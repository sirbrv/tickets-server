const express = require("express");
const router = express.Router();
const {
  getTickets,
  getTicket,
  getTicketCodigo,
  AddTicket,
  deleteTicket,
  updateTicket,
  generaTicket,
  enviaTicket,
} = require("../../controller/json/tickets");

const {
  getTicketsVendidos,
  getTicketsVendido,
  deleteTicketsVendido,
  updateTicketsVendido,
} = require("../../controller/json/ticketsVendidos");

/* *******************************************************  */
/*             Ruta de acceso a archivos Tickets           */
/* *******************************************************  */

router.get("/tickets", getTickets);
router.get("/ticket/:id", getTicket);
router.get("/ticketCodigo/:codigo", getTicketCodigo);
router.post("/ticket", validarData, AddTicket);
router.post("/ticketGen", validarData, generaTicket);
router.put("/ticket/:id", validarData, updateTicket);
router.delete("/ticket/:id", deleteTicket);
router.post("/envioticket", enviaTicket);

/* *******************************************************  */
/*      Ruta de acceso a archivos Tickets Vendidos           */
/* *******************************************************  */

router.get("/ticketVentas", getTicketsVendidos);
router.get("/ticketVenta/:id", getTicketsVendido);
router.put("/ticketVenta/:id", updateTicketsVendido);
router.delete("/ticketVenta/:id", deleteTicketsVendido);

function validarData(req, res, next) {
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
