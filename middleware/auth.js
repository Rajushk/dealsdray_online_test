const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.auth = (req, res, next) => {
    try {
        // extract jwt token
        //pending :other ways to fetch token
        const token = req.body.token;

        if (!token) {
            return res.status(401), json({
                success: false,
                message: "Token Missing ",
            })
        }
        //to verify the token 
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode)
            req.user = decode;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message:"token is invalid"
            })
        }
        next();

    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"something went wrong"
        })

    }
}


exports.isStudent =(req,res,next)=>{

    try{
        if(req.user.role!=="Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected routesfor student"
            })

        }
        next()
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User Role is not matching'

        }
        )
    }
}

exports.isAdmin =(req, res,next) =>{
    try{
        if(req.user.role!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected routesfor Admin"
            })

        }
        next()
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User Role is not matching'

        }
        )
    }
}







