const { request } = require('express');
const got = require('got');
const { Telegraf, Markup, Extra } = require('telegraf');
const validatePhoneNumber = require('validate-phone-number-node-js');

//const bot = new Telegraf('5187064542:AAFYYNCvrHXVC3pVGMKAaVlr2jLF4G_PDh0'); //membership bot
//live api : 5187064542:AAFYYNCvrHXVC3pVGMKAaVlr2jLF4G_PDh0
//stg api : 5118338282:AAEDTEhFqwuDwpWSo9Yg9CAz1pdf7Ocl6BU
var isProduction = true

var bot;
if (isProduction) {
    bot = new Telegraf('5187064542:AAFYYNCvrHXVC3pVGMKAaVlr2jLF4G_PDh0')
} else {
    bot = new Telegraf('5118338282:AAEDTEhFqwuDwpWSo9Yg9CAz1pdf7Ocl6BU')
}

const subController = require("./controller/subscription.controller");
const subscriptionModel = require('./models/subscription.model');
const url = require("url");
var validUrl = require('valid-url');
const serviceLog = require("./telegramLogBot.js");

const adminAccount = "@contact_us_24_7"
const USDT_BEP2_waletlAddress = "bnb17cefnzfaecg54g4q7tv2wdd4qz0a65j3t9n6jx"
const USDT_ERC20_waletlAddress = "0x9cd6722AcCC42187c05A468C4f24e552b0Fa4643"
const USDT_TRC20_waletlAddress = "TLPkUuayHbYmfqHHSAoCB8gSHGSxdHk3de"
const Bitcoin_waletlAddress = "bc1qpuf2x3prudpxhwd5uuwhmf0l2cnfqszexcx9p7"
const Ethereum_waletlAddress = "0x9cd6722AcCC42187c05A468C4f24e552b0Fa4643"
const Tron_waletlAddress = "TLPkUuayHbYmfqHHSAoCB8gSHGSxdHk3de"
const BNB_waletlAddress = "bnb17cefnzfaecg54g4q7tv2wdd4qz0a65j3t9n6jx"
const SmartChain_waletlAddress = "0x9cd6722AcCC42187c05A468C4f24e552b0Fa4643"
const Dogecoin_waletlAddress = "DDexwaFk5HFkerTZYb8mNNN6yedeJNJTxG"
const Solana_waletlAddress = "6VdgYPnh5UpiTNmFHKcq75ZZF2xp5hfcorbvq1dhzcgV"
const Shiba_waletlAddress = "0x9cd6722AcCC42187c05A468C4f24e552b0Fa4643"


bot.command('start', ctx => {

    serviceLog.reportLog(`#${ctx.chat.id}\n start `)

    bot.telegram.sendMessage(ctx.chat.id, `Good to meet you!🤩\nWelcome to the 'Crypto Arbitrage Signal' membership bot.\nStart your subscription by clicking the join button\n/join\n `)
})

bot.command('join', async (ctx) => {

        var subModel = {
    
        chat_id: ctx.chat.id,
       
    }

    var userSubscription = await subController.create(subModel)

    join(ctx.chat.id)

    // bot.telegram.sendMessage(ctx.chat.id, "Your account will be created by your phone number, please let us know what it is", requestPhoneKeyboard).then(() => {
    //     // handle user phone
    // })

})

// bot.on("contact", async (ctx) => {

//     //todo : save user info

//     var subModel = {
//         phone: ctx.update.message.contact.phone_number,
//         name: `${ctx.update.message.contact.first_name ?? ""} ${ctx.update.message.contact.last_name ?? ""}`,
//         username: ctx.update.message.contact.user_id ?? "",
//         chat_id: ctx.chat.id,
//         last_memo: ctx.update.message.contact.user_id,
//         referral_code: ctx.update.message.contact.user_id
//     }

//     serviceLog.reportLog(`#${ctx.chat.id}\n${subModel.phone}\n${subModel.name}\n${subModel.username} contact Granted`)

//     var userSubscription = await subController.create(subModel)

//     serviceLog.reportLog(`#${ctx.chat.id}\n user record:${userSubscription}`)

//     join(ctx.chat.id)

//     //  if (userSubscription instanceof ){
//     //console.log(`result is: error happen ${userSubscription}`)
//     //  }else{
//     //    console.log(`result is: ${productCount}`)

//     //  }

//     //todo : check user exit and then check his subscription and if user not exist then save user's info 
//     // var subscriptionMessage = ""
//     // if (userSubscription.expire_at == 0) { //new user
//     //     subscriptionMessage = `dear ${ctx.update.message.contact.first_name}\n`
//     // } else {
//     //     subscriptionMessage = `dear ${ctx.update.message.contact.first_name} your previous subscription plan expire at ${userSubscription.expire_at}  \n`
//     // }



