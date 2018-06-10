var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var methodOverride = require("method-override")
var mongoose = require("mongoose")

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(methodOverride("_method"))
mongoose.connect("mongodb://localhost/blog")

//Mongoose/Model Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})

var Blog = mongoose.model("Blog", blogSchema)

// Blog.create({
//     title: "#1 Must see",
//     image: "https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=29640b60327a3b66e91817e39adc433a&auto=format&fit=crop&w=800&q=60",
//     body:   "Bucket list item: see this lake"
// })
//INDEX route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err)
        } else {
            res.render("index", {blogs: blogs})
        }
    })  
})
//new blog form get route
app.get("/blogs/new", function(req, res){
    res.render("new")
})
//SHOW specific blog route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        } else {
            res.render("show", {blog: foundBlog})
        }
    })
})
//CREATE new blog post route
app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            console.log(err)
        } else {
            res.redirect("/blogs")
        }
    })
})

//EDIT route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        } else {
            res.render("edit", {blog: foundBlog})
        }
    })
})

//UPDATE route
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs/" + req.params.id)
        }
    })
})

//DELETE route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        res.redirect("/blogs")
       
    })
})




app.listen(3000, function(){
    console.log("Server listening on port 3000")
})
