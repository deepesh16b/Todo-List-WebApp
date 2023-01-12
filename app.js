const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


// ==========================================================
mongoose.connect("mongodb+srv://deepesh16b:atharva1@cluster0.5jmf7ef.mongodb.net/todolistDB");

const itemSchema = {
    name : String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item ({
    name : "Welcome to your todolist!"
});

const defaultItems = [item1];

const customListSchema = {
    name : String,
    itemsArray : [itemSchema]
};

const CustomList = mongoose.model("CustomList", customListSchema);

// =======================================================


app.get("/", function (req, res) {
    
    Item.find({}, function(err, foundItemsArray){
        if(foundItemsArray.length === 0)
        {
            Item.insertMany(defaultItems, function (err) {
                if(err) 
                    console.log(err);
                else 
                    console.log("Successfully saved default items to database");
            });
            res.redirect("/");
        }
        else{
            res.render('index', { listTitle : "Today", newListItems : foundItemsArray});
        }
        
    });

    // const day = date.getDate();
});

app.post("/", function (req, res) {  
    const itemName = req.body.newItem;
    const listTitle = req.body.listTitle;

    const item = new Item({
        name : itemName
    });
    // Check whether user is in default list or custom List!
    if(listTitle === "Today")
    {
        item.save();
        res.redirect("/");
    }
    else
    {
        CustomList.findOne({name : listTitle} , function (err, foundList) { 
            foundList.itemsArray.push(item);
            foundList.save();
            res.redirect("/" + listTitle);
        });
    }

});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listTitle = req.body.listTitle;

    if(listTitle === "Today")
    {
        Item.findByIdAndRemove(checkedItemId, function (err) {  
            if(!err)  
                console.log("Successfully removed!");    
        });
        
        res.redirect("/");

    }
    else
    {
        CustomList.findOneAndUpdate({name : listTitle}, {$pull : {itemsArray : {_id : checkedItemId} }}, function (err, foundList) {  
            if(!err)
                res.redirect("/" + listTitle);
        });
    }

});

app.get("/:customPageName", function (req, res) {  
    const customPageName = _.capitalize(req.params.customPageName);

    // search for that page in customList collection!
    CustomList.findOne({name : customPageName}, function (err, foundList) {
        if(!err)
        {
            if(!foundList)
            {
                // We will create a new 
                const customList = new CustomList({
                    name : customPageName,
                    itemsArray : defaultItems
                })
                customList.save(); 
                
                res.redirect("/" + customPageName);
            }
            else
            {
                res.render("index", {listTitle : customPageName , newListItems : foundList.itemsArray })
            }
        }    
    });


});

app.get("/about", function (req, res) {  
    res.render("about");
});

app.listen(process.env.PORT || 3000, function () {  
    console.log("server started at port 3000!");
});