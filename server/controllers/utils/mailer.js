var nodemailer = require('nodemailer');
//var sendgrid = require('sendgrid')('SerjeGordeev')


// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport("SMTP", {
    service: 'Gmail',
    auth: {
        user: '###',
        pass: '###'
    }
});


module.exports = function(mail, ticket){
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'SosnovskyApp', // sender address
        to: mail, // list of receivers
        subject: 'Назначена заявка', // Subject line
        text: `Вам назначена заявка #${ticket._id} \n
                Адрес: ${ticket.adress} \n
                Имя заявителя: ${ticket.declarantName} \n
                Телефон заявителя: ${ticket.declarantPhone} \n
                Описание: ${ticket.description}`, // plaintext body
        html: '' // html body
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}