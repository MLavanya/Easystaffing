
/********************************
 * Application
 **********************************/
var popupbox = function(okfunction,data) {
	/*$('#edudetails .modal-header').html(title);*/
	$('#editemppopup').modal('show');
	$('#editemppopup .btn-primary').click(okfunction);
};

var confirmbox = function(message, title, okfunction) {
	$('#confirm .modal-body').html(message);
	$('#confirm .modal-header modal-title').html(title);
	$('#confirm').modal('show');
	$('#confirm .btn-primary').click(okfunction);
};

var addcomments = function(elem){

	var c = $(elem).next().next().next().next();

	c.slideToggle();

/*	var s = "<div class='cmt'><hr>"
			+ "<p>Status : <br><select>"
			+ "<option value='Interviewed'>Interviewed</option>"
			+ "<option value='Rejected'>Rejected</option>"
			+ "<option value='Deferred'>Deferred</option>"
			+ "<option value='Accepted'>Accepted</option>"
			+ "</select></p>"
			+ "<p>Comments : <br><textarea rows=2 cols=30></textarea></p>"
			+ "<p><button type='button' class='btn btn-primary'>Update</button></p>"
			+ "</div>"

	if($(".cmt").length > 0){
		$(".cmt").remove();
	}else{
		c.append(s).fadeIn('slow');
	}*/

};

var editingEmail = "";
var currentPage  = "";

App = Ember.Application.create({

	needs : [ 'application' ],
	ready : function() {

		//$.noConflict(true);
		// check if already authenticated via cookies.

		if ($.cookie("loggedIn")) {
			App.LoginUser.set('loggedinEmail', $.cookie("loggedinEmail"));
			App.LoginUser.set('loggedinUser', $.cookie("loggedinUser"));
			App.LoginUser.set('loggedin', false);

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
    	var user=getCookie("username");
    	UserName = user;
	}

});

/*Helpers*/

Ember.Handlebars.helper('format-date', function(date) {
	return moment(date).fromNow();
});

Ember.Handlebars.helper('format-email', function(email) {
	return new Ember.Handlebars.SafeString("<a href='mailto:"+email+"'>"+email+"</a>");
});


/********************************
 * Models
 **********************************/

App.LoginUser = Ember.Object.create({
	loggedin : true,
	loggedinUser : "",
	loggedinEmail : ""
});



/********************************
 * Routes
 **********************************/

App.Router.map(function() {
	this.resource('home');
	this.resource('addemployee');
	this.resource('manageemployee');
	this.resource('editemployee');
	this.resource('manageapproval');
	this.resource('search');
	this.resource('employ');
	this.resource('configure');
	this.resource('addcandidate');
	this.resource('editcandidate');
	this.resource('importemployee');
	this.resource('importcandidate');
	this.resource('skillset');
	this.resource('leavetypes');
	this.resource('holidays');
});

App.HomeRoute = Ember.Route.extend({

	/*model: function(){
		return $.getJSON("/users",{});
	}*/
});

App.AddemployeeRoute = Ember.Route.extend({

});

App.SearchRoute = Ember.Route.extend({

	model:function(){
		return [];
	}

});

App.EmployRoute = Ember.Route.extend({

	model:function(){
		return $.getJSON("hrm/getfavpeople").then(function(data) {
			var items = [];

			for ( var i = 0; i < data.length; i++) {
				items.push(data[i])
			}
			return items;
		});		
	}

});

App.ManageemployeeRoute = Ember.Route.extend({
	
});

App.ManageapprovalRoute = Ember.Route.extend({

	model : function() {
		return Ember.$.getJSON("/hrm/getapprovals/");
	},
	
});

App.EditemployeeRoute = Ember.Route.extend({

	model : function() {
		return Ember.$.getJSON("/hrm/getemployeesbyemail/"+editingEmail,{});
	},
	

});


App.IndexRoute = Ember.Route.extend({

/* beforeModel: function(){
 	if(!$.cookie('loggedinEmail'))
 		window.location.href = "http://localhost:8080";
 },*/

 afterModel: function() {
 	this.transitionTo('home');
 }

});

App.SkillsetRoute = Ember.Route.extend({

	model: function(){
		//return $.getJSON("/hrm/skillset",{});
	}
});


/********************************
 * Controllers
 **********************************/

App.ApplicationController = Ember.Controller
		.extend({

			loginFailed : false,
			isProcessing : false,
			isSlowConnection : false,
			timeout : null,
			auth : true,
			loggedinUser : '',
			loggedinEmail : '',
			profilepic : '',
			taskscount : 0,
			filescount : 0,
			imgcount : 0,
			isAdmin : false,

			init : function() {
				this._super();

				if (App.LoginUser.get('loggedin')) {
					this.setProperties({
						loginFailed : false,
						isProcessing : false,
						auth : true,
						username : '',
						password : ''
					});
				} else {
					this.set('loggedinUser', App.LoginUser.get('loggedinUser'));
					this.set('loggedinEmail', App.LoginUser
							.get('loggedinEmail'));
					this.set('auth', App.LoginUser.get('loggedin'));
					this.set('profilepic', "images/users/"
							+ App.LoginUser.get('loggedinEmail') + ".jpg");
					var that = this;
				}
				
			},

			logout : function() {

				var request = $.post("/logout", this
						.getProperties("loggedinEmail"));

				this.setProperties({
					loginFailed : false,
					isProcessing : false,
					loggedinUser : '',
					loggedinEmail : '',
					profilepic : '',
					auth : true,
					username : '',
					password : ''
				});

				$.removeCookie("loggedinUser");
				$.removeCookie("loggedIn");
				$.removeCookie("loggedinEmail");

				    

				location.href="/";
			}

		});

App.HomeController = Ember.Controller.extend({

	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),

	resourcereqs:0,
	savedEmp:0,

	init: function(){

		var that = this;

		$.getJSON("hrm/getfavpeople").then(function(data) {
			that.set('savedEmp',data.length);
		});	

		$.getJSON("im/getimrequestsDT").then(function(data) {
			that.set('resourcereqs',data.data.length>0?data.data.length:0);
		});

	}

});

