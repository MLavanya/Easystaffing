App.IndexRoute = Ember.Route.extend({
	beforeModel:function(){
		alert(UserName);
		return UserName;
	},
	model : function(){	
		alert(UserName);	
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