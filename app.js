var flag=0;
const express = require('express');
const app=express();
const bodyparser = require('body-parser');
const ejs = require('ejs');
const homeContent="This is personalize Notes writing and E diary for your Daily Uses ";
const ab="This Website store data for your Daily Notes and Blog.It is free to use";
const detail="Mail Us On :-  tripathianand894@gmail.com";
const mongoose = require('mongoose');
//mongoose.connect("mongodb://localhost:27017/Ediary",{useNewUrlParser:true,useUnifiedTopology: true});
var id;
mongoose.connect("mongodb+srv://admin-anand:start123@cluster0.1x7p2.mongodb.net/Login",{useNewUrlParser:true,useUnifiedTopology: true});
const entry = new mongoose.Schema({
   user:String,
   password:String
});
const data= new mongoose.Schema({
  title:String,
  msg:String,
  user:String
});
var nm="LogIn/LogOut";
const new_data=mongoose.model("data",data);
const new_user= mongoose.model("login",entry);

var name;
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs")
app.use(express.static("public"));

app.get("/",function(req,res)
{
  res.render("login",{id:"",data:nm});
});
app.post("/",function (req,res) {
  var id;
  var nm;
  name=req.body.user_name;
  var pass=req.body.pass;
  if(name!=""&&pass!="")
  {
  flag=1;
  new_user.find({user:name,password:pass},function (err,result) {
    if(!err)
    {if(result.length===0)
    {
      const person=new new_user({user:name,password:pass});
      person.save();
      nm=person.user;
      id=person._id;
    //  console.log(person);

    }
    else {
      nm=result[0].user;
      id=result[0]._id;

    }
      res.redirect("/"+id+"/"+nm+"/home");
  }

  });
}
else {
  res.redirect("/");
}

});
app.get("/logout",function (req,res) {
  flag=0;
  nm="LogIn/LogOut";
  res.redirect("/");
});
app.get("/:id/:name/home",function (req,res) {
  var id=req.params.id;
  var nm=req.params.name;
  new_data.find({user:id},function (err,array) {
  res.render("home",{id:id,data:nm,homeStartingContent:homeContent,content:array});
  })  ;

});
app.get("/:id/:name/about",function (req,res) {
  var id,nm;
  id=req.params.id;
  nm=req.params.name;
  res.render("about",{id:id,data:nm,aboutContent:ab});
});
app.get("/:id/:name/contact",function (req,res) {
  var id,nm;
  id=req.params.id;
  nm=req.params.name;
  res.render("contact",{id:id,data:nm,detail:detail});
});
app.get("/:id/:name/compose",function (req,res) {
  var id,nm;
  id=req.params.id;
  nm=req.params.name;
  res.render("compose",{id:id,data:nm});
});
app.get("/posts/:id/:nm/:topic",function (req,res) {

  var item=req.params.topic;
  var nm=req.params.nm;
  var id=req.params.id;
  console.log(req.params);
  /*var flag=-1;
  var temp;
  for(var i=0;i<array.length;i++)
  {
      if(array[i].title===item)
      {
        flag=i;
        temp=array[i];
        break;
      }
  }
  if(flag===-1)
  {
    console.log("Not found");
  }
  else {


  }*/
  new_data.find({title:item,user:id},function (err,result) {
    if(result.length!==0)
    {
        res.render("post",{id:id,data:nm,object:result[0]});
    }
    else {
      res.render("404",{id:id,data:nm});
    }
  });
});
app.post("/:id/:nm/delete",function (req,res) {
  var id=req.params.id;
  var nm=req.params.nm;
  var del_id=req.body.but;
  //console.log(del_id);
  new_data.deleteOne({_id:del_id},function (err) {
    if(err)
    console.log(err);
  });
  res.redirect("/"+id+"/"+nm+"/home");
});
app.post("/:id/:nm/home",function (req,res) {
  var id=req.params.id;
  var nm=req.params.nm;
  var obj=new new_data({
    title:req.body.title,
    msg:req.body.msg,
    user:id
  });
  obj.save();
//  console.log(obj);
  res.redirect("/"+id+"/"+nm+"/home");
});
app.listen(process.env.PORT);
/*app.listen(4000,function () {
  console.log("working");
});*/
