const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

var items = [];
var workItems = [];

app.get("/", function (req, res) {      
    const day = date.getDate();
    res.render('index', { listTitle : day, newListItems : items});
});

app.post("/", function (req, res) {  
    var item = req.body.newItem;
    
    if(req.body.button === "Work List"){
        workItems.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work", function (req, res) {  
    res.render("index", {listTitle: "Work List", newListItems : workItems});
});

app.get("/about", function (req, res) {  
    res.render("about");
});

app.listen(process.env.PORT || 3000, function () {  
    console.log("server started at port 3000!");
});