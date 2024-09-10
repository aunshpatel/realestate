import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = Schema({
    username:{
        type: String,
        required:true,
        unique:true,
    },
    fullname:{
        type: String,
        required:true,
    },
    countrycode:{
        type: String,
        required:true,
    },
    mobile:{
        type: Number,
        required:true,
    },
    email:{
        type: String,
        required:true,
        unique:true,
    },
    password:{
        type: String,
        required:true,
    },
    avatar:{
        type:String,
        default:"https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg",
    },
}, {
    timestamps:true,
});

const User = mongoose.model('User', userSchema);

export default User;