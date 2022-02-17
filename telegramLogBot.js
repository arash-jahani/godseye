
const StringBuilder = require("string-builder");
var moment = require('moment-timezone');
var global = require('./Global.js');
const { Telegraf, Markup } = require('telegraf');

const logBot = new Telegraf('1975506239:AAE54vDGYF0EgmWZZHKvjYfAWZZs42n_mCE'); //log bot


function reportLog(message) {

    var finalmessage=message +"\n #arbitrage_membership_bot"
    
    logBot.telegram.sendMessage("-1001737856092", finalmessage,{disable_web_page_preview : 'true' })
}

module.exports = { reportLog }
