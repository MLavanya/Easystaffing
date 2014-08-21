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
	recruiter		:String,
	firstname       :String,
	title           :String,
	candidate_email :String,
	experience      :Number,
	mobile_num      :Number,
	skills          :String,
	cv              :String,
	forcompany      :String,
	status          :String,
	comments        :String,
	faved 			:Boolean
};

var vacancies = {
	jobTitle 	:String,
	vacancy		:String,
	experience	:Number,
	location	:String,
	forcompany	:String,
	description :String
}

module.exports = mongoose.model('login',login);
module.exports = mongoose.model('candidates',candidates);
module.exports = mongoose.model('vacancies',vacancies);