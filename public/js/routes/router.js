App.IndexRoute = Ember.Route.extend({
	afterModel : function(){
		this.transitionTo("dashboard");
	}
});

App.DashboardRoute = Ember.Route.extend({

});


App.SearchResultRoute = Ember.Route.extend({
   
	model: function(params){
		return $.ajax ({
	        type: "POST", 
	        url:'/solrclient',
	        data:{searchtext:params.query},                   
	        success: function(data) {  
	            search_text="";
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
			return data;
		});
	}

});

App.CandidateRoute = Ember.Route.extend({

	model: function(params){
		return $.get('/getcandidate/'+params.candidate_id,function(data){
			console.log(data);
			return data;
		});
	}

});