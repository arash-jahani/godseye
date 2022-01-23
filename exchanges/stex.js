const { request } = require('express');
const got = require('got');
const { default: Request } = require('got/dist/source/core');
const { Coin } = require('../models/coin.model');
const messageUtils = require("../messageUtils");



let coinArray = [];
let exchangeName="stex"
let messageId=5339


function allTickers(globItems) {

    (async () => {
        try {

            let response = await got('https://api3.stex.com/public/ticker');

            let cointsList = JSON.parse(response.body);

            let cointsListFiltered=cointsList.data.filter( e  => e.symbol.toUpperCase().includes('USDT'))

            coinArray = [];

            globItems.forEach(globItem => {

                let foundItem = cointsListFiltered.find(e => e.symbol.replace('_USDT','USDT').toUpperCase() === globItem.symbol)

                if (foundItem === undefined) {
                    return
                }

                if(foundItem.volume<5000){
                    return
                }

                //console.log("found Item :" + foundItem.symbol);

                var exchangeItemLastPrice = foundItem.last
                var exchangeItemPairName = foundItem.symbol.replace('_USDT', '/USDT').toUpperCase()
                var exchangeItemVol = foundItem.volume
                var exchangeItemHighPrice = foundItem.high
                var exchangeItemLowPrice = foundItem.low
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