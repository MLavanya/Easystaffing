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
	country			:String,
	city			:String,
	experience      :Number,
	mobile_num      :Number,
	skills          :String,
	country			:String,
	city			:String,
	cv              :String,
	forcompany      :String,
	status          :String,
	comments        :String,
	faved 			:Boolean
};

var vacancies = {
	jobTitle 		:String,
	vacancy			:String,
	min_experience	:Number,
	max_experience	:Number,
	country			:String,
	city			:String,
	forcompany		:String,
	description 	:String
}

module.exports = mongoose.model('login',login);
module.exports = mongoose.model('candidates',candidates);
module.exports = mongoose.model('vacancies',vacancies);