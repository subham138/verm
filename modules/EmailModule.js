const db = require('../core/db');
const dateFormat = require('dateformat');
const nodemailer = require('nodemailer');
const { F_Select } = require('./MasterModule');

// var client_url = 'http://localhost:4200/#/';
var client_url = 'https://verm.opentech4u.co.in/#/';
var api_url = 'https://vermapi.opentech4u.co.in/';

const UserCredential = async (email_id, user_name, password) => {
    var email_name = 'Admin'
    return new Promise(async (resolve, reject) => {
        // FOR LOCAL
		// var transporter = nodemailer.createTransport({
		//     service: 'gmail',
		//     auth: {
		//         user: 'synergicbbps@gmail.com',
		//         pass: 'Signature@123'
		//     }
		// });

		// FOR SERVER
		var transporter = nodemailer.createTransport({
			//pool: true,
			host: 'webmail.opentech4u.co.in',
			port: 25,
			secure: false,
			auth: {
				user: 'verm@opentech4u.co.in',
				pass: 'Verm#sss!Malayasia@2021'
			},
			tls: {
				// do not fail on invalid certs
				rejectUnauthorized: false
			}
		});

        var mailOptions = {
            from: 'verm@opentech4u.co.in',
            to: email_id,
            subject: 'VERM User Credential',
            html: '<!DOCTYPE html>'
                + '<html>'
                + '<head>'
                + '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
                + '<title>VERM</title>'
                + '<style type="text/css">'
                + 'body{margin:0; padding:0; font-family:14px; font-family:Arial, Helvetica, sans-serif;}'
                + '</style>'
                + '</head>'
                + '<body>'
                + '<div class="sectionArea" style="max-width:750px; width:100%; margin:2% auto 2% auto; padding:15px; background:#faf9f9; border-radius:15px;border: #ececec solid 1px;">'
                + '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
				+ '<tr>'
				+ '<td align="left" valign="top" class="logoArea" style="padding:0 0 25px 0; text-align:center;"><img src="https://verm.opentech4u.co.in/assets/images/logoWhit.png" width="402" height="300" alt="" style="max-width:190px; width:100%; height:auto; margin:0 auto;"></td>'
				+ '</tr>'
                + '<tr>'
                + '<td align="left" valign="top">'
                + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Hi ' + user_name + ',</h2>'
                // + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Congratulations</h2>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">Your login credentials are as follow</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;"><b>UserName:</b> ' + email_id + '<br><b>Password:</b> ' + password + '</p>'
                // + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">Please click on the link bellow to login.</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:19px; padding-bottom:15px; margin:0;"><strong>Your Sincerely</strong>,<br>'
                + email_name + '</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; padding-top:20px; padding-bottom:20px; margin:0;">'
                + '<a href="' + client_url + 'login" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600;'
                + 'padding: 8px 15px; margin: 0; background: #3fb048; text-decoration: none; color: #fff; border-radius: 34px; width: 100%; display: inline-block; text-align: center; box-sizing: border-box;">Login</a>'
                + '</p></td>'
                + '</tr>'
                + '</table>'
                + '</div>'
                + '</body>'
                + '</html>'
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                data = { suc: 0, msg: JSON.stringify(error) };
            } else {
                console.log('Email sent: ' + info.response);
                data = { suc: 1, msg: 'Email sent: ' + info.response };
            }
            resolve(data);
        });

    })
}

