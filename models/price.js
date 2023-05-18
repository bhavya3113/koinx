const mongoose = require("mongoose");
const schema = mongoose.Schema;

const priceSchema = new schema({
  price:{
    type: Number,
    require: true
  },
  time:{
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model("prices",priceSchema);