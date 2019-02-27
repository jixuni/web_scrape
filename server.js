//This app makes heavy use of promise and practicing es6 syntax

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const exphbs = require("express-handlebars");

//Initializing axios for our http request
//using cheerio to parse through DOM


const PORT = process.env.PORT || 3000;

const app = express();

//Morgan to log the server request
app.use(morgan("dev"));

//Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
// State Folder
app.use(express.static("public"));

//Telling handlebarjs to render as default page
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

//Connect to Mongo DB
mongoose.connect("mongodb://localhost/webscrape");

//Require all db models
let db = require("./models");

let routes = require("./routes/data_controllers");

app.use(routes);


app.listen(PORT, () => {
    console.log(`App running on port ${PORT} !`)
})