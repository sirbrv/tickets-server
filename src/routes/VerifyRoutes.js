const express = require("express");
const router = express.Router();
const { getVefify } = require("../controller/tickets.js");

/* *******************************************************  */
/*             Ruta de acceso para verificar entradas       */
/* *******************************************************  */

router.get("/verify/:codigo", getVefify);

module.exports = router;
