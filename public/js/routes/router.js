App.IndexRoute = Ember.Route.extend({
	afterModel : function(){
		this.transitionTo("dashboard");
	}
});

App.DashboardRoute = Ember.Route.extend({
	model:function(){
		return $.get('/piechartdetails',function(data){			
			return data;
		});
	}
});

App.AddvacancyRoute = Ember.Route.extend({
	model:function(){
		return null;
	}
});

App.AddcandidateRoute = Ember.Route.extend({
	model:function(){
		return null;
	}
});


App.SearchResultRoute = Ember.Route.extend({
   
	model: function(params){

		var q = params.query.split("&")[0];
		var s = params.query.split("&")[1].split("=")[1];

		this.set('schema',s);

		return $.ajax ({
	        type: "POST", 
	        url:'/solrclient',
	        data:{searchtext:q,schema:s},                   
	        success: function(data) {  
	            search_text="";
	            data.keyword = params.query;
	            data.schema = s;
	          	return data;  
	        },
	        error: function(data) {
	            alert("Msg: "+ data.status + ": " + data.statusText);
	        }
	    }); 		
	}

});


App.VacancyRoute = Ember.Route.extend({

	model: function(params){
		return $.get('/getvacancy/'+params.vacancy_id,function(data){
			if(data.status == "OPEN")
				data.isOpen = true;
			else
				data.isOpen = false;
			return data;
		});
	}

});

App.CandidateRoute = Ember.Route.extend({

	model: function(params){
		return $.get('/getcandidate/'+params.candidate_id,function(data){
			if(data.applications){
				$.each(data.applications,function(i,row){
					if(data.applications[i].vacancy_status == "OPEN")
						data.applications[i].isOpen = true;
					else
						data.applications[i].isOpen = false;
				});
			}

			return data;
		});
	}

});

App.ProfileRoute = Ember.Route.extend({

	model:function(){
		return $.get('/getUserdata',function(data){			
			return data;
		});				
	}
});