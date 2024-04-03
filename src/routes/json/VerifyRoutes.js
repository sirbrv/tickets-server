const express = require("express");
const router = express.Router();
const { getVefify } = require("../../controller/json/tickets.js");

/* *******************************************************  */
/*             Ruta de acceso para verificar entradas       */
/* *******************************************************  */
router.get("/verify/:codigo", getVefify);

module.exports = router;
