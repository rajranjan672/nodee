const express=require('express');
const User = require('../model/User');
const { body, validationResult } = require('express-validator');
const router=express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET='ultrockwillrock#'


// router.get('/', (req, res) => {
// const user=User(req.body)
// user.save()
// res.send(req.body) 
// });

router.post('/createuser',[
    body('username').notEmpty().isAlphanumeric().isLength(3,20),
    body('email').isEmail(),
    body('password').isLength({min:8}),


] ,async (req, res) => {
    let success = false
    // if there are any errors the return bad request
    const errors=validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})

        
    }
    // check user exist with same email or not
    try
    {
    let user= await User.findOne({email: req.body.email})
        if(user){
            return res.status(400).json({ success, error:" user already exist with email id"})   
        }
        // this  is for add salt in pass do npm i bcrypts js and import then write this
        const salt = await bcrypt.genSalt(10)   
        secPassword= await bcrypt.hash (req.body.password, salt   ) ;  
// create user
    user= await User.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: secPassword,
        repeatpassword: secPassword,


    });
    const dta= {
        user:{
            id:user.id
        }
    }
    const authtoken = await jwt.sign(dta, JWT_SECRET);
    success = true
      res.json({success , authtoken}) 
 
 }  catch (error) {
    console.error(error.message);
    res.status(500).send("internal erorr occured");
    
  }

})

const verifyToken = async(req, res, next) => {
    try {
  const token = req.cookies.access_token;
  
    // if (!token) {
    //   return res.status(403).send("A token is required for authentication");
    // }
  
      const varifyToken = jwt.verify(token, JWT_SECRET);

      const rootUser = await User.findOne({_id: varifyToken._id, "tokens.token": token})
      console.log(rootUser)
       if(!rootUser) {
         throw new Error("User not found")
       }

      req.token = token;
      req.rootUser = rootUser
      req.userID = rootUser._id;

      next()
      // req.user = decoded;
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    // return next();
  };

  router.get('/get', verifyToken, async(req, res) => {
    // const ress = await User.find()
     res.send(req.rootUser)
})


//  user login
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
    let user = await User.findOne({email});
    // if(!user){
    //     return res.status(400).json({error: "enter valid details"})
    // }
// password compare    
    const passwordcompare = await bcrypt.compare(password, user.password)
    
    if(!passwordcompare){
        success=false
        return res.status(400).json({error: "enter valid details"})

    }
    // const dta= {
    //     user:{
    //         id:user.id
    //     }
    // }

    const token = await user.generateToken()
    console.log(token)
    // const authtoken = await jwt.sign({_id:this._id}, JWT_SECRET,
    //   {
    //     expiresIn: "2h",
    //   });
    //   this.tokens = 
    // success=true
    // res.json({success, authtoken}) 
   return res
    .cookie("access_token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ message: "Logged in successfully 😊 👌" });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal erorr ");
    
  }
}
)

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


router.put("/resetpassword/:id", verifyToken, async(req, res, next) => {
  const salt = await bcrypt.genSalt(10)   
  secPassword= await bcrypt.hash (req.body.password, salt   ) ;
  
  var pwd = {
    password: secPassword
  }

  const ress = await User.findByIdAndUpdate(req.params.id, {
    $set: pwd}, {new: true}
  
  )
  res.send(ress) 

})

module.exports=router;