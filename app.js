var express = require('express');
const got = require('got');
var cron = require('node-cron');
var app = express();
const db = require("./models");


const EX_kickex = require('./exchanges/kickex.js')
const EX_exmarkets = require('./exchanges/exmarkets.js')
const EX_fatbtc = require('./exchanges/fatbtc.js')
const EX_cointiger = require('./exchanges/cointiger.js')
const EX_latoken = require('./exchanges/latoken.js')
const EX_ascendex = require('./exchanges/ascendex.js')
const EX_wazirx = require('./exchanges/wazirx.js')
const EX_liquid = require('./exchanges/liquid.js')
const EX_exmo = require('./exchanges/exmo.js')
const EX_vindax = require('./exchanges/vindax.js')
const EX_ztb = require('./exchanges/ztb.js')
const EX_catex = require('./exchanges/catex.js')

require("./routes/asset.routes")(app);


const tekegranBot = require('./telegramBot.js')
tekegranBot.launchBot();


db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and re-sync db.");
});
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


cron.schedule('*/1 * * * *', () => {

  (async () => {
    try {

      globalkeys = "dogecoin,axie-infinity,chiliz,ethereum-classic,the-graph,maker,zilliqa,cardano,cosmos,bittorrent-2,compound-governance-token"
        + "coti,curve-dao-token,polkadot,enjin-coin,gala,chainlink,decentraland,matic-network,ontology,the-sandbox,shiba-inu,solana,tron"
        + "avalanche-2,balancer,basic-attention-token,elrond-erd-2,loopring,litecoin,near,quasacoin,republic-protocol,reserve-rights-token"
        + "binance-peg-sushi,uniswap,ripple,0x"

      console.log("binance call");

      const response = await got("https://api3.binance.com/api/v3/ticker/price",//`https://api.coin-stats.com:443/v4/coins?ids=${globalkeys}`,
        {
          headers: {

          }
        })

      const assetsResponse = JSON.parse(response.body)

      //let globItemsList = assetsResponse.coins;

      let filteredList = assetsResponse.filter(e => e.symbol.includes('USDT')) //axie-infinity)


      console.log("binance size :" + filteredList.length);

      setTimeout(function () { EX_cointiger.getData(filteredList)}, 1000 )
      setTimeout(function () { EX_fatbtc.getData(filteredList)}, 3000 )
      setTimeout(function () { EX_kickex.getData(filteredList)}, 5000 )
      setTimeout(function () { EX_exmarkets.getData(filteredList)}, 7000 )
      setTimeout(function () { EX_latoken.getData(filteredList)}, 9000 )
      setTimeout(function () { EX_wazirx.getData(filteredList)}, 11000 )
      setTimeout(function () { EX_liquid.getData(filteredList)}, 13000 )
      setTimeout(function () { EX_exmo.getData(filteredList)}, 15000 )
      setTimeout(function () { EX_vindax.getData(filteredList)}, 17000 )
      setTimeout(function () { EX_ztb.getData(filteredList)}, 21000 )
      setTimeout(function () { EX_catex.getData(filteredList)}, 23000 )
      setTimeout(function () { EX_ascendex.getData(filteredList)}, 25000 )


    } catch (error) {
      console.log(error);
      //=> 'Internal server error ...'
    }
  })();
});




app.get('/', function (req, res) {
  res.send('Hello Arash!');
});
// set port, listen for requests
const PORT = 5000;
const hostname = '0.0.0.0'
app.listen(PORT, hostname, () => {
  console.log(`Server is running on port ${PORT}.`);
});

