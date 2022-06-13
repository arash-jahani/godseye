const db = require("../models")
const Subscription = db.subscriptions
const Op = db.Sequelize.Op

// Create and Save a new Tutorial
exports.create = async (subModel) => {

    const subExist = await Subscription.findOne({ where: { phone: subModel.phone } })
    
    if (subExist == null) {
        const result = await Subscription.create(subModel)
            .then(data => {
                return data
            })
            .catch(err => {
                return err
            });
            return result

    } else {
        const result = await Subscription.update({ name: subModel.name }, {
            where: {
                phone: subModel.phone,
                chat_id: subModel.chat_id
            }
            
        }).then(data => {
            return data
        })
        .catch(err => {
            return err
        });
        return result

    }

};

// Retrieve all assets from the database.
exports.findAll = (req, res) => {

};

// Find a single Tutorial with an id
exports.findByChatId = async (chatId) => {
    const subExist = await Subscription.findOne({ where: { chat_id: chatId } })
    if (subExist == null) {
            return "not exist"
    }else{
        return subExist
    }
};

// Update a Tutorial by the id in the request
exports.updateAmount = async (chatId,amount) => {
    const result = await Subscription.update({ amount: amount }, {
        where: {
            chat_id: chatId
        }
        
    }).then(data => {
        return data
    })
    .catch(err => {
        return err
    });
    return result
};

// Update a Tutorial by the id in the request
exports.updateWalletAddress = async (chatId,walletAddress,walletQr) => {
    const result = await Subscription.update({ wallet_address: walletAddress,wallet_qr: walletQr }, {
        where: {
            chat_id: chatId
        }
        
    }).then(data => {
        return data
    })
    .catch(err => {
        return "error"
    });
    return result
};


// Update a Tutorial by the id in the request
exports.getAmount = async (chatId) => {
    const user = await Subscription.findOne({ where: { chat_id: chatId } })
    if (user == null) {
            return ""
    }else{
        return user.amount
    }
};

// Update a Tutorial by the id in the request
exports.getWalletAddress = async (chatId) => {
    const user = await Subscription.findOne({ where: { chat_id: chatId } })
    if (user == null) {
            return ""
    }else{
        return user.wallet_address
    }
};

// Update a Tutorial by the id in the request
exports.getWalletQr = async (chatId) => {
    const user = await Subscription.findOne({ where: { chat_id: chatId } })
    if (user == null) {
            return ""
    }else{
        return user.wallet_qr
    }
};
// Update a Tutorial by the id in the request
exports.updateReferralOwnerCount = async (inviteCode) => {
    var referralCount=await Subscription.findOne({ where: { referral_code: inviteCode } })

    const result = await Subscription.update({ refferal_count: (referralCount.refferal_count+1) }, {
        where: {
            referral_code: inviteCode
        }
        
    }).then(data => {
        return data
    })
    .catch(err => {
        return "error"
    });
    return result
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all assets from the database.
exports.deleteAll = (req, res) => {

};

// Update a Tutorial by the id in the request
exports.updateNamesToPersian = (req, res) => {

};

// // Find all published assets
// exports.findAllByIndex = (req, res) => {
    
//     items=req.query.indexs.split(",")

//     Subscription.findAll({ where: { index:  [items]  }})
//     .then(data => {
        
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).end({
//         message:
//           err.message || "Some error occurred while retrieving assets."
//       }
//       );
//   //  throw err;
//     });

// };

// // Retrieve all assets from the database.
// exports.findAllNames = (req, res) => {
//     Subscription.findAll({attributes: ['index','name','type']})
//     .then(data => {
//         console.log("findAllNames")
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving assets."
//       });
//     });
// };

// // Retrieve all assets from the database.
// exports.findAll = (req, res) => {
//     Subscription.findAll()
//     .then(data => {
//         console.log("findAll")
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving assets."
//       });
//     });
// };