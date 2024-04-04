const express = require("express");
const router = express.Router();
const ticketController = require("../../controller/mysql/tickets.js");

/* *******************************************************  */
/*             Ruta de acceso para verificar entradas       */
/* *******************************************************  */
router.get("/verify/:codigo", ticketController.getVefify);

module.exports = router;
