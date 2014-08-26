var pool = require('./db'),	
	fs = require('fs'),
    mammoth = require("mammoth"),
    solr = require('solr-client');

exports.register = function(req, res) {
    var registerdetails = req.body;
    var email= req.body.email;
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('SELECT *  from user where email=?',[email], function(err, rows, fields) {
            if (err) throw err;
            if(rows.length > 0){
                con.release();
                res.send("user already exist");                                                     
            }
            else{
                var query = con.query('INSERT INTO user SET ?', registerdetails, function(err, result) {
                    if (err) throw err;
                    con.release();
                    res.send("Success");
                });
            }
        });
    });
}


exports.login = function(req, res) {
    var email=req.body.email;
    var password=req.body.password;
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('SELECT *  from user where email=? and password=?',[email,password], function(err, rows, fields) {
            if (err) throw err;
            if(rows <=0){
                res.send (401);
            }else{
                con.release();
                res.send ({ 
                    email:rows[0].email,
                    message:'Successfully loggedin',
                    redirectTo:'home.html'
                });
            }           
        });        
    });       
}

exports.saveCandidate = function(req,res){  
    var candidatedetails = req.body;
    var email= req.body.email;
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('SELECT *  from candidate where email=?',[email], function(err, rows, fields) {
            if (err) throw err;
            if(rows.length > 0){
                con.release();                     
                res.send({message:"candidate already exist"});                 
            }
            else{
                var query = con.query('INSERT INTO candidate SET ?', candidatedetails, function(err, result) {
                    if (err) throw err;
                    con.release();
                    res.send({message:'Successfully saved'});
                });
            }
        });
    });
}

exports.companyList = function(req, res) {
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('SELECT *  from company', function(err, rows, fields) {
            if (err) throw err;
            con.release();
            res.send(rows);
        });         
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
            res.send({filepath:newPath});
        });
    });
};

exports.saveVacancies = function(req,res){
    var vacancydetails = req.body;
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        var query = con.query('INSERT INTO vacancy SET ?', vacancydetails, function(err, result) {               
            if (err) throw err;
            con.release();
            res.send({message:'Successfully saved'});         
        });
    });
}

exports.solrclient = function(req,res){
    var searchtext=req.body.searchtext;
    //console.log(searchtext);
    var client = solr.createClient();
    console.log(client);
    client.search('q='+searchtext+'', function(err, obj){
       res.send(obj);
    });
}


exports.getcandidate = function(req, res) {    
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('SELECT *  from candidate where id = ?', [req.params.candidate_id],function(err, rows, fields) {
            if (err) throw err;

            if(rows.length > 0){
                con.release();

                var docName = rows[0].name;
                var docPath = rows[0].cvpath;

                fs.readFile(docPath, function (err, data) {                   
                    var newFilePath = __dirname+"/uploads/";

                    mammoth.convertToHtml({path: docPath})
                    .then(function(result){
                        var html = result.value; // The generated HTML
                        var messages = result.messages; // Any messages, such as warnings during conversion  
                        var newFile = newFilePath+docName+".html";                     
                        fs.writeFile(newFile, html, function (err) {
                            console.log(newFile);
                            res.send({docFile:html,Details:rows[0]});  
                        });
                    })
                    .done();
                    
                });
//                res.send(rows[0]);
            }else{
                con.release();
                res.send({});                
            }
        });         
    });       
}