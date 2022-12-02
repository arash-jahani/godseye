const { request } = require('express');
const got = require('got');
const { default: Request } = require('got/dist/source/core');
const { Coin } = require('../models/coin.model');
const messageUtils = require("../messageUtils");



let coinArray = [];
let exchangeName="Wazirx"
let messageId=5335

let exchangeRefferallLink="https://wazirx.com"
let exchangeBaseLink="https://wazirx.com/exchange/"
let globalBaseLink="https://www.binance.com/en/trade/"


function allTickers(globItems) {

    (async () => {
        try {

            let response = await got('https://api.wazirx.com/sapi/v1/tickers/24hr');

            let cointsList = JSON.parse(response.body);

            let cointsListFiltered=cointsList.filter( e  => e.quoteAsset.toUpperCase().includes('USDT'))

            coinArray = [];

            globItems.forEach(globItem => {

                let foundItem = cointsListFiltered.find(e => e.symbol.toUpperCase() === globItem.symbol)

                if (foundItem === undefined || foundItem.symbol.toUpperCase()==="SRMUSDT" || foundItem.symbol.toUpperCase()==="FTTUSDT" || foundItem.symbol.toUpperCase()==="BTTUSDT"|| foundItem.symbol.toUpperCase()==="BURGERUSDT") {
                    return
                }

                if(foundItem.volume<5000){
                    return
                }

                //console.log("found Item :" + foundItem.symbol);

                var exchangeItemLastPrice = foundItem.lastPrice
                var exchangeItemPairName = foundItem.symbol.toUpperCase().replace('USDT', '/USDT')
                var exchangeItemVol = foundItem.volume * foundItem.lastPrice
                var exchangeItemHighPrice = foundItem.highPrice
                var exchangeItemLowPrice = foundItem.lowPrice
                var exchangeItemChangePrice = 0

                var exchangeLink=exchangeBaseLink +exchangeItemPairName.replace('/USDT',"-USDT")
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