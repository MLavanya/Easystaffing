mesgs = [];

var companyList,statusList,cityList;

var countries = ["India", "United States"];

var Employee_status = ['YES','NO'];          

var empStatus = ['Active', 'In-Active'];

var addmessage = function(type,msg){

	mesgs.push({
		type:type,
		msg:msg
	});

}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
  }
var admin = getCookie('isAdmin');

setInterval(function() {

	var cl = "alert ";

	for(var i=0 ; i < mesgs.length ; i++){

		if(mesgs[i].type == "success"){
			cl = cl + "alert-success";
		}else if(mesgs[i].type == "info"){
			cl = cl + "alert-info";
		}else if(mesgs[i].type == "warning"){
			cl = cl + "alert-warning";
		}else if(mesgs[i].type == "danger"){
			cl = cl + "alert-danger";
		}

		$("#alertMsg").prepend("<div class='alert alert-dismissable"+cl+"'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>"+mesgs[i].msg+"</div>")

		mesgs.splice(i, 1);		

	}

}, 1000);  


setInterval(function() {

	$('#gmesg div:first-child').remove();

}, 5000);  

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(window.location.href);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function appliedforv(cid,vid,callback){
	$.post('/appliedforv',{company_id:cid,vacancy_id:vid},callback);
}

function shortlist(cid,url,elem){

	bootbox.confirm({
		message: "Are you sure you want to shortlist this candidate for this vacancy ?",
		callback: function(result) {
			if(result){
				$.post('/applyvacancy',{company_id:0,candidate_id:cid,vacancy_id:getParameterByName('v'),status:'C02'},function(data){
					$(elem).attr('disabled','true');
				});
			}
		},
		className: "bootbox-sm"
	});

}

function applyforv(vid,url,elem){

	bootbox.confirm({
		message: "Are you sure you want to post this candidate for this vacancy ?",
		callback: function(result) {
			if(result){
				$.post('/applyvacancy',{company_id:0,candidate_id:getParameterByName('c'),vacancy_id:vid,status:'C02'},function(data){
					$(elem).attr('disabled','true');
				});
			}
		},
		className: "bootbox-sm"
	});

}

/********************************
 * Helpers
 **********************************/

Ember.Handlebars.helper('format-skill', function(skills) {
	if(!skills){
		return "";
	}	
	var res = skills.split(",");
	var ret = "";
	for(var i=0;i<res.length;i++){
		ret = ret+'<label class="label label-info">'+res[i]+'</label>&nbsp;';
	}
	return new Ember.Handlebars.SafeString(ret);
});

Ember.Handlebars.helper('format-matched', function(skills) {
	if(!skills){
		return "";
	}
	var res = skills.split(",");
	var ret = "";
	for(var i=0;i<res.length;i++){
		ret = ret+'<label class="label label-success">'+res[i]+'</label>&nbsp;';
	}
	return new Ember.Handlebars.SafeString(ret);
});

Ember.Handlebars.helper('format-vacancy', function(id) {
	return "#/vacancy/"+id;
});

Ember.Handlebars.helper('format-date', function(date) {
	return moment(date).fromNow();
});

Ember.Handlebars.helper('format-cv', function(value) {
  return new Ember.Handlebars.SafeString(value);
});


Ember.Handlebars.helper('format-vstatus', function(value) {
  var res="";
  if(value == "OPEN")
  	res = res + '<label class="label label-tag label-success">'+value+'</label>';
  else
  	res = res + '<label class="label label-tag label-warning">'+value+'</label>';

  return new Ember.Handlebars.SafeString(res);
});

Ember.Handlebars.helper('format-cstatus', function(value) {
  var res="";

switch (value) {
    case "C01":
  		res = res + '<label class="label label-tag label-info">AVAILABLE</label>';
        break;
    case "C02":
        res = res + '<label class="label label-tag label-warning">IN-REVIEW</label>';
        break;
    case "C03":
        res = res + '<label class="label label-tag label-warning">SHORTLISTED</label>';
        break;        
    case "C04":
        res = res + '<label class="label label-tag label-warning">IN-PROGRESS</label>';
        break;   
    case "C05":
        res = res + '<label class="label label-tag label-success">ACCEPTED</label>';
        break;
    case "C06":
        res = res + '<label class="label label-tag label-danger">REJECTED</label>';
        break;   
    case "C07":
        res = res + '<label class="label label-tag label-danger">INVALID</label>';
        break;  
    case "YES":
    	res = res + '<i class="fa fa-star" style="color:#DAA520"></i>'
}

  return new Ember.Handlebars.SafeString(res);
});

