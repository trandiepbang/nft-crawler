const { fetchNitfites, fetchSaleData } = require('../crawlers/niftygate');
const { readCSV, writeCSV, parseTime, shouldAppend, transformData } = require('./util');

const buildAndProcessData = async (filePath, listUsername) => {
    const currentData = await readCSV(filePath);
    const currentRecordIds = await transformData(currentData);
    listUsername.forEach(async (username) => {
        const nifitiesData = await fetchNitfites(username);
        const item = nifitiesData.userProfileAndNifties.nifties;

        item.forEach(async (tokenItem) => {
            const { tokenId, contractAddress } = tokenItem;
            const data = await fetchSaleData(contractAddress, tokenId);
            if (data) {
                const saleEvents = data.data.results.filter((item) => {
                    return item.Type === 'sale';
                });

                if (saleEvents.length > 0) {
                    await convertDataToWrite(saleEvents, tokenItem, currentRecordIds, filePath);
                }
            }
        });
    });
}

const convertDataToWrite = (saleEvents, tokenItem, currentRecordIds, filePath) => {
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