const mongoose = require("mongoose");
const schema = mongoose.Schema;

const txnSchema = new schema({
         blockNumber: String,

         timeStamp: String,

         hash: String,

         nonce: String,

         blockHash: String,

         transactionIndex: String,

         from: String,

         to: String,

         value: String,

         gas: String,

         gasPrice: String,

         isError: String,

         txreceipt_status: String,

         
         contractAddress: String,

         cumulativeGasUsed: String,

         gasUsed: String,

         confirmations: String,

         methodId: String,

         functionName: String
})

module.exports = mongoose.model("transactions",txnSchema);