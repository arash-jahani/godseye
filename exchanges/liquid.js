const { request } = require('express');
const got = require('got');
const { default: Request } = require('got/dist/source/core');
const { Coin } = require('../models/coin.model');
const messageUtils = require("../messageUtils");



let coinArray = [];
let exchangeName="liquid"
let messageId=5336


function allTickers(globItems) {

    (async () => {
        try {

            let response = await got('https://api.liquid.com/products');

            let cointsList = JSON.parse(response.body);

            let cointsListFiltered=cointsList.filter( e  => e.quoted_currency.toUpperCase().includes('USDT'))

            coinArray = [];

            globItems.forEach(globItem => {

                let foundItem = cointsListFiltered.find(e => e.currency_pair_code.toUpperCase() === globItem.symbol)

                if (foundItem === undefined) {
                    return
                }

                if(foundItem.volume_24h<5000){
                    return
                }

                //console.log("found Item :" + foundItem.symbol);

                var exchangeItemLastPrice = foundItem.last_traded_price
                var exchangeItemPairName = foundItem.currency_pair_code.replace('USDT', '/USDT').toUpperCase()
                var exchangeItemVol = foundItem.volume_24h
                var exchangeItemHighPrice = 0
                var exchangeItemLowPrice = 0
                var exchangeItemChangePrice = 0

                var diff = ((globItem.price - exchangeItemLastPrice) / (globItem.price)) * 100

                var coin = new Coin(exchangeName,0, exchangeItemPairName, diff, exchangeItemLastPrice, globItem.price, 0, exchangeItemHighPrice, exchangeItemLowPrice, exchangeItemChangePrice, exchangeItemVol, "", "")

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