//     // let displayMessage = `Enter your invitation code to receive 15% off`;

//     // bot.telegram.sendMessage(ctx.chat.id, displayMessage, {
//     //     reply_markup: {
//     //         inline_keyboard: [
//     //             [{
//     //                 text: "I don't have an invite code",
//     //                 callback_data: 'join_anyway'
//     //             }
//     //             ]
//     //         ]
//     //     }
//     // })

// })

async function join(chatId) {

    serviceLog.reportLog(`#${chatId}\n join message`)

    // if user have invite code calc dicount
    var discount = 0
    //var userSubscription = await subController.findByChatId(chatId)
    var displayMessage = ""

    var plan1 = `1 Month: 19 USDT`
    var plan2 = `6 Months: 39 USDT`


    // if (userSubscription.invited_code >0) {

    //     discount = 15

    //     plan1 = `1 Month: ${calcDiscount(49, discount)} USDT`
    //     plan2 = `6 Months: ${calcDiscount(149, discount)} USDT`
    //     plan3 = `2 Years: ${calcDiscount(249, discount)} USDT`
    //     displayMessage="%15 discount was applied.\n"
    // }
    console.log("discount is:" + discount)


    displayMessage = displayMessage + `The following subscription plans are available, \n choose one of them `;

    bot.telegram.sendPhoto(chatId, { source: 'images/discount_offer.jpg' }, {
        caption: displayMessage,
        reply_markup: {
            inline_keyboard: [
                [{
                    text: plan1,
                    callback_data: 'plan1'
                }
                ],
                [{
                    text: plan2,
                    callback_data: 'plan2'
                }
                ]
            ]
        }
    })
}
// bot.action("join_anyway", (ctx) => {
//     join(ctx.chat.id)
// })
// bot.hears("Cancel", (ctx) => {

//     serviceLog.reportLog(`#${ctx.chat.id}\n contact denied!`)
//     //Print Log cancel
//     bot.telegram.sendMessage(ctx.chat.id, "If you would like to subscribe, please provide your phone number. \n /join")
// })
bot.command("contact_us", (ctx) => {
    //Print Log cancel
    serviceLog.reportLog(`#${ctx.chat.id}\n contact us`)
    bot.telegram.sendMessage(ctx.chat.id, `contact us: ${adminAccount}`)
})
bot.action('contact_us', ctx => {

    serviceLog.reportLog(`#${ctx.chat.id}\n contact us`)
    bot.telegram.sendMessage(ctx.chat.id, `contact us: ${adminAccount}`)
});
bot.action('plan1', ctx => {

    showPaymentSolutionsList(ctx.chat.id, 19)

    return
    (async () => {
        try {

            let data = await bot.telegram.createChatInviteLink(-1001774132100, { member_limit: 1 })
            //....do more things with data....
            console.log(data.invite_link)

            let animalMessage = `this link only for you \n ${data.invite_link}`;
            //ctx.deleteMessage();
            bot.telegram.sendMessage(ctx.chat.id, animalMessage, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            Markup.button.url("join", data.invite_link)
                        ]
                    ]
                }
            })

        } catch (error) {

            console.log(error)
        }
    })()
});
bot.action('plan2', ctx => {
    showPaymentSolutionsList(ctx.chat.id, 39)
});


// bot.command('status', async ctx => {

//     var message = "this service not available.please contact us"
//     // var userSubscription = await subController.findByChatId(ctx.chat.id)
//     // if (userSubscription instanceof String) {
//     //     message = "Please join first, /join"
//     //     return
//     // }
//     // var today = Date.now()
//     // if (userSubscription.expire_at > today) {
//     //     message = `Your subscription expire At ${userSubscription.expire_at}`
//     // } else {
//     //     message = `You do not have an active subscription.`
//     // }



//     bot.telegram.sendMessage(ctx.chat.id, message, {
//     })
// })


