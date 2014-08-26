App.IndexRoute = Ember.Route.extend({
	model : function(){
		this.transitionTo("dashboard");
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