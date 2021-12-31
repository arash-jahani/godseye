var express = require('express');
var cron = require('node-cron');
const { Telegraf } = require('telegraf');
const got = require('got');
const StringBuilder = require("string-builder");
var moment = require('moment-timezone');

const pricesPerMinuteSb = new StringBuilder();

var app = express();

const bot = new Telegraf('5000095440:AAHkSxy2NdJSYvC95ktJ6Dmv3Dil9jTDxy0');



cron.schedule('*/1 * * * *', () => {

  (async () => {
    try {

      const response = await got('https://gate.kickex.com/api/v1/market/allTickers',
        {
          headers: {

          }
        })

      const assetsResponse = JSON.parse(response.body)


      let kickexList = assetsResponse.filter(
        e => e.pairName === 'AXS/USDT' //axie-infinity
          || e.pairName === 'CHZ/USDT' //chiliz
          || e.pairName === 'ETC/USDT' //ethereum-classic
          || e.pairName === 'GRT/USDT' //the-graph
          || e.pairName === 'MKR/USDT' //maker
          || e.pairName === 'DOGE/USDT' //doge
          || e.pairName === 'ZIL/USDT' //zilliqa
          || e.pairName === 'ADA/USDT' //cardano
          || e.pairName === 'ATOM/USDT' //cosmos
          || e.pairName === 'BTT/USDT' //bittorrent-2
          || e.pairName === 'COMP/USDT' //compound-governance-token
          || e.pairName === 'COTI/USDT' //coti
          || e.pairName === 'CRV/USDT' //curve-dao-token
          || e.pairName === 'DOT/USDT' //polkadot
          || e.pairName === 'ENJ/USDT' //enjin-coin
          || e.pairName === 'GALA/USDT' //gala
          || e.pairName === 'LINK/USDT' //chainlink
          || e.pairName === 'MANA/USDT' //decentraland
          || e.pairName === 'MATIC/USDT' //matic-network
          || e.pairName === 'ONT/USDT' //ontology
          || e.pairName === 'SAND/USDT' //the-sandbox
          || e.pairName === 'SHIB/USDT' //shiba-inu
          || e.pairName === 'SOL/USDT' //solana
          || e.pairName === 'TRX/USDT' //tron
      )


      // kickexList.forEach(element => {
      //   appendItemtoMessage(element)
      // });
      globalkeys = "dogecoin,axie-infinity,chiliz,ethereum-classic,the-graph,maker,zilliqa,cardano,cosmos,bittorrent-2,compound-governance-token"
        + "coti,curve-dao-token,polkadot,enjin-coin,gala,chainlink,decentraland,matic-network,ontology,the-sandbox,shiba-inu,solana,tron"
      appendItemtoMessage(kickexList, globalkeys)


    } catch (error) {
      console.log(error);
      //=> 'Internal server error ...'
    }
  })();
});

function appendItemtoMessage(kickexList, globalkeys) {

  console.log(globalkeys);

  (async () => {
    try {

      const response = await got(`https://api.coin-stats.com:443/v4/coins?ids=${globalkeys}`);

      const sb = new StringBuilder();

      sb.clear()
      pricesPerMinuteSb.clear()

      pricesPerMinuteSb.append(moment().tz("Asia/Tehran").format('HH:mm:ss'))
      pricesPerMinuteSb.appendLine();

      const coinsResponse = JSON.parse(response.body);
      let globItemsList = coinsResponse.coins;

      globItemsList.forEach(globItem => {

        const foundItem = kickexList.find(e => e.pairName === findKickexIdByName(globItem.i))
        console.log("found Item :" + findKickexIdByName(globItem.i));

        var diff = ((globItem.pu - foundItem.lastPrice) / (globItem.pu)) * 100

        var diffPrint = globItem.r + ". " + foundItem.pairName.substring(0, 4) + " : P = " + foundItem.lastPrice + " : V = " + Math.round(foundItem.baseVol) + " : D = " + diff.toString().substring(0, 4) + " %"

        console.log(diffPrint);

        pricesPerMinuteSb.append(diffPrint);
        pricesPerMinuteSb.appendLine();

        if ((diff > 10 || diff < -10)&& foundItem.baseVol>2000) {
          
        sb.append(moment().tz("Asia/Tehran").format('HH:mm:ss'))
        sb.appendLine();

        sb.append(globItem.r + " - " + foundItem.pairName);
        sb.appendLine();

        sb.append("K: " + foundItem.lastPrice + "  (" + Math.round(foundItem.changePrice) + ") " + "  high: " + foundItem.highestPrice + "  low: " + foundItem.lowestPrice);
        sb.appendLine();
        sb.append("G: " + globItem.pu.toString().substring(0, 9) + "  (" + globItem.p24 + ")");
        sb.appendLine();
        sb.append("Vol: " + Math.round(foundItem.baseVol));

        sb.appendLine();

        sb.append("diff = " + diff.toString().substring(0, 4) + " %")

        sb.appendLine();
        sb.append("------------");
        sb.appendLine();
        }
      });


      //update pinned message
      let pricesListMessage = pricesPerMinuteSb.toString()

      console.log("prices is " + pricesListMessage);

      bot.telegram.editMessageText('@HsqbIh70KMFwzSoO',
        123,
        123,
        pricesListMessage,
        "")

      //send new message
      let message = sb.toString();

      console.log("message is" + message);

      if (message.length == 0)
        return

      console.log("message sent");
      bot.telegram.sendMessage("@HsqbIh70KMFwzSoO", message)

    } catch (error) {
      console.log(error);
      //=> 'Internal server error ...'
    };
  })();
}

function findKickexIdByName(name) {

  switch (name) {
    case 'axie-infinity':
      return "AXS/USDT";

    case 'chiliz':
      return "CHZ/USDT";

    case 'ethereum-classic':
      return "ETC/USDT";

    case 'the-graph':
      return "GRT/USDT";

    case 'maker':
      return "MKR/USDT";

    case 'zilliqa':
      return "ZIL/USDT";

    case 'dogecoin':
      return "DOGE/USDT";

    case 'cardano':
      return "ADA/USDT";

    case 'cosmos':
      return "ATOM/USDT";

    case 'balancer':
      return "BAL/USDT";

    case 'bittorrent-2':
      return "BTT/USDT";

    case 'compound-governance-token':
      return "COMP/USDT";

    case 'coti':
      return "COTI/USDT";

    case 'curve-dao-token':
      return "CRV/USDT";

    case 'polkadot':
      return "DOT/USDT";

    case 'enjin-coin':
      return "ENJ/USDT";

    case 'gala':
      return "GALA/USDT";

    case 'chainlink':
      return "LINK/USDT";

    case 'decentraland':
      return "MANA/USDT";

    case 'matic-network':
      return "MATIC/USDT";

    case 'ontology':
      return "ONT/USDT";

    case 'the-sandbox':
      return "SAND/USDT";

    case 'shiba-inu':
      return "SHIB/USDT";

    case 'solana':
      return "SOL/USDT";

    case 'tron':
      return "TRX/USDT";

    default:
      return ""
  };
}

// app.get('/', function (req, res) {
//   res.send('Hello Arash!');
// });
// set port, listen for requests
const PORT = 5001;
const hostname = 'localhost'
app.listen(PORT, hostname, () => {
  console.log(`Server is running on port ${PORT}.`);
});

