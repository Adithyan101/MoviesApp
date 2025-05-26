import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import createToken from "../utils/createToken.js";

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists. Please login" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    createToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.log("error in login controller", error);
    res.status(400).json({ message: "Invalid Credentials" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcryptjs.compare(password, user.password);
      if (isMatch) {
        const token = createToken(res, user._id);
        res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        });
      } else {
        res.status(400).json({ message: "Invalid Credentials" });
      }
    } else {
      res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log("error in login controller", error);
    res.status(400).json({ message: "Invalid Credentials" });
  }
};

const logout = async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logout successful" });
};


const getAllUsers = async(req,res)=>{
    try {

        const users = await User.find({}).select("-password");
        res.status(200).json(users);
        
    } catch (error) {
        console.log("error in getAllUsers controller",error)
        res.status(400).json({ message: "Error in getting users" });
    }
}

const getProfile = async(req,res)=>{
    try {

        const user = await User.findById(req.user._id).select("-password");
        if(user){
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        }
        
    } catch (error) {
        console.log("error in getProfile controller",error)
        res.status(400).json({ message: "Error in getting users profile" });
    
    }
}

const updateProfile = async(req,res)=>{
    try {

        const user = await User.findById(req.user._id);
       
        if(user){
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if(req.body.password){
                const salt = await bcryptjs.genSalt(10);
                const hashedPassword = await bcryptjs.hash(req.body.password, salt);
                user.password = hashedPassword;
            }
            const updatedUser = await user.save();
            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin
            });
        }else{
            res.status(404).json({message:"User not found"});
        }
        
    } catch (error) {
        console.log("error in update profile controller",error);
        res.statuc(400).json({message:"Error in updating profile"});
    }
}

export { login, signup, logout, getAllUsers, getProfile, updateProfile };
