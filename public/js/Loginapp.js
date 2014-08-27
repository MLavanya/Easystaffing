App = Ember.Application.create({
  	ready:function () {
        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }
            return "";
          }
          var user=getCookie("email");
          if(user !=""){
            window.location = 'home.html';
          }
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


