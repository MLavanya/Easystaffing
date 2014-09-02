    
var pool=require('./databaseconnection');    
var fs = require('fs');
var mammoth = require("mammoth");
var solr = require('solr-client');
var moment = require('moment');
var solrinfo=require('../solrconfig');


/*
*    Application API
*/

exports.register = function(req, res) {

    var registerdetails = req.body;
    var email= req.body.email;

    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();
        con.query('SELECT *  from user where email="'+email+'"', function(err, rows, fields) {
        if (err) throw err;

           if(rows.length > 0)
            {
                con.release();
                res.send("user already exist");                          
            }
            else{
                var query = con.query('INSERT INTO user SET ?', registerdetails, function(err, result) {
                if (err) throw err;

                    con.release();
                    res.send("succuss");
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

        con.query('SELECT *  from user where email="'+email+'" and password="'+password+'"', function(err, rows, fields) {
           if (err) throw err;

           if(rows.length <= 0)
             res.send(401);
           else{
             con.release();
             res.send({
                email:rows[0].email,
                name: rows[0].name,
                redirectTo : "home.html"
            });            
           }
       });        

    });       

}

exports.validateadm = function(req, res) {

    if(req.body.password == "2014"){
        res.send("success");
    }else{
        res.send("failure");
    }

}

exports.me = function(req, res) {

    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();
        con.query('SELECT email,name  from user where email = ?',[req.cookies.email], function(err, rows, fields) {
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

exports.saveCandidate = function(req, res) {

    var candidatedetails = req.body;
    var email= req.body.email;

    candidatedetails.created_by=req.cookies.email;
    candidatedetails.updated_time= moment();

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
                    candidatedetails.id = result.insertId;
                    exports.solraddcandidate(candidatedetails);
                    res.send({message:'Successfully saved'});
                });
            }
        });
    });

}

exports.candidateretreive = function(req, res) {


                pool.getConnection(function(err,con){

        if(err){

            console.log("Error connection to the db.");
        }

        con.connect();

    
        

            con.query('SELECT *  from candidate', function(err, rows, fields) {
            if (err) throw err;

              con.release();
              res.send(rows);
          });         



    });       



}

exports.candidateupdate = function(req, res) {


                pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();

            con.query('update candidate set ', function(err, rows, fields) {
            if (err) throw err;

            con.release();
            res.send(rows);
        });       



    });

}

exports.vacancyadd = function(req, res) {

    var vacancydetails = req.body;

    vacancydetails.created_by=req.cookies.email;
    vacancydetails.updated_time= moment();

    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();

        var query = con.query('INSERT INTO vacancy SET ?', vacancydetails, function(err, result) {
                
            if (err) throw err;

            con.release();
            vacancydetails.id = result.insertId;
            exports.solraddvacancy(vacancydetails);
            res.send("succuss");
            
        });

    });

}

exports.getvacancy = function(req, res) {

    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();
        con.query('SELECT *  from vacancy where id = ?', [req.params.vacancy_id],function(err, rows, fields) {
            if (err) throw err;

            if(rows.length > 0){

                var data = rows[0];

                con.query('SELECT application.id,application.status,vacancy.name,vacancy.title  from application,vacancy where application.vacancy_id = vacancy.id and application.vacancy_id = ?', [data.id],function(err, rows, fields) {
                    if (err) throw err;

                    if(rows.length > 0){
                        con.release();
                        data.applications = rows;
                        res.send(data);
                    }else{
                        con.release();
                        res.send(data);                
                    }
                });  

            }else{
                con.release();
                res.send({});                
            }
        });         

    });       
}

exports.vacancyretreive = function(req, res) {

    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();
        con.query('SELECT *  from vacancy', function(err, rows, fields) {
            if (err) throw err;

            con.release();
            res.send(rows);
        });         

    });       
}

exports.vacancyupdate = function(req, res) {


                pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();

        con.query('update vacancy set ', function(err, rows, fields) {
            if (err) throw err;

             con.release();
         res.send(rows);
      });         

    });

}

/*exports.companies = function(req, res) {

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
}*/