Ember.Handlebars.helper('format-results', function(content) {

	var schema = window.App.__container__.lookup('controller:searchResult').get('content').schema;
	var res = "";

	var rows = content.response.docs;
	var hls = content.highlighting;

	$.each(rows,function(i,data){

		if(schema == 'v'){

			var sl = '<button class="btn btn-primary btn-outline btn-xs pull-right" onclick="applyforv('+data.id+',window.location.href,this);"><i class="fa fa-check"></i> Apply</button>';

			res=res+'<li>';

			if(getParameterByName('c')){
				res=res+sl;
			}

			var hltitle = hls[data.id].vtitle?hls[data.id].vtitle:data.vtitle;

			res=res+'<a href="#/vacancy/'+data.id+'" class="search-title">'+data.vname+'</a>'
				+'<p>'+hltitle+'</p>'
				+'<div class="search-content">'
				+data.vexp_min+' to '+data.vexp_max+' years with '+data.vskills+' skills located in '+data.vcity+' .'
				+'</div>'
				+'<div class="search-tags">'
				+'<span class="search-tags-text">Skills :</span>';

			var r = data.vskills.split(",");
			for(var i=0;i<r.length;i++){
				res = res+'<label class="label label-info">'+r[i]+'</label>&nbsp;';
			}

			res = res + '</div>'+'<div class="search-tags">'
				  + '<span class="search-tags-text">Matched :</span>';	  

			if(hls[data.id].vskills){
				var r = $("<div></div>").append(hls[data.id].vskills[0]).find("mark");
				for(var i=0;i<r.length;i++){
					res = res+'<label class="label label-success">'+$(r[i]).text()+'</label>&nbsp;';
				}			  
			}

			res = res + '</div> </li>';

		}else if(schema == 'c'){

			var sl = '<button class="btn btn-primary btn-outline pull-right btn-flat btn-xs " onclick="shortlist('+data.id+',window.location.href,this);"><i class="fa fa-check"></i> Shortlist</button>';

			res=res+'<li>';

			if(getParameterByName('v')){
				res=res+sl;
			}

			var hlcontent = hls[data.id].content?hls[data.id].content:'';
			var hltitle = hls[data.id].ctitle?hls[data.id].ctitle:data.ctitle;

			res = res +'<a href="#/candidate/'+data.id+'" class="search-title">'+data.cname+'</a>'
				+'<p>'+hltitle+'</p>'
				+'<div class="search-content">'
				+data.cexp+' years with '+data.cskills+' skills located in '+data.ccity+' .'
				+hlcontent + " score: " + data.score
				+'</div>'
				+'<div class="search-tags">'
				+'<span class="search-tags-text">Skills :</span>';

			var r = data.cskills.split(",");
			for(var i=0;i<r.length;i++){
				res = res+'<label class="label label-info">'+r[i]+'</label>&nbsp;';
			}

			res = res + '</div>'+'<div class="search-tags">'
				  + '<span class="search-tags-text">Matched :</span>';

			if(hls[data.id].cskills){
				var r = $("<div></div>").append(hls[data.id].cskills[0]).find("mark");
				for(var i=0;i<r.length;i++){
					res = res+'<label class="label label-success">'+$(r[i]).text()+'</label>&nbsp;';
				}			  
			}
			res = res + '</div> </li>';

		}
	});

  return new Ember.Handlebars.SafeString(res);
});

Ember.Handlebars.helper('format-cstats', function(data,status) {

	var res="0";

	$.each(data,function(i,row){
		if(data[i].status == status){
			res = data[i].cnt;
			return false;
		}

	});

	return res;
});

Ember.Handlebars.helper('format-country', function(value) {
  var res="";
    
  if(value == 1){
  	res ='United States';
  }else if(value == 2){
  	res = 'India';
  }else {
  	res = 'India & United States';
  }

  return new Ember.Handlebars.SafeString(res);
});

Ember.Handlebars.helper('format-emproles', function(value) {
  var res="";

  // alert(roleenum["manager"]);

  var roles = value.split(",");

  $.each(roles,function(i,role){

	switch (role) {
	    case "1":
	  		res = res+' Manager';
	        break;
	    case "2":
	        res = res+' Recruiter';
	        break;
	    case "3":
	        res = res+' Sales';
	        break;        
	    case "4":
	        res = res+' Admin';
	        break;   
	    case "5":
	        res = res+' Marketing';
	        break;
        case "true":
	    	res = res + '<li><a href="/home.html#/configure/"><i class="dropdown-icon fa fa-cog"></i>&nbsp;&nbsp;Configure</a></li>'
	    	break;
	    case "false":
	    	res = res + '<li class="disabled"><a href="#"><i class="dropdown-icon fa fa-cog"></i>&nbsp;&nbsp;Configure</a></li>'
	    	break;
		case "e01":
	    	res = res + '<label class="label label-tag label-success">Active</label>'
	    	break;
	    case "e02":
	    	res = res + '<label class="label label-tag label-warning">In-Active</label>'; 
	}

  });



  return new Ember.Handlebars.SafeString(res);
});

Ember.Handlebars.helper('format-posting', function(value,id) {
  var res="";
  
	switch (value) {
	    case "YES":
	  		res = res+' <div class="pull-right col-xs-12 col-sm-auto">\
	  		<a href="/home.html#/addposting/'+id+'"><button class="btn btn-outline btn-primary btn-labeled">\
	  		<span class="btn-label icon fa fa-plus"></span>&nbsp;&nbsp;Posting &nbsp;&nbsp;</button>\
	  		</a></div>';	          	 
	}

  return new Ember.Handlebars.SafeString(res);
});


/********************************
 * Controllers m, mm m mm m  nnb *
 ********************************/

App.ApplicationController = Ember.Controller.extend({
	name: "",
	isAdmin:admin,

	init: function(){
		var that = this;
		$.get('/me',function(data){
			that.set('name',data[0].name);
		});				
	},

	actions:{				
		signout:function(){			
			document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 GMT"
			document.cookie = "region=; expires=Thu, 01 Jan 1970 00:00:00 GMT"
			document.cookie = "isAdmin=; expires=Thu, 01 Jan 1970 00:00:00 GMT"
			document.cookie = "rolescnt=; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    		window.location='login.html';
		},	
	}
});

