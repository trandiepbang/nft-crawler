const fetch = require('node-fetch')

const fetchData = async (username, page, pagesize) => {
    const data = await fetch(`https://makersplace.com/store/${username}/feed/2/?page_num=${page}&page_size=${pagesize}&min_editions=&max_editions=&min_price=&max_price=&has_offers=false&sold_out=false&available=false&feed_type=1`, {
        "method": "GET",
        "mode": "cors"
    });

    const jsonResponse = await data.json();
    return jsonResponse
}

const getProductDetai = async (productDetailURL) => {
    const data = await fetch(productDetailURL, {
        "method": "GET",
        "mode": "cors"
    });

    const htmlResponse = await data.text();
    return htmlResponse
}

module.exports = {
    fetchData,
    getProductDetai
}