async function showPaymentSolutionsList(chatId, amount) {

    var userSubscription = await subController.updateAmount(chatId, amount)

    //todo: get this user memo from db by chatid
    serviceLog.reportLog(`#${chatId}\n ${amount} pay message`)


    let displayMessage = `Select one of the items below and send ${amount} USDTs of selected coin to that's wallet address`

    bot.telegram.sendMessage(chatId, displayMessage, {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "Tether(USDT) - BEP2",
                    callback_data: 'select_coin_usdt_bep2'
                }
                ],
                [{
                    text: "Tether(USDT) - ERC20",
                    callback_data: 'select_coin_usdt_erc20'
                }
                ],
                [{
                    text: "Tether(USDT) - TRC20",
                    callback_data: 'select_coin_usdt_trc20'
                }
                ],
                [{
                    text: "Bitcoin(BTC)",
                    callback_data: 'select_coin_bitcoin'
                }
                ],
                [{
                    text: "Ethereum(ETH)",
                    callback_data: 'select_coin_ethereum'
                }
                ],
                [{
                    text: "Tron(TRX)",
                    callback_data: 'select_coin_tron'
                }
                ],
                [{
                    text: "BNB(BNB)",
                    callback_data: 'select_coin_bnb'
                }
                ],
                [{
                    text: "Smart Chain(BNB)",
                    callback_data: 'select_coin_smartchain'
                }
                ],
                [{
                    text: "Dogecoin(DOGE)",
                    callback_data: 'select_coin_dogecoin'
                }
                ],
                [{
                    text: "Solana(SOL)",
                    callback_data: 'select_coin_solana'
                }
                ],
                [{
                    text: "Shiba INU(SHIB) - ERC20",
                    callback_data: 'select_coin_shiba'
                }
                ]

            ]
        }
    })
}
bot.action('select_coin_usdt_bep2', async ctx => {

    var userSubscription = await subController.updateWalletAddress(ctx.chat.id, USDT_BEP2_waletlAddress, "images/usdt_bep2.jpg")

    calcHowMuchTokenHaveToSend(ctx.chat.id, "Tether(USDT) - BEP2", "")
})
bot.action('select_coin_usdt_erc20', async ctx => {

    var userSubscription = await subController.updateWalletAddress(ctx.chat.id, USDT_ERC20_waletlAddress, "images/usdt_erc20.jpg")

    calcHowMuchTokenHaveToSend(ctx.chat.id, "Tether(USDT) - ERC20", "")
})
bot.action('select_coin_usdt_trc20', async ctx => {

    var userSubscription = await subController.updateWalletAddress(ctx.chat.id, USDT_TRC20_waletlAddress, "images/usdt_trc20.jpg")

    calcHowMuchTokenHaveToSend(ctx.chat.id, "Tether(USDT) - TRC20", "")
})
bot.action('select_coin_bitcoin', async ctx => {

    var userSubscription = await subController.updateWalletAddress(ctx.chat.id, Bitcoin_waletlAddress, "images/bitcoin.jpg")

    calcHowMuchTokenHaveToSend(ctx.chat.id, "Bitcoin(BTC)", "bitcoin")
})
bot.action('select_coin_ethereum', async ctx => {

    var userSubscription = await subController.updateWalletAddress(ctx.chat.id, Ethereum_waletlAddress, "images/ethereum.jpg")

    calcHowMuchTokenHaveToSend(ctx.chat.id, "Ethereum(ETH)", "ethereum")
})
bot.action('select_coin_tron', async ctx => {

    var userSubscription = await subController.updateWalletAddress(ctx.chat.id, Tron_waletlAddress, "images/tron.jpg")

    calcHowMuchTokenHaveToSend(ctx.chat.id, "Tron(TRX)", "tron")
})
bot.action('select_coin_bnb', async ctx => {

    var userSubscription = await subController.updateWalletAddress(ctx.chat.id, BNB_waletlAddress, "images/bnb.jpg")

    calcHowMuchTokenHaveToSend(ctx.chat.id, "BNB", "binance-coin")
})
bot.action('select_coin_smartchain', async ctx => {

    var userSubscription = await subController.updateWalletAddress(ctx.chat.id, SmartChain_waletlAddress, "images/smartchain.jpg")

    calcHowMuchTokenHaveToSend(ctx.chat.id, "Smart Chain(BNB)", "binance-coin")
})
bot.action('select_coin_dogecoin', async ctx => {

    var userSubscription = await subController.updateWalletAddress(ctx.chat.id, Dogecoin_waletlAddress, "images/dogecoin.jpg")


    calcHowMuchTokenHaveToSend(ctx.chat.id, "Dogecoin(DOGE)", "dogecoin")
})
bot.action('select_coin_solana', async ctx => {

    var userSubscription = await subController.updateWalletAddress(ctx.chat.id, Solana_waletlAddress, "images/solana.jpg")

    calcHowMuchTokenHaveToSend(ctx.chat.id, "Solana(SOL)", "solana")
})
bot.action('select_coin_shiba', async ctx => {

    var userSubscription = await subController.updateWalletAddress(ctx.chat.id, Shiba_waletlAddress, "images/shiba_erc20.jpg")

    calcHowMuchTokenHaveToSend(ctx.chat.id, "Shiba INU(SHIB) - ERC20", "shiba-inu")
})