App.SearchController = Ember.ArrayController.extend({

	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),

	fav: function(data){
		$.post("/hrm/favpeople",{
			email:data.email,
			faved:"true"
		}).then(function(){
			addmessage("success","Added to Favourites");
		})
	},

	downloadcv: function(data){

		window.open('/hrm/downloadcv?email=' + data.email);

	},

	search: function(){

		var that = this;

		if($(".expto").val() == "0"){
			addmessage("danger","Experience has to be specified");
			return;
		}

		var textarea = $('#empsearchtags:last');
		var textext = textarea.textext()[0];

		if(textext.hiddenInput().val().length < 3){
			addmessage("danger","Skills has to be specified");
			return;
		}

		var text = textext.hiddenInput().val();
		text = text.replace("[","");
		text = text.replace("]","");
		text = text.replace(/['"]+/g, '')

		console.log(text.split(','));

		$.post("hrm/getpeople",{
			expfrom:$(".expfrom").val(),
			expto: $(".expto").val(),
			skills: text.split(",")
		}).then(function(data){
			console.log(data);
			that.clear();
			for ( var i = 0; i < data.length; i++) {
				that.pushObject(data[i]);
			}
		});

	}

});


App.EmployController = Ember.ArrayController.extend({

	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),
	statuses: ['None','Interviewed','Rejected','Deferred','Accepted'],

	unfav: function(data){

		var that = this;
		$.post("/hrm/favpeople",{
			email:data.email,
			faved:"false"
		}).then(function(){
			addmessage("success","Removed to Favourites");
			//that.updateData();
		});
	},

	update: function(data){

		var that = this;

		$.post("/hrm/updatepeople",{
			email:data.email,
			status:$("[id='"+data.email+"'] select :selected").text(),
			comments: data.comments
		}).then(function(){
			addmessage("success","Update successfully");
			that.updateData();
		});

	},

	updateData: function(){

		var that = this;

		this.clear();

		$.getJSON("hrm/getfavpeople").then(function(data) {

			that.clear();

			for ( var i = 0; i < data.length; i++) {

				that.pushObject(data[i]);
			}

		});		

	}		
});

