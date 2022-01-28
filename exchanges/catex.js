const { request } = require('express');
const got = require('got');
const { default: Request } = require('got/dist/source/core');
const { Coin } = require('../models/coin.model');
const messageUtils = require("../messageUtils");



let coinArray = [];
let exchangeName="catex"
let messageId=5341


function allTickers(globItems) {

    (async () => {
        try {

            let response = await got('https://www.catex.io/api/token/list');

            let cointsList = JSON.parse(response.body);

            let cointsListFiltered=cointsList.data.filter( e  => e.pair.toUpperCase().includes('USDT'))

            coinArray = [];

            globItems.forEach(globItem => {

                let foundItem = cointsListFiltered.find(e => e.pair.replace('/USDT','USDT').toUpperCase() === globItem.symbol)

                if (foundItem === undefined || foundItem.symbol==="ATM/USDT") {
                    return
                }

                if(foundItem.volume24HoursByCurrency<5000){
                    return
                }

                //console.log("found Item :" + foundItem.symbol);

                var exchangeItemLastPrice = foundItem.priceByBaseCurrency
                var exchangeItemPairName = foundItem.pair.toUpperCase()
                var exchangeItemVol = foundItem.volume24HoursByCurrency
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