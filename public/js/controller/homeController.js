mesgs = [];
var companyList,statusList;

var addmessage = function(type,msg){

	mesgs.push({
		type:type,
		msg:msg
	});

}

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
        res = res + '<label class="label label-tag label-danger">FAKE</label>';
        break;                                      
}

  return new Ember.Handlebars.SafeString(res);
});

Ember.Handlebars.helper('format-results', function(data) {

	var schema = window.App.__container__.lookup('controller:searchResult').get('content').schema;
	var res = "";

	if(schema == 'v'){

		var sl = '<button class="btn btn-primary btn-outline btn-xs pull-right" onclick="applyforv('+data.id+',window.location.href,this);"><i class="fa fa-check"></i> Apply</button>';

		res=res+'<li>';

		if(getParameterByName('c')){
			res=res+sl;
		}

		res=res+'<a href="#/vacancy/'+data.id+'" class="search-title">'+data.vname+'</a>'
			+'<p>'+data.vtitle+'</p>'
			+'<div class="search-content">'
			+data.vexp_min+' to '+data.vexp_max+' years with '+data.vskills+' skills located in '+data.vcity+' .'
			+'</div>'
			+'<div class="search-tags">'
			+'<span class="search-tags-text">Skills:</span>';

		var r = data.vskills.split(",");
		for(var i=0;i<r.length;i++){
			res = res+'<label class="label label-info">'+r[i]+'</label>&nbsp;';
		}

		res = res + '</div>'+'<div class="search-tags">'
			  + '<span class="search-tags-text">Keywords:</span>';

		var r = data.vskills.split(",");
		for(var i=0;i<r.length;i++){
			res = res+'<label class="label label-success">'+r[i]+'</label>&nbsp;';
		}			  

		res = res + '</div> </li>';

	}else if(schema == 'c'){

		var sl = '<button class="btn btn-primary btn-outline pull-right btn-flat btn-xs " onclick="shortlist('+data.id+',window.location.href,this);"><i class="fa fa-check"></i> Shortlist</button>';

		res=res+'<li>';

		if(getParameterByName('v')){
			res=res+sl;
		}

		res = res +'<a href="#/candidate/'+data.id+'" class="search-title">'+data.cname+'</a>'
			+'<p>'+data.ctitle+'</p>'
			+'<div class="search-content">'
			+data.cexp+' years with '+data.cskills+' skills located in '+data.ccity+' .'
			+'</div>'
			+'<div class="search-tags">'
			+'<span class="search-tags-text">Skills:</span>';

		var r = data.cskills.split(",");
		for(var i=0;i<r.length;i++){
			res = res+'<label class="label label-info">'+r[i]+'</label>&nbsp;';
		}

		res = res + '</div>'+'<div class="search-tags">'
			  + '<span class="search-tags-text">Keywords:</span>';

		var r = data.cskills.split(",");
		for(var i=0;i<r.length;i++){
			res = res+'<label class="label label-success">'+r[i]+'</label>&nbsp;';
		}			  

		res = res + '</div> </li>';

	}

  return new Ember.Handlebars.SafeString(res);
});

/********************************
 * Controllers
 **********************************/

App.ApplicationController = Ember.Controller.extend({
	name: "",

	init: function(){
		var that = this;
		$.get('/me',function(data){
			that.set('name',data[0].name);
		});
	},

	actions:{				
		signout:function(){			
			document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    		window.location='login.html';
		},	
	}
});

