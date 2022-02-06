const { request } = require('express');
const got = require('got');
const { default: Request } = require('got/dist/source/core');
const { Coin } = require('../models/coin.model');
const messageUtils = require("../messageUtils");



let coinArray = [];
let exchangeName="vindax"
let messageId=5338

let exchangeRefferallLink="https://vindax.com"
let exchangeBaseLink="https://vindax.com/exchange-base.html?symbol="
let globalBaseLink="https://www.binance.com/en/trade/"


function allTickers(globItems) {

    (async () => {
        try {

            let response = await got('https://api.vindax.com/api/v1/ticker/24hr');

            let cointsList = JSON.parse(response.body);

            let cointsListFiltered=cointsList.filter( e  => e.symbol.toUpperCase().includes('USDT'))

            coinArray = [];

            globItems.forEach(globItem => {


                let foundItem = cointsListFiltered.find(e => e.symbol === globItem.symbol)

                if (foundItem === undefined   || foundItem.symbol==="RLCUSDT"|| foundItem.symbol==="BELUSDT" || foundItem.symbol==="BTT/USDT") {
                    return
                }



                if(foundItem.volume<5000){
                    return
                }

                //console.log("found Item :" + foundItem.symbol);

                var exchangeItemLastPrice = foundItem.lastPrice
                var exchangeItemPairName = foundItem.symbol.replace('USDT', '/USDT').toUpperCase()
                var exchangeItemVol = foundItem.volume
                var exchangeItemHighPrice = foundItem.highPrice
                var exchangeItemLowPrice = foundItem.lowPrice
                var exchangeItemChangePrice = foundItem.priceChangePercent

                var exchangeLink=exchangeBaseLink +exchangeItemPairName.replace('/USDT',"_USDT")
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