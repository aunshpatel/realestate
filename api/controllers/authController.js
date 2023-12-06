import User from "../../models/userModel.js";

export const signup = async (req, res)=>{
   const {username, email, password} = req.body;
   const newUser = new User({username, email, password});
//   const newUser = new User({username:username, email:email, password:password});
   await newUser.save();
   res.status(201).json({message:'User created successfully'});
}