App.AddcandidateController = Ember.Controller.extend({

	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),
	country : countries,	
	employee : Employee_status,

	init: function(){		
		var statusList = [];
		var cityList = [];
		var that = this;
		$.ajax ({
            type: "GET", 
            url:'/statusList',            
            success: function(data) {                 
                /*for(var i=0;i<data.length;i++){*/
                	if(data[0].id.indexOf("C0") > -1){
	                    statusList.push({
	                    	id:data[0].id,
	                    	name:data[0].name
	                    });
	                }
                /*}*/                                
                that.set('statuses',statusList);                
            },
            error:function(data){
                bootbox.alert(data.statusText);
            }                        
        }); 
        $.ajax ({
            type: "GET", 
            url:'/cityList',            
            success: function(data) {              	
                for(var i=0;i<data.length;i++){                	
                    cityList.push(data[i].city);	              
                }                                
                that.set('city',cityList);                
            },
            error:function(data){
                bootbox.alert(data.statusText);
            }                        
        }); 
	},
	statuses : statusList, 
	city : cityList,               
	actions :{
		addCity: function(){
			var that =  this;
			bootbox.prompt({
				title: "Enter the City name",
				callback: function(result) {					
					if(result){
						$.post('/updateCity',{'city':result},function(data){
							if(data == "200"){
								var cityList = [];
				                $.get('/cityList',function(data){
				                	console.log(data);
									for(var i=0;i<data.length;i++){
					                    cityList.push(data[i].city);
					                }   
					                that.set('city',cityList);
								});	

							}else if(data =="201"){
								bootbox.alert("Already exists");
							}
						});
					}					
				},
				className: "bootbox-sm"
			});
		},
		savecandidate: function(){			
			var that = this;
			var v = true;
			var fileName = JSON.parse($(".uploadedfile").text());
			var cv = fileName.filepath;
			
			var phonereg = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;		
			var emailreg = /^([a-zA-Z0-9_\.\-])+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
			var expreg = /^[0-9]{0,2}$/;

			if(($("#name").val() == "")){
				addmessage("danger","Enter the Name ");
				v=false;
			}			
			if(($("#title").val() == "")){
				addmessage("danger","Enter the title ");
				v=false;
			}
			if(($("#experience").val() == "")||(!expreg.test($('#experience').val()))){
				addmessage("danger","Check the Experience ");
				v=false;
			}
			if(($("#email").val() == "")||(!emailreg.test($('#email').val()))){
				addmessage("danger","Enter a valid Email");				
				v=false;
			}
			if(($("#phone").val() == "")||(!phonereg.test($('#phone').val()))){
				addmessage("danger","Enter valid Mobile number");
				v=false;
			}			
			if($("#country").val() == ""){
				addmessage("danger", "country has to be specified");
				v=false;
			}
			if($("#city").val() == ""){
				addmessage("danger", "city has to be specified");
				v=false;
			}


			var textarea = $('#tags:last');
			var textext = textarea.textext()[0];

			if(textext.hiddenInput().val().length < 3){
				addmessage("danger","Skills has to be specified.");
				v=false;
			}

			var text = textext.hiddenInput().val();
			text = text.replace("[","");
			text = text.replace("]","");
			text = text.replace(/['"]+/g, '');

			if(v){
	   			jQuery("#addEmpSbmt").attr('disabled','disabled').html("updated"); 
	   			$.ajax({
		   		    type: 'POST',
		   		    url: "/saveCandidate",
		   		    dataType:"json",
		   		    data: {
		   					"name"				: this.get("firstname"),
		   					"title"				: this.get("title"),
		   					"email"				: this.get("email"),
		   					"phone"				: this.get("phone"),
		   					"alt_phone"			: this.get("alt_phone"),
		   					"alt_email"			: this.get("alt_email"),
		   					"exp"				: this.get("experience"),
		   					"country"			: jQuery('#country').val(),
		   					"city"				: jQuery('#city').val(),
		   					"cvpath"			: cv,
		   					"company_id"		: jQuery("#company").val(),
		   					"status"			: jQuery("#status").val(),
		   					"skills"			: text,
		   					"comments"			: this.get("comments"),
		   					"active"		   	:jQuery('#employee').val()		
		      		    },
		   		    success: function(data){
		   		    	bootbox.alert(data.message);
		   		    	jQuery(".form-control").val("");
	   					setTimeout(function(){that.transitionToRoute('dashboard');},500);
		   		    },
		   		    error: function(data){
		   		    	bootbox.alert(data.message);
		   		    }
	   		     });
          	}

		}
	}
});

App.AddvacancyController = Ember.Controller.extend({

	init: function(){
		var companyList =[];
		var cityList = [];
		var that = this;
		$.ajax ({
            type: "GET", 
            url:'/companyList',            
            success: function(data) {                 
                for(var i=0;i<data.length;i++){
                    companyList.push({
                    	id: data[i].id,
                    	name:data[i].name});
                }                                  
                that.set('companies',companyList);                
            },
            error:function(data){
                bootbox.alert(data.statusText);
            }                        
        });
        $.ajax ({
            type: "GET", 
            url:'/cityList',            
            success: function(data) {              	
                for(var i=0;i<data.length;i++){                	
                    cityList.push(data[i].city);	              
                }                                
                that.set('city',cityList);                
            },
            error:function(data){
                bootbox.alert(data.statusText);
            }                        
        }); 
	},
	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),
	companies: companyList,
	country : countries,
	city	: cityList,
	statuses: ['OPEN','CLOSED'],
	actions :{
		addCompany: function(){
			var that =  this;
			bootbox.prompt({
				title: "Enter the company name",
				callback: function(result) {
					if(result){
						$.post('/updateCompany',{'name':result},function(data){
							if(data == "200"){
								var companies = [];
				                $.get('/companyList',function(data){		               		
									for(var i=0;i<data.length;i++){
					                    companies.push({
					                    	id: data[i].id,
					                    	name:data[i].name});
					                }   
					                that.set('companies',companies);
								});	

							}else if(data =="201"){
								bootbox.alert("Already exists");
							}
						});
					}					
				},
				className: "bootbox-sm"
			});
		},
		addCity: function(){
			var that =  this;
			bootbox.prompt({
				title: "Enter the City name",
				callback: function(result) {					
					if(result){
						$.post('/updateCity',{'city':result},function(data){
							if(data == "200"){
								var cityList = [];
				                $.get('/cityList',function(data){				                	
									for(var i=0;i<data.length;i++){
					                    cityList.push(data[i].city);
					                }   
					                that.set('city',cityList);
								});	

							}else if(data =="201"){
								bootbox.alert("Already exists");
							}
						});
					}					
				},
				className: "bootbox-sm"
			});
		},

		savevacancy: function(){

			var that = this;
			var v = true;

			if($("#min_experience").val() == ""){
				addmessage("danger","Experience has to be specified");
				v=false;
			}
			if($("#max_experience").val() == ""){
				addmessage("danger","Experience has to be specified");
				v=false;
			}
			if($("#jobTitle").val() == ""){
				addmessage("danger","Email has to be specified");
				v=false;
			}
			if($("#vacancy").val() == ""){
				addmessage("danger", "Phone number has to be specified");
				v=false;
			}
			if($("#country").val() == ""){
				addmessage("danger", "country has to be specified");
				v=false;
			}
			if($("#city").val() == ""){
				addmessage("danger", "city has to be specified");
				v=false;
			}
			if($("#status").val() == ""){
				addmessage("danger", "status has to be specified");
				v=false;
			}

			var textarea = $('#tags:last');
			var textext = textarea.textext()[0];

			if(textext.hiddenInput().val().length < 3){
				addmessage("danger","Skills has to be specified.");
				v=false;
			}		

			var text = textext.hiddenInput().val();
			text = text.replace("[","");
			text = text.replace("]","");
			text = text.replace(/['"]+/g, '');

			if(v){
	   			jQuery("#addEmpSbmt").attr('disabled','disabled').html("updated"); 
	   			$.ajax({
		   		    type: 'POST',
		   		    url: "/saveVacancies",
		   		    dataType:"json",
		   		    data: {
		   					"title"			: this.get("jobTitle"),
		   					"name"			: this.get("vacancy"),
		   					"country"		: jQuery('#country').val(),
		   					"city"			: jQuery('#city').val(),
		   					"exp_min"		: this.get("min_experience"),
		   					"exp_max"		: this.get("max_experience"),		   					
		   					"company_id"	: jQuery("#company").val(),	
		   					"status"		: jQuery("#status").val(),	   					
		   					"skills"		: text,
		   					"description"	: this.get("description"),
		      		    },
		   		    success: function(data){		   		    	
		   		    	bootbox.alert(data.message);
		   		    	jQuery(".form-control").val("");
	   					setTimeout(function(){that.transitionToRoute('dashboard');},500);
		   		    },
		   		    error: function(data){
		   		    	bootbox.alert("error saving the data");
		   		    } 
	   		     });
          	}

		}
	}
});

App.DashboardController = Ember.ObjectController.extend({
	actions : {		
		search : function (){
			searchtype = $("input:radio[name='searchtype']:checked").val();
			schema = "v";
			if(searchtype == 'candidate')
				schema = "c";
			else if(searchtype == 'company')
				schema = "co"
			else if(searchtype == 'vacancy')
				schema = "v"
			else
				return;

			var that = this;
			that.transitionToRoute('searchResult',search_text+"&schema="+schema);

		}
	}
});

App.VacancyController = Ember.ObjectController.extend({	

	v_city	: cityList,
	actions:{
		loadCity: function(){
			var cityList = [];
			var that = this;		
	        $.ajax ({
	            type: "GET", 
	            url:'/cityList',            
	            success: function(data) {              	
	                for(var i=0;i<data.length;i++){                	
	                    cityList.push(data[i].city);	              
	                }                                
	                that.set('v_city',cityList);                
	            },
	            error:function(data){
	                bootbox.alert(data.statusText);
	            }                        
	        }); 
		},
		addCity: function(){
			var that =  this;
			bootbox.prompt({
				title: "Enter the City name",
				callback: function(result) {					
					if(result){
						$.post('/updateCity',{'city':result},function(data){
							if(data == "200"){
								var cityList = [];
				                $.get('/cityList',function(data){				                	
									for(var i=0;i<data.length;i++){
					                    cityList.push(data[i].city);
					                }   
					                that.set('v_city',cityList);
								});	

							}else if(data =="201"){
								bootbox.alert("Already exists");
							}
						});
					}					
				},
				className: "bootbox-sm"
			});
		},
		searchbyv: function(){
			var m = this.get('content');
			var key = m.city+"+"+m.country+"+"+m.skills;
			this.transitionToRoute('searchResult',key+'&schema=c'+'&v='+m.id);
		},
		updatevacancystatus: function(){

			var m = this.get('content');
			var that = this;
			$.ajax ({
	            type: "GET", 
	            url:'/statusList',            
	            success: function(data) {                 
	            	var sel = "<select class='form-control' id='newstatus'>";

	                for(var i=0;i<data.length;i++){
	                	if(data[i].id.indexOf("V0") > -1){
	                		sel = sel + "<option value='"+data[i].name+"'>"+data[i].name+"</option>";
		                }
	                }

					bootbox.confirm({
						message: "Select the status : "+sel + "</select>",
						callback: function(result) {
							if(result){
								$.post('/updatevacancystatus',{
									id: m.id,
									data:{
										status: $('#newstatus').val(),
									}
								},function(res){
									return $.get('/getvacancy/'+m.id,function(data){
										if(data.status == "OPEN")
											data.isOpen = true;
										else
											data.isOpen = false;
										that.set('content',data);
									});
								});
							}
						},
						className: "bootbox-sm"
					});

	            },
	            error:function(data){
	                bootbox.alert(data.statusText);
	            }                        
	        }); 

		},
		UpdateVacancy: function(){

			var that = this;
			var vacancyId = $("#vacancyId").val();
			var expreg = /^[0-9]{0,2}$/;
			var v = true;
					
			if(($("#exp_min").val() == "")||(!expreg.test($('#exp_min').val()))){
				bootbox.alert("Check the Min Experience ");
				v = false;
			}
			if(($("#exp_max").val() == "")||(!expreg.test($('#exp_max').val()))){
				bootbox.alert("Check the Max Experience ");
				v = false;
			}
			if(v){
				$.ajax({
		   		    type: 'POST',
		   		    url: "/UpdateVacancy",
		   		    dataType:"json",
		   		    data: {	   					
		   					"title"				: $("#title").val(),	   					
		   					"name"				: $("#vacancyName").val(),
		   					"description"		: $("#description").val(),
		   					"exp_min"			: $("#exp_min").val(),
		   					"exp_max"			: $("#exp_max").val(),	
		   					"city"				: $('#v_city').val(),
		   					"id"				: vacancyId	
		      		    },
		   		    success: function(data){
		   		    	bootbox.alert(data.statusText);
		   		    	return $.get('/getvacancy/'+vacancyId,function(data){
							if(data.status == "OPEN")
								data.isOpen = true;
							else
								data.isOpen = false;							
							that.set('content',data);
						});
		   		    },
		   		    error: function(data){
		   		    	bootbox.alert(data.statusText);
		   		    }
	   		    });
			}		
		}
	}

});

App.CandidateController = Ember.ObjectController.extend({
	
	country : countries,
	city	: cityList,
	actions:{
		loadCity: function(){
			var cityList = [];
			var that = this;		
	        $.ajax ({
	            type: "GET", 
	            url:'/cityList',            
	            success: function(data) {              	
	                for(var i=0;i<data.length;i++){                	
	                    cityList.push(data[i].city);	              
	                }                                
	                that.set('city',cityList);                
	            },
	            error:function(data){
	                bootbox.alert(data.statusText);
	            }                        
	        }); 
		},
		addCity: function(){
			var that =  this;
			bootbox.prompt({
				title: "Enter the City name",
				callback: function(result) {					
					if(result){
						$.post('/updateCity',{'city':result},function(data){
							if(data == "200"){
								var cityList = [];
				                $.get('/cityList',function(data){
				                	console.log(data);
									for(var i=0;i<data.length;i++){
					                    cityList.push(data[i].city);
					                }   
					                that.set('city',cityList);
								});	

							}else if(data =="201"){
								bootbox.alert("Already exists");
							}
						});
					}					
				},
				className: "bootbox-sm"
			});
		},
		searchbyc: function(){
			var m = this.get('content').details;
			var key = m.city+"+"+m.country+"+"+m.skills;
			this.transitionToRoute('searchResult',key+'&schema=v'+'&c='+m.id);
		},
		showHistory: function(m){
			var that = this;
			$.get('/apphistorybyid/'+m.id,function(result){
				that.set('content.apphistory',result);
			});
		},	
		showPosHistory: function(m){
			var that = this;			
			$.get('/poshistorybyid/'+m.id,function(result){
				console.log(JSON.stringify(result));
				that.set('content.postinghistory',result);
			});
		},		
		updateapplication: function(m){

			var that = this;
			$.ajax ({
	            type: "GET", 
	            url:'/statusList',            
	            success: function(data) {                 
	            	var sel = "<select class='form-control' id='newstatus'>";

	                for(var i=0;i<data.length;i++){
	                	if(data[i].id.indexOf("C0") > -1){
	                		sel = sel + "<option value='"+data[i].id+"'>"+data[i].name+"</option>";
		                }
	                }

					bootbox.confirm({
						message: "Select the status : "+sel + "</select><br/>Comments: <textarea rows=2 cols=30 class='form-control' id='acomment' />",
						callback: function(result) {
							if(result){
								$.post('/updateappstatus',{
									id: m.id,
									candidate_id: that.get('content').details.id,
									data:{
										status: $('#newstatus').val(),
									},
									history:{
										application_id: m.id,
										prevstatus: m.status,
										curstatus:  $('#newstatus').val()
									},
									comment: {
										comment: $('#acomment').val()?$('#acomment').val():"None."
									}
								},function(data){
									$.get('/applicationbycid/'+that.get('content').details.id,function(res){
										that.set('content.applications',res);	
									});
								});
							}
						},
						className: "bootbox-sm"
					});

	            },
	            error:function(data){
	                bootbox.alert(data.statusText);
	            }                        
	        }); 

		},

		UpdatePostingApp: function(m){

			var that = this;
			$.ajax ({
	            type: "GET", 
	            url:'/statusList',            
	            success: function(data) {                 
	            	var sel = "<select class='form-control' id='newstatus_p'>";

	                for(var i=0;i<data.length;i++){
	                	if(data[i].id.indexOf("C0") > -1){
	                		sel = sel + "<option value='"+data[i].id+"'>"+data[i].name+"</option>";
		                }
	                }

					bootbox.confirm({
						message: "Select the status : "+sel + "</select><br/>Comments: <textarea rows=2 cols=30 class='form-control' id='pcomment' />",
						callback: function(result) {							
							if(result){
								$.post('/updatepostingStatus',{
									id: m.id,
									candidate_id: that.get('content').details.id,
									data:{
										status: $('#newstatus_p').val(),
									},
									history:{
										posting_id: m.id,
										prevstatus: m.status,
										curstatus:  $('#newstatus_p').val()
									},
									comment: {
										posting_note: $('#pcomment').val()?$('#pcomment').val():"None."
									}
								},function(data){
									$.get('/postingbycid/'+that.get('content').details.id,function(res){										
										that.set('content.posting',res);	
									});
								});
							}
						},
						className: "bootbox-sm"
					});

	            },
	            error:function(data){
	                bootbox.alert(data.statusText);
	            }                        
	        }); 

		},		
		UpdateCandidate:function(){
			
			var that = this;			
			var candidateId = $("#candidateId").val();
			
			var phonereg = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;		
			var emailreg = /^([a-zA-Z0-9_\.\-])+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
			var expreg = /^[0-9]{0,2}$/;
			var v = true;
					
			if(($("#experience").val() == "")||(!expreg.test($('#experience').val()))){
				bootbox.alert("Check the Experience ");
				v = false;
			}
			if(($("#email").val() == "")||(!emailreg.test($('#email').val()))){
				bootbox.alert("Enter a valid Email");				
				v = false;
			}
			if(($("#phone").val() == "")||(!phonereg.test($('#phone').val()))){
				bootbox.alert("Enter valid Mobile number");
				v = false;
			}
			
			if(v){
				$.ajax({
		   		    type: 'POST',
		   		    url: "/UpdateCandidate",
		   		    dataType:"json",
		   		    data: {	   					
		   					"title"				: $("#title").val(),	   					
		   					"phone"				: $("#phone").val(),
		   					"alt_phone"			: $("#alt_phone").val(),
		   					"email"				: $("#email").val(),
		   					"alt_email"			: $("#alt_email").val(),
		   					"exp"				: $("#experience").val(),		   					
		   					"city"				: $('#city').val(),	   				
		   					"company_id"		: $("#company").val(),
		   					"comments"			: $("#comments").val(),	   				
		   					"id"				: candidateId	
		      		    },
		   		    success: function(data){
		   		    	bootbox.alert(data.statusText);
		   		    	return $.get('/getcandidate/'+candidateId,function(data){
							if(data.applications){
								$.each(data.applications,function(i,row){
									if(data.applications[i].vacancy_status == "OPEN")
										data.applications[i].isOpen = true;
									else
										data.applications[i].isOpen = false;
								});
							}
							that.set('content',data);
						});
		   		    },
		   		    error: function(data){
		   		    	bootbox.alert(data.statusText);
		   		    }
	   		    });
			}   		
		},
		UpdateCandidateResume : function(){

			var that = this;
			var fileName = JSON.parse($(".uploadedfile").text());
			var cv = fileName.filepath;			
			var candidateId = $("#candidateId").val();			
			$.ajax({
	   		    type: 'POST',
	   		    url: "/UpdateCandidateResume",
	   		    dataType:"json",
	   		    data: {
	   		    		updatedata: {	   						   					
		   					"cvpath"			: cv,
		   					"id"				: candidateId,
	   					},
	   					"content"			: that.get('content').details
	      		    },
	   		    success: function(data){
	   		    	bootbox.alert(data.statusText);
	   		    	$('#uploadcv').show();
	   		    	$('.progress-bar').parent().prev().remove();
	   		    	$('.uploadedfile').text('');
					document.getElementById("#progress").remove();
	   		    	return $.get('/getcandidate/'+candidateId,function(data){
						if(data.applications){
							$.each(data.applications,function(i,row){
								if(data.applications[i].vacancy_status == "OPEN")
									data.applications[i].isOpen = true;
								else
									data.applications[i].isOpen = false;
							});
						}
						that.set('content',data);
					});
	   		    },
	   		    error: function(data){
	   		    	bootbox.alert(data.statusText);
	   		    }
   		    });	
		},
		updatecv : function(){
			$('#uploadcv').show();
	    	$('.progress-bar').parent().prev().remove();
	    	$('.uploadedfile').text('');
			document.getElementById("#progress").remove();
		}
	}

});

App.SearchResultController = Ember.ObjectController.extend({

	actions : {		
		search : function (){

			searchtype = $("input:radio[name='searchtype']:checked").val();
			schema = "v";
			if(searchtype == 'candidate')
				schema = "c";
			else if(searchtype == 'company')
				schema = "co"
			else if(searchtype == 'vacancy')
				schema = "v"
			else
				return;

			var that = this;
			that.transitionToRoute('searchResult',search_text+"&schema="+schema);
 
		}
	}


});

App.ProfileController = Ember.ObjectController.extend({
	actions:{
		updateProfile : function(){			
			var that = this;
			var description = $('#description').val();
			var mobile_number = $('#mobile_number').val();	
			var phonereg = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
			if(((description)||(mobile_number))&&(phonereg.test(mobile_number))){
				$.ajax ({
	                type: "POST", 
	                url:'/updateProfile',
	                dataType:'JSON',
	                data:{'description':description,'mobile_number':mobile_number},                   
	                success: function(data) {  
		                bootbox.alert(data.message);	                
		               	$.get('/getUserdata',function(data){		               		
							that.set('content',data);
						});									
	                },
	                error: function(data) {
	                    bootbox.alert(data.statusText);
	                }
	            });	  
			}	
			else{
				bootbox.alert('Enter the valid data');
			}			                   
		}
	}
});

App.AddpostingController = Ember.ObjectController.extend({
	init: function(){
		var companyList =[];
		var cityList = [];
		var statusList = [];
		var that = this;
		$.ajax ({
            type: "GET", 
            url:'/companyList',            
            success: function(data) {                 
                for(var i=0;i<data.length;i++){
                    companyList.push({
                    	id: data[i].id,
                    	name:data[i].name});
                }                                  
                that.set('companies_p',companyList);                
            },
            error:function(data){
                bootbox.alert(data.statusText);
            }                        
        });
        $.ajax ({
            type: "GET", 
            url:'/cityList',            
            success: function(data) {              	
                for(var i=0;i<data.length;i++){                	
                    cityList.push(data[i].city);	              
                }                                
                that.set('city',cityList);                
            },
            error:function(data){
                bootbox.alert(data.statusText);
            }                        
        });         	
		$.ajax ({
            type: "GET", 
            url:'/statusList',            
            success: function(data) {                                
            	if(data[0].id.indexOf("C0") > -1){
                    statusList.push({
                    	id:data[0].id,
                    	name:data[0].name
                    });
                }                                      
                that.set('statuses',statusList);                
            },
            error:function(data){
                bootbox.alert(data.statusText);
            }                        
        }); 
	},
	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),
	companies_p: companyList,
	country : countries,
	city	: cityList,
	types	: ['Client','Reference','Prospect'],
	employment_types : ['Contract','Full-time','Part-time'],
	statuses: statusList, 
	actions :{
		addCompany: function(){
			var that =  this;
			bootbox.prompt({
				title: "Enter the company name",
				callback: function(result) {
					if(result){
						$.post('/updateCompany',{'name':result},function(data){
							if(data == "200"){
								var companies = [];
				                $.get('/companyList',function(data){		               		
									for(var i=0;i<data.length;i++){
					                    companies.push({
					                    	id: data[i].id,
					                    	name:data[i].name});
					                }   
					                that.set('companies_p',companies);
								});	

							}else if(data =="201"){
								bootbox.alert("Already exists");
							}
						});
					}					
				},
				className: "bootbox-sm"
			});
		},
		addCity: function(){
			var that =  this;
			bootbox.prompt({
				title: "Enter the City name",
				callback: function(result) {					
					if(result){
						$.post('/updateCity',{'city':result},function(data){
							if(data == "200"){
								var cityList = [];
				                $.get('/cityList',function(data){				                	
									for(var i=0;i<data.length;i++){
					                    cityList.push(data[i].city);
					                }   
					                that.set('city',cityList);
								});	

							}else if(data =="201"){
								bootbox.alert("Already exists");
							}
						});
					}					
				},
				className: "bootbox-sm"
			});
		},

		saveposting: function(){			
			var that = this;
			var v = true;

			if($("#min_experience").val() == ""){
				addmessage("danger","Experience has to be specified");
				v=false;
			}
			if($("#max_experience").val() == ""){
				addmessage("danger","Experience has to be specified");
				v=false;
			}
			if($("#postingId").val() == ""){
				addmessage("danger","posting Id has to be specified");
				v=false;
			}
			if($("#posting").val() == ""){
				addmessage("danger", "posting title has to be specified");
				v=false;
			}
			if($("#country").val() == ""){
				addmessage("danger", "country has to be specified");
				v=false;
			}
			if($("#city").val() == ""){
				addmessage("danger", "city has to be specified");
				v=false;
			}
			if($("#status").val() == ""){
				addmessage("danger", "status has to be specified");
				v=false;
			}

			var textarea = $('#tags:last');
			var textext = textarea.textext()[0];

			if(textext.hiddenInput().val().length < 3){
				addmessage("danger","Skills has to be specified.");
				v=false;
			}		

			var text = textext.hiddenInput().val();
			text = text.replace("[","");
			text = text.replace("]","");
			text = text.replace(/['"]+/g, '');

			if(v){	
				
	   			$.ajax({
		   		    type: 'POST',
		   		    url: "/savePosting",
		   		    dataType:"json",
		   		    data: {
		   					"title"			: this.get("posting"),
		   					"candidate_id"	: this.get('candidate_id'),
		   					"description"	: this.get("pos_description"),
		   					"country"		: jQuery('#country').val(),
		   					"city"			: jQuery('#city').val(),
		   					"exp_min"		: this.get("min_experience"),
		   					"exp_max"		: this.get("max_experience"),		   					
		   					"company_id"	: jQuery("#companies_p").val(),	
		   					"type"			: jQuery("#types_p").val(),
		   					"employment_type": $("#etypes_p").val(),
		   					"status"		: jQuery("#status_p").val(),
		   					"comments"		: this.get("notes"),	   					
		   					"skills"		: text,		   					
		      		    },
		   		    success: function(data){		   		    	
		   		    	bootbox.alert(data.message);
		   		    	jQuery(".form-control").val("");
	   					setTimeout(function(){that.transitionToRoute('dashboard');},500);
		   		    },
		   		    error: function(data){
		   		    	bootbox.alert("error saving the data");
		   		    } 
	   		     });
          	}

		}
	}
});

App.PostingController = Ember.ObjectController.extend({
	types	: ['Client','Reference','Prospect'],
	employment_types : ["Contract","Full-time","Part-time"],
	actions:{
		loadCity: function(){
			var cityList = [];
			companyList = [];
			var that = this;		
	        $.ajax ({
	            type: "GET", 
	            url:'/cityList',            
	            success: function(data) {              	
	                for(var i=0;i<data.length;i++){                	
	                    cityList.push(data[i].city);	              
	                }                                
	                that.set('v_city',cityList); 

	                /* get the company List*/  

	                $.ajax ({
			            type: "GET", 
			            url:'/companyList',            
			            success: function(data) {                 
			                for(var i=0;i<data.length;i++){
			                    companyList.push({
			                    	id: data[i].id,
			                    	name:data[i].name});
			                }                                  
			                that.set('companies_p',companyList);                
			            },
			            error:function(data){
			                bootbox.alert(data.statusText);
			            }                        
			        }); 

	            },
	            error:function(data){
	                bootbox.alert(data.statusText);
	            }                        
	        }); 
		},
		addCompany: function(){
			var that =  this;
			bootbox.prompt({
				title: "Enter the company name",
				callback: function(result) {
					if(result){
						$.post('/updateCompany',{'name':result},function(data){
							if(data == "200"){
								var companies = [];
				                $.get('/companyList',function(data){		               		
									for(var i=0;i<data.length;i++){
					                    companies.push({
					                    	id: data[i].id,
					                    	name:data[i].name});
					                }   
					                that.set('companies_p',companies);
								});	

							}else if(data =="201"){
								bootbox.alert("Already exists");
							}
						});
					}					
				},
				className: "bootbox-sm"
			});
		},
		addCity: function(){
			var that =  this;
			bootbox.prompt({
				title: "Enter the City name",
				callback: function(result) {					
					if(result){
						$.post('/updateCity',{'city':result},function(data){
							if(data == "200"){
								var cityList = [];
				                $.get('/cityList',function(data){				                	
									for(var i=0;i<data.length;i++){
					                    cityList.push(data[i].city);
					                }   
					                that.set('v_city',cityList);
								});	

							}else if(data =="201"){
								bootbox.alert("Already exists");
							}
						});
					}					
				},
				className: "bootbox-sm"
			});
		},
		UpdatePosting: function(){			
			var posting_id = this.get('id');
			var that = this;
			$.ajax({
	   		    type: 'POST',
	   		    url: "/updatePosting",
	   		    dataType:"json",
	   		    data: {	   					
	   					"id"			: this.get('id'),
	   					"description"	: $('#description_p').val(),	   					
	   					"city"			: jQuery('#p_city').val(),
	   					"exp_min"		: $('#exp_min_p').val(),
	   					"exp_max"		: $('#exp_max_p').val(),		   					
	   					"company_id"	: jQuery("#companies_p").val(),	
	   					"type"			: jQuery("#types_p").val(),
	   					"status"		: jQuery("#status_p").val(),
	   					"employment_type": jQuery('#etypes').val(),
	   					"comments"		: $("#note").val()
	      		    },
	   		    success: function(data){		   		    	
	   		    	bootbox.alert(data.message);	
	   		    	return $.get('/getposting/'+posting_id,function(data){	   		    		
						that.set('content',data);
					});   		    	
	   		    },
	   		    error: function(data){
	   		    	bootbox.alert("error saving the data");
	   		    } 
   		    });
		},
	}
});


/****************
User Configure - Controller
****************/

App.ConfigureController = Ember.ObjectController.extend({	
	empStatus : empStatus,		
	actions : {
		editRegion : function(email){
	      	var that = this;
	      	var sel = '<select class="form-control" id="userRegion">\
							<option value="1">United States</option>\
							<option value="2">India</option>\
							<option value="3">India & United States</option>\
						</select>';			
            bootbox.confirm({
				message:  'Choose the region :<br/><br/>' +sel,
				callback: function(result) {
					if(result){						
						$.ajax({
							type:"POST",
							url:'/updateUser',
							dataType:"json",
							data:{
								'region' : $('#userRegion').val(),
								'email' : email
							},
							success : function(data){
								bootbox.alert(data.message);
								return $.get('/userList',function(data){	
									that.set('content',data);
								});
							}
						});
					}
				},
				className: "bootbox-sm"
			});

		},
		editRole : function(email){
			var that = this;

			$.ajax ({
	            type: "GET", 
	            url:'/roles',            
	            success: function(data) {
					var sel = "<select class='form-control' id='newRole' multiple='multiple'>";

		            for(var i=0;i<data.length;i++){            	
		           		sel = sel + "<option value='"+data[i].id+"'>"+data[i].name+"</option>";
		            }

					bootbox.confirm({
						message: "Select the status : "+sel,
						callback: function(result) {
							var count = $("#newRole :selected").length;		

							if((result)&&(count <=2)){								
								var role = $('#newRole').val();
								var roles = role.toString();							
								$.ajax({
									type:"POST",
									url:'/updateUser',
									dataType:"json",
									data:{
										'role'  : roles,
										'email' : email
									},
									success : function(data){
										bootbox.alert(data.message);
										return $.get('/userList',function(data){	
											that.set('content',data);
										});
									}
								});
							}
							else if(count > 2){
								bootbox.alert("Person can have only two Roles");
							}
						},
						className: "bootbox-sm"
					});

	            },
	            error:function(data){
	                bootbox.alert(data.statusText);
	            }                        
	        });
		},
		editStatus: function(email){
			var that =  this;
			var sel = '<select class="form-control" id="userStatus"><option value="e01">Active</option>\
			<option value="e02">In-Active</option></select>';			
            bootbox.confirm({
				message:  'Choose the region :<br/><br/>' +sel,
				callback: function(result) {					
					if(result){						
						$.ajax({
							type:"POST",
							url:'/updateUser',
							dataType:"json",
							data:{
								'status' : $('#userStatus').val(),
								'email' : email
							},
							success : function(data){
								bootbox.alert(data.message);
								return $.get('/userList',function(data){	
									that.set('content',data);
								});
							}
						});
					}
				},
				className: "bootbox-sm"
			});
		}
	}
});

