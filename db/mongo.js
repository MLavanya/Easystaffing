/** @FileName mongo.js
    @Description Mongo DB API.
**/ 
var mongoose = require('mongoose');
var pool = require('./mongodb_pool');
var Schema = mongoose.Schema;
var host, database, port, connection;

// MongoDB CRUD operation functions
var mongo = {

	/**
	 * Mongo DB connection pool initialized 
	 * @param host - MongoDB IP address or host name
	 * @param database - Database  name
	 * @param port
	 */
	init : function(host, database, port) {
		
		//Checking condition for undefined variables
		if (('undefined' === host) || (host === "")) {
			this.host = 'localhost';
		} else {
			this.host = host;
			console.log(this.host);
		}

		if ('undefined' == database) {
			throw err;
		} else {
			this.database = database;
		}

		// attach lister to connected event
		connection = pool.establishConnection(this.host, this.database);

	},
	
	/**
	 * This 'save' function add a new record on the database. 
	 * 
	 * @param collecitonName - MongoDB collection or table name
	 * @param record - A new record to be inserted on the given collection
	 * @param callback - A callback function
	 * 
	 * @return callback result else error
	 */
	save : function(collectionName, record, callback) {
		var collection = connection.model(collectionName);
		var schemaObject = new collection(record);
		schemaObject.save(function(err, result) {
			if (err) {
				console.log('Problem in saving the record ' + err);
				throw err;
			} else {
				if ('undefined' != typeof callback) {
					callback(result);
				}
			}

		});
	},

	/**Records to be retrieved based on the query. It will return JSON values, 
	 * the structure based on the given collections schema
	 *  
	 * @param collecitonName - MongoDB collection or table name
	 * @param query - Condition to be passed on the store to fetch one or more records
	 * @param callback - A callback function
	 * 
	 * @return callback result with retrieved records else error
	 */
	read : function(collectionName, query, callback) {
		var collection = connection.model(collectionName);
		collection.find(query, function(err, result) {
			if (err) {
				console.log('Problem in read the record ' + err);
				throw err;
			} else {
				if ('undefined' != typeof callback) {
					callback(result);
				}
			}
		});

	},
    
	/** A Record to be retrieved based on the given id. It will return
	 *  a record else return null
	 *  
	 * @param collecitonName - MongoDB collection or table name
	 * @param id - Condition to be passed on the store to fetch a record
	 * @param callback - A callback function
	 * 
	 * @return callback result with retrieved records else error
	 */
	
	readById : function(collectionName, id, callback) {
		var collection = connection.model(collectionName);
		collection.findById(id, function(err, result) {
			if (err) {
				console.log('Problem in read the record ' + err);
				throw err;
			} else {
				if ('undefined' != typeof callback) {
					callback(result);
				}
			}
		});

	},

	/** This will update one more records based on the given condition
	 *  
	 * @param collecitonName - MongoDB collection or table name
	 * @param query - Query will be passed to retrieve the records
	 * @param updateValue - Update value for the retrieved records
	 * @param callback - A callback function
	 * 
	 * @return callback result with retrieved records else error
	 */
	
	update : function(collectionName, query, updateValue, callback) {
		var collection = connection.model(collectionName);
		collection.update(query, updateValue, function(err, result) {
			if (err) {
				console.log('Problem in update the record ' + err);
				throw err;
			} else {
				if ('undefined' != typeof callback) {
					callback(result);
				}
			}
		});

	},
	

	/** This will remove one more records based on the given condition
	 *  
	 * @param collecitonName - MongoDB collection or table name
	 * @param query - Query will be passed to retrieve the records for remove
	 * @param callback - A callback function
	 * 
	 * @return callback result with retrieved records else error
	 */
	remove : function(collectionName,query,callback){
		var collection = connection.model(collectionName);
		collection.remove(query,function(err,result) {
			if (err) {
				console.log('Problem in remove the record ' + err);
				throw err;
			} 
			else {
				if ('undefined' != typeof callback) {
					callback(result);
				}
			}
		});
	}
	
};

module.exports = mongo;
