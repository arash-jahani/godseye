const { Telegraf, Markup, Extra } = require('telegraf');
const bot = new Telegraf('5187064542:AAFYYNCvrHXVC3pVGMKAaVlr2jLF4G_PDh0'); //membership bot

const adminAccount = "@contact_us_24_7"
const waletlAddress = "bnb17cefnzfaecg54g4q7tv2wdd4qz0a65j3t9n6jx"
const subController = require("./controller/subscription.controller");
const subscriptionModel = require('./models/subscription.model');
const url = require("url");
var validUrl = require('valid-url');
const serviceLog = require("./telegramLogBot.js");




bot.command('start', ctx => {

    serviceLog.reportLog(`#${ctx.chat.id}\n start `)

    bot.telegram.sendMessage(ctx.chat.id, `Hi there!\nWelcome to 'Crypto Arbitrage Signal' membership bot.\n/join\n/status\n/referral_program\n `)
})

// bot.command('delete_messages', ctx => {

//     for (let i = 1; i < 101; i++) {
//         ctx.deleteMessage(ctx.message.message_id - i).catch(er => { return })
//     }

// })

bot.command('join', ctx => {

    bot.telegram.sendMessage(ctx.chat.id, "How can we contact you to create an account?", requestPhoneKeyboard).then(() => {
        // handle user phone
    })

})

bot.on("contact", async (ctx) => {

    //todo : save user info

    var subModel = {
        phone: ctx.update.message.contact.phone_number,
        name: `${ctx.update.message.contact.first_name ?? ""} ${ctx.update.message.contact.last_name ?? ""}`,
        username: ctx.update.message.contact.user_id ?? "",
        chat_id: ctx.chat.id,
        last_memo: ctx.update.message.contact.user_id,
        referral_code: ctx.update.message.contact.user_id
    }

    serviceLog.reportLog(`#${ctx.chat.id}\n${subModel.phone}\n${subModel.name}\n${subModel.username} contact Granted`)

    var userSubscription = await subController.create(subModel)

    //  if (userSubscription instanceof ){
    console.log(`result is: error happen ${userSubscription}`)
    //  }else{
    //    console.log(`result is: ${productCount}`)

    //  }

    //todo : check user exit and then check his subscription and if user not exist then save user's info 
    // var subscriptionMessage = ""
    // if (userSubscription.expire_at == 0) { //new user
    //     subscriptionMessage = `dear ${ctx.update.message.contact.first_name}\n`
    // } else {
    //     subscriptionMessage = `dear ${ctx.update.message.contact.first_name} your previous subscription plan expire at ${userSubscription.expire_at}  \n`
    // }

    let displayMessage = `enter your invite code to get 15% off`;

    bot.telegram.sendMessage(ctx.chat.id, displayMessage, {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "I dont have invite code",
                    callback_data: 'join_anyway'
                }
                ]
            ]
        }
    })

})

async function join(chatId) {

    serviceLog.reportLog(`#${chatId}\n join message`)

    // if user have invite code calc dicount
    var discount = 0
    var userSubscription = await subController.findByChatId(chatId)
    var displayMessage=""

    var plan1 = `1 Month: ${calcDiscount(49, discount)} USDT`
    var plan2 = `6 Months: ${calcDiscount(149, discount)} USDT`
    var plan3 = `2 Years: ${calcDiscount(249, discount)} USDT`

    if (userSubscription.invited_code !== 0) {

        discount = 15

        plan1 = `1 Month: ${calcDiscount(49, discount)} USDT`
        plan2 = `6 Months: ${calcDiscount(149, discount)} USDT`
        plan3 = `2 Years: ${calcDiscount(249, discount)} USDT`
        displayMessage="Discount was applied\n"
    }
    console.log("discount is:" + discount)


     displayMessage =displayMessage + `dear ${userSubscription.name}\nWe accept ( USDT_BEP2 ) ,\nPlease select a subscription plan from the list below:`;

    bot.telegram.sendMessage(chatId, displayMessage, {
        parse_mode: 'HTML',
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
                ],
                [{
                    text: plan3,
                    callback_data: 'plan3'
                }
                ],
                [{
                    text: "i want to pay with other coins",
                    callback_data: 'contact_us'
                }
                ]
            ]
        }
    })
}
bot.action("join_anyway", (ctx) => {
    join(ctx.chat.id)
})
bot.hears("Cancel", (ctx) => {

    serviceLog.reportLog(`#${ctx.chat.id}\n contact denied!`)
    //Print Log cancel
    bot.telegram.sendMessage(ctx.chat.id, "Please share your phone number, we use that to make subscription only. \n /join")
})
bot.action("contact_us", (ctx) => {
    //Print Log cancel
    serviceLog.reportLog(`#${ctx.chat.id}\n contact us`)
    bot.telegram.sendMessage(ctx.chat.id, `contact us ${adminAccount}`)
})

bot.action('plan1', ctx => {

    showPaymentSolutionsList(ctx.chat.id, "plan1", 49)

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
    showPaymentSolutionsList(ctx.chat.id, "plan2", 149)
});
bot.action('plan3', ctx => {
    showPaymentSolutionsList(ctx.chat.id, "plan3", 249)
});

