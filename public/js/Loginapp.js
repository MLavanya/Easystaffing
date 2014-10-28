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
          var email=getCookie("email");
          if(email !=""){
            window.location = 'home.html';
          }
        }
});

App.Router.map(function() {
   this.resource('login');
   this.resource('signup');
   this.resource('forgotPassword');
   this.resource('changePassword',{ path: '/changePassword/:email'});
});

App.IndexRoute = Ember.Route.extend({
  	afterModel:function(){      
   		this.transitionTo("login");
  	}
});

App.SignupRoute = Ember.Route.extend({

    beforeModel: function(){

        var that = this;

        var box = bootbox.confirm({
            title: "Authentication",
            message: "Enter the PIN <br/> <input id='pin_code' type='password' name='pin_code' tabindex=0></input>",
            callback: function(result) {

                if(result)
                  $.post('/validateadm',{password:$('#pin_code').val()},function(data){

                      if(data == "success")
                          that.transitionTo('signup');
                      else
                        that.transitionTo('login');  
                  });
                else
                   that.transitionTo('login');
            },
            className: "bootbox-sm"
        });

        box.on('shown',function(){
            $("#pin_code").focus();
        });        

    }
});

App.ChangePasswordRoute = Ember.Route.extend({
    model:function(params){            
      return [{'email':params.email}];
    }
});


