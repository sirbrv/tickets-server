const router = require("express").Router();
const ticketController = require("../../controller/mysql/tickets.js");

/** ***************************************** */
/* Rutas de acceso al catálogo de Tickets     */
/** ***************************************** */

router.get("/tickets/", ticketController.getTickets);
router.get("/ticket/:id", ticketController.getTicket);
router.post("/ticket/", ticketController.AddTicket);
router.put("/ticket/:id", ticketController.updateTicket);
router.delete("/ticket/:id", ticketController.deleteTicket);
router.get("/ticketCodigo/:codigo", ticketController.getTicketCodigo);
router.post("/ticketGen", ticketController.generaTicket);
router.post("/envioticket", ticketController.enviaTicket);

/** ************************************************ */
/* Rutas de acceso al catálogo de Venta de Tickets   */
/** ************************************************ */

router.get("/ticketVentas", ticketController.getTicketsVendidos);
router.delete("/ticketVenta/:id", ticketController.deleteTicketsVendido);
router.put("/ticketVenta/:id", ticketController.updateTicketsVendido);
router.post("/ticketVenta/:id", ticketController.updateTicketsVendido);
// router.get("/ticketVenta/:id", getTicketsVendido);

/** ************************************************ */
/*                        fin                        */
/** ************************************************ */

module.exports = router;
