const { request } = require('express');
const got = require('got');
const { default: Request } = require('got/dist/source/core');
const { Coin } = require('../models/coin.model');
const messageUtils = require("../messageUtils");



let coinArray = [];
let exchangeName="Ztb"
let messageId=5340

let exchangeRefferallLink="https://www.ztb.im"
let exchangeBaseLink="https://www.ztb.im/exchange?coin="
let globalBaseLink="https://www.binance.com/en/trade/"

function allTickers(globItems) {

    (async () => {
        try {

            let response = await got('https://www.ztb.im/api/v1/tickers');

            let cointsList = JSON.parse(response.body);

            let cointsListFiltered=cointsList.ticker.filter( e  => e.symbol.toUpperCase().includes('USDT'))

            coinArray = [];

            globItems.forEach(globItem => {

                let foundItem = cointsListFiltered.find(e => e.symbol.replace('_USDT','USDT').toUpperCase() === globItem.symbol)

                if (foundItem === undefined 
                    || foundItem.symbol==="SRM_USDT"|| foundItem.symbol==="FTT_USDT"|| foundItem.symbol==="XRPBEAR_USDT"|| foundItem.symbol==="BNBBEAR_USDT"|| foundItem.symbol==="ETHBEAR_USDT"|| foundItem.symbol==="EOSBULL_USDT"
                    || foundItem.symbol==="EOSBEAR_USDT"|| foundItem.symbol==="XRPBULL_USDT"|| foundItem.symbol==="TCT_USDT"|| foundItem.symbol==="BEAR_USDT"
                    || foundItem.symbol==="BTT_USDT"|| foundItem.symbol==="BNBBULL_USDT"|| foundItem.symbol==="ETHBULL_USDT"
                    || foundItem.symbol==="KEY_USDT" || foundItem.symbol==="BTT_USDT" || foundItem.symbol==="UST_USDT" || foundItem.symbol==="BULL_USDT"|| foundItem.symbol==="HNT_USDT") {
                    return
                }

                if(foundItem.vol<5000){
                    return
                }

                //console.log("found Item :" + foundItem.symbol);

                var exchangeItemLastPrice = foundItem.last
                var exchangeItemPairName = foundItem.symbol.replace('_USDT', '/USDT').toUpperCase()
                var exchangeItemVol = foundItem.vol * foundItem.last
                var exchangeItemHighPrice = foundItem.high
                var exchangeItemLowPrice = foundItem.low
                var exchangeItemChangePrice = 0

                var exchangeLink=exchangeBaseLink + exchangeItemPairName.replace('/USDT',"_USDT")
                var globalLink=globalBaseLink+exchangeItemPairName.replace('/USDT',"_USDT")

                var diff = ((globItem.price - exchangeItemLastPrice) / (globItem.price)) * 100

                var coin = new Coin(exchangeName,0, exchangeItemPairName, diff, exchangeItemLastPrice, globItem.price, 
                    0, exchangeItemHighPrice, exchangeItemLowPrice,
                     exchangeItemChangePrice, exchangeItemVol, exchangeLink, globalLink,exchangeRefferallLink)
                     
                coinArray.push(coin)

            });

            console.log(exchangeName +" size is: "+coinArray.length);  

            messageUtils.handleCoinsList(exchangeName,messageId,coinArray)


        } catch (error) {
            console.log(error);
            //=> 'Internal server error ...'
        };
    })();
}

module.exports.getData = allTickers