
var pool=require('./databaseconnection');    
var fs = require('fs');
var mammoth = require("mammoth");
var solr = require('solr-client');
var moment = require('moment');
var solrinfo=require('../solrconfig');
var Cryptr = require("cryptr"),
    cryptr = new Cryptr('myTotalySecretKey');


/*
*    Application API
*/

exports.register = function(req, res) {

    var user = req.body;
    var email= req.body.email;
    var pwd = req.body.password;
    var password = cryptr.encrypt(pwd);     

    var registerdetails = {
        "email"         :user.email,
        "username"      :user.username,
        "name"          :user.name,
        "password"      :password,
        "region"        :user.region,
        "role"          :2,
        "status"        :'e01'
    }

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
                    res.send("Registered Successfully");
                });
            }

        });

    });

}

exports.login = function(req, res) {

    var emailPrefix=req.body.email;
    var email = emailPrefix+"@srsconsultinginc.com";
    var pwd=req.body.password;
    var password = cryptr.encrypt(pwd);
    var admin;
    var rolescnt;

    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();

        con.query('SELECT email,role from user where role LIKE "%4%" and email=?',[email], function(err, rows, fields){
            if (err) throw err;
            //console.log(" split(",") "+rows[0].role.split(","));                    
            if(rows.length>0){
                var roles = rows[0].role.split(","); 
                rolescnt = roles.length; 
                admin = true;
            }else if (rows.length <= 0){                
                admin = false;
                rolescnt = 2;
            }           
        });

        con.query('SELECT email,name,region,status  from user where email="'+email+'" and password="'+password+'"', function(err, rows, fields) {
            if (err) throw err;

            if(rows.length <= 0)
                //con.release();
                res.send({status:401});
            else if(rows[0].status== 'e02'){
                res.send({status:401});
            }
                else{
                    con.release();
                    res.send({
                        status:200,
                        email:rows[0].email,
                        name: rows[0].name,
                        region: rows[0].region,
                        admin : admin,
                        rolescnt : rolescnt,
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

exports.saveVacancies = function(req, res) {

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
            res.send({message:"Vacancy saved"});
            
        });

    });

}

exports.getvacancy = function(req, res) {
    var company;    
    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();
        con.query('SELECT *  from vacancy where id = ?', [req.params.vacancy_id],function(err, rows, fields) {
            if (err) throw err;

            if(rows.length > 0){
                
                con.query('SELECT name  from company where id = ?', [rows[0].company_id],function(err, company, fields) {
                    if (err) throw err;                    
                    company = company[0].name;
                    rows[0].company_id = company;
                });                
                var data = rows[0];                
                data.applications = [];
                data.stats=[];

                con.query('SELECT application.id,application.status,vacancy.name,vacancy.title,candidate.id as candidate_id,candidate.name as candidate_name from application,vacancy,candidate where application.vacancy_id = vacancy.id and application.candidate_id = candidate.id  and application.vacancy_id = ?', [data.id],function(err, rows, fields) {
                    if (err) throw err;

                    if(rows.length > 0){                        
                        data.applications = rows;                                       
                    }

                    con.query('SELECT status , count(*) as cnt FROM application WHERE vacancy_id = ? GROUP BY STATUS ', [data.id],function(err, rows, fields) {
                        if (err) throw err;                                

                        if(rows.length > 0){
                            data.stats = rows;
                        }

                        con.release();                                
                        res.send(data);

                    });                     
                });  

            }else{
                con.release();
                res.send({});                
            }
        });         

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
                //con.release();

                var docName = rows[0].name;
                var docPath = rows[0].cvpath;

                var data_result = {};
                data_result.details = rows[0];
                data_result.applications = [];
                data_result.apphistory = [];
                data_result.postinghistory = [];
                data_result.stats = [];
                data_result.posting = [];
                data_result.emp_posting = false;

                fs.readFile(docPath, function (err, data) {                   
                    var newFilePath = __dirname+"/uploads/";

                    //mammoth.convertToHtml({path: docPath})
                    //.then(function(result){
                        // var html = result.value; // The generated HTML
                        var html = "Not supported for now ..."; 
                        //var messages = result.messages; // Any messages, such as warnings during conversion  

                        data_result.docFile = html;

                        con.query('SELECT posting.id,posting.title,posting.type,posting.status,posting.created_by from posting where posting.candidate_id = ? ', [data_result.details.id],function(err, rows, fields) {
                            if (err) throw err;

                            if(rows.length > 0){
                                data_result.posting = rows;
                                data_result.emp_posting = true;
                            }
                        });

                        con.query('SELECT application.id,application.status,vacancy.name,vacancy.title,vacancy.status as vacancy_status from application,vacancy,candidate where application.candidate_id = candidate.id and application.vacancy_id = vacancy.id and application.candidate_id = ? ', [data_result.details.id],function(err, rows, fields) {
                            if (err) throw err;

                            if(rows.length > 0){
                                data_result.applications = rows;
                            }

                            con.query('SELECT status , count(*) as cnt FROM application WHERE candidate_id = ? GROUP BY STATUS ', [data_result.details.id],function(err, rows, fields) {
                                if (err) throw err;                                

                                if(rows.length > 0){
                                    data_result.stats = rows;
                                }

                                con.release();                                
                                res.send(data_result);

                            });                        

                        });                        

                    //})
                    //.done();
                    
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
                con.release();
                res.send('Already applied for this vacany');
            }else{

                var query = con.query('INSERT INTO application SET ?', applydetails, function(err, result) {
                        
                    if (err) throw err;

                    applydetails.id = result.insertId;
                    var query = con.query('INSERT INTO application_h SET ?', {application_id:applydetails.id,prevstatus:'C01',curstatus:applydetails.status}, function(err, result) {
                        if (err) throw err;                            

                        var comment={};
                        comment.application_h_id = result.insertId;
                        comment.created_by = req.cookies.email;
                        comment.comment = "Picked for Review";
                        con.query('insert into comments set ? ',comment, function(err,result) {
                          con.release();
                          res.send("success");
                        });

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
                con.release();
                res.send({ status: 'true'});
            }else{
                con.release();
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
            res.send(rows);
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

exports.cityList = function(req,res){
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('SELECT *  from city',function(err, rows, fields) {
            if (err) throw err;                                
            con.release();             
            res.send(rows);
        });
    });
}

exports.applicationbycid = function(req, res) {

    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();
        con.query('SELECT application.id,application.status,vacancy.name,vacancy.title,vacancy.status as vacancy_status from application,vacancy,candidate where application.candidate_id = candidate.id and application.vacancy_id = vacancy.id and application.candidate_id = ?', [req.params.candidate_id],function(err, rows, fields) {
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
        con.query('SELECT application_h.id,application_h.application_id,application_h.prevstatus,application_h.curstatus,application_h.updated_time,comments.comment from application_h,comments where application_h.id = comments.application_h_id and application_id = ?', [req.params.application_id],function(err, rows, fields) {
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
            if(err) throw err;

            if(rows.length > 0){
                con.release();
                var userdata = rows[0];
                con.query('SELECT *  from candidate where created_by=?',[email],function(err, result, fields) {
                    if (err) throw err;
                    if(result.length > 0){
                        con.release();  
                        var candidatelist = result; 
                        var candidate_len = candidatelist.length;
                        var accepted;
                        con.query('SELECT count(status) as cnt from candidate where created_by=? and status="C05" ', [email],function(err, rows, fields) {
                            if (err) throw err;                                
                            accepted = rows[0].cnt;                            
                        });                                  
                        con.query('SELECT *  from vacancy where created_by=?',[email],function(err, result, fields) {
                            if (err) throw err;
                            if(result.length > 0){
                                con.release();  
                                var vacancylist = result;                                                                               
                                res.send({userdata:userdata,candidatelist:candidatelist,vacancylist:vacancylist,candidate_len:candidate_len,accepted:accepted});
                            }else{
                                con.release();  
                                var vacancylist = [];                                                                               
                                res.send({userdata:userdata,candidatelist:candidatelist,vacancylist:vacancylist,candidate_len:candidate_len,accepted:accepted});
                            }
                        }); 
                    }else{
                        con.query('SELECT *  from vacancy where created_by=?',[email],function(err, result, fields) {
                            if (err) throw err;
                            if(result.length > 0){
                                con.release();  
                                var vacancylist = result;                                                                  
                                res.send({userdata:userdata,vacancylist:vacancylist});                               
                            }else{
                                con.release();
                                res.send({userdata:userdata})
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

exports.updateappstatus = function(req,res){    
        
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('UPDATE application set ? WHERE id = ?',[req.body.data,req.body.id], function(err, rows, fields) {
            con.query('insert into application_h set ? ',req.body.history, function(err,result) {

                req.body.comment.application_h_id = result.insertId;

                if(req.body.data.status == "C06")
                  req.body.data.status = "C01";
                con.query('UPDATE candidate set ? WHERE id = ?',[req.body.data,req.body.candidate_id], function(err, rows, fields) {
                    
                    exports.solrupdatecandidate({
                      "id": req.body.candidate_id,
                      "cstatus" : {"set": req.body.data.status}
                    });

                    req.body.comment.created_by = req.cookies.email;
                    con.query('insert into comments set ? ',req.body.comment, function(err,result) {
                      console.log("inserted" + result);
                      con.release();
                      res.send({message:"Updated Successfully"});
                    });
                    
                });                            

            });
        });                            
    });
}

exports.updatevacancystatus = function(req,res){    
        
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('UPDATE vacancy set ? WHERE id = ?',[req.body.data,req.body.id], function(err, rows, fields) {

          con.release();
          exports.solrupdatevacancy({
            "id": req.body.id,
            "vstatus" : {"set": req.body.data.status}
          });
          res.send({message:"Updated Successfully"});

        });                            



    });
}

exports.dashboardDetails = function(req, res) {

    var email =  req.cookies.email;
    var region_ = req.cookies.region;

    var available,candidates,employee_active,vacancy_active;

    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        if (region_ != 3){
            if(region_ == 1){
                region_ = 'United States'
            }else if (region_ == 2) {
                region_ = 'India'
            };
            con.query('SELECT *  from candidate where country=?',[region_], function(err, rows, fields) {
                if (err) throw err;
                candidates=rows.length;
            });
            con.query('SELECT *  from candidate where status="C01" AND created_by=? AND country=?',[email,region_], function(err, rows, fields) {
                if (err) throw err;
                available=rows.length;
            });
            con.query('SELECT *  from candidate where active="YES" and status in("C01","C02","C03","C04") and country=? order by created_date asc',[region_], function(err, rows, fields) {
                if (err) throw err;
                employee_active = rows;            
            });
            con.query('SELECT *  from vacancy where status="OPEN" and country=?' ,[region_], function(err, rows, fields) {
                if (err) throw err;
                vacancy_active = rows;            
            });
            con.query('SELECT *  from candidate where status="C04" AND created_by=? AND country=?',[email,region_], function(err, rows, fields) {
                if (err) throw err;

                var inprogress = rows.length;
                var avb_perc = (available/candidates)*100;
                var inprg_perc = (inprogress/candidates)*100;
                //console.log('avb_perc'+ " "+avb_perc+" "+inprg_perc);
                con.query('SELECT *  from vacancy where country=?',[region_] , function(err, rows, fields) {
                    if (err) throw err;

                    var vacancies = rows.length;
                    con.query('SELECT *  from vacancy WHERE status="open" AND created_by=? and country=?',[email,region_], function(err, rows, fields) {
                        if (err) throw err;
                        con.release();                    
                        var vac_open = rows.length;
                        var vac_perc = (vac_open/vacancies)*100;                    
                        res.send({
                            candidates:candidates,
                            available:available,
                            inprogress:inprogress,
                            avb_perc:avb_perc,
                            inprg_perc:inprg_perc,
                            vacancies:vac_open,
                            vac_perc:vac_perc,
                            employee_active:employee_active,
                            vacancy_active:vacancy_active
                        });
                    });                   
                });             
            });       

        }else if (region_ == 3){
            con.query('SELECT *  from candidate', function(err, rows, fields) {
                if (err) throw err;
                candidates=rows.length;                   
            });
            con.query('SELECT *  from candidate where status="C01" AND created_by=?',[email], function(err, rows, fields) {
                if (err) throw err;
                available=rows.length;                
            });
            con.query('SELECT *  from candidate where active="YES" and status in("C01","C02","C03","C04") order by created_date asc', function(err, rows, fields) {
                if (err) throw err;
                employee_active = rows; 
            });
            con.query('SELECT *  from vacancy where status="OPEN"' , function(err, rows, fields) {
                if (err) throw err;
                vacancy_active = rows;            
            });
            con.query('SELECT *  from candidate where status="C04" AND created_by=?',[email], function(err, rows, fields) {
                if (err) throw err;

                var inprogress = rows.length;
                var avb_perc = (available/candidates)*100;
                var inprg_perc = (inprogress/candidates)*100;
                //console.log('avb_perc'+ " "+avb_perc+" "+inprg_perc);
                con.query('SELECT *  from vacancy', function(err, rows, fields) {
                    if (err) throw err;

                    var vacancies = rows.length;
                    con.query('SELECT *  from vacancy WHERE status="open" AND created_by=?',[email], function(err, rows, fields) {
                        if (err) throw err;
                        con.release();                    
                        var vac_open = rows.length;
                        var vac_perc = (vac_open/vacancies)*100;                    
                        res.send({
                            candidates:candidates,
                            available:available,
                            inprogress:inprogress,
                            avb_perc:avb_perc,
                            inprg_perc:inprg_perc,
                            vacancies:vac_open,
                            vac_perc:vac_perc,
                            employee_active:employee_active,
                            vacancy_active:vacancy_active
                        });
                    });                   
                });             
            });                
        }
    });
}


exports.updateCompany = function(req,res){
    
    var company = req.body;

    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();

        con.query('SELECT name from company where ?', [company], function(err, rows, fields) {
                
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

exports.UpdateCandidate = function(req,res){
    var candidateData = req.body;
    var id = candidateData.id;
    candidateData.updated_time = new Date();
   
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('UPDATE candidate set ? WHERE id = ?',[candidateData,id], function(err, rows, fields) {
            if (err) throw err;
                                         
            con.release();
            exports.solrupdatecandidate({
                "id":candidateData.id,
                "ctitle" : {"set": candidateData.title},
                "cexp" : {"set": candidateData.exp},
                "cphone" : {"set": candidateData.phone},                
                "cemail" : {"set": candidateData.email},
                "ccity" : {"set": candidateData.city},
                "calt_email" : {"set": candidateData.alt_email},
                "calt_phone" : {"set": candidateData.alt_phone},
                "ccomments"  : {"set": candidateData.comments}
            });
            res.send({"status":200,"statusText":"updated Successfully"});
        });
    });
}

exports.UpdateCandidateResume = function(req,res){

    var resumePath = req.body.updatedata;
    var id = req.body.updatedata.id;

    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('UPDATE candidate set ? WHERE id = ?',[resumePath,id], function(err, rows, fields) {
            if (err) throw err;
                                         
            con.release();
            var data = req.body.content;
            data.cvpath = resumePath.cvpath;
            exports.solraddcandidate(data);
            res.send({"status":200,"statusText":"updated Successfully"});
        });
    });    
}

exports.UpdateVacancy = function(req,res){

    var vacancyData = req.body;
    var id = vacancyData.id;
    vacancyData.updated_time = new Date();
    
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('UPDATE vacancy set ? WHERE id = ?',[vacancyData,id], function(err, rows, fields) {
            if (err) throw err;
                                         
            con.release();
            exports.solrupdatevacancy({
                "id":vacancyData.id,
                "vtitle" : {"set": vacancyData.title},
                "vname" : {"set": vacancyData.name},
                "vdescription" : {"set": vacancyData.description},
                "vexp_min" : {"set": vacancyData.exp_min},
                "vexp_max" : {"set": vacancyData.exp_max},
                "vcity"    :{"set":vacancyData.city}
            });
            res.send({"status":200,"statusText":"updated Successfully"});
        });
    });

}

exports.updateCity = function(req,res){
    
    var city = req.body;

    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('SELECT * from city where ?', [city], function(err, rows, fields) {
            if (err) throw err;

            if(rows.length > 0){
                con.release();   
                res.send('201');
            }else{
                con.query('INSERT INTO city SET ?', [city], function(err, result) {
                    if (err) throw err;
                    con.release();   
                    res.send('200');
                });
            }        
        });
    });
}

exports.userList = function(req,res){

    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('SELECT name,region,role,status,email from user', function(err, rows, fields) {
            if (err) throw err;

            if(rows.length > 0){
                con.release();
                res.send({data:rows})
            }
        });
    });

}

exports.roles = function(req,res){
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('SELECT *  from roles',function(err, rows, fields) {
            if (err) throw err;                                
            con.release();
            res.send(rows);
        });
    });
}

exports.updateUser = function(req,res){
    var userdata = req.body;
    
    var email = userdata.email;

    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('UPDATE user set ? WHERE email = ?',[userdata,email], function(err, rows, fields) {
            con.release();
            res.send({message:"Updated Successfully"});
        });        
    });
}

exports.savePosting = function(req,res){
    
    var postingdetails = req.body;
    postingdetails.created_by = req.cookies.email;
    postingdetails.updated_time = moment();

    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();

        var query = con.query('INSERT INTO posting SET ?', postingdetails, function(err, result) {
                
            if (err) throw err;

            con.release();
            postingdetails.id = result.insertId;           
            res.send({message:"posting saved"});
            
        });

    });
}

