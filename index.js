const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyparser = require('body-parser');
const cookie = require("cookie-parser")

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/courses', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected sucessfully ')

    },
    error => {
        console.log("couldn't connected to db: " + error)
    }
)
app.use(cors({
    origin:'http://localhost:3000', credentials:true
}));
app.use(express.json());
app.use(cookie())

app.use("/api/user", require("./router/User"))

const port = 3001;

 

 app.get('/', (req,res) => {
    res.send("Hello im server")
})

app.listen(port, () => {
    console.log("server is running on port "+port)
});
