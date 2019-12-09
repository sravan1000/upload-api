var express = require('express');
var router = express.Router();
let userController = require("../controller/userController");
let fileItemController = require("../controller/fileItemController");
var jwt = require("jsonwebtoken");
var constants = require("../constants");
var multer  = require('multer')

var fs = require('fs');



const storage = multer.diskStorage({

    destination: function(req,file,cb){

        var dir = `./uploads/${req.user.email}`;

        if (!fs.existsSync(dir)){

            fs.mkdirSync(dir);

        }

        cb(null,`./uploads/${req.user.email}/`)

    },
    filename:function(req,file,cb){

        cb(null, Date.now() +'_'+file.originalname );

    }

})

var upload = multer({ 

    storage:storage , 

    limits:{

        fileSize: 1024 * 1024 * 2 //2 MB max

    }

});

router.post('/register',function(req,res){

    let data = req.body;

    console.log("called register end point.");

    userController.putData(data).then((result,err)=>{

            if(err){

                res.send({
                    type: "fail",
                    data:"got an error"+ err
                });

            }else{

                res.send({
                    type: result["type"],
                    data:result["data"]
                })

            }
    });
});

router.post('/validate',function(req,res){

    let data = req.body;

    userController.validate(data).then((result,err)=>{

            if(err){

                res.send({
                    type: "fail",
                    data:"got an error"+ err
                });

            }else{

                res.send({
                    type: result["type"],
                    data:result["data"],
                    token: req["token"]
                })

            }

    });

});


router.get('/files',function(req,res){

    let query = {};

    query["user_id"] = req.user.email;

    fileItemController.getData(query).then((result,err)=>{

        if(err){

            res.send({
                type: "fail",
                data:"got an error"+ err
            });

        }else{

            res.send({
                type: result["type"],
                data:result["data"]
            })

        }
    });

    
})

router.get('/public',function(req,res){

    fileItemController.getAllPublicFilesByUserId().then((result,err)=>{

        if(err){

            res.send({
                type: "fail",
                data:"got an error"+ err
            });

        }else{

            res.send({
                type: result["type"],
                data:result["data"]
            })

        }
    });

    
})

router.post('/upload',upload.any(),function(req,res){

    let data = req.body;

    data["email"] = req.user.email;

    if(req.files){
        data["files"] = req.files;
    }

    fileItemController.putData(data).then((result,err)=>{

        if(err){

            res.send({
                type: "fail",
                data:"got an error"+ err
            });

        }else{

            res.send({
                type: result["type"],
                data:result["data"]
            })

        }

    });

})

router.post('/deleteitem',function(req,res){

    let data = req.body;

    data["email"] = req.user.email;

    fileItemController.deleteData(data).then((result,err)=>{

        if(err){

            res.send({
                type: "fail",
                data:"got an error"+ err
            });

        }else{

            res.send({
                type: "success",
                data: "successfully deleted.."
            })

        }

    });

});

router.post('/file',function(req,res){

    let data = req.body;

    data["email"] = req.user.email;

    fileItemController.download(data).then((result,err)=>{

        if(err){

            res.send({
                type: "fail",
                data:"got an error"+ err
            });

        }else{

            if(result["fail"]){

                res.send({
                    type: "fail",
                    data:"got an error"+ result["data"]
                });

            }else{

                res.sendFile(result["data"]);

            }

        }

    });

});

router.post('/updateprivacy',function(req,res){

    let data = req.body;

    data["email"] = req.user.email;

    fileItemController.updatePrivacy(data).then((result,err)=>{

        if(err){

            res.send({
                type: "fail",
                data:"got an error"+ err
            });

        }else{

            if(result["fail"]){

                res.send({
                    type: "fail",
                    data:"got an error"+ result["data"]
                });

            }else{

               res.send({
                   type: "success",
                   data: result["data"]
               })
               
            }

        }

    });

});


module.exports = router;