App.AddcandidateController = Ember.Controller.extend({

	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),
	usertypes: ["SAHAJ","SRS","CISCO"],
	statuses: ['None','Interviewed','Rejected','Deferred','Accepted'],
	actions :{
		savecandidate: function(){

			var that = this;
			var v = true;

			if($("#experience").val() == ""){
				addmessage("danger","Experience has to be specified");
				v=false;
			}
			if($("#email").val() == ""){
				addmessage("danger","Email has to be specified");
				v=false;
			}
			if($("phone").val() == ""){
				addmessage("danger", "Phone number has to be specified");
				v=false;
			}

			var textarea = $('#skills:last');
			var textext = textarea.textext()[0];

			if(textarea.val().length < 3){
				addmessage("danger","Skills has to be specified");
				v=false;
			}

			var text = textarea.val();
			text = text.replace("[","");
			text = text.replace("]","");
			text = text.replace(/['"]+/g, '');

			if(v){
	   			jQuery("#addEmpSbmt").attr('disabled','disabled').html("updated"); 
	   			$.ajax({
		   		    type: 'POST',
		   		    url: "/hrm/savecandidate",
		   		    dataType:"json",
		   		    data: {
		   		    		"recruiter"	: UserName,
		   					"firstname"			: this.get("firstname"),
		   					"title"				: this.get("title"),
		   					"candidate_email"	: this.get("email"),
		   					"mobile_num"		: this.get("phone"),
		   					"experience"		: this.get("experience"),
		   					"cv"				: JSON.parse($(".uploadedfile").text()).file,
		   					"forcompany"		: jQuery("#company").val(),
		   					"status"			: jQuery("#status").val(),
		   					"skills"			: text,
		   					"comments"			: this.get("comments"),
		   					"faved"				: "false",
		      		    },
		   		    success: function(data){
		   		    	console.log("success");
		   		    	addmessage("success", "Candidate Saved");
		   		    	jQuery(".form-control").val("");
	   					setTimeout(function(){that.transitionTo('home');},500);
		   		    },
		   		    error: function(data){
		   		    	console.log("error");
		   		    	addmessage("danger", "Sorry, Data could not be saved. Server error.");
		   		    } /*})
	   		    .done(function(data) { 
	   
	   		    	addmessage("success", "Candidate Saved");
	   				jQuery(".form-control").val("");
	   				setTimeout(function(){that.transitionTo('home');},500);
	   		     })
	   		    .fail(function() { 
	   		    	addmessage("danger", "Sorry, Data could not be saved. Server error.");
	   		     })
	   		    .always(function() { 
	   		    	jQuery("#addEmpSbmt").removeAttr('disabled').html("Save");*/
	   		     });
          	}

		}
	}
});

App.ManageapprovalController = Ember.ObjectController.extend({

	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),

});

