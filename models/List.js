var mongoose = require("mongoose");

var listSchema = new mongoose.Schema({
    Item: String[]
});

module.exports = mongoose.model("List",transactionSchema);
