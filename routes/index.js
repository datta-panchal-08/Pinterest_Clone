var express = require('express');
const passport = require('passport');
var router = express.Router();
const localStrategy = require('passport-local');
const upload = require('./multer')
const userModel = require('./users')
const postModel = require('./post')

passport.use(new localStrategy(userModel.authenticate()));


router.get('/', function(req, res, next) {
  res.render('index', { nav : false});
});

router.get('/register',function(req, res, next) {
  res.render('register',{nav : false});
});

router.post('/createpost', isLoggedIn,upload.single('postimage'),async function(req, res, next) {
  const user = await userModel.findOne({ username : req.session.passport.user});
  const post = await postModel.create({
    user : user._id,
    title : req.body.title,
    description : req.body.description,
    image : req.file.filename
   });
   user.posts.push(post._id)
   await user.save();
   res.redirect("/profile")
});

router.get('/profile', isLoggedIn,async function(req, res) {
  const user = await userModel
  .findOne({ username : req.session.passport.user})
  .populate("posts")
  console.log(user)
  res.render('profile',{user,nav:true});
});

router.get('/showposts', isLoggedIn,async function(req, res) {
  const user = await userModel
  .findOne({ username : req.session.passport.user})
  .populate("posts")
  console.log(user)
  res.render('show',{user,nav:true});
});

router.get('/feed', isLoggedIn,async function(req, res) {
  const user = await userModel.findOne({ username : req.session.passport.user})
  const posts = await postModel.find()
  .populate('user')
  res.render('feed',{user,posts, nav:true})
});

router.get('/add', isLoggedIn,async function(req, res, next) {
  const user = await userModel.findOne({ username : req.session.passport.user});

  res.render('add',{user,nav:true});
});

router.post('/login', passport.authenticate("local",{
  successRedirect:'/profile',
  failureRedirect : "/"
}),function(req,res){})

router.post('/fileupload',isLoggedIn,upload.single('image'),async(req,res)=>{
  const user = await userModel.findOne({ username : req.session.passport.user});
    user.profileImage = req.file.filename;
    await user.save();
    res.redirect("/profile");
});

router.post('/register', function(req, res, next) {
   let userData = new userModel({
    username : req.body.username,
    email : req.body.email,
    contact:req.body.contact,
    fullname : req.body.fullname 

   })
   userModel.register(userData,req.body.password)
   .then(function(registereduser){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/profile');
    })
   })
});

router.get('/logout', function(req, res, next) {
   req.logout(function(err){
    if(err){return next(err)}
    res.redirect("/")
   })
});

function isLoggedIn(req,res,next){
   if(req.isAuthenticated()){
    return next()
   }
   res.redirect("/")
}

module.exports = router;
