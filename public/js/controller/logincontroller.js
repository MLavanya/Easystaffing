App.LoginController=Ember.Controller.extend({

    actions:{
        checkadm: function(){
            var that = this;

            bootbox.prompt({
                title: "Authentication",
                message: "Enter the password.",
                callback: function(result) {
                    $.post('/validateadm',{password:result},function(data){
                        if(data == "success")
                            that.transitionTo('signup');
                    });
                },
                className: "bootbox-sm"
            });

        },
        signinclick:function(){
            var username=$("#username_id").val();
            var password=$("#password_id").val();
            if(username == "" || password == ""){
                alert('some of the required fields are Empty!!');
            }
            else{
                var adddetails={};
                adddetails.email=username;
                adddetails.password=password;
                $.ajax ({
                    type: "POST",
                    url:'/login', 
                    data:adddetails,                  
                    success: function(data) {   
                        var email = data.email; 
                        setCookie("email", email, 30);
                        window.location = data.redirectTo; //redirects to the main page
                    },
                    error: function(data) {
                        alert("Msg: "+ data.status + ": " + data.statusText);
                    }
                }); 
            }
        }
    }

});

App.SignupController=Ember.Controller.extend({
   
    actions:{
        signupclick:function(){

            var that = this;
            var name = $("#name_id").val();
            var email = $("#email_id").val();
            var username = $("#signupusername_id").val();
            var password = $("#signuppassword_id").val();

            var emailreg = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
            var namereg =/^[a-zA-Z][a-zA-Z\\s]+$/;
            if(name == "" || email == "" || username == "" || password == ""){
                alert('some of the required fields are Empty!!');
            }
            else if(!namereg.test(name)){
                alert('Enter valid Name');
            }
            else if(!emailreg.test(email)){
                alert('Enter the valid email address');
            }
            else{
                var adddetails={};
                adddetails.name=name;
                adddetails.email=email;
                adddetails.username=username;
                adddetails.password=password;
                $.ajax ({
                    type: "POST",
                    url:'/register', 
                    data:adddetails,                  
                    success: function(data) {    
                        alert(data); 
                        var email = data.Result[0].email; 
                        setCookie("email", email, 30); 
                        that.transitionTo("login");                
                    },
                    error: function(data) {
                        alert("Msg: "+ data.status + ": " + data.statusText);
                    }
                }); 
            } 

        }
    }

});

//set cookie for username
function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}