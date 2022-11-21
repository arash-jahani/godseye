const { request } = require('express');
const got = require('got');
const { default: Request } = require('got/dist/source/core');
const { Coin } = require('../models/coin.model');
const messageUtils = require("../messageUtils");



let coinArray = [];
let exchangeName="Bitglobal"
let messageId=5341

let exchangeRefferallLink="https://www.bitglobal.com/en-us"
let exchangeBaseLink="https://www.bitglobal.com/en-us/spot/trade?q="
let globalBaseLink="https://www.binance.com/en/trade/"

function allTickers(globItems) {

    (async () => {
        try {

            let response = await got('https://global-openapi.bithumb.pro/openapi/v1/spot/ticker?symbol=ALL');

            let cointsList = JSON.parse(response.body);

            let cointsListFiltered=cointsList.data.filter( e  => e.s.includes('USDT'))

            coinArray = [];

            globItems.forEach(globItem => {

                let foundItem = cointsListFiltered.find(e => e.s.replace('-USDT','USDT') === globItem.symbol)

                if (foundItem === undefined|| foundItem.s==="FTT-USDT" || foundItem.s==="CRV-USDT"||foundItem.s==="BTT-USDT"|| foundItem.s==="MIR-USDT"|| foundItem.s==="PLA-USDT"|| foundItem.s==="UNFI-USDT"|| foundItem.s==="GMT-USDT"|| foundItem.s==="BURGER-USDT") {
                    return
                }

                if(foundItem.v<5000){
                    return
                }

                //console.log("found Item :" + foundItem.symbol);

                var exchangeItemLastPrice = foundItem.l
                var exchangeItemPairName = foundItem.s.replace('-USDT',"/USDT")
                var exchangeItemVol = foundItem.v
                var exchangeItemHighPrice = 0
                var exchangeItemLowPrice = 0
                var exchangeItemChangePrice = 0

                var exchangeLink=exchangeBaseLink + exchangeItemPairName.replace('/USDT',"-USDT")
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