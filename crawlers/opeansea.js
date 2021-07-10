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

const getDataByUsername = async (username, cursor, count) => {
    try {
        const data = await fetch("https://api.opensea.io/graphql/", {
            "headers": {
                "content-type": "application/json",
                "x-api-key": "2f6f419a083c46de9d83ce3dbe7db601",
                "x-build-id": "EEh3ggwyClMogwwgcDIPj"
            },
            "referrer": "https://opensea.io/",
            "referrerPolicy": "strict-origin",
            "body": `{\"id\":\"AssetSearchQuery\",\"query\":\"query AssetSearchQuery(\\n  $categories: [CollectionSlug!]\\n  $chains: [ChainScalar!]\\n  $collection: CollectionSlug\\n  $collectionQuery: String\\n  $collectionSortBy: CollectionSort\\n  $collections: [CollectionSlug!]\\n  $count: Int\\n  $cursor: String\\n  $identity: IdentityInputType\\n  $includeHiddenCollections: Boolean\\n  $numericTraits: [TraitRangeType!]\\n  $paymentAssets: [PaymentAssetSymbol!]\\n  $priceFilter: PriceFilterType\\n  $query: String\\n  $resultModel: SearchResultModel\\n  $showContextMenu: Boolean = false\\n  $shouldShowQuantity: Boolean = false\\n  $sortAscending: Boolean\\n  $sortBy: SearchSortBy\\n  $stringTraits: [TraitInputType!]\\n  $toggles: [SearchToggle!]\\n  $creator: IdentityInputType\\n  $assetOwner: IdentityInputType\\n  $isPrivate: Boolean\\n  $safelistRequestStatuses: [SafelistRequestStatus!]\\n) {\\n  query {\\n    ...AssetSearch_data_2hBjZ1\\n  }\\n}\\n\\nfragment AssetCardContent_assetBundle on AssetBundleType {\\n  assetQuantities(first: 18) {\\n    edges {\\n      node {\\n        asset {\\n          relayId\\n          ...AssetMedia_asset\\n          id\\n        }\\n        id\\n      }\\n    }\\n  }\\n}\\n\\nfragment AssetCardContent_asset_27d9G3 on AssetType {\\n  relayId\\n  name\\n  ...AssetMedia_asset\\n  assetContract {\\n    account {\\n      address\\n      chain {\\n        identifier\\n        id\\n      }\\n      id\\n    }\\n    openseaVersion\\n    id\\n  }\\n  tokenId\\n  collection {\\n    slug\\n    id\\n  }\\n  isDelisted\\n  ...AssetContextMenu_data_3z4lq0 @include(if: $showContextMenu)\\n}\\n\\nfragment AssetCardFooter_assetBundle on AssetBundleType {\\n  name\\n  assetQuantities(first: 18) {\\n    edges {\\n      node {\\n        asset {\\n          collection {\\n            name\\n            relayId\\n            id\\n          }\\n          id\\n        }\\n        id\\n      }\\n    }\\n  }\\n  assetEventData {\\n    lastSale {\\n      unitPriceQuantity {\\n        ...AssetQuantity_data\\n        id\\n      }\\n    }\\n  }\\n  orderData {\\n    bestBid {\\n      orderType\\n      paymentAssetQuantity {\\n        ...AssetQuantity_data\\n        id\\n      }\\n    }\\n    bestAsk {\\n      closedAt\\n      orderType\\n      dutchAuctionFinalPrice\\n      openedAt\\n      priceFnEndedAt\\n      quantity\\n      decimals\\n      paymentAssetQuantity {\\n        quantity\\n        ...AssetQuantity_data\\n        id\\n      }\\n    }\\n  }\\n}\\n\\nfragment AssetCardFooter_asset_fdERL on AssetType {\\n  ownedQuantity(identity: $identity) @include(if: $shouldShowQuantity)\\n  name\\n  tokenId\\n  collection {\\n    name\\n    id\\n  }\\n  hasUnlockableContent\\n  isDelisted\\n  assetContract {\\n    account {\\n      address\\n      chain {\\n        identifier\\n        id\\n      }\\n      id\\n    }\\n    openseaVersion\\n    id\\n  }\\n  assetEventData {\\n    firstTransfer {\\n      timestamp\\n    }\\n    lastSale {\\n      unitPriceQuantity {\\n        ...AssetQuantity_data\\n        id\\n      }\\n    }\\n  }\\n  decimals\\n  orderData {\\n    bestBid {\\n      orderType\\n      paymentAssetQuantity {\\n        ...AssetQuantity_data\\n        id\\n      }\\n    }\\n    bestAsk {\\n      closedAt\\n      orderType\\n      dutchAuctionFinalPrice\\n      openedAt\\n      priceFnEndedAt\\n      quantity\\n      decimals\\n      paymentAssetQuantity {\\n        quantity\\n        ...AssetQuantity_data\\n        id\\n      }\\n    }\\n  }\\n}\\n\\nfragment AssetCardHeader_data on AssetType {\\n  relayId\\n  favoritesCount\\n  isDelisted\\n  isFavorite\\n}\\n\\nfragment AssetContextMenu_data_3z4lq0 on AssetType {\\n  ...asset_edit_url\\n  ...itemEvents_data\\n  isDelisted\\n  isEditable {\\n    value\\n    reason\\n  }\\n  isListable\\n  ownership(identity: {}) {\\n    isPrivate\\n    quantity\\n  }\\n  creator {\\n    address\\n    id\\n  }\\n  collection {\\n    isAuthorizedEditor\\n    id\\n  }\\n}\\n\\nfragment AssetMedia_asset on AssetType {\\n  animationUrl\\n  backgroundColor\\n  collection {\\n    description\\n    displayData {\\n      cardDisplayStyle\\n    }\\n    imageUrl\\n    hidden\\n    name\\n    slug\\n    id\\n  }\\n  description\\n  name\\n  tokenId\\n  imageUrl\\n  isDelisted\\n}\\n\\nfragment AssetQuantity_data on AssetQuantityType {\\n  asset {\\n    ...Price_data\\n    id\\n  }\\n  quantity\\n}\\n\\nfragment AssetSearchFilter_data_3KTzFc on Query {\\n  ...CollectionFilter_data_2qccfC\\n  collection(collection: $collection) {\\n    numericTraits {\\n      key\\n      value {\\n        max\\n        min\\n      }\\n      ...NumericTraitFilter_data\\n    }\\n    stringTraits {\\n      key\\n      ...StringTraitFilter_data\\n    }\\n    id\\n  }\\n  ...PaymentFilter_data_2YoIWt\\n  ...CategoryFilter_data\\n}\\n\\nfragment AssetSearchList_data_3Aax2O on SearchResultType {\\n  asset {\\n    assetContract {\\n      account {\\n        address\\n        chain {\\n          identifier\\n          id\\n        }\\n        id\\n      }\\n      id\\n    }\\n    relayId\\n    tokenId\\n    ...AssetSelectionItem_data\\n    ...asset_url\\n    id\\n  }\\n  assetBundle {\\n    relayId\\n    id\\n  }\\n  ...Asset_data_3Aax2O\\n}\\n\\nfragment AssetSearch_data_2hBjZ1 on Query {\\n  ...CollectionHeadMetadata_data_2YoIWt\\n  ...AssetSearchFilter_data_3KTzFc\\n  ...SearchPills_data_2Kg4Sq\\n  search(after: $cursor, chains: $chains, categories: $categories, collections: $collections, first: $count, identity: $identity, numericTraits: $numericTraits, paymentAssets: $paymentAssets, priceFilter: $priceFilter, querystring: $query, resultType: $resultModel, sortAscending: $sortAscending, sortBy: $sortBy, stringTraits: $stringTraits, toggles: $toggles, creator: $creator, isPrivate: $isPrivate, safelistRequestStatuses: $safelistRequestStatuses) {\\n    edges {\\n      node {\\n        ...AssetSearchList_data_3Aax2O\\n        __typename\\n      }\\n      cursor\\n    }\\n    totalCount\\n    pageInfo {\\n      endCursor\\n      hasNextPage\\n    }\\n  }\\n}\\n\\nfragment AssetSelectionItem_data on AssetType {\\n  backgroundColor\\n  collection {\\n    displayData {\\n      cardDisplayStyle\\n    }\\n    imageUrl\\n    id\\n  }\\n  imageUrl\\n  name\\n  relayId\\n}\\n\\nfragment Asset_data_3Aax2O on SearchResultType {\\n  asset {\\n    assetContract {\\n      account {\\n        chain {\\n          identifier\\n          id\\n        }\\n        id\\n      }\\n      id\\n    }\\n    isDelisted\\n    ...AssetCardHeader_data\\n    ...AssetCardContent_asset_27d9G3\\n    ...AssetCardFooter_asset_fdERL\\n    ...AssetMedia_asset\\n    ...asset_url\\n    ...itemEvents_data\\n    id\\n  }\\n  assetBundle {\\n    slug\\n    assetCount\\n    ...AssetCardContent_assetBundle\\n    ...AssetCardFooter_assetBundle\\n    id\\n  }\\n}\\n\\nfragment CategoryFilter_data on Query {\\n  categories {\\n    imageUrl\\n    name\\n    slug\\n  }\\n}\\n\\nfragment CollectionFilter_data_2qccfC on Query {\\n  selectedCollections: collections(first: 25, collections: $collections, includeHidden: true) {\\n    edges {\\n      node {\\n        assetCount\\n        imageUrl\\n        name\\n        slug\\n        id\\n      }\\n    }\\n  }\\n  collections(assetOwner: $assetOwner, assetCreator: $creator, onlyPrivateAssets: $isPrivate, chains: $chains, first: 100, includeHidden: $includeHiddenCollections, parents: $categories, query: $collectionQuery, sortBy: $collectionSortBy) {\\n    edges {\\n      node {\\n        assetCount\\n        imageUrl\\n        name\\n        slug\\n        id\\n        __typename\\n      }\\n      cursor\\n    }\\n    pageInfo {\\n      endCursor\\n      hasNextPage\\n    }\\n  }\\n}\\n\\nfragment CollectionHeadMetadata_data_2YoIWt on Query {\\n  collection(collection: $collection) {\\n    bannerImageUrl\\n    description\\n    imageUrl\\n    name\\n    id\\n  }\\n}\\n\\nfragment CollectionModalContent_data on CollectionType {\\n  description\\n  imageUrl\\n  name\\n  slug\\n}\\n\\nfragment NumericTraitFilter_data on NumericTraitTypePair {\\n  key\\n  value {\\n    max\\n    min\\n  }\\n}\\n\\nfragment PaymentFilter_data_2YoIWt on Query {\\n  paymentAssets(first: 10) {\\n    edges {\\n      node {\\n        asset {\\n          symbol\\n          id\\n        }\\n        relayId\\n        id\\n        __typename\\n      }\\n      cursor\\n    }\\n    pageInfo {\\n      endCursor\\n      hasNextPage\\n    }\\n  }\\n  PaymentFilter_collection: collection(collection: $collection) {\\n    paymentAssets {\\n      asset {\\n        symbol\\n        id\\n      }\\n      relayId\\n      id\\n    }\\n    id\\n  }\\n}\\n\\nfragment Price_data on AssetType {\\n  decimals\\n  imageUrl\\n  symbol\\n  usdSpotPrice\\n  assetContract {\\n    blockExplorerLink\\n    account {\\n      chain {\\n        identifier\\n        id\\n      }\\n      id\\n    }\\n    id\\n  }\\n}\\n\\nfragment SearchPills_data_2Kg4Sq on Query {\\n  selectedCollections: collections(first: 25, collections: $collections, includeHidden: true) {\\n    edges {\\n      node {\\n        imageUrl\\n        name\\n        slug\\n        ...CollectionModalContent_data\\n        id\\n      }\\n    }\\n  }\\n}\\n\\nfragment StringTraitFilter_data on StringTraitType {\\n  counts {\\n    count\\n    value\\n  }\\n  key\\n}\\n\\nfragment asset_edit_url on AssetType {\\n  assetContract {\\n    account {\\n      address\\n      chain {\\n        identifier\\n        id\\n      }\\n      id\\n    }\\n    id\\n  }\\n  tokenId\\n  collection {\\n    slug\\n    id\\n  }\\n}\\n\\nfragment asset_url on AssetType {\\n  assetContract {\\n    account {\\n      address\\n      chain {\\n        identifier\\n        id\\n      }\\n      id\\n    }\\n    id\\n  }\\n  tokenId\\n}\\n\\nfragment itemEvents_data on AssetType {\\n  assetContract {\\n    account {\\n      address\\n      chain {\\n        identifier\\n        id\\n      }\\n      id\\n    }\\n    id\\n  }\\n  tokenId\\n}\\n\",\"variables\":{\"categories\":null,\"chains\":null,\"collection\":null,\"collectionQuery\":null,\"collectionSortBy\":\"ASSET_COUNT\",\"collections\":[],\"count\":${count},\"cursor\":\"${cursor}\",\"identity\":{\"username\":\"${username}\"},\"includeHiddenCollections\":false,\"numericTraits\":null,\"paymentAssets\":null,\"priceFilter\":null,\"query\":null,\"resultModel\":null,\"showContextMenu\":false,\"shouldShowQuantity\":true,\"sortAscending\":null,\"sortBy\":\"LISTING_DATE\",\"stringTraits\":null,\"toggles\":null,\"creator\":null,\"assetOwner\":{\"username\":\"${username}\"},\"isPrivate\":null,\"safelistRequestStatuses\":null}}`,
            "method": "POST",
            "mode": "cors"
        });
        const toJSON = await data.json();
        return toJSON;
    } catch (e) {
        return e;
    }
}

