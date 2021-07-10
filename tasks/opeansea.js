const _ = require("lodash");
const openasea = require('../crawlers/opeansea');
const { getDetailByID, getDataByUsername, getTradingHistoryByAsset } = require('../crawlers/opeansea');
const { readCSV, writeCSV, parseTime, shouldAppend, transformData } = require('./util');

const formatMoney = (money, decimal) => {
    money /= Math.pow(10, decimal);
    return money;
};


const buildSubData = (items, currentRecordIds) => {
    const currentDate = Date.now();
    const newDataList = [];
    items.forEach((item) => {
        const { node } = item;
        const isLatest = parseTime(node.eventTimestamp) === parseTime(currentDate);
        if (!currentRecordIds[node.id] && node.eventType === 'SUCCESSFUL') {
            newDataList.push(node);
        }
    });

    return newDataList;
}

const buildAndProcessData = async (filePath, listUsername, pageSize = 10) => {
    const currentData = await readCSV(filePath);
    const currentRecordIds = await transformData(currentData);
    listUsername.forEach(async (username) => {
        let userCursor = null;
        let dataList = [];
        while (true) {
            const { data, hasNextPage, nextCursor } = await openasea.fetchData(username, pageSize, userCursor);
            const subDatalist = buildSubData(data, currentRecordIds);
            if (subDatalist.length > 0) {
                dataList = [
                    ...dataList,
                    ...subDatalist
                ]
            }

            userCursor = nextCursor;
            if (!hasNextPage) {
                if (dataList.length > 0) {
                    console.log('New data to ready insert ', dataList.length);
                    processData(filePath, dataList, username);
                } else {
                    console.log('Nothing new to insert');
                }
                break;
            }
        }
    })
}

const processData = async (destination, dataList, username) => {
    const dataToWrite = [];
    console.log("Processing data ...");
    dataList.forEach(async (node, index, totalList) => {
        setTimeout(async function () {
            if (node.eventType === 'SUCCESSFUL') {
                try {
                    const { id, eventType, eventTimestamp, price, assetQuantity: { asset: { name, collection, assetContract, tokenId } } } = node;
                    const platform = collection.name;
                    const priceInEuth = formatMoney(price && price.quantity, price && price.asset && price.asset.decimals);
                    const priceInUsd = price && price.asset && price.asset.usdSpotPrice;
                    const assetAccountID = assetContract.account.address;
                    const assetDetail = await getDetailByID(assetAccountID, tokenId);
                    const creator = assetDetail.creator.user ? assetDetail.creator.user.username : assetDetail.creator.address;
                    //
                    const fromUserAddress = node.seller && node.seller.address;
                    const fromUser = node.seller && node.seller.user ? node.seller.user.publicUsername : fromUserAddress;
                    //
                    const toUserAddress = node.winnerAccount && node.winnerAccount.address;
                    const toUser = node.winnerAccount && node.winnerAccount.user ? node.winnerAccount.user.publicUsername : toUserAddress
                    dataToWrite.push({
                        id,
                        username,
                        eventType: 'Sale',
                        priceInUsd,
                        priceInEuth,
                        creator,
                        platform,
                        fromUser: fromUser,
                        toUser: toUser,
                        date: parseTime(eventTimestamp),
                        itemName: name,
                    });
                } catch (e) {
                    console.log("Error ", e);
                }

            }

            if (index >= totalList.length - 1) {
                console.log("Finished");
                writeCSV(destination, [
                    { id: 'id', title: 'Id' },
                    { id: 'username', title: 'Username' },
                    { id: 'eventType', title: 'Event Type' },
                    { id: 'platform', title: 'Platform' },
                    { id: 'itemName', title: 'Item' },
                    { id: 'priceInEuth', title: 'Price (ETH)' },
                    { id: 'priceInUsd', title: 'Price ($)' },
                    { id: 'fromUser', title: 'From' },
                    { id: 'toUser', title: 'To' },
                    { id: 'date', title: 'Date' },
                    { id: 'creator', title: 'Original Creator' },
                ], dataToWrite, shouldAppend(destination));
            }
        }, 1500 * index);
    });
}

