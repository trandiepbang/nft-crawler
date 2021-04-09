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

module.exports = {
    fetchNitfites,
    fetchSaleData
}