const express = require('express');
const app = express();
const cors = require('cors');
const { hashSync, compareSync } = require('bcrypt');
const User = require('./config/database')
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('./config/passport')


app.use(express.json())
app.use(express.urlencoded({extended: true}))
// app.use(cors);

app.use(passport.initialize())

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.post('/login',async (req,res)=>{
  try {
    const user = await User.findOne({username : req.body.username}).exec()
    if(!user) {
      res.send({
        success : false,
        message : "user not found"
      })
    }
    if(!compareSync(req.body.password, user.password)) {
      res.send({
        success : false,
        message : "password is in correct"
      })
    }

    
    // return token for the user
    const payload = {
      username : user.username,
      id : user._id
    }
    const token = jwt.sign(payload, "jwt secret",{expiresIn: '1d'})
    
    res.status(200).json({
      success : true,
      message : "logged in succesfully",
      token : "Bearer " + token
    })

  }
  catch(error) {
    res.send({
      success: false,
      message : "login error",
      error : error.message
    })
  }
  
})







app.post('/register',(req,res)=>{
  try {
    const newUser = new User({
      username : req.body.username,
      password : hashSync(req.body.password, 10)
    })
    newUser.save()
    res.json({
      success : true,
      message: "user is created",
      user : newUser
    })

  } catch(error){
    res.json({
      success: false,
      message : "not created ",
      error : error.message
    })
  }
  
})


app.get('/logout', (req, res) => {
  res.send("Logout")
});



app.get('/protected',passport.authenticate('jwt',{session: false}),(req,res)=>{
  res.send("protected")
})












app.listen(3000, () => {
  console.log('Server started on port 3000');
});
