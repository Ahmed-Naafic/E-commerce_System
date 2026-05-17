

const mongoose = require("mongoose");


const cartItemSchema = new mongoose.Schema(
    {
        product : {
            type : mongoose.Types.ObjectId,
            ref : "Product",
            required :true
        },
        quantity : {
            type : Number,
            default : 1,
        }
    },
    {
        _id:false
    }
)



const cartSchema = new mongoose.Schema({
    user  :{
        type : mongoose.Types.ObjectId,
        ref : "User",
        required :true,
        unique:true,
        trim :true
    },
    items : [cartItemSchema],

},
{
    timestamps:true,
}
)

module.exports = mongoose.model("cart", cartSchema)