App.AddcandidateController = Ember.Controller.extend({

	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),
	country : ["China", "India", "United States", "Indonesia", "Brazil",
                "Pakistan", "Bangladesh", "Nigeria", "Russia", "Japan",
                "Mexico", "Philippines", "Vietnam", "Ethiopia", "Egypt",
                "Germany", "Turkey", "Iran", "Thailand", "D. R. of Congo",
                "France", "United Kingdom", "Italy", "Myanmar", "South Africa",
                "South Korea", "Colombia", "Ukraine", "Spain", "Tanzania",
                "Sudan", "Kenya", "Argentina", "Poland", "Algeria",
                "Canada", "Uganda", "Morocco", "Iraq", "Nepal",
                "Peru", "Afghanistan", "Venezuela", "Malaysia", "Uzbekistan",
                "Saudi Arabia", "Ghana", "Yemen", "North Korea", "Mozambique",
                "Taiwan", "Syria", "Ivory Coast", "Australia", "Romania",
                "Sri Lanka", "Madagascar", "Cameroon", "Angola", "Chile",
                "Netherlands", "Burkina Faso", "Niger", "Kazakhstan", "Malawi",
                "Cambodia", "Guatemala", "Ecuador", "Mali", "Zambia",
                "Senegal", "Zimbabwe", "Chad", "Cuba", "Greece",
                "Portugal", "Belgium", "Czech Republic", "Tunisia", "Guinea",
                "Rwanda", "Dominican Republic", "Haiti", "Bolivia", "Hungary",
                "Belarus", "Somalia", "Sweden", "Benin", "Azerbaijan",
                "Burundi", "Austria", "Honduras", "Switzerland", "Bulgaria",
                "Serbia", "Israel", "Tajikistan", "Hong Kong", "Papua New Guinea",
                "Togo", "Libya", "Jordan", "Paraguay", "Laos",
                "El Salvador", "Sierra Leone", "Nicaragua", "Kyrgyzstan", "Denmark",
                "Slovakia", "Finland", "Eritrea", "Turkmenistan"],
	city	: ['Cleveland',
                'New York City',
                'Brooklyn',
                'Manhattan',
                'Queens',
                'The Bronx',
                'Staten Island',
                'San Francisco',
                'Los Angeles',
                'Seattle',
                'London',
                'hyderabad',  
                'Portland',
                'Chicago',
                'Boston'],

	init: function(){
		var statusList =[];
		var that = this;
		$.ajax ({
            type: "GET", 
            url:'/statusList',            
            success: function(data) {                 
                for(var i=0;i<data.length;i++){
                	if(data[i].id.indexOf("C0") > -1){
	                    statusList.push({
	                    	id:data[i].id,
	                    	name:data[i].name
	                    });
	                }
                }                                  
                that.set('statuses',statusList);                
            },
            error:function(data){
                alert("Msg: "+ data.status + ": " + data.statusText);
            }                        
        }); 
	},
	statuses: statusList,                
	actions :{
		savecandidate: function(){

			var that = this;
			var v = true;
			var fileName = JSON.parse($(".uploadedfile").text());
			var cv = fileName.filepath;
			
			if($("#experience").val() == ""){
				addmessage("danger","Experience has to be specified");
				v=false;
			}
			if($("#email").val() == ""){
				addmessage("danger","Email is Mandatory.");				
				v=false;
			}
			if($("#phone").val() == ""){
				addmessage("danger","Mobile number is Mandatory");				
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
		   					"exp"				: this.get("experience"),
		   					"country"			: jQuery('#country').val(),
		   					"city"				: jQuery('#city').val(),
		   					"cvpath"			: cv,
		   					"company_id"		: jQuery("#company").val(),
		   					"status"			: jQuery("#status").val(),
		   					"skills"			: text,
		   					"comments"			: this.get("comments"),
		   					"active"		   	:"true"		
		      		    },
		   		    success: function(data){
		   		    	jQuery(".form-control").val("");
	   					setTimeout(function(){that.transitionTo('dashboard');},500);
		   		    },
		   		    error: function(data){
		   		    	addmessage("danger","Sorry, Data could not be saved. Server error.");
		   		    	//confirmbox("danger", "Sorry, Data could not be saved. Server error.");
		   		    }
	   		     });
          	}
		}
	}
});

