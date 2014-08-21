
/********************************
 * Application
 **********************************/
var popupbox = function(okfunction,data) {
	/*$('#edudetails .modal-header').html(title);*/
	$('#editemppopup').modal('show');
	$('#editemppopup .btn-primary').click(okfunction);
};

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
	this.resource('addcandidate');
	this.resource('addvacancy');
	this.resource('candidate');
	this.resource('search');
});

/********************************
 * Controllers
 **********************************/

App.AddcandidateController = Ember.Controller.extend({

	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),
	usertypes: ["SAHAJ","SRS","CISCO"],
	statuses: ['None','Interviewed','Rejected','Deferred','Accepted'],
	actions :{
		savecandidate: function(){

			var that = this;
			var v = true;
			var fileName = JSON.parse($(".uploadedfile").text());
			var cv = fileName.filepath;
			
			if($("#experience").val() == ""){
				popupbox("danger","Experience has to be specified");
				v=false;
			}
			if($("#email").val() == ""){
				popupbox("danger","Email has to be specified");
				v=false;
			}
			if($("#phone").val() == ""){
				popupbox("danger", "Phone number has to be specified");
				v=false;
			}

			var textarea = $('#skills:last');
			//var textext = textarea.textext()[0];

			if(textarea.val().length < 3){
				popupbox("danger","Skills has to be specified");
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
		   		    url: "/saveCandidate",
		   		    dataType:"json",
		   		    data: {
		   		    		"recruiter"	: UserName,
		   					"firstname"			: this.get("firstname"),
		   					"title"				: this.get("title"),
		   					"candidate_email"	: this.get("email"),
		   					"mobile_num"		: this.get("phone"),
		   					"experience"		: this.get("experience"),
		   					"cv"				: cv,
		   					"forcompany"		: jQuery("#company").val(),
		   					"status"			: jQuery("#status").val(),
		   					"skills"			: text,
		   					"comments"			: this.get("comments"),
		   					"faved"				: "false",
		      		    },
		   		    success: function(data){
		   		    	console.log("success");
		   		    	confirmbox("success", "Candidate Saved");
		   		    	jQuery(".form-control").val("");
	   					setTimeout(function(){that.transitionTo('home');},500);
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

App.AddvacancyController = Ember.Controller.extend({

	needs : [ 'application' ],
	currentUser : Ember.computed.alias('controllers.application.loggedinUser'),
	usertypes: ["SAHAJ","SRS","CISCO","HCL"],
	statuses: ['None','Interviewed','Rejected','Deferred','Accepted'],
	actions :{
		savecandidate: function(){

			var that = this;
			var v = true;

			if($("#experience").val() == ""){
				popupbox("danger","Experience has to be specified");
				v=false;
			}
			if($("#jobTitle").val() == ""){
				popupbox("danger","Email has to be specified");
				v=false;
			}
			if($("#vacancy").val() == ""){
				popupbox("danger", "Phone number has to be specified");
				v=false;
			}

			var textarea = $('#skills:last');
			var locationArea = $('#location:last');
			//var textext = textarea.textext()[0];

			if(textarea.val().length < 3){
				popupbox("danger","Skills has to be specified");
				v=false;
			}
			if(locationArea.val().length < 3){
				popupbox("danger","Skills has to be specified");
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
		   		    url: "/saveVacancies",
		   		    dataType:"json",
		   		    data: {
		   					"jobTitle"			: this.get("jobTitle"),
		   					"vacancy"			: this.get("vacancy"),
		   					"experience"		: this.get("experience"),
		   					"location"			: text,
		   					"forcompany"		: jQuery("#company").val(),		   					
		   					"skills"			: text,
		   					"description"		: this.get("description"),
		      		    },
		   		    success: function(data){
		   		    	console.log("success");
		   		    	confirmbox("success", "Candidate Saved");
		   		    	jQuery(".form-control").val("");
	   					setTimeout(function(){that.transitionTo('home');},500);
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

App.SearchController = Ember.Controller.extend({
	actions : {
		search : function (){
			var a;
			alert("success");
			/*$.ajax ({
                type: "POST", 
                url:'/solrclient',
                data:{saerchtext:a},                   
                success: function(data) {  
    	          //  alert(data);  
	                alert('success'+JSON.stringify(data));                 
                },
                error: function(data) {
                    alert("Msg: "+ data.status + ": " + data.statusText);
                }
            }); */
		}
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



