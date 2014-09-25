var should = require('should'); 
var request = require('supertest'); 
var assert = require('assert'); 
var winston = require('winston');
var requireHelper = require('./require_helper');
var app = requireHelper('app');

var url = 'http://localhost:3000';

 describe('Account', function() {
    it('checking for user existence', function(done) {
      var profile = {
        name: 'pradeep',
        username: 'test123',
        email: 'pradeep@test.com',
        password: 'test'
      };
   
    request(url)
  	.post('/register')
  	.send(profile)
    .expect(200,done);
    });

});
