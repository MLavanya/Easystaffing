var search_text;

/********************************
 * Application
 **********************************/

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
    	var user=getCookie("email");
    	UserName = user;
		if(user !=""){		            
        	//alert('Welcome'+" "+user);
        }
        else{window.location = 'login.html';}
	}
});

/********************************
 * Routes
 **********************************/

App.Router.map(function() {
	this.resource('test');
	this.resource('dashboard');
	this.resource('profile');
	this.resource('addcandidate');
	this.resource('addvacancy');
	this.resource('candidate',{ path: '/candidate/:candidate_id' });
	this.resource('searchResult', { path: '/searchResult/:query' });
	this.resource('vacancy', { path: '/vacancy/:vacancy_id' });
});