/**
 * Userschema 
 */
var mongoose = require('mongoose');

var login = {
	name    :String,
	email   :String,
	username:String,
	password:String
};

var candidates = {	
	name	        :String,
	title           :String,
	email 			:String,
	country			:String,
	city			:String,
	exp 		    :String,
	phone      		:String,
	skills          :String,
	country			:String,
	city			:String,
	cvpath	        :String,
	company_id      :String,
	status          :String,
	comments        :String,
	active 			:Boolean
};

var vacancies = {
	title	 		:String,
	name			:String,
	exp_min			:Number,
	exp_max			:Number,
	status			:String,
	country			:String,	
	city			:String,
	skills			:String,
	company_id		:String,
	description 	:String
}

module.exports = mongoose.model('login',login);
module.exports = mongoose.model('candidates',candidates);
module.exports = mongoose.model('vacancies',vacancies);