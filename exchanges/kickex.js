const { request } = require('express');
const got = require('got');
const { default: Request } = require('got/dist/source/core');
const { Coin } = require('../models/coin.model');
const messageUtils = require("../messageUtils");



let coinArray = [];
let exchangeName="kickex"
let messageId=557


function allTickers(globItems) {

    (async () => {
        try {

            let response = await got('https://gate.kickex.com/api/v1/market/allTickers');

            let cointsList = JSON.parse(response.body);

            let cointsListFiltered=cointsList.filter( e  => e.pairName.toUpperCase().includes('USDT'))

            coinArray = [];

            globItems.forEach(globItem => {


                let foundItem = cointsListFiltered.find(e => e.pairName.replace('/','') === globItem.symbol)

                if (foundItem === undefined) {
                    return
                }

                if(foundItem.quoteVol<5000){
                    return
                }

               // console.log("found Item :" + foundItem.pairName);

                var exchangeItemLastPrice = foundItem.lastPrice
                var exchangeItemPairName = foundItem.pairName
                var exchangeItemVol = foundItem.quoteVol
                var exchangeItemHighPrice = foundItem.highestPrice
                var exchangeItemLowPrice = foundItem.lowestPrice
                var exchangeItemChangePrice = foundItem.changePrice

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