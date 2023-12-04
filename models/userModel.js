import mongoose from "mongoose";
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 6;

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
    toJSON: {
        transform: function(doc, ret) {
          delete ret.password;
          return ret;
        }
      }
});
userSchema.pre('save', async function(next) {
    // 'this' is the user document
    if (!this.isModified('password')) return next();
    // Replace the password with the computed hash
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  });
  
// module.exports = mongoose.model('User', userSchema);
const User = mongoose.model('User', userSchema);
export default User;