import Jwt from "jsonwebtoken";

export const verifyToken = (req,res,next) =>{
    const AuthHeader = req.headers.token
    if(AuthHeader){
        const token= AuthHeader
        Jwt.verify(token,process.env.ACCESS_SECRET,(err,user)=>{
            if (err) res.status(401).json("Token is not valid")
            req.user= user;
        console.log("!!verified!!")
        next()
        })
    }
    else{
        return res.status(201).json("access token not found")
    }
}