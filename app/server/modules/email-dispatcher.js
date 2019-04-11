var app = require('express')(),
	mailer = require('express-mailer');

mailer.extend(app, {
	from: 'akkilnadev@gmail.com',
	host: 'smtp.gmail.com', // hostname
	secureConnection: true, // use SSL
	port: 465, // port for secure SMTP
	transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
	auth: {
		user: 'akkilnadev@gmail.com',
		pass: 'Info@123456'
	}
});


var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect(
{
	host 	    : process.env.NL_EMAIL_HOST || 'smtp.gmail.com',
	user 	    : process.env.NL_EMAIL_USER || 'akkilnadev@gmail.com',
	password    : process.env.NL_EMAIL_PASS || 'Info@gmail.com',
	ssl		    : true
});

EM.dispatchResetPasswordLink = function(account, callback)
{
	EM.server.send({
		from         : process.env.NL_EMAIL_FROM || 'Node Login <do-not-reply@gmail.com>',
		to           : account.email,
		subject      : 'Password Reset',
		text         : 'something went wrong... :(',
		attachment   : EM.composeEmail(account)
	}, callback );
}

EM.composeEmail = function(o)
{
	let baseurl = process.env.NL_SITE_URL || 'http://localhost:3000';
	var html = "<html><body>";
		html += "Hi "+o.name+",<br><br>";
		html += "Your username is <b>"+o.user+"</b><br><br>";
		html += "<a href='"+baseurl+'/reset-password?key='+o.passKey+"'>Click here to reset your password</a><br><br>";
		html += "Cheers,<br>";
		html += "<a href='https://braitsch.io'>braitsch</a><br><br>";
		html += "</body></html>";
	return [{data:html, alternative:true}];
};

EM.composeAddUserEmail = function(email, password) {
	app.mailer.send('email', {
		to: email, // REQUIRED. This can be a comma delimited string just like a normal email to field.
		subject: 'You registered as a teacher', // REQUIRED.
		// otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
	}, function (err) {
		if (err) {
			// handle error
			console.log(err);
			res.send('There was an error sending the email');
			return;
		}

		var html = "<html><body>";
		html += "Hello,<br><br>";
		html += "You are registered as a teacher.</b><br><br>";
		html += "ID: " + email + "<br>";
		html += "Password: " + password + "<br>";
		html += "</body></html>";

		res.send(html);
	});
};