exports.getcandidate = function(req, res) {    
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('SELECT *  from candidate where id = ?', [req.params.candidate_id],function(err, rows, fields) {
            if (err) throw err;

            if(rows.length > 0){
                //con.release();

                var docName = rows[0].name;
                var docPath = rows[0].cvpath;

                var datas = {};
                datas.details = rows[0];

                fs.readFile(docPath, function (err, data) {                   
                    var newFilePath = __dirname+"/uploads/";

                    mammoth.convertToHtml({path: docPath})
                    .then(function(result){
                        var html = result.value; // The generated HTML
                        var messages = result.messages; // Any messages, such as warnings during conversion  

                        datas.docFile = html;

                        con.query('SELECT application.id,application.status,vacancy.name,vacancy.title from application,vacancy,candidate where application.candidate_id = candidate.id and application.vacancy_id = vacancy.id and application.candidate_id = ?', [datas.details.id],function(err, rows, fields) {
                            if (err) throw err;

                            if(rows.length > 0){
                                con.release();
                                datas.applications = rows;
                                datas.apphistory = [];
                                res.send(datas);
                            }else{
                                con.release();
                                res.send(datas);                
                            }
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

exports.applyvacancy = function(req, res) {

    var applydetails = req.body;

    applydetails.created_by=req.cookies.email;
    applydetails.updated_time= moment();

    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();

        var query = con.query('SELECT * from application where candidate_id = ? and vacancy_id = ?', [applydetails.candidate_id,applydetails.vacancy_id], function(err, rows, fields) {
                
            if (err) throw err;

            console.log(rows);

            if(rows.length > 0){
                res.send('Already applied for this vacany');
            }else{

                var query = con.query('INSERT INTO application SET ?', applydetails, function(err, result) {
                        
                    if (err) throw err;

                    applydetails.id = result.insertId;
                    var query = con.query('INSERT INTO application_h SET ?', {application_id:applydetails.id,prevstatus:'C01',curstatus:applydetails.status}, function(err, result) {
                        if (err) throw err;                            
                        con.release();
                        res.send("succuss");
                    });
                    
                });

            }
            
        });

    });

}

exports.appliedforv = function(req, res) {

    var applydetails = req.body;

    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();

        var query = con.query('SELECT * from application where candidate_id = ? and vacancy_id = ?', [applydetails.candidate_id,applydetails.vacancy_id], function(err, rows, fields) {
                
            if (err) throw err;

            if(rows > 0){
                res.send({ status: 'true'});
            }else{
                res.send({ status: 'false'});
            }
            
        });

    });

}

exports.jqcloudCall = function(req,res){
    
    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();
        con.query('SELECT *  from search_log where user_id= ?',[req.cookies.email], function(err, rows, fields) {
            if (err) throw err;

            con.release();
            res.send(rows);
        });         

    });        
}

exports.companyList = function(req,res){
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('SELECT *  from company',function(err, rows, fields) {
            if (err) throw err;                                
            con.release();   
        //    console.log(rows);
            res.send(rows);
        });
    });
}

exports.updateCompany = function(req,res){
    
    var company = req.body;

    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();

        con.query('SELECT * from company where name = ?', [company], function(err, rows, fields) {
                
            if (err) throw err;

            if(rows.length > 0){
                con.release();   
                res.send('201');
            }else{
                con.query('INSERT INTO company SET ?', company, function(err, result) {
                    if (err) throw err;
                    con.release();   
                    res.send('200');
                });

            }
            
        });

    });
}

exports.statusList = function(req,res){
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('SELECT *  from status',function(err, rows, fields) {
            if (err) throw err;                                
            con.release();   
            res.send(rows);
        });
    });
}