App.AddemployeeController = Ember.Controller.extend({

	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),
	usertypes: ["Developer", "Project Manager","HR","Director","Program Manager"],
	countries : ["India","USA"],
	userstatuses : ["Active","InActive"],
	locations : ["Hyderabad","Bangalore"],
	isEditing : false,
	
 	actions : {

   		saveemployee : function() {

   			jQuery("#addEmpSbmt").attr('disabled','disabled').html("updating..");

			if(this.validate()){
                $this = this;
				$.ajax({
			    type: 'POST',
			    url: "/hrm/saveemployee",
			    data: {
					    "empid"			: this.get("empid"),
						"firstname"		: this.get("firstname"),
						"lastname"		: this.get("lastname"),
						"email"			: this.get("email"),
						"doj"			: this.get("doj"),
						"usertype"		: jQuery("#usertype").val(),
						"country"		: jQuery("#country").val(),
						"designation"	: jQuery("#designation").val(),
						"location"		: jQuery("#location").val(),
						"exitinterview"	: this.getExitInterview(),
						"remarks"		: this.get("remarks"),
						"username"		: "",
						"userstatus" 	: jQuery("#userstatus").val(),
						"password" 		: this.get("password"),
			    } })
			    .done(function(data) { 

			    	$this.showMsg("success", "New Employee Created");
					jQuery(".form-control").val("");

			     })
			    .fail(function() { 
			    	$this.showMsg("danger", "Sorry, Data could not be saved. Server error.");
			     })
			    .always(function() { 
			    	jQuery("#addEmpSbmt").removeAttr('disabled').html("Save");
			     });

				

			} else {
				  jQuery("#addEmpSbmt").removeAttr('disabled').html("Save");
			}
		}

  	},
	

	getExitInterview: function(){
		var selectedVal = 0;
		var selected = $("input[type='radio'][name='exitinterview']:checked");
		if (selected.length > 0) {
		    selectedVal = selected.val();
		}

		return selectedVal;

	},

	validate: function(){
		/*
		* @desc : validationg text fields using basic method
		* @todo : update it with emberjs way of validation
		*/
		var result = true;
		var fieldsArray = ["empid","firstname","lastname","email","doj","remarks","password"];
		for (var i=0; i<=fieldsArray.length;i++){
		 
		    if($("#"+fieldsArray[i]).val()==""){
		    	this.showMsg("danger", fieldsArray[i]+" is required");
		    	$("#"+fieldsArray[i]).focus();
		        result = false;
		        break;
		    } else if(fieldsArray[i]=="email"){
		    	if(!this.validateEmail($("#"+fieldsArray[i]).val())){
		    		this.showMsg("danger", "Please enter valid email");
		    		$("#"+fieldsArray[i]).focus();
		        	result = false;
		        	break;
		    	}
		    }
		    
		}

		return result;

	},

	validateEmail: function(email) { 
	    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	},

	showMsg: function(type,msg) {
		addmessage(type,msg);
	},



});

App.ManageemployeeController =  Ember.Controller.extend({
	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),

});

App.EditemployeeController =  Ember.ObjectController.extend({
	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),
	usertypes: ["Developer", "Project Manager","HR","Director","Program Manager"],
	countries : ["India","USA"],
	userstatuses : ["Active","InActive"],
	locations : ["Hyderabad","Bangalore"],
	isEditing : true,
	
 	actions : {

   		saveemployee : function() {

   			jQuery("#addEmpSbmt").attr('disabled','disabled').html("updating..");

			if(this.validate()){
                $this = this;
				$.ajax({
			    type: 'POST',
			    url: "/hrm/updateemployee",
			    data: {
					    "empid"			: this.get("empid"),
						"firstname"		: this.get("firstname"),
						"lastname"		: this.get("lastname"),
						"email"			: this.get("email"),
						"doj"			: this.get("doj"),
						"usertype"		: jQuery("#usertype").val(),
						"country"		: jQuery("#country").val(),
						"designation"	: jQuery("#designation").val(),
						"location"		: jQuery("#location").val(),
						"exitinterview"	: this.getExitInterview(),
						"remarks"		: this.get("remarks"),
						"username"		: "",
						"userstatus" 	: jQuery("#userstatus").val(),
						"password" 		: this.get("password"),
						"isediting"		: 1
			    } })
			    .done(function(data) { 
			    	//$this.controllerFor('manageemployee').set('msg', "Employee data updated successfully.");
					App.__container__.lookup("router:main").transitionTo('manageemployee');
					addmessage('success',"Employee data updated successfully.");
					renderRows(currentPage);

			     })
			    .fail(function() { 
			    	$this.showMsg("danger", "Sorry, Data could not be saved. Server error.");
			     })
			    .always(function() { 
			    	jQuery("#addEmpSbmt").removeAttr('disabled').html("Save");
			     });

			} else {
				  jQuery("#addEmpSbmt").removeAttr('disabled').html("Save");
			}
		}

  	},
	

	getExitInterview: function(){
		var selectedVal = 0;
		var selected = $("input[type='radio'][name='exitinterview']:checked");
		if (selected.length > 0) {
		    selectedVal = selected.val();
		}

		return selectedVal;

	},

	validate: function(){
		/*
		* @desc : validationg text fields using basic method
		* @todo : update it with emberjs way of validation
		*/
		var result = true;
		var fieldsArray = ["empid","firstname","lastname","email","doj","remarks","password"];
		for (var i=0; i<=fieldsArray.length;i++){
		 
		    if($("#"+fieldsArray[i]).val()==""){
		    	this.showMsg("danger", fieldsArray[i]+" is required");
		    	$("#"+fieldsArray[i]).focus();
		        result = false;
		        break;
		    } else if(fieldsArray[i]=="email"){
		    	if(!this.validateEmail($("#"+fieldsArray[i]).val())){
		    		this.showMsg("danger", "Please enter valid email");
		    		$("#"+fieldsArray[i]).focus();
		        	result = false;
		        	break;
		    	}
		    }
		    
		}

		return result;

	},

	validateEmail: function(email) { 
	    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	},

	showMsg: function(type,msg) {

       addmessage(type,msg);

	},
	
});

