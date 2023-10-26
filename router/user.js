const express = require("express")
const CreateUser = require("../controller/User")
const router = express.Router()

router.post("/register", CreateUser.register)

router.post("/login", CreateUser.login)

router.get("/logout", CreateUser.logout)

router.get("/get", CreateUser.varifyToken, CreateUser.getloggedInUser)



module.exports = router