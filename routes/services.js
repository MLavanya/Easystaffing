var db = require('../db/persistence-controller'),
	userschema = require('../db/schema/UserSchema'),
	fs = require('fs'),
    mammoth = require("mammoth");

exports.register = function(req, res) {
    var UserInfo = req.body;    
    db.read("login",{"email":UserInfo.email},function(result){ 
        if(result.length > 0){
            res.send("user already exist"); 
        } 
        else{
            db.save('login', UserInfo, function(result) { 
       	        /*db.save('candidates',{'recruiter_email':UserInfo.email},function(result){
                    console.log("Successfully saved the UserInfo");
                });*/  
            });
        } 
    });
}

exports.login = function(req, res) {
    var userInfo = req.body;
    db.read("login",{"username":userInfo.username,"password":userInfo.password},function(result){ 
        if(result.length > 0){
            console.log('Successfully loggedin'+JSON.stringify(result)); 
            res.send ({ 
                Result:result,              
                message:'Successfully loggedin',
                redirectTo:'home.html'
            });
        }
        else{
            console.log('no user data');
            res.send ({
                message:'User does not exist',
                redirectTo:'pages-signin.html'
            });
        }
    });
}

exports.saveCandidate = function(req,res){
    var info = req.body;
   // console.log("entered the function"+ JSON.stringify(info));
    db.save('candidates',info,function(result){
        console.log("saved");
        res.send({message:"saved the candidate's profile"});
    });
}

exports.upload =function(req,res){  
    var Details = req.files;
    //console.log(JSON.stringify(Details));
    fs.readFile(req.files.file.path, function (err, data) {    
        var newPath = __dirname+"/uploads/"+req.files.file.name;
        var fileName = req.files.file.name;
        fs.writeFile(newPath, data, function (err) {
            console.log(newPath);           
            res.send({filepath:fileName});
        });


    });

    /*fs.readFile(req.files.file.path, function (err, data) {    
        var newPath = __dirname+"/uploads/"+req.files.file.name;
        var newFile = __dirname+"/uploads/";

        mammoth.convertToHtml({path: newPath})
        .then(function(result){
            var html = result.value; // The generated HTML
            var messages = result.messages; // Any messages, such as warnings during conversion
            console.log(html);
            fs.writeFile(newFile+"name.html", html, function (err) {
                console.log(html);
                res.send({filepath:html});  
            });
        })
        .done();
        
    });   */
   

};

exports.saveVacancies = function(req,res){
    var info = req.body;
    //console.log("test"+JSON.stringify(req.body));
    db.save('vacancies',info,function(result){
        console.log("saved");
        res.send({message:"saved the vacancy details"});
    });
}