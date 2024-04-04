const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
require("./config/config.js");
const port = process.env.PORT;
const host = process.env.HOST;
const app = express();

app.use(morgan("dev"));

app.use(cors());
app.use(express.json());

app.use("/imagens", express.static(path.join(__dirname, "/public")));
app.use("/uploads", express.static(path.join(__dirname, "/public")));

/*   Rutas del Sistemas  */
app.get("/", (req, res) => {
  res.status(200).sendFile(__dirname + "/public/html/welcome.html");
});

app.use("/api", require("./routes/json/VerifyRoutes.js"));
app.use("/api", require("./routes/json/contact.js"));
app.use("/api", require("./routes/json/StudentRoutes.js"));
app.use("/api", require("./routes/json/EventsRoutes.js"));
app.use("/api", require("./routes/json/AcademyRoutes.js"));
app.use("/api", require("./routes/json/TicketsRoutes.js"));
app.use("/api", require("./routes/json/UsersRoutes.js"));

app.use("/api/v2", require("./routes/mysql/UsersRoutes.js"));
app.use("/api/v2", require("./routes/mysql/generalRouter.js"));
app.use("/api/v2", require("./routes/mysql/adminRouter.js"));
app.use("/api/v2", require("./routes/mysql/ticketsRouter.js"));
app.use("/api/v2", require("./routes/mysql/VerifyRoutes.js"));

// app.use("*", (req, res) => {
//   console.log("Request Type:", req.method);
//   console.log("Request URL:", req.originalUrl);
// });

app.use((red, res, next) => {
  res.status(404).sendFile(__dirname + "/public/html/404.html");
});

app.listen(port, () => {
  // console.log(`Servidor disponible en  ${host}:${port}`);
  console.log(`Servidor disponible en http://localhost:${port}`);
});
