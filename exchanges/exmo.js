const { request } = require('express');
const got = require('got');
const { default: Request } = require('got/dist/source/core');
const messageUtils = require("../messageUtils");
const { Coin } = require('../models/coin.model');



let coinArray = [];
let exchangeName="exmo"
let messageId=5337


function allTickers(globItems) {

    (async () => {
        try {

            let response = await got('https://api.exmo.com/v1.1/ticker');

            let cointsList = JSON.parse(response.body);

            coinArray = [];

            globItems.forEach(globItem => {


                let foundItem = cointsList[globItem.symbol.replace('USDT','_USDT').toUpperCase()]

                if (foundItem === undefined) {
                    return
                }
                if (foundItem.vol < 5000) {
                    return
                }

                //console.log("found Item :" + globItem.symbol.replace('USDT', '/USDT'));


                let exchangeItemLastPrice = foundItem.last_trade
                let exchangeItemPairName = globItem.symbol.replace('USDT', '/USDT')
                let exchangeItemVol = foundItem.vol
                let exchangeItemHighPrice = foundItem.high
                let exchangeItemLowPrice = foundItem.low
                let exchangeItemChangePrice = 0

                let diff = ((globItem.price - exchangeItemLastPrice) / (globItem.price)) * 100

                let coin = new Coin(exchangeName, 0, exchangeItemPairName, diff, exchangeItemLastPrice, globItem.price, 0, exchangeItemHighPrice, exchangeItemLowPrice, exchangeItemChangePrice, exchangeItemVol, "", "")

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