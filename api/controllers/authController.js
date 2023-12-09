import User from "../../models/userModel.js";
import bcryptjs from "bcryptjs";
// import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next)=>{
   const {username, email, password} = req.body;
   const hashedPassword = bcryptjs.hashSync(password, 10);
   // const newUser = new User({username, email, hashedPassword});
  const newUser = new User({username:username, email:email, password:hashedPassword});
   try{
      await newUser.save();
      res.status(201).json({message:'User created successfully'});
   } catch(error){
      // res.status(500).json(error.message);
      next(error);
      // next(errorHandler(501, 'Error from the function'));
   }
}