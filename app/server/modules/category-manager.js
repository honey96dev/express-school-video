
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

// const guid = function(){return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});}

/*
	login validation methods
*/

// exports.autoLogin = function(user, pass, callback)
// {
// 	categorys.findOne({user:user}, function(e, o) {
// 		if (o){
// 			o.pass == pass ? callback(o) : callback(null);
// 		}	else{
// 			callback(null);
// 		}
// 	});
// }
//
// exports.manualLogin = function(email, pass, callback)
// {
// 	categorys.findOne({email:email,is_admin:1}, function(e, o) {
// 		if (o == null){
// 			callback('user-not-found');
// 		}	else{
// 			validatePassword(pass, o.pass, function(err, res) {
// 				if (res){
// 					callback(null, o);
// 				}	else{
// 					callback('invalid-password');
// 				}
// 			});
// 		}
// 	});
// }


exports.getcategorysbyId = function(id, callback)
{

	categorys.findOne({'_id':getObjectId(id)}, callback);
}

exports.getUserbyName = function(name, callback)
{

	categorys.findOne({'email':getObjectId(email)}, callback);
}
//
// exports.generateLoginKey = function(user, ipAddress, callback)
// {
// 	let cookie = guid();
// 	categorys.findOneAndUpdate({user:user}, {$set:{
// 		ip : ipAddress,
// 		cookie : cookie
// 	}}, {returnOriginal : false}, function(e, o){
// 		callback(cookie);
// 	});
// }
//
// exports.validateLoginKey = function(cookie, ipAddress, callback)
// {
// // ensure the cookie maps to the user's last recorded ip address //
// 	categorys.findOne({cookie:cookie, ip:ipAddress}, callback);
// }
//
// exports.generatePasswordKey = function(email, ipAddress, callback)
// {
// 	let passKey = guid();
// 	categorys.findOneAndUpdate({email:email}, {$set:{
// 		ip : ipAddress,
// 		passKey : passKey
// 	}, $unset:{cookie:''}}, {returnOriginal : false}, function(e, o){
// 		if (o.value != null){
// 			callback(null, o.value);
// 		}	else{
// 			callback(e || 'account not found');
// 		}
// 	});
// }

// exports.validatePasswordKey = function(passKey, ipAddress, callback)
// {
// // ensure the passKey maps to the user's last recorded ip address //
// 	categorys.findOne({passKey:passKey, ip:ipAddress}, callback);
// }

/*
	record insertion, update & deletion methods
*/

exports.addNewCategory = function(newData, callback)
{
	// categorys.findOne({user:newData.user}, function(e, o) {
	// 	if (o){
	// 		callback('username-taken');
	// 	}	else{
	// 		categorys.findOne({email:newData.email}, function(e, o) {
	// 			if (o){
	// 				callback('email-taken');
	// 			}	else{
	// 				saltAndHash(newData.pass, function(hash){
	// 					newData.pass = hash;
	// 				// append date stamp when record was created //
	// 					newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
	// 					categorys.insertOne(newData, callback);
	// 				});
	// 			}
	// 		});
	// 	}
	// });
	categorys.findOne({name:newData.name}, function(e, o) {
		if (o){
			callback('email-taken');
		}	else{
			// saltAndHash(newData.pass, function(hash){
			// 	newData.pass = hash;
			// 	// append date stamp when record was created //
			// 	newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
			// 	categorys.insertOne(newData, callback);
			// });
			newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
			categorys.insertOne(newData, callback);
		}
	});
}

exports.updateCategory = function(newData, callback)
{
	let findOneAndUpdate = function(data){
		var o = {
			name : data.name,
			// email : data.email
		}
		if (data.pass) o.pass = data.pass;
		data.date = moment().format('MMMM Do YYYY, h:mm:ss a');
		categorys.findOneAndUpdate({'_id':getObjectId(data.id)}, {$set:o}, {returnOriginal : false}, callback);
	}
	// if (newData.pass == ''){
	// 	findOneAndUpdate(newData);
	// }	else {
	// 	saltAndHash(newData.pass, function(hash){
	// 		newData.pass = hash;
	// 		findOneAndUpdate(newData);
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

