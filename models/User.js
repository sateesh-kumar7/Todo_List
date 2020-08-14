var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    list: [
        {
            item: String,
            checked: {
                type: Boolean,
                default: false
            }
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);
