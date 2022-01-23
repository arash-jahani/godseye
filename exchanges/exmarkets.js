const { request } = require('express');
const got = require('got');
const { default: Request } = require('got/dist/source/core');
const messageUtils = require("../messageUtils");
const { Coin } = require('../models/coin.model');



let coinArray = [];
let exchangeName="exmarkets"

function allTickers(globItems) {

    (async () => {
        try {

            let response = await got('https://exmarkets.com/api/trade/v1/market/ticker');

            let cointsList = JSON.parse(response.body);

            // let cointsListFiltered=cointsList.filter( e  => e.pairName.toUpperCase().includes('USDT'))


            coinArray = [];

            globItems.forEach(globItem => {


                let foundItem = cointsList[globItem.symbol.replace('USDT', '-USDT').toLowerCase()]

                if (foundItem === undefined) {
                    return
                }
                if (foundItem.volume < 5000) {
                    return
                }

               // console.log("found Item :" + globItem.symbol.replace('USDT', '/USDT').toLowerCase());


                let exchangeItemLastPrice = foundItem.last
                let exchangeItemPairName = globItem.symbol.replace('USDT', '/USDT').toUpperCase()
                let exchangeItemVol = foundItem.volume
                let exchangeItemHighPrice = foundItem.high
                let exchangeItemLowPrice = foundItem.low
                let exchangeItemChangePrice = 0

                let diff = ((globItem.price - exchangeItemLastPrice) / (globItem.price)) * 100

                let coin = new Coin(exchangeName, 0, exchangeItemPairName, diff, exchangeItemLastPrice, globItem.price, 0, exchangeItemHighPrice, exchangeItemLowPrice, exchangeItemChangePrice, exchangeItemVol, "", "")

                coinArray.push(coin)

            });

            console.log(exchangeName +" size is: "+coinArray.length);            

            messageUtils.handleCoinsList(exchangeName,4289,coinArray)
            


        } catch (error) {
            console.log(error);
            //=> 'Internal server error ...'
        };
    })();
}

module.exports.getData = allTickers