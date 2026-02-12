import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['buyer', 'seller'],
        default: 'buyer'
    },
    //because user can have multiple product in there wishlist so we used array of object
    wishlist: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }
],
resetToken: {
  type: String,
  default: null
},
resetTokenExpire: {
  type: Date,
  default: null
}
})

const User=mongoose.model("User",userSchema);
export default User;