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

