const { request } = require('express');
const got = require('got');
const { default: Request } = require('got/dist/source/core');
const { Coin } = require('../models/coin.model');
const messageUtils = require("../messageUtils");



let coinArray = [];
let exchangeName="Decoin"
let messageId=0

let exchangeRefferallLink="https://www.decoin.io/en/"
let exchangeBaseLink="https://www.decoin.io/en/trade/"
let globalBaseLink="https://www.binance.com/en/trade/"


function allTickers(globItems) {

    (async () => {
        try {

            let response = await got('https://apiv1.decoin.io/market/get-ticker');

            let cointsList = JSON.parse(response.body);

            let cointsListFiltered=cointsList.filter( e  => e.Name.toUpperCase().includes('USDT'))

            coinArray = [];

            globItems.forEach(globItem => {


                let foundItem = cointsListFiltered.find(e => e.Name.replace('/','') === globItem.symbol)

                if (foundItem === undefined|| foundItem.Name==="MIR/USDT"  || foundItem.Name==="BTT/USDT" || foundItem.Name==="FTT/USDT" || foundItem.Name==="SRM/USDT") {
                    return
                }

                if(foundItem.Volume<5000){
                    return
                }

                

                var exchangeItemLastPrice = foundItem.LastPrice
                var exchangeItemPairName = foundItem.Name
                var exchangeItemVol =  foundItem.Volume
                var exchangeItemHighPrice = 0
                var exchangeItemLowPrice = 0
                var exchangeItemChangePrice =0

                var exchangeLink=exchangeBaseLink +exchangeItemPairName.replace('/USDT',"-USDT")
                var globalLink=globalBaseLink+exchangeItemPairName.replace('-USDT',"_USDT")

                var diff = ((globItem.price - exchangeItemLastPrice) / (globItem.price)) * 100

                console.log("found Item :" + diff);

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