exports.getposting = function(req,res){
    var company;    

    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();
        con.query('SELECT *  from posting where id = ?', [req.params.id],function(err, rows, fields) {
            if (err) throw err;            

            if(rows.length > 0){
                
                con.query('SELECT name  from company where id = ?', [rows[0].company_id],function(err, company, fields) {
                    if (err) throw err;                    
                    company = company[0].name;
                    rows[0].company_id = company;
                });                
                var data = rows[0];                
                data.stats=[];

                con.query('SELECT status , count(*) as cnt FROM posting WHERE id = ? GROUP BY STATUS ',[req.params.id],function(err, rows, fields) {
                    if (err) throw err;                                

                    if(rows.length > 0){
                        data.stats = rows;
                    }

                    con.release();                                
                    res.send(data);

                });                     
               
            }else{
                con.release();
                res.send({});                
            }
        });         

    }); 
}

exports.updatePosting = function(req,res){

    var postingdetails = req.body;
    var id = postingdetails.id;
    postingdetails.updated_time = new Date();
    
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('UPDATE posting set ? WHERE id = ?',[postingdetails,id], function(err, rows, fields) {
            if (err) throw err;
                                         
            con.release();           
            res.send({"status":200,"message":"updated Successfully"});
        });
    });

}


exports.updatepostingStatus = function(req,res){
   
    pool.getConnection(function(err,con){
        if(err){
            console.log("Error connection to the db.");
        }
        con.connect();
        con.query('UPDATE posting set ? WHERE id = ?',[req.body.data,req.body.id], function(err, rows, fields) {
            con.query('insert into posting_h set ? ',req.body.history, function(err,result) {                
                
                req.body.comment.posting_h_id = result.insertId;
                
                if(req.body.data.status == "C06")
                  req.body.data.status = "C01";
                con.query('UPDATE candidate set ? WHERE id = ?',[req.body.data,req.body.candidate_id], function(err, rows, fields) {
                                       
                    req.body.comment.created_by = req.cookies.email;
                    con.query('insert into comments set ? ',req.body.comment, function(err,result) {
                      //console.log("inserted" + JSON.stringify(result));
                      con.release();
                      res.send({message:"Updated Successfully"});
                    });
                    
                });                            

            });
        });                            
    });  

}

