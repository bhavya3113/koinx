const axios = require('axios');
const Transaction = require('../models/transactions');
const Address = require('../models/address');

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