const AssignTeamMail = async (emp_id, team_name) => {
	var table_name = 'md_employee',
        select = `emp_name, email`,
        whr = `employee_id = "${emp_id}"`;
    var dt = await F_Select(select, table_name, whr, null);
    var email_name = 'Admin',
		email_id = dt.msg[0].email,
		user_name = dt.msg[0].emp_name;
    return new Promise(async (resolve, reject) => {
        // FOR LOCAL
		// var transporter = nodemailer.createTransport({
		//     service: 'gmail',
		//     auth: {
		//         user: 'synergicbbps@gmail.com',
		//         pass: 'Signature@123'
		//     }
		// });

		// FOR SERVER
		var transporter = nodemailer.createTransport({
			//pool: true,
			host: 'webmail.opentech4u.co.in',
			port: 25,
			secure: false,
			auth: {
				user: 'verm@opentech4u.co.in',
				pass: 'Verm#sss!Malayasia@2021'
			},
			tls: {
				// do not fail on invalid certs
				rejectUnauthorized: false
			}
		});

        var mailOptions = {
            from: 'verm@opentech4u.co.in',
            to: email_id,
            subject: 'Team Assign',
            html: '<!DOCTYPE html>'
                + '<html>'
                + '<head>'
                + '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
                + '<title>VERM</title>'
                + '<style type="text/css">'
                + 'body{margin:0; padding:0; font-family:14px; font-family:Arial, Helvetica, sans-serif;}'
                + '</style>'
                + '</head>'
                + '<body>'
                + '<div class="sectionArea" style="max-width:750px; width:100%; margin:2% auto 2% auto; padding:15px; background:#faf9f9; border-radius:15px;border: #ececec solid 1px;">'
                + '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
				+ '<tr>'
				+ '<td align="left" valign="top" class="logoArea" style="padding:0 0 25px 0; text-align:center;"><img src="https://verm.opentech4u.co.in/assets/images/logoWhit.png" width="402" height="300" alt="" style="max-width:190px; width:100%; height:auto; margin:0 auto;"></td>'
				+ '</tr>'
                + '<tr>'
                + '<td align="left" valign="top">'
                + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Hi ' + user_name + ',</h2>'
                // + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Congratulations</h2>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">You are successfully assigned to <b>'+ team_name +'</b>.</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">For more information please visit our web portal <a href="'+client_url+'">VERM</a>.</p>'
                // + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">Please click on the link bellow to login.</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:19px; padding-bottom:15px; margin:0;"><strong>Your Sincerely</strong>,<br>'
                + email_name + '</p>'
                // + '<p style="font-family:Arial, Helvetica, sans-serif; padding-top:20px; padding-bottom:20px; margin:0;">'
                // + '<a href="' + client_url + 'login" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600;'
                // + 'padding: 8px 15px; margin: 0; background: #3fb048; text-decoration: none; color: #fff; border-radius: 34px; width: 100%; display: inline-block; text-align: center; box-sizing: border-box;">Login</a></p>'
                + '</td>'
                + '</tr>'
                + '</table>'
                + '</div>'
                + '</body>'
                + '</html>'
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                data = { suc: 0, msg: JSON.stringify(error) };
            } else {
                console.log('Email sent: ' + info.response);
                data = { suc: 1, msg: 'Email sent: ' + info.response };
            }
            resolve(data);
        });

    })
}

const ResetPasswordEmail = async (email_id, user_name, en_dt, flag) => {
    var email_name = 'Admin'
    return new Promise(async (resolve, reject) => {
        // FOR LOCAL
		// var transporter = nodemailer.createTransport({
		//     service: 'gmail',
		//     auth: {
		//         user: 'synergicbbps@gmail.com',
		//         pass: 'Signature@123'
		//     }
		// });

		// FOR SERVER
		var transporter = nodemailer.createTransport({
			//pool: true,
			host: 'webmail.opentech4u.co.in',
			port: 25,
			secure: false,
			auth: {
				user: 'verm@opentech4u.co.in',
				pass: 'Verm#sss!Malayasia@2021'
			},
			tls: {
				// do not fail on invalid certs
				rejectUnauthorized: false
			}
		});

        var mailOptions = {
            from: 'verm@opentech4u.co.in',
            to: email_id,
            subject: 'VERM Reset Password',
            html: '<!DOCTYPE html>'
                + '<html>'
                + '<head>'
                + '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
                + '<title>VERM</title>'
                + '<style type="text/css">'
                + 'body{margin:0; padding:0; font-family:14px; font-family:Arial, Helvetica, sans-serif;}'
                + '</style>'
                + '</head>'
                + '<body>'
                + '<div class="sectionArea" style="max-width:750px; width:100%; margin:2% auto 2% auto; padding:15px; background:#faf9f9; border-radius:15px;border: #ececec solid 1px;">'
                + '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
				+ '<tr>'
				+ '<td align="left" valign="top" class="logoArea" style="padding:0 0 25px 0; text-align:center;"><img src="https://verm.opentech4u.co.in/assets/images/logoWhit.png" width="402" height="300" alt="" style="max-width:190px; width:100%; height:auto; margin:0 auto;"></td>'
				+ '</tr>'
                + '<tr>'
                + '<td align="left" valign="top">'
                + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Hi ' + user_name + ',</h2>'
                // + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Congratulations</h2>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">You have requested for reset your password.</p>'
			+ '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">Please click on the link below to reset your password.</p>'
               // + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;"><b>UserName:</b> ' + email_id + '<br><b>Password:</b> ' + password + '</p>'
                // + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">Please click on the link bellow to login.</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:19px; padding-bottom:15px; margin:0;"><strong>Your Sincerely</strong>,<br>'
                + email_name + '</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; padding-top:20px; padding-bottom:20px; margin:0;">'
                + '<a href="' + client_url + 'resetPassword/'+flag+'/'+en_dt+'" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600;'
                + 'padding: 8px 15px; margin: 0; background: #3fb048; text-decoration: none; color: #fff; border-radius: 34px; width: 100%; display: inline-block; text-align: center; box-sizing: border-box;">Reset Password</a>'
                + '</p></td>'
                + '</tr>'
                + '</table>'
                + '</div>'
                + '</body>'
                + '</html>'
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                data = { suc: 0, msg: JSON.stringify(error) };
            } else {
                console.log('Email sent: ' + info.response);
                data = { suc: 1, msg: 'Email sent: ' + info.response };
            }
            resolve(data);
        });

    })
}

module.exports = { UserCredential, AssignTeamMail, ResetPasswordEmail };