exports.piechartdetails = function(req, res) {

    var available,candidates;
    pool.getConnection(function(err,con){

    if(err){
        console.log("Error connection to the db.");
    }
    con.connect();
    con.query('SELECT *  from candidate', function(err, rows, fields) {
        if (err) throw err;
            candidates=rows.length;
        });
        con.query('SELECT *  from candidate where status="C01"', function(err, rows, fields) {
            if (err) throw err;
            available=rows.length;
        });
        con.query('SELECT *  from candidate where status="C04"', function(err, rows, fields) {
            if (err) throw err;

            var inprogress = rows.length;
            var avb_perc = (available/candidates)*100;
            var inprg_perc = (inprogress/candidates)*100;
            //console.log('avb_perc'+ " "+avb_perc+" "+inprg_perc);
            con.query('SELECT *  from vacancy', function(err, rows, fields) {
                if (err) throw err;
                con.release();
                var vacancies = rows.length;
                res.send([{"candidates":candidates,"available":available,"inprogress":inprogress,"avb_perc":avb_perc,"inprg_perc":inprg_perc,"vacancies":vacancies}]);
            });             
        });       
    });
}

exports.applicationbycid = function(req, res) {

    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();
        con.query('SELECT *  from application where candidate_id = ?', [req.params.candidate_id],function(err, rows, fields) {
            if (err) throw err;

            if(rows.length > 0){
                con.release();
                res.send(rows);
            }else{
                con.release();
                res.send([]);                
            }
        });         

    });       
}

exports.applicationbyvid = function(req, res) {

    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();

        con.query('SELECT application.id,application.status,vacancy.name,vacancy.title  from application,vacancy where application.vacancy_id = vacancy.id and application.vacancy_id = ?', [req.params.vacancy_id],function(err, rows, fields) {
            if (err) throw err;

            if(rows.length > 0){
                con.release();
                res.send(rows);
            }else{
                con.release();
                res.send([]);                
            }
        });         

    });       
}

exports.apphistorybyid = function(req, res) {

    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();
        con.query('SELECT *  from application_h where application_id = ?', [req.params.application_id],function(err, rows, fields) {
            if (err) throw err;

            if(rows.length > 0){
                con.release();
                res.send(rows);
            }else{
                con.release();
                res.send([]);                
            }
        });         

    });       
}


exports.getUserdata = function(req,res){
    
    var email = req.cookies.email;
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('SELECT *  from user where email = ?', [email],function(err, rows, fields) {
            if (err) throw err;
            if(rows.length > 0){
                con.release();   
                var userdata = rows[0];
                //res.send(rows[0]);                 
                con.query('SELECT *  from candidate',function(err, result, fields) {
                    if (err) throw err;
                    if(result.length > 0){
                        con.release();  
                        var candidatelist = result;                                   
                        //res.send(result);                 
                       // res.send({userdata:userdata,candidatelist:candidatelist});
                        con.query('SELECT *  from vacancy',function(err, result, fields) {
                            if (err) throw err;
                            if(result.length > 0){
                                con.release();  
                                var vacancylist = result;                                   
                                //res.send(result);                 
                                res.send({userdata:userdata,candidatelist:candidatelist,vacancylist:vacancylist});                               
                            }
                        }); 

                    }
                }); 
            }
        }); 
                 
    });       
}

exports.updateProfile = function(req,res){    
    
    var profileUpdates = req.body;
    var email = req.cookies.email;
    
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('SELECT *  from user where email=?',[email], function(err, rows, fields) {
            if (err) throw err;
            if(rows.length > 0){                                
                con.query('UPDATE user set ? WHERE email = ?',[profileUpdates,email], function(err, rows, fields) {
                    con.release();
                    res.send({message:"Updated Successfully"});
                });                            
            }            
        });
    });
}


/*-------------------------------*/
// Solr API
/*-------------------------------*/



/*exports.solrclient = function(req,res){
    var searchtext=req.body.searchtext;
    //console.log(searchtext);
    var client = solr.createClient(solrinfo.ip,solrinfo.portnum,solrinfo.vacancy_core,'','','');
    console.log(client);
    client.search('q='+searchtext+'', function(err, obj){
       res.send(obj);
    });
}
*/
exports.solrclient = function(req,res){
    var searchtext=req.body.searchtext//+"&fl=*,score&hl=true&hl.fl=content&hl.snippets=10000";
    console.log(JSON.stringify(req.body));
    updateSearchLog(searchtext+"&schema="+req.body.schema,req.cookies.email);
    if(req.body.schema == 'c'){
        console.log("candidate schema");
        var client = solr.createClient(solrinfo.ip,solrinfo.portnum,solrinfo.candidate_core,'','','');
    }
    else if (req.body.schema == 'v'){
        console.log("vacancy schema");
        var client = solr.createClient(solrinfo.ip,solrinfo.portnum,solrinfo.vacancy_core,'','','');
    }
    
    var query2 = client.createQuery()
                       .q(searchtext)
                       .start(0)
                       .rows(1000);
    client.search(query2,function(err,obj){
       if(err){
        console.log(err);
        res.send(err);
       }else{
        console.log(obj);
        res.send(obj);
       }
    });
}


