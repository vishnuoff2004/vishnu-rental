const mongoose = require("mongoose");

const VehSchema = new mongoose.Schema({
    ownerId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,},
    name:{type:String,require:true,trim:true,},
    type:{type:String,require:true,enum:["bike","car"],},
    brand:{type:String,require:true,trim:true,},
    model:{type:String,require:true,trim:true,},
    pricePerDay:{type:Number,require:true,trim:true,},
    location:{type:String,require:true,trim:true,},
    contactNumber:{type:String,require:true,},

    rcDoc:{type:String,},
    insuranceDoc:{type:String,},
    vehicleImage:{type:String,},
    createdAt:{type:Date,default:Date.now,}

});

module.exports = mongoose.model("Vehicle",VehSchema);