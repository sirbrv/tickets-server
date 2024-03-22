const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("./config.js");
const port = process.env.PORT;
console.log("puerto.....:", process.env.SMPT_HOST);
const app = express();

app.use(morgan("dev"));

app.use(cors());
app.use(express.json());

// const enviarMail = require("./services/sendMail");

// console.log("Voy a enviar mensaje..:");
// enviarMail({
//   email: "sirbrv@gmail.com",
//   subject: "Compra de Boletos",
//   message: `Hola Victor Brown, activa tu cuenta en el enlace siguiente.: `,
// });

// console.log(" mensaje enviado..:");

app.get("/", function (req, res) {
  res.send("Proyecto de la Académia IT");
});

app.use("/api", require("./routes/VerifyRoutes.js"));
app.use("/api", require("./routes/Contact"));
app.use("/api", require("./routes/StudentRoutes.js"));
app.use("/api", require("./routes/EventsRoutes.js"));
app.use("/api", require("./routes/AcademyRoutes.js"));
app.use("/api", require("./routes/TicketsRoutes.js"));

app.listen(port, () => {
  console.log("Servidor disponible en  http://localhost:" + port);
});