App.SkillsetController = Ember.ArrayController.extend({

	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),

	saveskill: function(){

			var that = this;
			var v = true;

			if($("#name").val() == ""){
				addmessage("danger","Please enter a skill name");
				v=false;
			}

			if(v){
	   			jQuery("#skillsubmit").attr('disabled','disabled').html("Updating.."); 
	   			$.ajax({
	   		    type: 'POST',
	   		    url: "/hrm/saveskill",
	   		    data: {
	   					"name"		: $("#name").val(),	   
	   		    } })
	   		    .done(function(data) { 
	   
	   		    	addmessage("success", "Skill Saved");
	   				jQuery(".form-control").val("");
	   				that.updateData();
	   		     })
	   		    .fail(function() { 
	   		    	addmessage("danger", "Sorry, Data could not be saved. Server error.");
	   		     })
	   		    .always(function() { 
	   		    	jQuery("#skillsubmit").removeAttr('disabled').html("Save");
	   		     });
           	}

	},

	updateData: function(){

		var that = this;

		this.clear();

		$.getJSON("hrm/skillset").then(function(data) {

			that.clear();

			for ( var i = 0; i < data.length; i++) {

				that.pushObject(data[i]);
			}

		});		

	}	

});

App.HolidaysController = Ember.Controller.extend({

	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),

	saveholiday: function(){

			var that = this;
			var v = true;

			if($("#title").val() == "" || $("#date").val() == ""){
				addmessage("danger","Title and Date are Mandatory.");
				v=false;
			}

			if(v){
	   			jQuery("#skillsubmit").attr('disabled','disabled').html("Updating.."); 
	   			$.ajax({
	   		    type: 'POST',
	   		    url: "/hrm/saveholiday",
	   		    data: {
	   					"title"		: $("#title").val(),	
	   					"date"		: $("#date").val(),
	   					"year"		: moment($("#date").val()).year(),	   
	   		    } })
	   		    .done(function(data) { 
	   
	   		    	addmessage("success", "Holiday Saved");
	   				jQuery(".form-control").val("");
	   		     })
	   		    .fail(function() { 
	   		    	addmessage("danger", "Sorry, Data could not be saved. Server error.");
	   		     })
	   		    .always(function() { 
	   		    	jQuery("#skillsubmit").removeAttr('disabled').html("Save");
	   		     });
           	}

	}	

});


/********************************
 * Views
 **********************************/

App.Datatableview = Ember.View.extend({
	tagName : 'table',
	attributeBindings : [ 'name', 'id','border','width' ],
	classNamesBindings : [ 'class' ],
	didInsertElement : function() {
		
		renderRows(1);

		
	}
});



function renderPagination(currentpage ,totalCount){
				var totalPages = Math.ceil(totalCount/5);
				var options = {
		            currentPage:currentpage,
		            totalPages: totalPages,
		            bootstrapMajorVersion:3,
		            pageUrl: function(type, page, current){

                		return "javascript:renderRows("+page+")";

            		}
       		 	}

        		$('#paginationUL').bootstrapPaginator(options);
		}

function renderRows(currentPage,q){
	var query = "";
    if(typeof q!='undefined'){
    	query = "?q="+q
    }
	$.getJSON('/hrm/employees/pg'+currentPage+"/"+query,function(data){
		$("#employeemanager tbody").html("");
		$.each(data.employees, function( key, val ) {
	 	var $tr = '<tr>\
                      <td width="10%">'+val.empid+'</td>\
                      <td width="20%">'+val.firstname+' '+val.lastname+'</td>\
                      <td width="30%">'+val.email+'</td>\
                      <td width="20%">'+val.usertype+'</td>\
                      <td width="20%">\
                      			<a href="javascript:editPopup(\''+val.email+'\',\''+currentPage+'\');">\
                      				<span class="glyphicon glyphicon-edit"></span>\
                      			</a>\
                      			 | <a href="javascript:deletePopup(\''+val.email+'\',\''+currentPage+'\');">\
                      			 	<span class="glyphicon glyphicon-remove"></span>\
                      			  </a>\
                      </td>\
                  </tr>';
				  $("#employeemanager tbody").append($tr);
                  
		});		
		renderPagination(currentPage,data.totalCount);	
	});

}


