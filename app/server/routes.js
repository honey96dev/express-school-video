
var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
function makeid(length) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}
module.exports = function(app) {

/*
	login & logout
*/
	app.get('/', function(req, res){
		// check if the user has an auto login key saved in a cookie //
		// if (req.cookies.login == undefined){
		// 	res.render('login', { title: 'Hello - Please Login To Your Account' });
		// }	else{
		// 	// attempt automatic login //
		// 	AM.validateLoginKey(req.cookies.login, req.ip, function(e, o){
		// 		if (o){
		// 			AM.autoLogin(o.user, o.pass, function(o){
		// 				req.session.user = o;
		// 				res.redirect('/home');
		// 			});
		// 		}	else{
		// 			res.render('login', { title: 'Hello - Please Login To Your Account' });
		// 		}
		// 	});
		// }
		res.render('home', { title: 'VideoClass' });
	});

	app.get('/administrator', function(req, res){
	// check if the user has an auto login key saved in a cookie //
		if (req.cookies.login == undefined){
			res.render('adminlogin', { title: 'Login' });
		}	else{
			AM.validateLoginKey(req.cookies.login, req.ip, function(e, o){
				if (o){
					AM.autoLogin(o.user, o.pass, function(o){
						req.session.user = o;
						res.redirect('/usermanage');
					});
				}	else{
					res.render('login', { title: 'Login' });
				}
			});
		}
	});
	
	app.post('/administrator', function(req, res){
		AM.manualLogin(req.body['email'], req.body['pass'], function(e, o){
			if (!o){
				res.status(400).send(e);
			}	else{
				req.session.user = o;
				// if (req.body['remember-me'] == 'false'){
				// 	res.status(200).send(o);
				// }	else{
				// 	AM.generateLoginKey(o.user, req.ip, function(key){
				// 		res.cookie('login', key, { maxAge: 900000 });
				// 		res.status(200).send(o);
				// 	});
				// }
				AM.generateLoginKey(o.user, req.ip, function(key){
					res.cookie('login', key, { maxAge: 900000 });
					res.status(200).send(o);
				});
			}
		});
	});

	app.get('/logout', function(req, res){
		res.clearCookie('login');
		req.session.destroy(function(e){ res.redirect('/'); });
	})
	
/*
	control panel
*/
	app.get('/usermanage', function(req, res) {
		if (req.session.user == null){
			res.redirect('/administrator');
		}	else{
			AM.getAllRecords( function(e, accounts){
				res.render('usermanage', { title : 'User List', udata : accounts });
			})
		}
	});

	app.post('/usermanage', function(req, res){

		var token = makeid(6);
		console.log(token);
		AM.addNewAccount({
			name 	: req.body['name'],
			email 	: req.body['email'],
			pass	: token,
			token	: token,
			// contactnum : req.body['contactnum'],
			// institution : req.body['institution'],
			is_admin : 0

		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});


	app.get('/fetchdata', function(req, res, next) {
		var id = req.query.id;
		AM.getUserbyId(id,function(e, obj){
			res.send(obj);
		})
		// db.collection('products').find({_id: new mongodb.ObjectID(id)}).toArray(function(err, docs){
		// 	if(err) throw err;
		// 	res.send(docs);
		// 	db.close();
		// });
	});
	// app.get('/emailcheck', function(req, res, next) {
	// 	var email = req.query.email;
	// 	AM.getUserbyEmail(email,function(e, obj){
	// 		res.send(obj);
	// 	})
	// });
	app.post('/updateuser', function(req, res){
		if (req.session.user == null){
			res.redirect('/');
		}	else{
			console.log(req.body['id']);
			AM.updateAccount({
				id		: req.body['id'],
				name	: req.body['name'],
				email	: req.body['email']
			}, function(e, o){
				if (e){
					res.status(400).send('error-updating-account');
				}	else{
					req.session.user = o.value;
					res.status(200).send('ok');
				}
			});
		}
	});

	app.get('/category', function(req, res) {
		if (req.session.user == null){
			res.redirect('/administrator');
		}	else{
			AM.getAllRecords( function(e, accounts){
				res.render('category', { title : 'Category List', udata : accounts });
			})
		}
	});

	// app.get('/home', function(req, res) {
	// 	if (req.session.user == null){
	// 		res.redirect('/');
	// 	}	else{
	// 		res.render('home', {
	// 			title : 'Video Class',
	// 			countries : CT,
	// 			udata : req.session.user
	// 		});
	// 	}
	// });
	//
	// app.post('/home', function(req, res){
	// 	if (req.session.user == null){
	// 		res.redirect('/');
	// 	}	else{
	// 		AM.updateAccount({
	// 			id		: req.session.user._id,
	// 			name	: req.body['name'],
	// 			email	: req.body['email'],
	// 			pass	: req.body['pass'],
	// 			country	: req.body['country']
	// 		}, function(e, o){
	// 			if (e){
	// 				res.status(400).send('error-updating-account');
	// 			}	else{
	// 				req.session.user = o.value;
	// 				res.status(200).send('ok');
	// 			}
	// 		});
	// 	}
	// });

/*
	new accounts
*/

	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : CT });
	});
	
	app.post('/signup', function(req, res){

		AM.addNewAccount({
			// name 	: req.body['name'],
			email 	: req.body['email'],
			// user 	: req.body['user'],
			pass	: req.body['pass'],
			contactnum : req.body['contactnum'],
			institution : req.body['institution'],
			is_admin : 1

		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});

/*
	password reset
*/

	app.post('/lost-password', function(req, res){
		let email = req.body['email'];
		AM.generatePasswordKey(email, req.ip, function(e, account){
			if (e){
				res.status(400).send(e);
			}	else{
				EM.dispatchResetPasswordLink(account, function(e, m){
			// TODO this callback takes a moment to return, add a loader to give user feedback //
					if (!e){
						res.status(200).send('ok');
					}	else{
						for (k in e) console.log('ERROR : ', k, e[k]);
						res.status(400).send('unable to dispatch password reset');
					}
				});
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		AM.validatePasswordKey(req.query['key'], req.ip, function(e, o){
			if (e || o == null){
				res.redirect('/');
			} else{
				req.session.passKey = req.query['key'];
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});
	
	app.post('/reset-password', function(req, res) {
		let newPass = req.body['pass'];
		let passKey = req.session.passKey;
	// destory the session immediately after retrieving the stored passkey //
		req.session.destroy();
		AM.updatePassword(passKey, newPass, function(e, o){
			if (o){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('unable to update password');
			}
		})
	});
	
/*
	view, delete & reset accounts
*/
	//
	// app.get('/print', function(req, res) {
	// 	AM.getAllRecords( function(e, accounts){
	// 		res.render('print', { title : 'Account List', accts : accounts });
	// 	})
	// });
	//
	app.get('/userdel', function(req, res){
		AM.deleteAccount(req.query.id, function(e, obj){
			if (!e){
				// res.clearCookie('login');
				// req.session.destroy(function(e){ res.status(200).send('ok'); });
				res.redirect('/usermanage');
			}	else{
				res.status(400).send('record not found');
			}
		});
	});
	app.get('/active', function(req, res){
		// AM.deleteAccount(req.query.id, function(e, obj){
		// 	if (!e){
		// 		// res.clearCookie('login');
		// 		// req.session.destroy(function(e){ res.status(200).send('ok'); });
		// 		res.redirect('/usermanage');
		// 	}	else{
		// 		res.status(400).send('record not found');
		// 	}
		// });
	});

	app.get('/reset', function(req, res) {
		AM.deleteAllAccounts(function(){
			res.redirect('/print');
		});
	});
	
	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};