const getCreator = (assetDetail) => {
    const username = _.get(assetDetail, 'creator.user.username', null);
    const address = _.get(assetDetail, 'creator.address', null);
    if (!username) {
        return address;
    }
    return username;
}

const getTradingHistory = async (assetAddress, tokenId, currentRecordIds) => {
    let hasMore = false;
    let cursor = null;
    let data = [];
    hasMore = true;
    while (hasMore) {
        const historyEvent = await getTradingHistoryByAsset(assetAddress, tokenId, cursor, 30);
        const edges = _.get(historyEvent, "data.assetEvents.edges", []);
        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];
            const node = _.get(edge, "node");
            const eventType = _.get(node, "eventType");
            const price = _.get(node, "price")
            const priceQuantity = _.get(price, "quantity");
            const priceDecimals = _.get(price, "asset.decimals");
            const priceInEuth = formatMoney(priceQuantity, priceDecimals);
            const eventTimestamp = _.get(node, "eventTimestamp");
            const id = _.get(node, "id");
            const date = parseTime(eventTimestamp);
            if (eventType === 'SUCCESSFUL' && !currentRecordIds[id]) {
                data = [
                    ...data,
                    {
                        id,
                        priceInEuth,
                        date
                    }
                ]
            }
        }
        cursor = _.get(data, "data.search.pageInfo.endCursor", null);
        hasMore = _.get(data, "data.search.pageInfo.hasNextPage", false);
    }

    return data;
}

const getAsset = async (username, currentRecordIds) => {
    let listData = [];
    let hasNext = false;
    let cursor = null;
    hasNext = true;
    while (hasNext) {
        const data = await getDataByUsername(username, cursor, 30);
        const edges = _.get(data, "data.query.search.edges", []);
        for (let i = 0; i < edges.length; i++) {
            const node = edges[i];
            const asset = _.get(node, "node.asset");
            const name = _.get(asset, "name");
            const collectionName = _.get(asset, "collection.name");
            const tokenID = _.get(asset, "tokenId");
            const assetAccountID = _.get(asset, "assetContract.account.address");
            const assetDetail = await getDetailByID(assetAccountID, tokenID);
            const creator = await getCreator(assetDetail);
            const saleEvents = await getTradingHistory(assetAccountID, tokenID, currentRecordIds);
            listData = [
                ...listData,
                {
                    name,
                    collectionName,
                    creator,
                    saleEvents
                }
            ]
        }
        cursor = _.get(data, "data.search.pageInfo.endCursor", null);
        hasNext = _.get(data, "data.search.pageInfo.hasNextPage", false);
    }

    return listData;
}

const writeToFile = (destination, assets) => {
    const dataReadyToWrite = assets.reduce((totalAssets, asset) => {
        const { name, collectionName, creator, saleEvents } = asset;
        saleEvents.forEach((saleEvent) => {
            totalAssets = [
                ...totalAssets,
                {
                    id: saleEvent.id,
                    name,
                    platform: collectionName,
                    purchase: saleEvent.priceInEuth,
                    date: saleEvent.date,
                    creator
                }
            ]
        });

        return totalAssets;
    }, []);

    if (dataReadyToWrite.length > 0) {
        console.log("Finished, start writting to file", dataReadyToWrite.length);
        writeCSV(destination, [
            { id: 'id', title: 'Id' },
            { id: 'name', title: 'Asset Name' },
            { id: 'platform', title: 'Platform' },
            { id: 'purchase', title: 'Orig. Purchase' },
            { id: 'date', title: 'Date' },
            { id: 'creator', title: 'Orginal Creator' }
        ], dataReadyToWrite, shouldAppend(destination));
    }
}

const getUserAssetsAndTradingHistory = async (destination, listUsername) => {
    const currentData = await readCSV(destination);
    const currentRecordIds = await transformData(currentData);
    for (let i = 0; i < listUsername.length; i++) {
        const assets = await getAsset(listUsername[i], currentRecordIds);
        if (assets.length > 0) {
            writeToFile(destination, assets);
        }
    }
}

module.exports = {
    buildAndProcessData,
    getUserAssetsAndTradingHistory
}