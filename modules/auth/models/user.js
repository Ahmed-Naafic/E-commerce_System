const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },

        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
            minlength:6
        },
        role:{
            type:String,
            required:true,
            enum:["admin", "customer"],
            default:"customer"
        },
        loginAttempts: {
          type: Number,
          default: 0,
        },

        lockUntil: {
        type: Date,
          },
      
    },
      {
            timestamps:true
        }
)

module.exports = mongoose.model("user",userSchema);