bot.command('status', async ctx => {

    var message = ""
    var userSubscription = await subController.findByChatId(ctx.chat.id)
    if (userSubscription instanceof String) {
        message = "Please join first, /join"
        return
    }
    var today = Date.now()
    if (userSubscription.expire_at > today) {
        message = `Your subscription expire At ${userSubscription.expire_at}`
    } else {
        message = `You dont have active subscription.`
    }



    bot.telegram.sendMessage(ctx.chat.id, message, {
    })
})

bot.command('referral_program', async ctx => {


    var message = ""
    var userSubscription = await subController.findByChatId(ctx.chat.id)
    if (userSubscription instanceof String) {
        message = "Please Join First, /join"
        return
    }
    message = `Balance: ${userSubscription.referral_count * 7} USDT \n Joined People: ${userSubscription.referral_count}\nYour Invite Code is ${userSubscription.referral_code} \nYou earn 7 USDT per successful subscription and someone who used your invite code get 15% off \nYou can send withdraw request with minimum 100 USDT balance.`


    bot.telegram.sendMessage(ctx.chat.id, message, {
    })
})



async function showPaymentSolutionsList(chatId, plan, amount) {

    //todo: get this user memo from db by chatid
    serviceLog.reportLog(`#${chatId}\n ${amount} pay message`)

    var userSubscription = await subController.findByChatId(chatId)
    var discount=0
   
    if (userSubscription.invited_code !== 0) {
        discount = 15
    }

    let displayMessage = `Pleaes send ${calcDiscount(amount, discount)} USDT to this wallet ADDRESS With MEMO like attached image\nby MEMO value we could recognize your transaction so be careful to enter that correctly, \nthen send transaction link here`

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
                    text: "Get Memo",
                    callback_data: 'action_get_memo'
                }
                ], [{
                    text: "I make this transaction",
                    callback_data: 'action_make_transaction'
                }
                ]
            ]
        }
    })
    return


    bot.telegram.sendMessage(chatId, displayMessage, {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "USDT_BEP2",
                    callback_data: 'request_payment_address'
                }
                ],
                [{
                    text: "BTCB_BEP2",
                    callback_data: 'request_payment_address'
                }
                ],
                [{
                    text: "BNB_BEP2",
                    callback_data: 'request_payment_address'
                }
                ],
                [{
                    text: "XLM",
                    callback_data: 'request_payment_address'
                }
                ],
                [{
                    text: "ATOM",
                    callback_data: 'request_payment_address'
                }
                ]
            ]
        }
    })
}
bot.action('action_get_wallet_address', ctx => {
    serviceLog.reportLog(`#${ctx.chat.id}\n get address`)
    let displayMessage = waletlAddress;
    bot.telegram.sendMessage(ctx.chat.id, displayMessage)
})

bot.action('action_get_memo', async ctx => {

    serviceLog.reportLog(`#${ctx.chat.id}\n get memo`)

    var userSubscription = await subController.findByChatId(ctx.chat.id)
    let displayMessage = ""
    if (userSubscription instanceof String) {
        displayMessage = "error! try again /join"

    } else {
        var memo = userSubscription.last_memo
        if (memo === 0) {
            displayMessage = "error! try again /join"
        } else {
            displayMessage = memo;
        }
    }

    bot.telegram.sendMessage(ctx.chat.id, displayMessage)
})

bot.action('action_make_transaction', ctx => {
    serviceLog.reportLog(`#${ctx.chat.id}\n make transaction`)

    let displayMessage = `Please send transaction link here`;
    bot.telegram.sendMessage(ctx.chat.id, displayMessage)
})

bot.on("text", async ctx => {

    var recivedMessage = ctx.message.text
    var response = ""
    var digitFormat = /^\d+$/;

    serviceLog.reportLog(`#${ctx.chat.id}\n message \n ${recivedMessage}`)



    if (validUrl.isUri(recivedMessage)) {

        if (url.parse(recivedMessage).host === "explorer.binance.org") {

            //todo: update user record and then send message to user : you recive success message after transaction confirmed

            var updateHash = await subController.updateTransactionHash(ctx.chat.id, recivedMessage)


            response = "you will recive successful message and inviteation link after transaction's confirmed"

        } else {
            response = 'message wrong!';
        }
    } else if (digitFormat.test(recivedMessage)) {

        var invitedCode = await subController.checkInviteCodeExist(recivedMessage)
        console.log("inviteCode res: " + invitedCode)
        if (invitedCode === "not exist") {

            response = "Invite Code is Wrong."
            bot.telegram.sendMessage(ctx.chat.id, response, {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: "Join Anyway",
                            callback_data: 'join_anyway'
                        }
                        ]
                    ]
                }
            })
            return
        } else {

            var updateInviteCode = await subController.updateInvitedCode(ctx.chat.id, recivedMessage)
            //var updateReferralOwnerCount = await subController.updateReferralOwnerCount(recivedMessage)

            join(ctx.chat.id)
        }

    } else {
        response = 'message wrong!';
    }
    bot.telegram.sendMessage(ctx.chat.id, response, { disable_web_page_preview: 'true' })

})

const requestPhoneKeyboard = {
    "reply_markup": {
        "one_time_keyboard": true,
        "keyboard": [
            [{
                text: "My phone number",
                request_contact: true,
            }],
            ["Cancel"]
        ]
    }
};

function calcDiscount(value, discount) {
    var totalValue = value - (value * (discount / 100))
    return totalValue.toFixed(2);
}


function launch() {

    bot.launch()
}


module.exports.launchBot = launch
