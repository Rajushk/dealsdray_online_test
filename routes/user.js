const express =require("express");
const router =express.Router();


const {login,signup}=require("../controller/auth")
const {auth, isStudent, isAdmin}=require("../middleware/auth")

router.post("/login",login);
router.post("/signup", signup);

//protected Route
router.get("/student", auth , isStudent,(req, res)=>{
    res.json({
        success:true,
        message:"Welcome to the Protected routes for Student",
    })
})

router.get("/admin",auth, isAdmin,(req, res)=>{
    res.json({
        success:true,
        message:"Welcome to the Protected routes for Admin",
    })

})

module.exports=router;