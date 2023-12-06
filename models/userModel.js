import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = Schema({
    username:{
        type: String,
        required:true,
        unique:true,
    },
    email:{
        type: String,
        required:true,
        unique:true,
        trim: true,
        lowercase: true,
    },
    password:{
        type: String,
        required:true,
    },
}, {
    timestamps:true,
});

// module.exports = mongoose.model('User', userSchema);

const User = mongoose.model('User', userSchema);

export default User;