App.AddvacancyController = Ember.Controller.extend({

	init: function(){
		var companyList =[];
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
                alert("Msg: "+ data.status + ": " + data.statusText);
            }                        
        }); 
	},
	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),
	companies: companyList,
	country : ["China", "India", "United States", "Indonesia", "Brazil",
                "Pakistan", "Bangladesh", "Nigeria", "Russia", "Japan",
                "Mexico", "Philippines", "Vietnam", "Ethiopia", "Egypt",
                "Germany", "Turkey", "Iran", "Thailand", "D. R. of Congo",
                "France", "United Kingdom", "Italy", "Myanmar", "South Africa",
                "South Korea", "Colombia", "Ukraine", "Spain", "Tanzania",
                "Sudan", "Kenya", "Argentina", "Poland", "Algeria",
                "Canada", "Uganda", "Morocco", "Iraq", "Nepal",
                "Peru", "Afghanistan", "Venezuela", "Malaysia", "Uzbekistan",
                "Saudi Arabia", "Ghana", "Yemen", "North Korea", "Mozambique",
                "Taiwan", "Syria", "Ivory Coast", "Australia", "Romania",
                "Sri Lanka", "Madagascar", "Cameroon", "Angola", "Chile",
                "Netherlands", "Burkina Faso", "Niger", "Kazakhstan", "Malawi",
                "Cambodia", "Guatemala", "Ecuador", "Mali", "Zambia",
                "Senegal", "Zimbabwe", "Chad", "Cuba", "Greece",
                "Portugal", "Belgium", "Czech Republic", "Tunisia", "Guinea",
                "Rwanda", "Dominican Republic", "Haiti", "Bolivia", "Hungary",
                "Belarus", "Somalia", "Sweden", "Benin", "Azerbaijan",
                "Burundi", "Austria", "Honduras", "Switzerland", "Bulgaria",
                "Serbia", "Israel", "Tajikistan", "Hong Kong", "Papua New Guinea",
                "Togo", "Libya", "Jordan", "Paraguay", "Laos",
                "El Salvador", "Sierra Leone", "Nicaragua", "Kyrgyzstan", "Denmark",
                "Slovakia", "Finland", "Eritrea", "Turkmenistan"],
	city	: ['Cleveland',
                'New York City',
                'Brooklyn',
                'Manhattan',
                'Queens',
                'The Bronx',
                'Staten Island',
                'San Francisco',
                'Los Angeles',
                'Seattle',
                'London',
                'hyderabad',  
                'Portland',
                'Chicago',
                'Boston'],
	statuses: ['OPEN','CLOSED'],
	actions :{
		addCompany: function(){
			$(".form-control").val("");
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
								alert("Already exists");
							}
						});
					}					
				},
				className: "bootbox-sm"
			});

		},

		saveVacancy: function(){

			$(".form-control").val("");

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
		   		    	$(".form-control").val("");
	   					setTimeout(function(){that.transitionTo('dashboard');},500);
		   		    },
		   		    error: function(data){
		   		    	console.log("error");
		   		    	confirmbox("danger", "Sorry, Data could not be saved. Server error.");
		   		    } 
	   		     });
          	}

		}
	}
});

App.DashboardController = Ember.Controller.extend({
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
			that.transitionTo('searchResult',search_text+"&schema="+schema);

		}
	}
});

App.VacancyController = Ember.ObjectController.extend({

	actions:{
		searchbyv: function(){
			var m = this.get('content');
			var key = m.city+"+"+m.country+"+"+m.skills+"+"+m.title+"+"+m.name+"+"+m.exp_max;
			this.transitionTo('searchResult',key+'&schema=c'+'&v='+m.id);
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
								},function(data){
									$('.fa fa-edit').hide();
								});
							}
						},
						className: "bootbox-sm"
					});

	            },
	            error:function(data){
	                alert("Msg: "+ data.status + ": " + data.statusText);
	            }                        
	        }); 

		}
	}

});

