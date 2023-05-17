const mongoose = require("mongoose");
const schema = mongoose.Schema;

const addressSchema = new schema({
  address:{
    type: String,
    require: true
  },
  transactions:[{
    type:schema.Types.ObjectId,
    ref: 'transactions'
  }]
})

module.exports = mongoose.model("addresses",addressSchema);