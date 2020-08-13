var mongoose = require("mongoose");

var listSchema = new mongoose.Schema({
    item: String
});

module.exports = mongoose.model("List", listSchema);
