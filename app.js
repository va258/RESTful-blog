var express    = require("express"),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");


var app = express();
//APP config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});
var Blog = mongoose.model("Blog", blogSchema);

//RESTful routes


app.get("/", function(req, res) {
    res.redirect("/blogs");
});


app.get("/blogs",function(req, res){
    Blog.find({}, function(err, blog){
        if(err){
            res.send("Could not retrieve!");
        }
        else{
            res.render("index", {blog: blog});
        }
    });
    
});

app.get("/blogs/new", function(req, res) {
   res.render("new"); 
});

app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, blog){
    if(err){
        console.log("error");
    }
    else{
        console.log("Saved!");
        console.log(blog);
        res.redirect("/blogs");
    }
  });
});

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.render("/blogs");
        }
        else{
            res.render("show", {blog: foundBlog});
        }
    });
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit", {blog: foundBlog});
        }
    });
    
});

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.send("Error updating!");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
       
});

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.send("Error deleting!");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Started!");
});
