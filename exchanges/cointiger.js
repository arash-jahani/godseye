const { request } = require('express');
const got = require('got');
const { default: Request } = require('got/dist/source/core');
const messageUtils = require("../messageUtils");
const { Coin } = require('../models/coin.model');



let coinArray = [];
let exchangeName="cointiger"

function allTickers(globItems) {

    (async () => {
        try {

            let response = await got('https://www.cointiger.com/exchange/api/public/market/detail');

            let cointsList = JSON.parse(response.body);

            cointsList["CTKUSDT"]=undefined
            cointsList["PLAUSDT"]=undefined
            cointsList["BCHABCUSDT"]=undefined
            cointsList["BCHSVUSDT"]=undefined
            cointsList["TCTUSDT"]=undefined


            coinArray = [];

            globItems.forEach(globItem => {


                let foundItem = cointsList[globItem.symbol.toUpperCase()]

                if (foundItem === undefined) {
                    return
                }
                if (foundItem.quoteVolume < 5000) {
                    return
                }

                //console.log("found Item :" + globItem.symbol.replace('USDT', '/USDT'));


                let exchangeItemLastPrice = foundItem.last
                let exchangeItemPairName = globItem.symbol.replace('USDT', '/USDT')
                let exchangeItemVol = foundItem.quoteVolume
                let exchangeItemHighPrice = foundItem.high24hr
                let exchangeItemLowPrice = foundItem.low24hr
                let exchangeItemChangePrice = foundItem.percentChange

                let diff = ((globItem.price - exchangeItemLastPrice) / (globItem.price)) * 100

                let coin = new Coin(exchangeName, 0, exchangeItemPairName, diff, exchangeItemLastPrice, globItem.price, 0, exchangeItemHighPrice, exchangeItemLowPrice, exchangeItemChangePrice, exchangeItemVol, "", "")

                coinArray.push(coin)

            });

            console.log(exchangeName +" size is: "+coinArray.length);            

            messageUtils.handleCoinsList(exchangeName,5329,coinArray)
            


        } catch (error) {
            console.log(error);
            //=> 'Internal server error ...'
        };
    })();
}

module.exports.getData = allTickers