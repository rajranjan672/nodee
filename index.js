const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookie = require("cookie-parser")
const app = express()
const route = require("./router/user")

mongoose.connect('mongodb://127.0.0.1:27017/mynode', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("db connected successfully")
},
error => {
    console.log("couldn't connect to db")
}

)

app.use(cors({
    origin: "http://localhost:3000", credentials: true
}))

app.use(cookie())


app.use(express.json())
app.use("/api/User", route)
const port = 3001

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})