import User from "../../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';

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
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      
      if(!validUser) {
         console.log('User not found!');
         return next(errorHandler(404, 'User not found!'));
      }
      if(!validPassword) {
         console.log('Wrong Password ');
         return next(errorHandler(404, 'Invalid Password'));
      }
      if(!validUser && !validPassword) {
         console.log('Wrong Password & Email');
         return next(errorHandler(404, 'Invalid Password and Email ID!'));
      }

      const token = jwt.sign({id:validUser._id}, process.env.JWT_SECRET);
      const {password: pass, ...rest} = validUser._doc;

      res.cookie('access_token', token,{httpOnly:true}).status(200).json(rest);
   } catch(error){
      next(error);
   }
}