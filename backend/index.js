//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var pool = require('./models/UserDB.js');
app.set('view engine', 'ejs');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:5000', credentials: true }));
//use cookie parser to parse request headers
app.use(cookieParser());
//use express session to maintain session data
app.use(session({
    secret              : 'cmpe_273_secure_string',
    resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000
}));

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());

//Allow Access Control
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

pool.query('select * from user',  function(err, rows){
    if(err) throw err;
    else {
      console.log("Connection to DB established");
      console.log(rows);
    }
});  

//Route to handle login Post Request Call
app.post('/login',function(req,res){
    console.log("Inside Login Post Request");
    console.log("Req Body : ",req.body);
    pool.query('SELECT * FROM admin where username = ?',req.body.username, function (err,rows) {
        if(rows[0].password === req.body.password){
            res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
            req.session.user = req.body.username;
            console.log("Session data", req.session.user);
            console.log("Successful");
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end("Successful Login");
        } else {
            console.log("Unsuccessful");
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("UnSuccessful Login");
        }
    })
});

//Route to add Users
app.post('/create',function(req,res){
    console.log("In Create Post");
    if(req.session.user){
        console.log("Req Body : ", req.body);
        var userData = {"name": req.body.Name, "studentID": req.body.StudentID, "department" : req.body.Department};
        
        pool.query('INSERT INTO user SET ?',userData, function (err) {
            if (err) {
                console.log("unable to insert into database");
                res.status(400).send("unable to insert into database");
            } else {
                console.log("User Added Successfully!!!!");
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                res.end("User Added");
            }
        });
    } else {
        console.log("Session Invalid");
        res.writeHead(400,{
            'Content-Type' : 'text/plain'
        })
        res.end("Session Invalid");
    }
});

//Route to get All users when user visits the Report Page
app.get('/list', function(req,res){
    console.log("Inside list users Login");
    pool.query('SELECT * FROM user', (err, result) => {
    if (err){
      console.log(err);
      res.status(400).send("Error in Connection");
    }else {
        console.log("users list: ",JSON.stringify(result));
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        res.end(JSON.stringify(result));
     }
  })
})

//Route to delete an user
app.delete('/delete/:id',function(req,res){
    console.log("In Delete Post");
    console.log("The user to be deleted is ", req.params.id);
    
    pool.query('DELETE FROM user where studentID = ?', [req.params.id], (err, rows) => {
        if (err){
          console.log("User Not Found");
            res.writeHead(400,{
            'Content-Type' : 'text/plain'
        })
            res.end("User not found");
        } else {
            console.log("User ID " + req.params.id + " was removed successfully");
            pool.query('SELECT * FROM user', (err, result) => {
                if (err){
                  console.log(err);
                  res.status(400).send("Error in Connection");
                }else {
                    console.log("users list: ",JSON.stringify(result));
                    res.writeHead(200,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end(JSON.stringify(result));
                 }
            })
         }
      })
});

//start your server on port 5001
app.listen(5001);
console.log("Server Listening on port 5001");