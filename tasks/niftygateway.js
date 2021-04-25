const { fetchNitfites, fetchSaleData, fetchNitfyMetaData, fetchGlobalUser } = require('../crawlers/niftygate');
const { readCSV, writeCSV, parseTime, shouldAppend, transformData } = require('./util');
const fs = require('fs');

const fetchAndSaveGlobalUser = async (listContractAddress, filePathGlobalUser) => {
    console.log("Item need to fetch though ", listContractAddress.length)
    for (let i = 0; i < listContractAddress.length; i++) {
        let currentPage = 1;
        let dataToWrite = [];
        let contractAddress = listContractAddress[i];
        console.log("Fetching contract address : ", contractAddress.contractAddress)
        while (true) {
            const globalUsersData = await fetchGlobalUser(contractAddress.contractAddress, contractAddress.niftyType, currentPage);
            if (!globalUsersData.data || !globalUsersData.data.results || globalUsersData.data.results.length === 0) {
                writeCSV(filePathGlobalUser, [
                    { id: 'contractAddress', title: 'Contract address' },
                    { id: 'selling_user', title: 'Seller' },
                    { id: 'purchase_user', title: 'Buyer' },
                    { id: 'sell_price', title: 'Sell price' },
                    { id: 'date', title: 'Date' },
                    { id: 'type', title: 'Type' }
                ], dataToWrite, shouldAppend(filePathGlobalUser));
                break;
            } else {
                for (let i = 0; i < globalUsersData.data.results.length; i++) {
                    const itemObject = globalUsersData.data.results[i];
                    if (itemObject.Type === 'sale') {
                        const dataToAppend = {
                            date: parseTime(itemObject.Timestamp),
                            selling_user: itemObject.SellingUserProfile.name,
                            purchase_user: itemObject.PurchasingUserProfile.name,
                            sell_price: itemObject.SaleAmountInCents,
                            contractAddress: contractAddress.contractAddress,
                            type: 'Sale'
                        }
                        dataToWrite.push(dataToAppend);
                    }
                }
                console.log("Fetching...", globalUsersData.data.meta.page);
            }
            currentPage += 1;
        }
    }
}

const buildAndProcessData = async (filePath, filePathGlobalUser, listUsername) => {
    const currentData = await readCSV(filePath);
    const currentRecordIds = await transformData(currentData);
    const contractAddressList = [];
    listUsername.forEach(async (username) => {
        const nifitiesData = await fetchNitfites(username);
        const item = nifitiesData.userProfileAndNifties.nifties;

        item.forEach(async (tokenItem, index, totalList) => {
            setTimeout(async () => {
                const { tokenId, contractAddress } = tokenItem;
                const nitfyDetailData = await fetchNitfyMetaData(contractAddress, tokenId);
                const niftyType = nitfyDetailData.niftyMetadata.unmintedNiftyObjThatCreatedThis.niftyType;
                const data = await fetchSaleData(contractAddress, tokenId);
                if (data) {
                    const saleEvents = data.data.results.filter((item) => {
                        return item.Type === 'sale';
                    });

                    if (saleEvents.length > 0) {
                        await convertDataToWrite(saleEvents, tokenItem, currentRecordIds, filePath, username);
                    }

                }
                contractAddressList.push({
                    contractAddress,
                    niftyType
                })

                if (index >= totalList.length - 1) {
                    console.log("Starting to fetch global users");
                    // Remomove file and recreate again
                    if (fs.existsSync(filePathGlobalUser)) {
                        fs.unlinkSync(filePathGlobalUser);
                    }
                    fetchAndSaveGlobalUser(contractAddressList, filePathGlobalUser);
                }
            }, 1500 * index);
        });
    });
}

const convertDataToWrite = (saleEvents, tokenItem, currentRecordIds, filePath, username) => {
    const { name, creator_info } = tokenItem;
    return saleEvents.forEach((item) => {
        const { SellingUserProfile, PurchasingUserProfile, Timestamp, id } = item;
        const isLatest = parseTime(Timestamp) === parseTime(Date.now());
        if (!currentRecordIds[id]) {
            const fromUser = SellingUserProfile.name;
            const toUser = PurchasingUserProfile.name;
            const priceInUsd = item.SaleAmountInCents;
            const priceInEuth = 0;
            const eventType = "Sale";
            const platform = "NitfityGateway";

            const dataToAppend = [{
                id,
                username,
                eventType,
                priceInUsd,
                priceInEuth,
                platform,
                fromUser,
                toUser,
                creator: creator_info.name,
                date: parseTime(Timestamp),
                itemName: name,
            }];

            writeCSV(filePath, [
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
            ], dataToAppend, shouldAppend(filePath));
        }
    }, []);
}

module.exports = {
    buildAndProcessData,
}