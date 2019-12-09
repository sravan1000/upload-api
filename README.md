The project upload of files with login and making files public or private was divided into two parts

1) web part and (Upload-web)
2) API part (upload-api)

git urls:

1) https://github.com/sravan1000/upload-web
2) https://github.com/sravan1000/upload-api

(* Please use latest version of node js and angular)

-> used Node js and express for rest api's
-> used angular 8 for web part
-> The authentication between two services will be managed by jwt 
->  The files are stoered in upload folder and respective user id folder of the user who logged in
-> used mongo db for storing users and files details. currently, i am using my online cluster which is configued
-> The schemas of the two collections which i used were defined in models in api service
-> Did not used docker as my personal laptop can't handle it

Procedure to start: 

1) upload-web -> clone -> npm install -> ng serve
2) upload-api -> clone -> npm install -> node index (use latest version node and angular)