function editPopup(email,currentpage){
    editingEmail = email;
    currentPage  = currentpage;
    App.__container__.lookup("router:main").transitionTo('editemployee');
	

}

function deletePopup(email,currentpage){

		confirmbox('Delete this Employee ?', '', function() {

			$.post('/hrm/delemployee', {
				email : email
			}).done(function() {
				renderRows(currentpage);
			}).fail(function(e) {
				console.log(e);
			});

		});
}


function searchEmployee(){
	renderRows(1,jQuery('#searchEmployeetxt').val());
}

function approveconfirm(id,title,email,start,end,leavetype){
	confirmbox('Approve this leave ?', '', function() {

			$.post('/hrm/approveleave', {
				id : id,
				title : title,
				email : email,
				start : start,
				end   : end,
				leavetype : leavetype
			}).done(function() {
				jQuery("#td_"+id).html("Approved");
				//App.__container__.lookup("router:main").transitionTo('manageapproval');
			}).fail(function(e) {
				console.log(e);
			});

	});
}

/*App.SkillsTagsView = Ember.View.extend({
	tagName : 'div',
	attributeBindings : [ 'name', 'id','border','width' ],
	classNamesBindings : [ 'class' ],
	didInsertElement : function() {

		$.get("/hrm/skillsetarray").done(function(data){

			$('#skills').textext({ 
				plugins : 'autocomplete suggestions tags',
				suggestions: data
			});

		});
		
	}
});

App.EmpSearchTagsView = Ember.View.extend({
	tagName : 'div',
	attributeBindings : [ 'name', 'id','border','width' ],
	classNamesBindings : [ 'class' ],
	didInsertElement : function() {
		
		$.get("/hrm/skillsetarray").done(function(data){

			$('#empsearchtags').textext({ 
				plugins : 'autocomplete suggestions tags',
				suggestions: data
			});

		});
		
	}
});

*/
App.DataTableView = Ember.View.extend({
	tagName : 'table',
	attributeBindings : [ 'name', 'id','width' ],
	classNamesBindings : [ 'class' ],
	didInsertElement : function() {

		var that = this;

	    var dtable = $("#example").dataTable( {
	       "dom": 'T<"clear">lfrtip',
	        "tableTools": {
	            "sSwfPath": "js/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
	        },	    	
	        "ajax": "/hrm/employeess",
			 "aoColumnDefs": [
			   {
			        "aTargets": [5],
			        "mData": null,
			        "mRender": function (data, type, full) {
			            return '<a href="javascript:deletePopup(\''+full[0]+'\',null);"><span class="glyphicon glyphicon-remove"></span></a>'
			            		+ '<a href="javascript:editPopup(\''+full[0]+'\',null);"><span class="glyphicon glyphicon-pencil space"></span></a>';
			        }
			    }]	        
	    });

/*	    dtable.makeEditable({

	    	sUpdateUrl:"/am/assignAsset",
	    	"aoColumns":[
	    			null,
	    			{

						indicator: 'Saving CSS Grade...',
						tooltip: 'Click to select CSS Grade',
						loadtext: 'loading...',
						type: 'select',
						onblur: 'submit',
						data: "{'':'Please select...', 'A':'A','B':'B','C':'C'}",
						sUpdateURL: function(value, settings){
							alert("Custom function for posting results");
							return value;

						}

	    			}

	    	]

	    });	*/	

	}
});

App.CandidateformView = Ember.View.extend({
	templateName: 'candidateform',

	didInsertElement: function(){
		//loadDropDown("ipm/customers","customerid","customer","forcompany");
	}
});


