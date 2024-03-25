const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("./config.js");
const port = process.env.PORT;
const host = process.env.HOST;
const app = express();

app.use(morgan("dev"));

app.use(cors());
app.use(express.json());

/*   Rutas del Sistemas  */
app.get("/", (req, res) => {
  res.status(200).sendFile(__dirname + "/public/html/welcome.html");
});

app.use("/api", require("./routes/VerifyRoutes.js"));
app.use("/api", require("./routes/Contact"));
app.use("/api", require("./routes/StudentRoutes.js"));
app.use("/api", require("./routes/EventsRoutes.js"));
app.use("/api", require("./routes/AcademyRoutes.js"));
app.use("/api", require("./routes/TicketsRoutes.js"));

app.use((red, res, next) => {
  res.status(404).sendFile(__dirname + "/public/html/404.html");
});

app.listen(port, () => {
  console.log(`Servidor disponible en  ${host}:${port}`);
});
