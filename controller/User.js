const UserCollection = require("../model/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const JWT_Secret ="sdfergrsvbhwqafv"

exports.register = async(req,res) => {
    let success= false

    try{
        let user = await UserCollection.findOne({email: req.body.email})
        if(user) {
            return res.status(400).json({success, error: "user already exists"})
        }

        pass = await bcrypt.hash(req.body.password, 10),
        

        user = await UserCollection.create({
            username: req.body.username,
            email: req.body.email,
            password: pass
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = await jwt.sign(data, JWT_Secret);
        success: true
        res.json({success: true, authtoken})
    } catch (error) {
        console.log(error.message)
        res.status(500).send("error")
    }

}

exports.varifyToken = async(req,res, next) => {
    try {
        token = req.cookies.access_token;

        const varifyToken = jwt.verify(token, JWT_Secret);

        const rootUser = await UserCollection.$where.findOne({_id: varifyToken._id, "tokens.token": token})
        console.log(rootUser)
        if(!rootUser) {
            throw new Error("User not found")
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next()
    } catch (error)  {
        return res.status(401).send("Invalid token")
    }
}

exports.getloggedInUser = async(req, res) => {
    res.send(req.rootUser)
}

exports.login = async(req,res) => {
    const {email, password} = req.body
    try {
        let user = await UserCollection.findOne({email});

        const passwordCompare = await bcrypt.compare(password, user.password)

        if(!passwordCompare) {
            success: false
            return res.status(400).json({error: "enter valid details"})
        }

        const token = await user.generateToken()
        console.log(token)

        return res.cookie("access_token", token, {
            httpOnly: true,
        })
        .status(200)
        .json({message: "Logged in Successfully"})
    } catch (error) {
        console.log(error.message)
        res.status(500).send("error occured")
    }
}

exports.logout = async(req,res) => {
    cookie = req.cookies;
    for(var p in cookie) {
        if(!cookie.hasOwnProperty(p)) {
            continue;
        }
        res.cookie(p, '', {expiresIn: new Date(0)})
    }
    res.status(200).json("Logout successfully")
}

// exports.loginn = async(req,res)
