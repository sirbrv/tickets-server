const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
const fs = require("fs");
const enviarMail = async (options) => {
  // https://tickets-server.onrender.com
  https: try {
    // Generar el código QR de forma asíncrona
    const imgData = await QRCode.toDataURL(
      `http://${options.url}/api/verify/${options.numTicket}`
    );
    fs.writeFileSync("qr.pgn", `${imgData}`);

    const imgSrc = "data:image/png;base64," + imgData.split(",")[1];
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to: options.email,
      subject: options.subject,
      text: "Halo ini dari node js", // plain text body
      attachDataUrls: true, //to accept base64 content in messsage
      // html: 'Halo ini barcodenya </br> <img src="' + imgData + '">', // html body

      html: `
        <table border="0" cellpadding="0" cellspacing="0" width="400px" backgound-color="#2d3436" >
          <tr heigth="200px">
              <td bgcolor="" width="400px" >
                <P style="background-color: #fff; color: #000; text-align: left" > Sr(a) ${options.compreador} usted ha adquirido una entrada para el evento. Título, ${options.evento}</P>
                <P style="background-color: #fff; color: #000; text-align: left" > Estará ubicado en la Fila 23 puesto B3 </P>
                <P  style="background-color: #fff; color: #000; text-align: left" >Gracias por ser parte de nuestro Evento</P>
              </td>
          </tr>
          <tr bgcolor="#fff">
              <td style="text-align: center;">
                  <div style="background-color: #fff; color: #000; width: 100%; height: 100%;">
                      <img src="${imgSrc}" height="200px" width="200">
                  </div>
              </td>
          </tr>
          <tr style="background-color: #fff"; >
              <td style="text-align: left"t; >
                <h4>No Olvíde Presentar este Correo Electrónico, el día del Evento...</h4>
              </td>
              </tr>
          </table>
        `,
    };
    // Enviar correo electrónico
    const info = await transporter.sendMail(mailOptions);
    // console.log("Se ha enviado el correo electrónico correctamente.");
    return info.response;
  } catch (error) {
    // console.log("Error al enviar el correo electrónico:", error);
    return error;
  }
};

module.exports = enviarMail;
