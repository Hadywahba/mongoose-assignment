import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [20, 'Name must not exceed 20 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
    },
    age:{
        type: Number,
         min: [18, 'Age must be at least 18'],
    max: [60, 'Age must not exceed 60'],
    }
} , {
    timestamps:true ,
    strict:true,
    strictQuery:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    optimisticConcurrency:true,
    collection:"Users",
})

export const UserModel= mongoose.models.User || mongoose.model("User"  , userSchema )