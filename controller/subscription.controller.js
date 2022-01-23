const db = require("../models")
const Subscription = db.subscriptions
const Op = db.Sequelize.Op

// Create and Save a new Tutorial
exports.create = async (subModel) => {

//validate asset model

   
    const subExist = await Subscription.findOne({ where: { phone: subModel.phone } })
    
    if (subExist == null) {
        Subscription.create(subModel)
            .then(data => {
                console.log("created")
            })
            .catch(err => {
                console.log("error")
                throw TypeError("Some error occurred while creating the Asset.")

            });
    } else {
        // await Subscription.update({ rank: subModel.rank, last_price: subModel.last_price, last_price_change_percent: subModel.last_price_change_percent }, {
        //     where: {
        //         index: subModel.index
        //     }
            
        // }).then(data => {
        //     console.log("updated")
        // })
        // .catch(err => {
        //     console.log("error")
        //     throw TypeError("Some error occurred while updating the Asset.")

        // });
    }


};

// Retrieve all assets from the database.
exports.findAll = (req, res) => {

};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {

};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {

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