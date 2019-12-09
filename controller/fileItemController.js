var  fileItemModel =  require("../models/fileItem");

var fileItemUtils = require("../utils/fileItem");

var path = require('path');

class fileItem{

    putData = async(fileInfo) =>{
       
        let {files,email,id} = fileInfo;

        let formatedFiles = [];

        files.map( eachFile => {

            formatedFiles.push(fileItemUtils.returnFileItemFromFileMulter(email,eachFile));

        })

        let formatedFileSavePromisses = [];

        formatedFiles.map((eachFormatedFile)=>{

            formatedFileSavePromisses.push(this.saveEachItem(eachFormatedFile));

        })

        let formatedFileItemSaveResult = await Promise.all(formatedFileSavePromisses);

        let failedResponses = [];

        formatedFileItemSaveResult.map((eachFormatedSaveResult)=>{

            if(eachFormatedSaveResult["type"] == "fail"){

                failedResponses.push(eachFormatedSaveResult["data"]);

            }

        })

        if(failedResponses.length > 0){

            return({
                type: "fail",
                data: "some files does not stored."
            })

        }else{

            return({
                type: "success",
                data: "all files stored successfully"
            })

        }
        
    }

    saveEachItem = async(data)=>{

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

    getData = async(query,options) =>{
        try{

            let data ;

            if(options && query){
               
                    data = await fileItemModel.find(query).skip(options["offset"]).limit(options["limit"]);

            }else if(query){

                data = await fileItemModel.find(query);

            }else{

                data = await fileItemModel.find();
            
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

    deleteData = async(dataItem) =>{

        let {id,email} = dataItem;

        let data = {}

        let delObj = await fileItemModel.remove({ _id: id, email: email }, function(err) {
            
            if (!err) {
                    data.type = 'success';
            }
            else {
                    data.type = 'fail';
            }

        });

        return({data});
    }

    download = async(dataItem)=>{

        let {id,email} = dataItem;

        if(id){

            let fileItem = await this.getData({_id:id});

            let filePath = path.join(__dirname,'../uploads/'+ email + '/' + fileItem.file_name);

            return({
                type: "success",
                data: filePath
            })

        }else{

            return({
                type: "fail",
                data: "unique id does not found, fetch file failed."
            })

        }

        


    }

}

module.exports = new fileItem();