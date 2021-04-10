const fetch = require('node-fetch')
const fetchData = async (username, pageSize, cursor = null) => {
    const request = `{"id":"EventHistoryQuery","query":"query EventHistoryQuery(\\n  $archetype: ArchetypeInputType\\n  $bundle: BundleSlug\\n  $collections: [CollectionSlug\u0021]\\n  $categories: [CollectionSlug\u0021]\\n  $eventTypes: [EventType\u0021]\\n  $cursor: String\\n  $count: Int = ${pageSize}\\n  $showAll: Boolean = false\\n  $identity: IdentityInputType\\n) {\\n  ...EventHistory_data_3WnwJ9\\n}\\n\\nfragment AccountLink_data on AccountType {\\n  address\\n  chain {\\n    identifier\\n    id\\n  }\\n  user {\\n    publicUsername\\n    id\\n  }\\n  ...ProfileImage_data\\n  ...wallet_accountKey\\n}\\n\\nfragment AssetCell_asset on AssetType {\\n  collection {\\n    name\\n    id\\n  }\\n  name\\n  ...AssetMedia_asset\\n  ...asset_url\\n}\\n\\nfragment AssetCell_assetBundle on AssetBundleType {\\n  assetQuantities(first: 2) {\\n    edges {\\n      node {\\n        asset {\\n          collection {\\n            name\\n            id\\n          }\\n          name\\n          ...AssetMedia_asset\\n          ...asset_url\\n          id\\n        }\\n        relayId\\n        id\\n      }\\n    }\\n  }\\n  name\\n  slug\\n}\\n\\nfragment AssetMedia_asset on AssetType {\\n  animationUrl\\n  backgroundColor\\n  collection {\\n    description\\n    displayData {\\n      cardDisplayStyle\\n    }\\n    imageUrl\\n    hidden\\n    name\\n    slug\\n    id\\n  }\\n  description\\n  name\\n  tokenId\\n  imageUrl\\n}\\n\\nfragment AssetQuantity_data on AssetQuantityType {\\n  asset {\\n    ...Price_data\\n    id\\n  }\\n  quantity\\n}\\n\\nfragment EventHistory_data_3WnwJ9 on Query {\\n  assetEvents(after: $cursor, bundle: $bundle, archetype: $archetype, first: $count, categories: $categories, collections: $collections, eventTypes: $eventTypes, identity: $identity, includeHidden: true) {\\n    edges {\\n      node {\\n        assetBundle @include(if: $showAll) {\\n          ...AssetCell_assetBundle\\n          id\\n        }\\n        assetQuantity {\\n          asset @include(if: $showAll) {\\n            ...AssetCell_asset\\n            id\\n          }\\n          ...quantity_data\\n          id\\n        }\\n        relayId\\n        eventTimestamp\\n        eventType\\n        customEventName\\n        devFee {\\n          quantity\\n          ...AssetQuantity_data\\n          id\\n        }\\n        devFeePaymentEvent {\\n          ...EventTimestamp_data\\n          id\\n        }\\n        fromAccount {\\n          address\\n          ...AccountLink_data\\n          id\\n        }\\n        price {\\n          quantity\\n          ...AssetQuantity_data\\n          id\\n        }\\n        endingPrice {\\n          quantity\\n          ...AssetQuantity_data\\n          id\\n        }\\n        seller {\\n          ...AccountLink_data\\n          id\\n        }\\n        toAccount {\\n          ...AccountLink_data\\n          id\\n        }\\n        winnerAccount {\\n          ...AccountLink_data\\n          id\\n        }\\n        ...EventTimestamp_data\\n        id\\n        __typename\\n      }\\n      cursor\\n    }\\n    pageInfo {\\n      endCursor\\n      hasNextPage\\n    }\\n  }\\n}\\n\\nfragment EventTimestamp_data on AssetEventType {\\n  eventTimestamp\\n  transaction {\\n    blockExplorerLink\\n    id\\n  }\\n}\\n\\nfragment Price_data on AssetType {\\n  decimals\\n  imageUrl\\n  symbol\\n  usdSpotPrice\\n  assetContract {\\n    blockExplorerLink\\n    id\\n  }\\n}\\n\\nfragment ProfileImage_data on AccountType {\\n  imageUrl\\n  address\\n  chain {\\n    identifier\\n    id\\n  }\\n}\\n\\nfragment asset_url on AssetType {\\n  assetContract {\\n    account {\\n      address\\n      chain {\\n        identifier\\n        id\\n      }\\n      id\\n    }\\n    id\\n  }\\n  tokenId\\n}\\n\\nfragment quantity_data on AssetQuantityType {\\n  asset {\\n    decimals\\n    id\\n  }\\n  quantity\\n}\\n\\nfragment wallet_accountKey on AccountType {\\n  address\\n  chain {\\n    identifier\\n    id\\n  }\\n}\\n","variables":{"archetype":null,"bundle":null,"collections":["superrare","async-art","fnd","known-origin"],"categories":null,"eventTypes":["AUCTION_SUCCESSFUL","ASSET_TRANSFER"],"cursor": "${cursor}","count":10,"showAll":true,"identity":{"username":"${username}"}}}`;
    const data = await fetch('https://api.opensea.io/graphql/', {
        "headers": {
            "content-type": "application/json",
            "x-api-key": '0106d29713754b448f4513d7a66d0875',
            "x-build-id": 'GBEenpG3YHeDfvEqWa7R0'
        },
        "body": request,
        "method": "POST",
        "mode": "cors"
    });
    const reponseData = await data.json();
    const { data: { assetEvents: { edges, pageInfo } } } = reponseData;
    return { data: edges || [], hasNextPage: pageInfo.hasNextPage || false, nextCursor: pageInfo.endCursor }
}

const getDetailByID = async (assetID, tokenID) => {
    const url = `https://api.opensea.io/api/v1/asset/${assetID}/${tokenID}`;
    const data = await fetch(url, {
        "headers": {
            "content-type": "application/json",
        },
        "method": "GET",
        "mode": "cors"
    });

    const toJSON = await data.json();
    return toJSON;
}

module.exports = {
    fetchData,
    getDetailByID
}