App.TreeView = Ember.View.extend({
	tagName : 'li',
	attributeBindings : [ 'name', 'id','border','width' ],
	classNamesBindings : [ 'class' ],	

	didInsertElement: function(){
		$(".sidebar .treeview").tree();
	}
});

App.FileUploadTool = Ember.TextField.extend({
	tagName : 'input',
	attributeBindings : [ 'name', 'data-url' ],
	classNamesBindings : [ 'class' ],
	type : 'file',
	classNames : 'form-control',
	didInsertElement : function() {

		/*
		 this.$().fileupload('option', {
		 maxFileSize: 5000000
		 });*/

		var that = this;

		this.$().fileupload({
			add : function(e, data) {
				var goUpload = true;
				var uploadFile = data.files[0];
				if (!(/\.(xls|xlsx)$/i)
						.test(uploadFile.name)) {
					addmessage("danger",'Please select an xls or xlsx file.');
					goUpload = false;
				}				
				if (uploadFile.size > 5000000) { // 2mb
					addmessage("warning",'Please upload a smaller file, max size is 5 MB');
					goUpload = false;
				}
				if (goUpload == true) {
					$('#importcandidatefile').attr('disable', true);
					addmessage("info","Uploading "+data.files[0].name);
					data.submit();
				}
			},
			dataType : 'text',
			done : function(e, data) {
				addmessage("success","Upload Complete");
				$('#importcandidatefile').attr('disable', false);
				console.log(JSON.parse(data.result));
			}

		});

	}

});

App.CVUploadTool = Ember.TextField.extend({
	tagName : 'input',
	attributeBindings : [ 'name', 'data-url' ],
	classNamesBindings : [ 'class' ],
	type : 'file',
	classNames : 'form-control',
	didInsertElement : function() {

		/*
		 this.$().fileupload('option', {
		 maxFileSize: 5000000
		 });*/

		var that = this;

		this.$().fileupload({
			add : function(e, data) {
				var goUpload = true;
				var file = document.getElementById("uploadcv").value;
				var uploadFile = data.files[0];
				if (!(/\.(doc|docx)$/i)
						.test(uploadFile.name)) {
					addmessage("danger",'Please select an doc or docx file.');
					goUpload = false;
				}				
				if (uploadFile.size > 5000000) { // 2mb
					addmessage("warning",'Please upload a smaller file, max size is 5 MB');
					goUpload = false;
				}
				if (goUpload == true) {
					$('#uploadcv').hide();
            		$('#addEmpSbmt').attr('disabled',true);
            		data.context = $('<button/>').text('Upload')
                	.appendTo($("#uploadcv").parent())
                	.click(function (e) {
                		e.preventDefault();
                		$(this).parent().append('<div class="progress" id="#progress"> <div class="progress-bar progress-bar-aqua" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"> </div> </div>');

                		//addmessage("info","Uploading "+data.files[0].name);
                    	//data.context = $('<p/>').text('Uploading...').replaceAll($(this));
                    	data.submit();
                	});					
					
					//data.submit();
				}
			},
			dataType : 'text',
		    progressall: function (e, data) {
		        var progress = parseInt(data.loaded / data.total * 100, 10);
		        $('.progress-bar').css(
		            'width',
		            progress + '%'
		        );
		    },			
			done : function(e, data) {
				console.log(JSON.parse(data.result));
				$('.progress-bar').parent().prev().text('Uploaded').attr('disabled',true);
				$('#addEmpSbmt').attr('disabled',false);
				$('.uploadedfile').text(data.result);
			}

		});

	}

});


App.HolidaysTableView = Ember.View.extend({
	tagName : 'table',
	attributeBindings : [ 'name', 'id','width' ],
	classNamesBindings : [ 'class' ],
	didInsertElement : function() {

		var that = this;

	    var dtable = $("#example").dataTable( {
	        "ajax": "/hrm/holidays",
			 "aoColumnDefs": [
			   {
			        "aTargets": [2],
			        "mData": null,
			        "mRender": function (data, type, full) {
			            return '<a href="javascript:deletePopup(\''+full[0]+'\',null);"><span class="glyphicon glyphicon-remove"></span></a>'
			        }
			    }]	        
	    });

	}
});
