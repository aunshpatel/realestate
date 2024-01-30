import User from "../../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
import errorHandler from "../utils/error.js";
export const signup = async (req, res, next)=>{
   const {username, email, password} = req.body;
   const hashedPassword = bcryptjs.hashSync(password, 10);
   // const newUser = new User({username, email, hashedPassword});
//   const newUser = new User({username:username, email:email, password:hashedPassword});
  const newUser = new User({username, email, password:hashedPassword});
   try{
      await newUser.save();
      res.status(201).json({message:'User created successfully'});
   } catch(error){
      // res.status(500).json(error.message);
      next(error);
      // next(errorHandler(501, 'Error from the function'));
   }
}

export const signin = async (req, res, next)=>{
   const {email, password} = req.body;
   try{
      const validUser = await User.findOne({email});
      if(!validUser || validUser == null) {
         console.log("User not found! Please enter the correct details.");
         return next(errorHandler(404, 'User not found! Please enter the correct details or sign up.'));
      }

      const validPassword = bcryptjs.compareSync(password, validUser.password);
      // if((!validUser && !validPassword) || (validUser == null && validPassword == null)) {
      //    console.log("Invalid Password and Email ID! Please enter the correct details.");
      //    return next(errorHandler(404, 'Invalid Password and Email ID! Please enter the correct details.'));
      // }
      if(!validPassword || validPassword == null) {
         console.log("Invalid Password! Please enter the correct password.");
         return next(errorHandler(404, "Invalid Password! Please enter the correct password."));
      }

      const token = jwt.sign({id:validUser._id}, process.env.JWT_SECRET);
      const {password: pass, ...rest} = validUser._doc;
      res.cookie('access_token', token, {httpOnly:true}).status(200).json(rest);
      
   } catch(error){
      console.log("Error:" + error)
      next(error);
   }
}