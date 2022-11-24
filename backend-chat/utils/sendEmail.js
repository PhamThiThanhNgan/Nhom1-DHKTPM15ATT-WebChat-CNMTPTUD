
const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			service: "gmail",
			port: 465,
			secure: true,
			type:"oauth2",
			auth: {
				user: 'thanhngan1262018@gmail.com',
				pass: 'xicebjwnwrdxxnlm',
			},
		});

		await transporter.sendMail({
			from: process.env.USER,
			to: email,
			subject: subject,
			text: text,
			html: '<h2>Vui lòng bấm vào link để đổi lại mật khẩu của bạn</h2><ul><li>Link: ' + text + '</li></ul>'
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};