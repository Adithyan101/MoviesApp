import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'


export const authenticate = async(req,res,next)=>{
    try {

        const token = req.cookies.jwt;
        if(token){
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select("-password");
            next();
        }else{
            res.status(401).send("Unauthorized");
        }
        
    } catch (error) {
        res.status(401).send("Unauthorized");
        console.log("error in auth middleware",error)
    }
}

export const authorizeAdmin = async(req,res,next)=>{
    try {

        if(req.user && req.user.isAdmin){
            next();
        }else{
            res.status(401).send("Unauthorized as Admin");
        }
        
    } catch (error) {
         res.status(401).send("Unauthorized as Admin");
        console.log("error in authAdmin middleware",error)
    }
}