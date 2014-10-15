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
            var email_id=$("#email_id").val();
            var password=$("#password_id").val();
            if(email_id == "" || password == ""){
                bootbox.alert('some of the required fields are Empty!!');
            }
            else{
                var adddetails={};
                adddetails.email=email_id;
                adddetails.password=password;
                $.ajax ({
                    type: "POST",
                    url:'/login', 
                    data:adddetails,                  
                    success: function(data) { 
                        if(data.status ==200){
                            var email = data.email; 
                            var region = data.region; 
                            setCookie("email", email, 30);
                            setCookie("isAdmin", data.admin, 30);
                            setCookie("rolescnt", data.rolescnt,30);
                            setCookie("region", region, 30);                             
                                window.location = data.redirectTo; //redirects to the main page                             
                        } else{
                            bootbox.alert({
                                message: "Invalid User",                                                          
                            });
                        }                                                                   
                        
                       // window.location = data.redirectTo; //redirects to the main page
                    },
                    error: function(data) {
                        bootbox.alert(data.statusText);
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
            var region =$(".radio-inline input[type='radio']:checked").val();            

            var emailreg = /^([a-zA-Z0-9_\.\-])+@srsconsultinginc.com/;
            var namereg =/^[a-zA-Z][a-zA-Z\\s0-9]+$/;
            if(name == "" || email == "" || username == "" || password == ""){
                bootbox.alert('some of the required fields are to be filled!!');
            }
            else if(!namereg.test(username)){
                bootbox.alert('Enter valid Name');
            }
            else if(!emailreg.test(email)){
                bootbox.alert('Enter the valid SRS email address');
            }else if (!region) {
                bootbox.alert("select the region you work for !")
            }
            else{
                var adddetails={};
                adddetails.name=name;
                adddetails.email=email;
                adddetails.username=username;
                adddetails.password=password;
                adddetails.region=region;
                $.ajax ({
                    type: "POST",
                    url:'/register', 
                    data:adddetails,                  
                    success: function(data) {  
                        bootbox.alert(data);
                        that.transitionTo("login");                
                    },
                    error: function(data) {
                        bootbox.alert("Msg: "+ data.status + ": " + data.statusText);
                    }
                }); 
            } 

        }
    }

});

/******
set cookie 
******/
function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}