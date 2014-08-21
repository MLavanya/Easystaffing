
/** @FileName persistence-control.js
    @Description A generic persistence model for MongoDb, MySQL and so on.
**/ 

var Injector = require("./injector");
var MongoDriver = require("./mongo");
var cjson = require('cjson');

var db_driver;

/**
 * Database driver injection method
 */
var DatabaseAdapter = {
	init : function DB_init() {
		DBAdapter = function(Driver) {
			db_driver = Driver;
		};

		Injector.register('Driver', MongoDriver);
		Injector.process(DBAdapter);
		var conf = cjson.load('./db/config.json');
		//var conf = cjson.load('config.json');
		MongoDriver.init(conf.host,conf.port,conf.database);
	},
	
	/**
	 * Save function
	 */
	save : function(collectionName, value, callback) {
		if ((collectionName != 'undefined') && (value != 'undefined')) {
			db_driver.save(collectionName,value,callback);
		}else {
			console.log('All parameters are required');
		}
	},
	
	/**
	 * Read by query function
	 */			
	read : function(collectionName,query,callback){
		if ((collectionName != 'undefined') && (query != 'undefined')) {
			db_driver.read(collectionName,query,callback);
		}else {
			console.log('All parameters are required');
		}
	},
	
	/**
	 * Update by query function
	 */	
	update : function(collectionName,query,updateValue,callback){
		if ((collectionName != 'undefined') && (query != 'undefined')) {
			db_driver.update(collectionName,query,updateValue,callback);
		}else {
			console.log('All parameters are required');
		}
	},
	
	/**
	 * Read by id function
	 */	
	readById : function(collectionName,id,callback){
		if ((collectionName != 'undefined') && (id != 'undefined')) {
			db_driver.readById(collectionName,id,callback);
		}else {
			console.log('All parameters are required');
		}
	},

     remove : function(collectionName,query,callback){
		if ((collectionName != 'undefined') && (query != 'undefined')) {
			db_driver.remove(collectionName,query,callback);
		}else {
			console.log('All parameters are required');
		}
	}

};

DatabaseAdapter.init();	

//Exporting this module
module.exports = DatabaseAdapter;