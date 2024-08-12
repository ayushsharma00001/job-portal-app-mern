import { User } from "../modals/userModal.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataURI.js";
import cloudinary from "../utils/cloudinary.js";
import path from "path"
export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res
        .status(400)
        .json({ message: "Something is missing...", success: false });
    }
    const file = req.file;
    let cloudResponse;
    if(typeof req.file !== 'undefined'){
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content,{
        format:"jpg"
      });
    }
    var user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this email...",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile:{
        profilePhoto:cloudResponse?.secure_url?cloudResponse?.secure_url:""
      }
    });
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    res
      .status(201)
      .cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Account created successfully...",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profile: user.profile,
        },
        success: true,
      });
  } catch (err) {
    console.log(err);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required...", success: false });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "user not exist with this email...", success: false });
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res
        .status(400)
        .json({ message: "wrong password...", success: false });
    }
    // check role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role...",
        success: false,
      });
    }
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullName}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
      const { fullName, email, phoneNumber, bio, skills } = req.body;
      
      const file = req.file;
      // cloudinary ayega idhar
      let cloudResponse;
      if(typeof req.file !== 'undefined'){
        const fileUri = getDataUri(file);
        cloudResponse = await cloudinary.uploader.upload(fileUri.content,{
          format:"jpg"
        });

      }



      let skillsArray;
      if(skills){
          skillsArray = skills.split(",");
      }
      const userId = req.id; // middleware authentication
      let user = await User.findById(userId);

      if (!user) {
          return res.status(400).json({
              message: "User not found.",
              success: false
          })
      }
      // updating data
      if(fullName) user.fullName = fullName
      if(email) user.email = email
      if(phoneNumber)  user.phoneNumber = phoneNumber
      if(bio) user.profile.bio = bio
      if(skills) user.profile.skills = skillsArray
    
      // resume comes later here...
      if(cloudResponse){
          user.profile.resume = cloudResponse.secure_url // save the cloudinary url
          user.profile.resumeOriginalName = file.originalname // Save the original file name
      }


      await user.save();

      user = {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profile: user.profile
      }

      return res.status(200).json({
          message:"Profile updated successfully.",
          user,
          success:true
      })
  } catch (error) {
      console.log(error);
  }
}