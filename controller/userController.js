var  userModel =  require("../models/user");

class user{

    putData = async(userInfo) =>{
       
        let {email,password,re_password,id} = userInfo;

        let data;

        let errList = []; 

        if(!email){ errList.push["Please enter email address"] }

        if(!password){ errList.push["Please enter Password"] }

        if(password != re_password){ errList.push["Passwords doesn't match"] }

        if(errList && errList.length){

            return({

                type: "fail",
                data: errList.join(", <br>")

            })

        }

        let userInDb = await this.getData({"email":email});

        if(userInDb["data"] && userInDb["data"][0]){

            return {
                type:"fail",
                data: "failed, user already exists"
            }

        }else{

             data = new userModel({
                email,
                password,
                created_on: new Date(),
            })

        }
        try{

           let dataAdd = await data.save();

           return({
                type:"success",
                data: dataAdd
           })

        }catch(error){

            return ({
                type:"fail",
                data:error
            })

        }
    }

    getData = async(query) =>{
        try{

            let data ;

            if(query){

                data = await userModel.find(query);

            }else{

                data = await userModel.find().select({"_id":1,"email":1});

            }

            return ({
                type: "success",
                data
            });

        }catch(err){

            return ({
                type: "fail",
                data : err,
            })

        }
    }

    validate = async(userObj) =>{

        try{

            let {email,password} = userObj;

            let query = {email};

            let data ;

            data = await userModel.find(query);

            if(data && data.length){

                let user = data[0];

                if(user["password"] != password){

                    return({
                        type: "fail",
                        data: "Password is not correct, Please try again"
                    })
                }

                return ({
                    type: "success",
                    data: {
                        email: user["email"]
                    }
                });

            }else{

                return ({
                    type: "fail",
                    data: "No record found, Please register"
                });

            }

        }catch(err){

            return ({
                type: "fail",
                data : err,
            })

        }
    }

    deleteData = async(dataItem) =>{

        let {id} = dataItem;

        let data = {}

        let userDelete = await userModel.remove({ _id: id }, function(err) {

            if (!err) {
                    data.type = 'success';
            }
            else {
                    data.type = 'fail';
            }
        });

        return({data});
    }

}

module.exports = new user();