exports.postingbycid = function(req, res) {

    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();
        con.query('SELECT posting.id,posting.status,posting.type,posting.title from posting,candidate where posting.candidate_id = candidate.id and posting.candidate_id = ?', [req.params.candidate_id],function(err, rows, fields) {
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

exports.poshistorybyid = function(req, res) {
    
    pool.getConnection(function(err,con){

        if(err){
            console.log("Error connection to the db.");
        }

        con.connect();        
        con.query('SELECT posting_h.id,posting_h.posting_id,posting_h.prevstatus,posting_h.curstatus,posting_h.updated_time,comments.posting_note from posting_h,comments where posting_h.id = comments.posting_h_id and posting_id = ?', [req.params.posting_id],function(err, rows, fields) {
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
    var searchtext=req.body.searchtext;
    var region = req.cookies.region;
    var ctr = "*:*";

    if(region == "1"){
        ctr = "United States";
    }else if(region == "2"){
        ctr = "India";
    }

    updateSearchLog(searchtext+"&schema="+req.body.schema,req.cookies.email);
    if(req.body.schema == 'c'){
        console.log("candidate schema");
        searchtext = searchtext +' AND (cstatus:"C01" OR cstatus:"C02" OR cstatus:"C03" OR cstatus:"C04") AND ccreated_by:'+req.cookies.email + ' AND ccountry:'+ctr;
        var client = solr.createClient(solrinfo.ip,solrinfo.portnum,solrinfo.candidate_core,'','','');
    }
    else if (req.body.schema == 'v'){
        console.log("vacancy schema");
        searchtext = searchtext +' & vstatus:"OPEN"'+ ' AND vcountry:'+ctr;
        var client = solr.createClient(solrinfo.ip,solrinfo.portnum,solrinfo.vacancy_core,'','','');
    }
    
/*    var query2 = client.createQuery()
                       .q(searchtext)
                       .start(0)
                       .rows(1000);*/
    
    client.gethl('select',searchtext,function(err,obj){
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
       "literal.calt_email":data.alt_email,
       "literal.calt_phone":data.alt_phone,
       "literal.cstatus":data.status,
       "literal.cexp":data.exp,
       "literal.cphone":data.phone,
       "literal.cskills":data.skills,
       "literal.ccity":data.city,
       "literal.ccountry":data.country,
       "literal.ccompany_id":data.company_id,
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

exports.solrupdatecandidate = function(data){

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

     client.add(data,function(err,obj){
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

exports.solrupdatevacancy = function(data){

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

     client.add(data,function(err,obj){
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