App.CandidateController = Ember.ObjectController.extend({
	country : ["China", "India", "United States", "Indonesia", "Brazil",
                "Pakistan", "Bangladesh", "Nigeria", "Russia", "Japan",
                "Mexico", "Philippines", "Vietnam", "Ethiopia", "Egypt",
                "Germany", "Turkey", "Iran", "Thailand", "D. R. of Congo",
                "France", "United Kingdom", "Italy", "Myanmar", "South Africa",
                "South Korea", "Colombia", "Ukraine", "Spain", "Tanzania",
                "Sudan", "Kenya", "Argentina", "Poland", "Algeria",
                "Canada", "Uganda", "Morocco", "Iraq", "Nepal",
                "Peru", "Afghanistan", "Venezuela", "Malaysia", "Uzbekistan",
                "Saudi Arabia", "Ghana", "Yemen", "North Korea", "Mozambique",
                "Taiwan", "Syria", "Ivory Coast", "Australia", "Romania",
                "Sri Lanka", "Madagascar", "Cameroon", "Angola", "Chile",
                "Netherlands", "Burkina Faso", "Niger", "Kazakhstan", "Malawi",
                "Cambodia", "Guatemala", "Ecuador", "Mali", "Zambia",
                "Senegal", "Zimbabwe", "Chad", "Cuba", "Greece",
                "Portugal", "Belgium", "Czech Republic", "Tunisia", "Guinea",
                "Rwanda", "Dominican Republic", "Haiti", "Bolivia", "Hungary",
                "Belarus", "Somalia", "Sweden", "Benin", "Azerbaijan",
                "Burundi", "Austria", "Honduras", "Switzerland", "Bulgaria",
                "Serbia", "Israel", "Tajikistan", "Hong Kong", "Papua New Guinea",
                "Togo", "Libya", "Jordan", "Paraguay", "Laos",
                "El Salvador", "Sierra Leone", "Nicaragua", "Kyrgyzstan", "Denmark",
                "Slovakia", "Finland", "Eritrea", "Turkmenistan"],
	city	: ['Cleveland',
                'New York City',
                'Brooklyn',
                'Manhattan',
                'Queens',
                'The Bronx',
                'Staten Island',
                'San Francisco',
                'Los Angeles',
                'Seattle',
                'London',
                'hyderabad',  
                'Portland',
                'Chicago',
                'Boston'],

	actions:{
		searchbyc: function(){
			var m = this.get('content').details;
			var key = m.city+"+"+m.country+"+"+m.skills+"+"+m.title+"+"+m.name+"+"+m.exp;
			this.transitionTo('searchResult',key+'&schema=v'+'&c='+m.id);
		},
		showHistory: function(m){
			var that = this;
			$.get('/apphistorybyid/'+m.id,function(result){
				that.set('content.apphistory',result);
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
	                alert("Msg: "+ data.status + ": " + data.statusText);
	            }                        
	        }); 

		},
		UpdateCandidate:function(){
			var that = this;			
			var fileName = JSON.parse($(".uploadedfile").text());
			var cv = fileName.filepath;			
			var candidateId = $("#candidateId").val();			
			/*var textarea = $('#tags:last');
			var textext = textarea.textext()[0];

			var text = textext.hiddenInput().val();
			text = text.replace("[","");
			text = text.replace("]","");
			text = text.replace(/['"]+/g, '');*/

   			$.ajax({
	   		    type: 'POST',
	   		    url: "/UpdateCandidate",
	   		    dataType:"json",
	   		    data: {	   					
	   					"title"				: $("#title").val(),	   					
	   					"phone"				: $("#phone").val(),
	   					"exp"				: $("#experience").val(),
	   					"country"			: $('#country').val(),
	   					"city"				: $('#city').val(),
	   					"cvpath"			: cv,
	   					"company_id"		: $("#company").val(),
	   				//	"skills"			: text,
	   					"id"				: candidateId	
	      		    },
	   		    success: function(data){
	   		    	alert("Msg: "+ data.status + ": " + data.statusText);
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
	   		    	alert("Msg: "+ data.status + ": " + data.statusText);
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
			that.transitionTo('searchResult',search_text+"&schema="+schema);
 
		}
	}


});

App.ProfileController = Ember.ObjectController.extend({
	actions:{
		updateProfile : function(){			
			var that = this;
			var description = this.get('description');
			var mobile_number = this.get('mobile_number');	
			if((description)||(mobile_number)){
				$.ajax ({
	                type: "POST", 
	                url:'/updateProfile',
	                dataType:'JSON',
	                data:{'description':description,'mobile_number':mobile_number},                   
	                success: function(data) {  
		                alert(data.message);	                
		               	$.get('/getUserdata',function(data){		               		
							that.set('content.userdata',data);
						});									
	                },
	                error: function(data) {
	                    alert("Msg: "+ data.status + ": " + data.statusText);
	                }
	            });	  
			}	
			else{
				alert('enter the data');
			}
			                    
		}
	}
});

