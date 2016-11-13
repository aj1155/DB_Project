var email = require("emailjs");

function SendMail(title,to,content) {
    var server = email.server.connect({

        user: "skhuproject1",

        password: "skhu@ac.kr",

        host: "smtp.gmail.com", // ex) smtp.naver.com

        ssl: true

    });

    var message = {

        text: title,

        from: "성공회대학교 <skhuproject1@gmail.com>",

        to: to,

        subject: title,

        attachment:
            [

                {data: content, alternative: true}

            ]
    };

    //메일 보내기
    server.send(message, function(err, message) {
        //에러시 메시지
        if(err){
            console.error(err);
        }
    });
}

module.exports = {

    send: SendMail

};

