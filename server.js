
const express = require('express');
require("dotenv").config();
const mongoose=require('mongoose');
const bcrypt =require('bcryptjs');

//files
const {userDataValidation,isEmailValidate} = require('./utilis/authUtilis');
const userModel = require('./model/userModel');





//constants
const app=express();
const PORT= process.env.PORT;
//db connections
mongoose.connect("mongodb+srv://suddalamanichandanreddy62:mani_mani@cluster0.wcsw0.mongodb.net/octTodoAppDb")
.then(()=>console.log("mongodb connected successfully"))
.catch((error)=>console.log(error))

//middleware
app.set("view engine" , "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json());



app.get('/',(req,res)=>{
    return res.send("server up on running");
})
//register-page
app.get('/register-page',(req,res)=>{
    return res.render("registerPage");
})
app.post('/register',async (req,res)=>{
    
    const {name,email,username,password}=req.body;
    
    //data validation
    //user schema
    //email and username does not exist
    //store the data in db
    console.log(name+" "+email)
     try{
     await userDataValidation({name,email,username,password})
     }catch(error){
      return res.status(400).json(error);
    }
    //email and username exist or not
const userEmailExist=await userModel.findOne({email});
if(userEmailExist){
    return res.status(400).json("email already exist")
}
const usernameExist=await userModel.findOne({username});
if(usernameExist){
    return res.status(400).json("username already exist")
}



//encypt of password
const hashedPassword= await bcrypt.hash(password,Number(process.env.SALT));
    const userObj= new userModel({name,
        email,
        username,
        password:hashedPassword,
    });
      
    try{
       const userDb = await userObj.save();
   
       return res
       .status(201)
       .json({message:"Register successfull", data :userDb });
    }catch(error){
    return res
    .status(500)
    .json({message:"internal server error",error});

    }


    return res.send("resgiter api is working");
})
//login-page
// app.get('/login-page',(req,res)=>{
//     return res.render("Loginpage");
// })
// app.post('/login', async (req,res)=>{
//     console.log(req.body);
//     //find user with loginid
//     //compare the password//session base auth
//     const {loginId,password}=req.body;
//     if(!loginId || !password) return res.status(400).json("Missing user credentials");
//     let userDb;
//     if(isEmailValidate({key:loginId})){
        
// userDb=await userModel.findOne({email:loginId})
// }else{
// userDb=await userModel.findOne({username:loginId})
// }
// if(!userDb) return res.status.json("user does not found, register first")
//     console.log(password,userDb.password);







//     // return res.send("login api is working");
// })
app.listen(PORT,()=>{
    console.log(`server running at :http://localhost:${PORT}`);
    
})