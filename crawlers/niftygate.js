const fetch = require('node-fetch')

const fetchNitfites = async (username) => {
    const data = await fetch(`https://api.niftygateway.com//user/profile-and-offchain-nifties-by-url/?profile_url=${username}`, {
        "referrer": "https://niftygateway.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });

    const result = await data.json();
    return result || [];
}

const fetchSaleData = async (contractAddress, tokenId) => {
    const data = await fetch("https://api.niftygateway.com/market/nifty-secondary-market/", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json;charset=UTF-8",
        },
        "referrer": "https://niftygateway.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `{\"contractAddress\":\"${contractAddress}\",\"tokenId\":\"${tokenId}\",\"current\":1,\"size\":100000}`,
        "method": "POST",
        "mode": "cors"
    });

    const result = await data.json();
    return result || null;
}

const fetchGlobalUser = async (contractAddress, niftyType, currentPage, size = 100) => {
    const data = await fetch("https://api.niftygateway.com//market/nifty-history-by-type/", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "authorization": "Bearer null",
            "content-type": "application/json",
        },
        "referrer": "https://niftygateway.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `{\"contractAddress\":\"${contractAddress}\",\"niftyType\":${niftyType},\"current\":${currentPage},\"size\":${size},\"onlySales\":\"true\",\"cancelToken\":{\"promise\":{}},\"timeout\":30000}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
    const result = await data.json();
    return result || null;
}

const fetchNitfyMetaData = async (contractAddress, tokenId) => {
    const data = await fetch("https://api.niftygateway.com/nifty/metadata-minted/", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "authorization": "Bearer undefined",
            "content-type": "application/json;charset=UTF-8",
            "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\""
        },
        "referrer": "https://niftygateway.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `{\"contractAddress\":\"${contractAddress}\",\"tokenId\":\"${tokenId}\"}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
    const result = await data.json();
    return result || null;
}

module.exports = {
    fetchNitfites,
    fetchNitfyMetaData,
    fetchSaleData,
    fetchGlobalUser
}