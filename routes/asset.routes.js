var global = require('../Global.js');


module.exports = app => {

  var router = require("express").Router();

  // Retrieve all import 
  router.get("/exchanges", function (req, res) {

    var array = [];

    global.exchangesArrays.forEach(function (value, key) {

      for (let i = 0; i < value.length; i++) {
        const coin = value[i];
        if (i < 2 || i >= (value.length - 2)) {
          array.push(JSON.parse(coin.toJson()));
        }

      }
      // value.slice(0, 5).forEach(coin => {
      // });
    });

    res.send(array)
  })

  // Retrieve all import 
  router.get("/exchange", function (req, res) { //ex=kickex

    var array = [];

    try {
      let ex = req.query.ex;
      global.exchangesArrays.get(ex).forEach(coin => {

        array.push(JSON.parse(coin.toJson()));

      });
      res.send(array)
    } catch (error) {
      res.status(404).end({
        message:
          error.message || "exchange not found"
      })
    }
  })


  app.use('/api/v1/', router);
};