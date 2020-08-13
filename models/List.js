var mongoose = require("mongoose");

var listSchema = new mongoose.Schema({
    item: String,
    checked: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("List", listSchema);