exports.solraddvacancy = function(data){

    var client = solr.createClient(solrinfo.ip,solrinfo.portnum,solrinfo.vacancy_core,'','','');

    // Switch on "auto commit", by default `client.autoCommit = false`
    client.autoCommit = true;
    /*
          *********************************                     *********************************
          The following parameters are the info about candidate.
          pass the values to the respective fields.
          change the content type based on the document format. Example for doc/docx application/msword for pdf application/pdf....etc.
          Give the CV path value to the parameter path.
          *********************************                     *********************************
    */
    var docs = [];

   var doc = {
       "id":data.id,
       "vtitle": data.title,
       "vname": data.name,
       "vstatus":data.status,
       "vexp_min":data.exp_min,
       "vexp_max":data.exp_max,
       "vskills":data.skills,
       "vcity":data.city,
       "vcountry":data.country,
       "vcompany_id":0,
       "vcreated_date":data.created_date,
       "vupdated_time":data.updated_time,
       "vcreated_by":data.created_by
  }
    docs.push(doc);

    client.add(docs,function(err,obj){
       if(err){
          console.log(err);
       }else{
          console.log(obj);

            client.commit(function(err,res){
               if(err) console.log(err);
               if(res) console.log(res);
            });

       }
    });


}



exports.solraddcandidate = function(data){

    var client = solr.createClient(solrinfo.ip,solrinfo.portnum,solrinfo.candidate_core,'','','');

    // Switch on "auto commit", by default `client.autoCommit = false`
    client.autoCommit = true;
    /*
          *********************************                     *********************************
          The following parameters are the info about candidate.
          pass the values to the respective fields.
          change the content type based on the document format. Example for doc/docx application/msword for pdf application/pdf....etc.
          Give the CV path value to the parameter path.
          *********************************                     *********************************
    */

   var doc = {
       "literal.id":data.id,
       "literal.ctitle": data.title,
       "literal.cname": data.name,
       "literal.cemail": data.name,
       "literal.cstatus":data.status,
       "literal.cexp":data.exp,
       "literal.cphone":data.phone,
       "literal.cskills":data.skills,
       "literal.ccity":data.city,
       "literal.ccountry":data.country,
       "literal.ccompany_id":0,
       "literal.cactive":data.active,
       "literal.ccomments":data.comments,
       "literal.ccreated_by":data.created_by
  }

    var options = {
       parameters:doc,
        format:'extract',
        path :data.cvpath,       //path of the candidate cv
        contentType:'application/msword'   // document type
    }
    client.addRemoteResource(options,function(err,obj){
       if(err){
            console.log(err);
       }else{
            console.log(obj);
            client.commit(function(err,res){
               if(err) console.log(err);
               if(res) console.log(res);
            });          
       }
    });

}

function updateSearchLog (searchtext,email,callback){
    console.log("SearchLog"+searchtext);

    var search_log = {"user_id":email,"searchQuery":searchtext,"count":1}

    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('SELECT *  from search_log where searchQuery=? and user_id=?',[searchtext,email], function(err, rows, fields) {
            if (err) throw err;
            if(rows.length > 0){                
                con.query('UPDATE search_log set count=count+1 where searchQuery=? and user_id=?',[searchtext,email], function(err, rows, fields) {
                    con.release();
                   // res.send({message:"Updated Successfully"})
                });                            
            }
            else{
                var query = con.query('INSERT INTO search_log SET ?', search_log ,function(err, result) {
                    if (err) throw err;
                    con.release();                   
                    //res.send({message:'Successfully saved'});
                });
            }
        });
    });
}