const openasea = require('../crawlers/opeansea');
const mm = require('moment');
const { getDetailByID } = require('../crawlers/opeansea');
const { readCSV, writeCSV } = require('./util');
const fs = require('fs');

const formatMoney = (money, decimal) => {
    money /= Math.pow(10, decimal);
    return money;
};

const parseTime = (inputDate) => {
    return mm(inputDate).format('DD/MM/YYYY')
};

const buildSubData = (items, currentRecordIds) => {
    const currentDate = Date.now();
    const newDataList = [];
    items.forEach((item) => {
        const { node } = item;
        console.log(node.id);
        if (!currentRecordIds[node.id]) {
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
                    processData(filePath, dataList);
                } else {
                    console.log('Nothing new to insert');
                }
                break;
            }
        }
    })
}

const transformData = async (inputData) => {
    return inputData.reduce((recordIds, currentItem) => {
        recordIds[currentItem.Id] = true;
        return recordIds
    }, {});
}

const shouldAppend = (filePath) => {
    return fs.existsSync(filePath);
}

const processData = async (destination, dataList) => {
    const dataToWrite = [];
    dataList.forEach(async (node, index) => {
        setTimeout(async function () {
            const { id, eventType, eventTimestamp, price, fromAccount, toAccount, assetQuantity: { asset: { name, collection, assetContract, tokenId } } } = node;
            const platform = collection.name;
            const priceInEuth = formatMoney(price && price.quantity, price && price.asset && price.asset.decimals);
            const priceInUsd = price && price.asset && price.asset.usdSpotPrice;
            const fromAccountUsername = fromAccount && fromAccount.user && fromAccount.user.publicUsername;
            const toAccountAddressID = toAccount && toAccount.address;
            const assetAccountID = assetContract.account.address;
            const assetDetail = await getDetailByID(assetAccountID, tokenId);
            const creator = assetDetail.creator.user && assetDetail.creator.user.username;
            dataToWrite.push({
                id,
                eventType,
                priceInUsd,
                priceInEuth,
                creator,
                platform,
                fromUser: fromAccountUsername,
                toUser: toAccountAddressID,
                date: parseTime(eventTimestamp),
                itemName: name,
            });

            if (dataToWrite.length === dataList.length) {
                writeCSV(destination, [
                    { id: 'id', title: 'Id' },
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

module.exports = {
    buildAndProcessData,
}