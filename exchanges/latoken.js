const { request } = require('express');
const got = require('got');
const { default: Request } = require('got/dist/source/core');
const { Coin } = require('../models/coin.model');
const messageUtils = require("../messageUtils");



let coinArray = [];
let exchangeName="Latoken"
let messageId=5333

let exchangeRefferallLink="https://latoken.com"
let exchangeBaseLink="https://latoken.com/exchange/"
let globalBaseLink="https://www.binance.com/en/trade/"


function allTickers(globItems) {

    (async () => {
        try {

            let response = await got('https://api.latoken.com/v2/ticker');

            let cointsList = JSON.parse(response.body);

            let cointsListFiltered=cointsList.filter( e  => e.symbol.toUpperCase().includes('USDT'))

            coinArray = [];

            globItems.forEach(globItem => {


                let foundItem = cointsListFiltered.find(e => e.symbol.replace('/','') === globItem.symbol)

                if (foundItem === undefined|| foundItem.symbol==="MIR/USDT"|| foundItem.symbol==="SRM/USDT"|| foundItem.symbol==="FTT/USDT" || foundItem.symbol==="DNT/USDT" ||foundItem.symbol==="GAL/USDT" ||foundItem.symbol==="BTT/USDT" || foundItem.symbol==="BULL/USDT" || foundItem.symbol==="GMT/USDT"|| foundItem.symbol==="EPS/USDT") {
                    return
                }

                if(foundItem.volume24h<5000){
                    return
                }

                //console.log("found Item :" + foundItem.symbol);

                var exchangeItemLastPrice = foundItem.lastPrice
                var exchangeItemPairName = foundItem.symbol
                var exchangeItemVol = foundItem.volume24h
                var exchangeItemHighPrice = 0
                var exchangeItemLowPrice = 0
                var exchangeItemChangePrice = 0

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