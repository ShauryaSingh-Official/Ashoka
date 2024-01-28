const jwt = require("jsonwebtoken");

exports.isLogIn=(req,res,next)=>{
    // token comes from localStorage // and secretkey comes from dotenv or environment vars 
        
    try{
        // console.log(req.get("Authorization") , "line 7")
        let token =  req.get("Authorization").split("Bearer ")[1];
        var decoded = jwt.verify(token, process.env.SECRET_KEY)
        if(decoded.email){
        next();
    }
    else{
        res.sendStatus(401, "Middleware Error ! Unauthorised User.");
    }
    }
    catch(err){
        res.sendStatus(401, "Unauthorised User.");
    }
}

// setHeader("authorization" : token)
// req.get("Authorization")

        // var decoded = jwt.verify( "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvdXJhdms0ODU2MEBnbWFpbC5jb20iLCJpYXQiOjE3MDUyNDI5MjF9.1cBrv37ZMuzfUy30TrtQ8PQp8Ndb9Q_g8CSanupvKDg",'sshhhhh48560');