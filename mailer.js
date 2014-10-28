var extend = require('util')._extend,
   mailtemplates = require('./mailtemp'),
   nodemailer = require("nodemailer"),
   path       = require('path'),
   emailTemplates = require('email-templates'),
   templatesDir   = path.join(__dirname, './public/mailer/'),
   config = require('./config.js'),
   mail =  require('nodemailer').mail;

module.exports = {
   sendMail: function(to, mail_type,data, callback){  
   var mailOptions = {
      from: data.from_address,
      to: data.to_address, 
      subject: "", 
       text: "", 
       html: ""    
   }  
     
      emailTemplates(templatesDir, function(err, template){ 
         //var transport = nodemailer.createTransport(config.MAIL_PROVIDER_TYPE,config.MAIL_PROVIDER_CONFIG);//ses & nodemailder transport
            var mailoption = extend({}, mailOptions);
            var mail_type_option = mailtemplates[mail_type];
            mailoption.subject = mailoption.text = mail_type_option.subject;
            var template_file= mail_type_option.template;    
            var images_path = templatesDir+ template_file;
            data.images_path = images_path;
           // console.log("the information for sending mail*********" + JSON.stringify(data));
            template(template_file,  data, function(err, html, text) {
               console.log("before sending mail.");
               if(err){
               console.log("Error sending email template...." + data.to_address,err);
               return;
            }
               else{
                  mailoption.html = html;
                  mailoption.text = text;
                  mailoption.forceEmbeddedImages = true;
                  mail(mailoption, function(error, response){
                     if(callback){
                        callback(err, response);
                     }
                  console.log("Successfully sent email  for the user " + data.to_address);
               });
               }
            });
         
      });
   }    
};