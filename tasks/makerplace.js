
const { fetchData, getProductDetai } = require('../crawlers/makerplace');
const { readCSV, writeCSV, parseTime, shouldAppend, transformData } = require('./util');
const cheerio = require('cheerio');

const extractDataFromResponse = async (response, username, filePath) => {
    const $ = cheerio.load(response);
    $('.product_feed_item').each(async (productIndex, el) => {
        const productLink = $(el).find(".hover_content_wrp > div > div > a").attr('href').toString().trim();
        const productHtmlDetail = await getProductDetai(productLink);
        const saleResult = await extractDataFromHtml(username, productHtmlDetail, $(el));
        if (saleResult.length > 0) {
            writeCSV(filePath, [
                { id: 'username', title: 'User name' },
                { id: 'eventType', title: 'Event Type' },
                { id: 'platform', title: 'Platform' },
                { id: 'itemName', title: 'Item' },
                { id: 'priceInEuth', title: 'Price (ETH)' },
                { id: 'priceInUsd', title: 'Price ($)' },
                { id: 'fromUser', title: 'From' },
                { id: 'toUser', title: 'To' },
                { id: 'date', title: 'Date' },
                { id: 'creator', title: 'Original Creator' },
            ], saleResult, shouldAppend(filePath));
        }
    });
};

const extractDataFromHtml = async (username, htmlDetail, productWrapperElement) => {
    const productName = productWrapperElement.find(".hover_content_wrp > div > div > a").text().toString().trim();
    const $ = cheerio.load(htmlDetail);
    const creator = $('span.ml-1.h7 > strong > a').text();
    const saleResult = [];
    $(".product-history").each(async (productIndex, el) => {
        const toUser = $(el).find('.w-25 > div > a').text().trim();
        const priceInUsd = $(el).find('.w-35 > strong').text().trim()
        if (priceInUsd.indexOf("Purchased") >= 0) {
            const time = $(el).find('.w-15').text().trim();
            const priceInEuth = 0;
            const priceInUsdNormalized = priceInUsd.replace('Purchased$', '').replace('PurchasedΞ($', '').replace(')', '');
            saleResult.push({
                username,
                priceInUsd: priceInUsdNormalized,
                itemName: productName,
                priceInEuth,
                eventType: 'Sale',
                platform: 'Makerplace',
                creator,
                date: time,
                toUser
            });
        }
    });

    return saleResult;
}

const buildAndProcessData = async (filePath, listUsername) => {
    listUsername.forEach(async (username) => {
        let page = 1;
        while(true) {
            const responseData = await fetchData(username, page, 12);
            const isSuccess = responseData.status === 'success';
            const feedItems = responseData.feed_items;
            if (feedItems.length === 0) {
                break;
            }
            if (isSuccess) {
                feedItems.forEach(async (feedItem) => {
                    await extractDataFromResponse(feedItem, username, filePath);
                });
            }

            page += 1;
        }
       
    })
}

module.exports = {
    buildAndProcessData
}