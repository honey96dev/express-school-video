
const crypto 		= require('crypto');
const moment 		= require('moment');
const MongoClient 	= require('mongodb').MongoClient;

var db, categorys;
MongoClient.connect(process.env.DB_URL, { useNewUrlParser: true }, function(e, client) {
	if (e){
		console.log(e);
	}	else{
		db = client.db(process.env.DB_NAME);
		categorys = db.collection('categorys');
	// index fields 'user' & 'email' for faster new account validation //
		categorys.createIndex({name: 1, date: 1});
		console.log('mongo :: connected to database :: "'+process.env.DB_NAME+'"');
	}
});


exports.getcategorysbyId = function(id, callback)
{

	categorys.findOne({'_id':getObjectId(id)}, callback);
}

exports.getUserbyName = function(name, callback)
{

	categorys.findOne({'email':getObjectId(email)}, callback);
}

/*
	record insertion, update & deletion methods
*/

exports.addNewCategory = function(newData, callback)
{

	categorys.findOne({name:newData.name}, function(e, o) {
		if (o){
			callback('email-taken');
		}	else{

			newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
			categorys.insertOne(newData, callback);
		}
	});
}

exports.updateCategory = function(newData, callback)
{
	let findOneAndUpdate = function(data){
		var o = {
			name : data.name
			// email : data.email
		}
		//if (data.pass) o.pass = data.pass;

		data.date = moment().format('MMMM Do YYYY, h:mm:ss a');
		categorys.findOneAndUpdate({'_id':getObjectId(data.id)}, {$set:o}, {returnOriginal : false}, callback);
	}
	findOneAndUpdate(newData);
	// if (newData.pass == ''){
	// 	findOneAndUpdate(newData);
	// }	else {
	// 	saltAndHash(newData.pass, function(hash){
	// 		newData.pass = hash;
	//
	// 	});
	// }
}
//
// exports.updatePassword = function(passKey, newPass, callback)
// {
// 	saltAndHash(newPass, function(hash){
// 		newPass = hash;
// 		categorys.findOneAndUpdate({passKey:passKey}, {$set:{pass:newPass}, $unset:{passKey:''}}, {returnOriginal : false}, callback);
// 	});
// }

/*
	account lookup methods
*/

exports.getAllRecords = function(callback)
{
	categorys.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

exports.deleteCategory = function(id, callback)
{
	categorys.deleteOne({_id: getObjectId(id)}, callback);
}

exports.deleteAllcategorys = function(callback)
{
	categorys.deleteMany({}, callback);
}

/*
	private encryption & validation methods
*/
//
// var generateSalt = function()
// {
// 	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
// 	var salt = '';
// 	for (var i = 0; i < 10; i++) {
// 		var p = Math.floor(Math.random() * set.length);
// 		salt += set[p];
// 	}
// 	return salt;
// }
//
// var md5 = function(str) {
// 	return crypto.createHash('md5').update(str).digest('hex');
// }
//
// var saltAndHash = function(pass, callback)
// {
// 	var salt = generateSalt();
// 	callback(salt + md5(pass + salt));
// }
//
// var validatePassword = function(plainPass, hashedPass, callback)
// {
// 	var salt = hashedPass.substr(0, 10);
// 	var validHash = salt + md5(plainPass + salt);
// 	callback(null, hashedPass === validHash);
// }

var getObjectId = function(id)
{
	return new require('mongodb').ObjectID(id);
}
//
// var listIndexes = function()
// {
// 	categorys.indexes(null, function(e, indexes){
// 		for (var i = 0; i < indexes.length; i++) console.log('index:', i, indexes[i]);
// 	});
// }

