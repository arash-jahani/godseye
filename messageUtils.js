
const StringBuilder = require("string-builder");
var moment = require('moment-timezone');
const { Coin } = require('./models/coin.model');
var global = require('./Global.js');

const { Telegraf, Markup } = require('telegraf');
const bot = new Telegraf('5000095440:AAHkSxy2NdJSYvC95ktJ6Dmv3Dil9jTDxy0');

const exchangePinedMessage = new StringBuilder();
const exchangeAlertMessage = new StringBuilder();



function handleCoinsList(exchange, messageId, coinArray) {
    coinArray.sort(function (a, b) {
        return b.getDiff() - a.getDiff();
    });

    global.exchangesArrays.set(exchange,coinArray);

    let pinedMessageKeyboard = Markup.inlineKeyboard([getPinedMessageKeyboradLink(exchange)])
    let alertMessageKeyboard = Markup.inlineKeyboard([Markup.button.url(exchange, "https://stackoverflow.com/"), Markup.button.url("binance", "https://stackoverflow.com/")], { columns: 2 });

    exchangeAlertMessage.clear()
    exchangePinedMessage.clear()

    // update top 5 in channel with link
    exchangePinedMessage.append("update at: " + moment().tz("Asia/Tehran").format('HH:mm:ss.ms'))
    exchangePinedMessage.appendLine();
    exchangePinedMessage.append("#" + exchange + ", Top 6 Arbitrage Chance")
    exchangePinedMessage.appendLine();
    exchangePinedMessage.appendLine();

    for (let index = 0; index < coinArray.length; index++) {

        let coin = coinArray[index]

        if (index < 3) {
            exchangePinedMessage.append(getCoinDiffMessage(coin))
            exchangePinedMessage.appendLine();
        }
        if (index == 3) {
            exchangePinedMessage.append("...")
            exchangePinedMessage.appendLine();
        }

        if (index >= (coinArray.length - 3)) {
            exchangePinedMessage.append(getCoinDiffMessage(coin))
            exchangePinedMessage.appendLine();
        }

        // check if +10 diff exist send message to users subscribed
        if ((coin.getDiff() > 15 || coin.getDiff() < -30) && coin.getEXVol() > 5000) {

            //send new message
            let message = priceChangeAlertMessage(coin)

            //console.log("message is" + message);
            exchangeAlertMessage.append(message)

        }
    }

    //alert message
    if (exchangeAlertMessage.toString().length > 0) {
        console.log("alert price is " + exchangePinedMessage.toString());
        bot.telegram.sendMessage("@HsqbIh70KMFwzSoO", exchangeAlertMessage.toString(), alertMessageKeyboard)
    }

    //update exchange pinned message
    console.log(exchange + " : message Updated ");

    bot.telegram.editMessageText('@HsqbIh70KMFwzSoO',
        messageId,
        messageId,
        exchangePinedMessage.toString(),
        pinedMessageKeyboard
        ).catch((err) => {
        console.log(exchange + " :errooooor : " + err);
        //setTimeout(function () { handleCoinsList(exchange, messageId, coinArray) }, 500)
    })

    //console.log(exchange +"--"+ global.exchangesArrays.size );
    
    
}


function priceChangeAlertMessage(coin) {

    const sb = new StringBuilder();


    // sb.append("time: " + moment().tz("Asia/Tehran").format('HH:mm:ss:ms'))
    // sb.appendLine();
    // sb.appendLine();


    sb.append(coin.getName());
    sb.appendLine();

    sb.append(coin.getExchange() + ": " + formatPrice(coin.getEXLastprice()) + "  high: " + formatPrice(coin.getEXhightprice()) + "  low: " + formatPrice(coin.getEXlowprice()));
    sb.appendLine();
    sb.append("Binance: " + formatPrice(coin.getLastGlobprice()));
    sb.appendLine();
    sb.append("Vol: " + Math.round(coin.getEXVol()));

    sb.appendLine();

    sb.append("diff = " + coin.getDiff().toString().substring(0, 4) + " %")

    sb.appendLine();
    sb.append("------------");
    sb.appendLine();

    return sb.toString()
}

function getCoinDiffMessage(coin) {
    //return coin.getDiff().toString().substring(0, 4) + "%  " + coin.getGlobalRank() + ". " + coin.getName() + " : P = " + coin.getEXLastprice() + " : V = " + Math.round(coin.getEXVol())
    return "(" + coin.getDiff().toString().substring(0, 4) + "%) " + coin.getName() + "\n    " + coin.getExchange() + ": " + formatPrice(coin.getEXLastprice()) + " , binance: " + formatPrice(coin.getLastGlobprice())
}

function formatPrice(p) {

    let price = parseFloat(p)

    if (price > 1)
        return price.toFixed(2)
    else if (price > 0.01)
        return price.toFixed(3)
    else if (price > 0.001)
        return price.toFixed(4)
    else if (price > 0.0001)
        return price.toFixed(5)
    else if (price > 0.00001)
        return price.toFixed(6)
    else if (price > 0.000001)
        return price.toFixed(7)
    else if (price > 0.0000001)
        return price.toFixed(8)
    else if (price > 0.00000001)
        return price.toFixed(9)
    else if (price > 0.000000001)
        return price.toFixed(10)
    else if (price > 0.0000000001)
        return price.toFixed(11)
    else
        return price;

}

function getPinedMessageKeyboradLink(exchange) {

    switch (exchange) {
        case "kickex":
            return Markup.button.url('Click to Buy/Sell at kickex.com', 'https://ref.kickex.com/BqkA4');
        case "exmarkets":
            return Markup.button.url('Click to Buy/Sell at exmarkets.com', 'https://exmarkets.com/');
        case "fatbtc":
            return Markup.button.url('Click to Buy/Sell at fatbtc.com', 'https://fatbtc.com/');
        case "cointiger":
            return Markup.button.url('Click to Buy/Sell at cointiger.com', 'https://cointiger.com/');
        case "latoken":
            return Markup.button.url('Click to Buy/Sell at latoken.com', 'https://latoken.com/');
        case "ascendex":
            return Markup.button.url('Click to Buy/Sell at ascendex.com', 'https://ascendex.com/');
        case "wazirx":
            return Markup.button.url('Click to Buy/Sell at wazirx.com', 'https://wazirx.com/');
        case "liquid":
            return Markup.button.url('Click to Buy/Sell at liquid.com', 'https://liquid.com/');
        case "exmo":
            return Markup.button.url('Click to Buy/Sell at exmo.me', 'https://exmo.me/');
        case "vindax":
            return Markup.button.url('Click to Buy/Sell at vindax.com', 'https://vindax.com/');
        case "stex":
            return Markup.button.url('Click to Buy/Sell at stex.com', 'https://stex.com/');
        case "ztb":
            return Markup.button.url('Click to Buy/Sell at ztb.im', 'https://ztb.im/');
        case "catex":
            return Markup.button.url('Click to Buy/Sell at catex.io', 'https://catex.io/');


        default:
            return Markup.button.url('not define yet', 'https://not.com/')
    }


}

module.exports = { handleCoinsList }
