const { Telegraf, Markup, Extra } = require('telegraf');
const bot = new Telegraf('5049629924:AAHirNJ0J0hyrn2VdEMZOtF9YGyHOcLhB28'); //membership bot
const adminAccount = "@market_service_admin"
bot.command('start', ctx => {

    bot.telegram.sendMessage(ctx.chat.id, `${ctx.from} \n ${ctx.chat.id} \n hello there! Welcome to my new telegram bot.`, {
    })
})

bot.command('delete_messages', ctx => {

    for (let i = 1; i < 101; i++) {
        ctx.deleteMessage(ctx.message.message_id - i).catch(er => { return })
    }

})

bot.command('join', ctx => {
    let displayMessage = `We accept " USDT_BEP2  |  BTCB_BEP2  |  ATOM-BEP2  |  BNB " ,\nIf you have active membership,don't worry your old plan days will be carried forward.\nPlease select a subscription plan from the list below:`;
    //ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, displayMessage, {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "7 Days: $19",
                    callback_data: 'plan1'
                }
                ],
                [{
                    text: "1 Month: 49",
                    callback_data: 'plan2'
                }
                ],
                [{
                    text: "6 Month: $149",
                    callback_data: 'plan3'
                }
                ],
                [{
                    text: "12 Month: $249",
                    callback_data: 'plan4'
                }
                ],
            ]
        }
    })
})

bot.hears('phone', (ctx, next) => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Can we get access to your phone number?', {
        "reply_markup": {
            "one_time_keyboard": true,
            "keyboard": [
                [{
                    text: "My phone number",
                    request_contact: true,
                    one_time_keyboard: true
                }],
                ["Cancel"]
            ]
        }
    });

})


bot.action('plan1', ctx => {

    showPaymentSolutionsList(ctx.chat.id,"plan1",19)

    return
    (async () => {
        try {

            let data = await bot.telegram.createChatInviteLink(-1001774132100, {member_limit:1})
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
    showPaymentSolutionsList(ctx.chat.id,"plan2",49)
});
bot.action('plan3', ctx => {
    showPaymentSolutionsList(ctx.chat.id,"plan3",149)
});
bot.action('plan4', ctx => {
    showPaymentSolutionsList(ctx.chat.id,"plan4",249)
});
bot.action('action_make_transaction', ctx => {
    let displayMessage = `thanks,`;
    bot.telegram.sendMessage(chatId, displayMessage)
})

bot.command('status', ctx => {

    bot.telegram.sendMessage(ctx.chat.id, `There are 12 days left until your membership expiration.`, {
    })
})

bot.command('contact', ctx => {

    bot.telegram.sendMessage(ctx.chat.id, `if you have any question please contact me ${adminAccount}`, {
    })
})

bot.command('apps', ctx => {

    bot.telegram.sendMessage(ctx.chat.id, `download our android app at ${"link"}`, {
    })
})

bot.command('developer', ctx => {

    bot.telegram.sendMessage(ctx.chat.id, `You Need a Application or Telegram bot for your service?\nContact Us ${adminAccount}`, {
    })
})

function launch() {

    bot.launch()
}

function showPaymentSolutionsList(chatId,plan,amount){

    
    let displayMessage = `sent ${amount}$ to Address With Memo\n by memo value we could recognize your transaction so be cerful to enter that correct, \n send transaction link or id to chat`;
    bot.telegram.sendMessage(chatId, displayMessage, {
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
                ],[{
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

module.exports.launchBot = launch
