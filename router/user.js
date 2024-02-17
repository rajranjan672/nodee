const express = require("express")
const bcrypt = require("bcryptjs")
const { body, validationResult } = require('express-validator');
const JWT_SECRET='ultrockwillrock#'
const router = express.Router()
const UserModel = require("../model/User")
const jwt = require("jsonwebtoken")
const CarModel = require("../model/Cars");

//register
router.post('/register',[
    body('name').notEmpty().isAlphanumeric().isLength(3,20),
    body('email').isEmail(),
    body('password').isLength({min:8}),


] ,async (req, res) => {
    let success = false
    // if there are any errors the return bad request
    const errors=validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})

        
    }
    try
    {
    let user= await UserModel.findOne({email: req.body.email})
        if(user){
            return res.status(400).json({ success, error:" user already exist with email id"})   
        }
        const salt = await bcrypt.genSalt(10)   
        secPassword= await bcrypt.hash (req.body.password, salt   ) ;  

    user= await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,


    });
    const dta= {
        user:{
            id:user.id
        }
    }
    const authtoken = await jwt.sign(dta, JWT_SECRET);
    success = true
      res.json({success , authtoken, secPassword}) 
 
 }  catch (error) {
    console.error(error.message);
    res.status(500).send("internal erorr occured");
    
  }

})


//login
router.post('/login',[
    body('email').isEmail(),
    body('password', 'password  can not be blank').exists(),


] ,async (req, res) => {
    const errors=validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
  const {email , password}=req.body
  try {
    let user = await UserModel.findOne({email});
    
    const passwordcompare = await bcrypt.compare(password, user.password)
    
    if(!passwordcompare){
        success=false
        return res.status(400).json({error: "enter valid details"})

    }
  

    const token = jwt.sign({id: user._id}, JWT_SECRET, {
      expiresIn: "2h"
    })
    console.log(token)
    
   return res
    .cookie("access_token", token, {
      httpOnly: true,
    })
    .status(200)
    .json({ message: "Logged in successfully 😊 👌", name:user.name, email: user.email, token: token });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal erorr ");
    
  }
}
)


const verifyToken = async(req, res, next) => {
  const token = req.cookies.access_token;

    jwt.verify((token), JWT_SECRET, (err, user) => {
      if(err) {
        return res.status(400).json({message: "Invalid token"})
      }
      console.log(user.id)
      req.id = user.id
    })
    next()
};

const getUser = async(req,res,next) => {
  const userId = req.id;
  
  let user;
  try {
    user = await UserModel.findById(userId)
  } catch (err) {
    return new Error(err)
  }
  // if(!user) {
  //   return res.status(404).json({message: "Invalid user"})
  // }
  return res.status(200).json({user})
}
    

router.get('/get', verifyToken, getUser)


router.get('/logout', verifyToken, function(req, res){
  cookie = req.cookies;
  for (var prop in cookie) {
      if (!cookie.hasOwnProperty(prop)) {
          continue;
      }    
      res.cookie(prop, '', {expiresIn: new Date(0)});
  }
  res.redirect('/');
});

router.post('/createcar', async(req,res) => {
    const newcar = new CarModel({
      make: req.body.make,
      model: req.body.model,
      price: req.body.price,
      
    })
    ress = await newcar.save()
    return res.status(200).json(ress)
})

router.get("/allcars", (async(req,res) => {
  const resp = await CarModel.find()
   
  return res.status(200).send(resp)
}))

router.get("/cars", ((req,res) => {
  let founduser = UserModel.find({name: req.params.name}).populate("cars")
  return res.json(founduser)
}))

module.exports = router