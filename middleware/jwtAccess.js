var userController = require("../controller/userController");
var jwt = require("jsonwebtoken");
var constants = require("../constants");

 var jwtAccess = function (req, res, next) {

        let bearerHeader = req.headers["authorization"];

        if(bearerHeader && bearerHeader.split(" ")[1]){
            // if token there will get user session from token else... else code

            const token = bearerHeader.split(" ")[1];

            jwt.verify(token,constants.secretKey,(err, data)=>{

                if(err){

                    res.send({
                        type: "fail",
                        data: "extracting data from token failed, Please re login"
                    })

                }else{

                    req.user = data.user;

                    req.token = token;

                    next();
                }

            })

        }else{//if no token then req must be login or register

            if(Object.keys(req.body).length == 0){//if there is no body then reject

                res.send({
                    type: "fail",
                    data: "Please relogin"
                })

            }else{//if body there in req

                let data =  req.body;
                
                let registerUrl = req._parsedUrl._raw.match(/register/g);

                let validateUrl = req._parsedUrl._raw.match(/validate/g);
                        
                if(data && registerUrl && registerUrl[0]){
                    
                    next();
                    
                }else if(data && validateUrl && validateUrl[0]){// login req will enter here

                    let user = {
                        email : data.email
                    }
        
                    jwt.sign({user},constants.secretKey,(tokenErr,token) => {

                        if(tokenErr){

                            res.send({
                                type:"fail",
                                data: "error generating token"
                            }) 

                        }else{

                            req.token = token;

                            req.user = user;

                            next();

                        }

                    })

                }else{// other than login or register req must reject

                    res.send({
                        type: "fail",
                        data: "Invalid request"
                    })

                }

            }

        }
            
    }

module.exports = jwtAccess;