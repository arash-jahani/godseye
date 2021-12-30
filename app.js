var express = require('express');
var cron = require('node-cron');
const { Telegraf } = require('telegraf')
var moment = require('jalali-moment');
const got = require('got');
const StringBuilder = require("string-builder");
const pricesPerMinuteSb = new StringBuilder();

var app = express();

const bot = new Telegraf('5000095440:AAHkSxy2NdJSYvC95ktJ6Dmv3Dil9jTDxy0');



cron.schedule('*/2 * * * *', () => {

  let pricesListMessage=pricesPerMinuteSb.toString()

  console.log("prices is "+pricesListMessage);
  bot.telegram.editMessageText('@HsqbIh70KMFwzSoO',
  123,
  123,
  pricesListMessage,
  "")

  pricesPerMinuteSb.clear()

  pricesPerMinuteSb.append(moment().locale('fa').format('dddd DD MMM HH:mm:ss'))
  pricesPerMinuteSb.appendLine();

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
      || e.pairName === 'ZIL/USDT') //Zilliqa

     
      kickexList.forEach(element => {
        appendItemtoMessage(element)
      });


    } catch (error) {
      console.log(error);
      //=> 'Internal server error ...'
    }
  })();
});

function appendItemtoMessage(item) {
  
  var key="";
  
  switch (item.pairName) {
    case 'AXS/USDT':
      key="axie-infinity"
      break;
    case 'CHZ/USDT':
      key="chiliz"
      break;
    case 'ETC/USDT':
      key="ethereum-classic"
      break;
    case 'GRT/USDT':
      key="the-graph"
      break;
    case 'MKR/USDT':
      key="maker"
      break;
    case 'ZIL/USDT':
      key="zilliqa"
      break;
      case 'DOGE/USDT':
      key="dogecoin"
      break;
  
    default:
      break;
  };
  
  console.log(key);

  (async () => {
    try {
      
      const response = await got(`https://api.coin-stats.com:443/v4/coins?ids=${key}`);

      const coinsResponse = JSON.parse(response.body);
      const globItem=coinsResponse.coins[0];

      var diff=((globItem.pu - item.lastPrice) / (globItem.pu)) * 100

      var diffPrint=globItem.r+". "+item.pairName+" : price = " +item.lastPrice+ " : diff = " + diff.toString().substring(0, 4) +" %"

      console.log(diffPrint);

      pricesPerMinuteSb.append(diffPrint);
      pricesPerMinuteSb.appendLine();

      if(diff<10 && diff>-10){
        return
      }

      const sb = new StringBuilder();

      sb.clear()

      sb.append(moment().locale('fa').format('dddd DD MMM HH:mm:ss'))
      sb.appendLine();

      sb.append(globItem.r + " - " + item.pairName);
      sb.appendLine();
      
      sb.append("K: " + item.lastPrice + "  ("+ Math.round(item.changePrice) +") " + "  high: " + item.highestPrice + "  low: " + item.lowestPrice);
      sb.appendLine();
      sb.append("G: " +globItem.pu.toString().substring(0, 9) + "  ("+ globItem.p24 +")");

      sb.appendLine();

      sb.append("diff = " + diff.toString().substring(0, 4) +" %")

      sb.appendLine();
      sb.append("------------");
      sb.appendLine();

      let message = sb.toString();

      console.log("message updated");
      bot.telegram.sendMessage("@HsqbIh70KMFwzSoO",message)

    } catch (error) {
      console.log(error);
      //=> 'Internal server error ...'
    };
  })();
  



}

// app.get('/', function (req, res) {
//   res.send('Hello Arash!');
// });
// set port, listen for requests
const PORT = 5001;
const hostname ='localhost'
app.listen(PORT,hostname, () => {
  console.log(`Server is running on port ${PORT}.`);
});

