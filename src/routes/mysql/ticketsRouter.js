const router = require("express").Router();
const ticketController = require("../../controller/mysql/tickets.js");

/** ***************************************** */
/* Rutas de acceso al catálogo de Tickets     */
/** ***************************************** */

router.get("/tickets/", ticketController.getTickets);
router.get("/ticket/:id", ticketController.getTicket);
router.get("/ticketCodigo/:codigo", ticketController.getTicketCodigo);
router.delete("/ticket/:id", ticketController.deleteTicket);
router.post("/ticket/", ticketController.AddTicket);
router.post("/ticketGen", ticketController.generaTicket);
router.post("/envioticket", ticketController.enviaTicket);
router.put("/ticket/:id", ticketController.updateTicket);

/** ************************************************ */
/* Rutas de acceso al catálogo de Venta de Tickets   */
/** ************************************************ */

router.get("/ticketVentas", ticketController.getTicketsVendidos);
router.put("/ticketVenta/:id", ticketController.updateTicketsVendido);
router.post("/ticketVenta/:id", ticketController.updateTicketsVendido);
router.delete("/ticketVenta/:id", ticketController.deleteTicketsVendido);
// router.get("/ticketVenta/:id", getTicketsVendido);

/** ************************************************ */
/*                        fin                        */
/** ************************************************ */

module.exports = router;
