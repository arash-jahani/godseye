const { request } = require('express');
const got = require('got');
const { default: Request } = require('got/dist/source/core');
const messageUtils = require("../messageUtils");
const { Coin } = require('../models/coin.model');



let coinArray = [];
let exchangeName="fatbtc"

function allTickers(globItems) {

    (async () => {
        try {

            let response = await got(`https://www.fatbtc.com/m/allticker/1/`+Date.now());

            let cointsList = JSON.parse(response.body).data;

             //let cointsListFiltered=cointsList.data.filter( e  => e.pairName.toUpperCase().includes('USDT'))
            
             //cause thie asset has samename with other asset in binance
             cointsList["linausdt_ticker"]=undefined
                          
            coinArray = [];

            globItems.forEach(globItem => {


                let foundItem = cointsList[globItem.symbol.replace('USDT', 'usdt_ticker').toLowerCase()]

                if (foundItem === undefined) {
                    return
                }
                if (foundItem.volume < 5000) {
                    return
                }

               // console.log("found Item :" + globItem.symbol.replace('USDT', '/USDT').toLowerCase());


                let exchangeItemLastPrice = foundItem.close
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
            
            messageUtils.handleCoinsList(exchangeName,5322,coinArray)
            


        } catch (error) {
            console.log(error);
            //=> 'Internal server error ...'
        };
    })();
}

module.exports.getData = allTickers