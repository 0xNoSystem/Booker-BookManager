import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service:'gmail',
    
    /*auth: {
      
      user: //,
      pass: //",
    },
  });*/


  async function main(newUser) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Jerome" <lbjcoin23@gmail.com>', // sender address
      to: newUser, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });


    console.log("Message sent: %s", info.messageId);

}


export { main };