async function calcHowMuchTokenHaveToSend(chatId, selectedCoin, coinId) {

    var selectedAmount = await subController.getAmount(chatId)

    if (coinId === "") {
        showSelectedCryptoInfo(chatId, selectedCoin, selectedAmount)
        return
    }

    (async () => {
        try {

            let response = await got(`https://api.coin-stats.com:443/v4/coins?ids=` + coinId);

            let coinsArray = JSON.parse(response.body);

            let coin = coinsArray.coins[0];

            let finalAmount = (selectedAmount / coin.pu)

            showSelectedCryptoInfo(chatId, selectedCoin, formatPrice(finalAmount))

        } catch (error) {
            showSelectedCryptoInfo(chatId, selectedCoin, selectedAmount + " USDT as ")
        };
    })();
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

async function showSelectedCryptoInfo(chatId, selectedCoin, amout) {

    //todo: get this user memo from db by chatid
    serviceLog.reportLog(`#${chatId}\nmust pay ${amout} ${selectedCoin}`)

    let walletAddress = await subController.getWalletAddress(chatId);
    if (walletAddress === "") {
        serviceLog.reportLog(`#${chatId}\n wallet address is empty`)
        //Print Log cancel
        bot.telegram.sendMessage(chatId, "oops! something changed please join again. \n /join")
        return
    }

    let displayMessage = `you have to send  ${amout} ${selectedCoin}.\n\nsend only   ${selectedCoin}   to below address.\nSending any other coins may result in premanent loss.\n\n\n ${walletAddress}`

    bot.telegram.sendPhoto(chatId, { source: 'images/trustwallet.jpg' }, {
        caption: displayMessage,
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "Get Wallet Address",
                    callback_data: 'action_get_wallet_address'
                }
                ],
                [{
                    text: "Get QR Code",
                    callback_data: 'action_get_wallet_address_qr'
                }
                ],
                [{
                    text: "Final Step: Send Transaction Link Here",
                    callback_data: 'action_make_transaction'
                }
                ]
            ]
        }
    })
}

bot.action('action_get_wallet_address', async ctx => {

    serviceLog.reportLog(`#${ctx.chat.id}\n get address`)

    let displayMessage = await subController.getWalletAddress(ctx.chat.id);
    if (displayMessage === "") {
        serviceLog.reportLog(`#${ctx.chat.id}\n wallet address is empty`)
        //Print Log cancel
        bot.telegram.sendMessage(ctx.chat.id, "oops! something changed please join again. \n /join")
        return
    }
    bot.telegram.sendMessage(ctx.chat.id, displayMessage)
})
bot.action('action_get_wallet_address_qr', async ctx => {

    serviceLog.reportLog(`#${ctx.chat.id}\n get Qr Code`)
    let qrAddress = await subController.getWalletQr(ctx.chat.id);
    if (qrAddress === "") {
        serviceLog.reportLog(`#${ctx.chat.id}\n wallet qr is empty`)
        //Print Log cancel
        bot.telegram.sendMessage(ctx.chat.id, "oops! something changed please join again. \n /join")
        return
    }
    bot.telegram.sendPhoto(ctx.chat.id, { source: qrAddress })

})

bot.action('action_make_transaction', ctx => {
    serviceLog.reportLog(`#${ctx.chat.id}\n make transaction`)

    let displayMessage = `Send the transaction link here, and then wait for the invitation to join the premium channel.\nIt won't take more than a day to complete this process \nplease wait.`;
    bot.telegram.sendMessage(ctx.chat.id, displayMessage)
})

bot.on("text", async ctx => {

    var recivedMessage = ctx.message.text
    var response = ""
    var digitFormat = /^\d+$/;

    serviceLog.reportLog(`#${ctx.chat.id}\n message \n ${recivedMessage}`)


    if (validUrl.isUri(recivedMessage)) {


        response = "And finally enter your phone number please or send the transaction link to our support account: \n/contact_us\n\nAfter the transaction is confirmed, you will receive a message and an invitation link"


    } else if (validatePhoneNumber.validate(recivedMessage)){
        response = "Hey! So happy you've joined our community, we will call you soon."

    }else{
        response = 'message is wrong! contact us if you have any question \n/contact_us';
    }
    bot.telegram.sendMessage(ctx.chat.id, response, { disable_web_page_preview: 'true' })

})

// const requestPhoneKeyboard = {
//     "reply_markup": {
//         "one_time_keyboard": true,
//         "keyboard": [
//             [{
//                 text: "My phone number",
//                 request_contact: true,
//             }],
//             ["Cancel"]
//         ]
//     }
// };



function launch() {

    bot.launch()
}


module.exports.launchBot = launch
