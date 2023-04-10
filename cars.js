const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
make: {type: String},
model: {type: String},
year: {type: String},
color: {type:String},
mileage: {type: String},
price: {type: String},
description: {type: String},
is_available: {type: Boolean, default: false},
relational_id: {type: String}

});

module.exports = mongoose.model('car', carSchema);