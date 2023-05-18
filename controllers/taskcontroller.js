const axios = require('axios');
const Transaction = require('../models/transactions');
const Address = require('../models/address');
const Price = require('../models/price')
var cron = require('node-cron');



exports.task1= async (req, res, next) => {
  try {
    const {address} = req.params;

    const API_KEY = process.env.API_KEY
    const result = await axios.get(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=asc&apikey=${API_KEY}`
    );
    await Transaction.insertMany(result.data.result);
    await Promise.all(result.data.result.map(async (i) => {
      const res = await Transaction.findOne({"hash":i.hash});
      if(res == null)
      {
        const err = new Error('No record found');
        err.statusCode = 400;
        throw err;
      }
      else
      {
        await  Address.findOneAndUpdate({"address":address},
        { $push: { transactions: res._id } },
        {upsert:true}) 
      }
      })
    )
    return res.status(201).json(result.data.result);
    }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}



    cron.schedule(' */10 * * * *', async () => {
      try{
      const result = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&amp;vs_currencies=inr`
        );
        await Price.create({ price: result.data.ethereum.inr })
        // return res.status(201).json(result.data.ethereum);
      }
      catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    });


    exports.task3= async (req, res, next) => {
      try {
        const {address} = req.params;

        const add = await Address.findOne({address:address}).populate('transactions')

        let cur_bal = 0;
        let arr=[];
        if(add)
          arr = add.transactions
        for(const txn of arr)
        {
          if(txn.to == address)
          cur_bal+=txn.value
          else if(txn.from == address)
          cur_bal-=txn.value;
        }
        const result = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&amp;vs_currencies=inr`
          );
        return res.status(201).json({balance: cur_bal, price: result.data.ethereum.inr });
        }
      catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    }
    