App = Ember.Application.create({
  	ready:function(){
 	
 	}
});

App.Router.map(function() {
   this.resource('login');
   this.resource('signup');
});

App.IndexRoute = Ember.Route.extend({
  	afterModel:function(){
   		this.transitionTo("login");
  	}
});