const getTradingHistoryByAsset = async (assetContractAddress, tokenId, cursor, count) => {
    try {
        const data = await fetch("https://api.opensea.io/graphql/", {
            "headers": {
                "content-type": "application/json"
            },
            "referrer": "https://opensea.io/",
            "referrerPolicy": "strict-origin",
            "body": `{\"id\":\"EventHistoryQuery\",\"query\":\"query EventHistoryQuery(\\n  $archetype: ArchetypeInputType\\n  $bundle: BundleSlug\\n  $collections: [CollectionSlug!]\\n  $categories: [CollectionSlug!]\\n  $chains: [ChainScalar!]\\n  $eventTypes: [EventType!]\\n  $cursor: String\\n  $count: Int = 10\\n  $showAll: Boolean = false\\n  $identity: IdentityInputType\\n) {\\n  ...EventHistory_data_L1XK6\\n}\\n\\nfragment AccountLink_data on AccountType {\\n  address\\n  user {\\n    publicUsername\\n    id\\n  }\\n  ...ProfileImage_data\\n  ...wallet_accountKey\\n  ...accounts_url\\n}\\n\\nfragment AssetCell_asset on AssetType {\\n  collection {\\n    name\\n    id\\n  }\\n  name\\n  ...AssetMedia_asset\\n  ...asset_url\\n}\\n\\nfragment AssetCell_assetBundle on AssetBundleType {\\n  assetQuantities(first: 2) {\\n    edges {\\n      node {\\n        asset {\\n          collection {\\n            name\\n            id\\n          }\\n          name\\n          ...AssetMedia_asset\\n          ...asset_url\\n          id\\n        }\\n        relayId\\n        id\\n      }\\n    }\\n  }\\n  name\\n  slug\\n}\\n\\nfragment AssetMedia_asset on AssetType {\\n  animationUrl\\n  backgroundColor\\n  collection {\\n    description\\n    displayData {\\n      cardDisplayStyle\\n    }\\n    imageUrl\\n    hidden\\n    name\\n    slug\\n    id\\n  }\\n  description\\n  name\\n  tokenId\\n  imageUrl\\n  isDelisted\\n}\\n\\nfragment AssetQuantity_data on AssetQuantityType {\\n  asset {\\n    ...Price_data\\n    id\\n  }\\n  quantity\\n}\\n\\nfragment EventHistory_data_L1XK6 on Query {\\n  assetEvents(after: $cursor, bundle: $bundle, archetype: $archetype, first: $count, categories: $categories, collections: $collections, chains: $chains, eventTypes: $eventTypes, identity: $identity, includeHidden: true) {\\n    edges {\\n      node {\\n        assetBundle @include(if: $showAll) {\\n          ...AssetCell_assetBundle\\n          id\\n        }\\n        assetQuantity {\\n          asset @include(if: $showAll) {\\n            ...AssetCell_asset\\n            id\\n          }\\n          ...quantity_data\\n          id\\n        }\\n        relayId\\n        eventTimestamp\\n        eventType\\n        offerEnteredClosedAt\\n        customEventName\\n        devFee {\\n          asset {\\n            assetContract {\\n              account {\\n                chain {\\n                  identifier\\n                  id\\n                }\\n                id\\n              }\\n              id\\n            }\\n            id\\n          }\\n          quantity\\n          ...AssetQuantity_data\\n          id\\n        }\\n        devFeePaymentEvent {\\n          ...EventTimestamp_data\\n          id\\n        }\\n        fromAccount {\\n          address\\n          ...AccountLink_data\\n          id\\n        }\\n        price {\\n          quantity\\n          ...AssetQuantity_data\\n          id\\n        }\\n        endingPrice {\\n          quantity\\n          ...AssetQuantity_data\\n          id\\n        }\\n        seller {\\n          ...AccountLink_data\\n          id\\n        }\\n        toAccount {\\n          ...AccountLink_data\\n          id\\n        }\\n        winnerAccount {\\n          ...AccountLink_data\\n          id\\n        }\\n        ...EventTimestamp_data\\n        id\\n        __typename\\n      }\\n      cursor\\n    }\\n    pageInfo {\\n      endCursor\\n      hasNextPage\\n    }\\n  }\\n}\\n\\nfragment EventTimestamp_data on AssetEventType {\\n  eventTimestamp\\n  transaction {\\n    blockExplorerLink\\n    id\\n  }\\n}\\n\\nfragment Price_data on AssetType {\\n  decimals\\n  imageUrl\\n  symbol\\n  usdSpotPrice\\n  assetContract {\\n    blockExplorerLink\\n    account {\\n      chain {\\n        identifier\\n        id\\n      }\\n      id\\n    }\\n    id\\n  }\\n}\\n\\nfragment ProfileImage_data on AccountType {\\n  imageUrl\\n  address\\n  chain {\\n    identifier\\n    id\\n  }\\n}\\n\\nfragment accounts_url on AccountType {\\n  address\\n  user {\\n    publicUsername\\n    id\\n  }\\n}\\n\\nfragment asset_url on AssetType {\\n  assetContract {\\n    account {\\n      address\\n      chain {\\n        identifier\\n        id\\n      }\\n      id\\n    }\\n    id\\n  }\\n  tokenId\\n}\\n\\nfragment quantity_data on AssetQuantityType {\\n  asset {\\n    decimals\\n    id\\n  }\\n  quantity\\n}\\n\\nfragment wallet_accountKey on AccountType {\\n  address\\n  chain {\\n    identifier\\n    id\\n  }\\n}\\n\",\"variables\":{\"archetype\":{\"assetContractAddress\":\"${assetContractAddress}\",\"tokenId\":\"${tokenId}\"},\"bundle\":null,\"collections\":null,\"categories\":null,\"chains\":null,\"eventTypes\":[\"AUCTION_SUCCESSFUL\"],\"cursor\":${cursor},\"count\":${count},\"showAll\":true,\"identity\":null}}`,
            "method": "POST",
            "mode": "cors",
            "credentials": "omit"
        });
        const toJSON = await data.json();
        return toJSON;
    } catch (e) {
        return e;
    }
}

module.exports = {
    fetchData,
    getDataByUsername,
    getDetailByID,
    getTradingHistoryByAsset
}