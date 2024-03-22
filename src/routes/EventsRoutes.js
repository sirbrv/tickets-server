const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEvent,
  getEventCodigo,
  AddEvent,
  deleteEvent,
  updateEvent,
} = require("../controller/events");

/* *******************************************************  */
/*             Ruta de acceso a archivos Events           */
/* *******************************************************  */

router.get("/events", getEvents);
router.get("/event/:id", getEvent);
router.get("/eventCodigo/:codigo", getEventCodigo);
router.post("/event", validarData, AddEvent);
router.put("/event/:id", validarData, updateEvent);
router.delete("/event/:id", deleteEvent);

function validarData(req, res, next) {
  console.log("Body....", req.body);
  // const { codigo, nombre, descripcion } = req.body;

  // if (!codigo) {
  //   return res.status(400).json({
  //     message: "Ingrese un codigo válido..",
  //     exito: false,
  //   });
  // }
  // if (!nombre) {
  //   return res.status(400).json({
  //     message: "El nombre, del Estudiante está vacío..",
  //     exito: false,
  //   });
  // }
  next();
}

module.exports = router;
