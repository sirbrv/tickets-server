const router = require("express").Router();
const gralController = require("../../controller/mysql/general.js");

/** ************************************* */
/* Rutas de acceso al catálogo de configuracion */
/** ************************************* */
router.get("/configure/:id", gralController.getConfigure);
router.get("/config/:id", gralController.getConfig);
router.get("/config/", gralController.getConfigTotal);
router.post("/config/", gralController.createConfig);
router.put("/config/:id", gralController.updateConfig);
router.delete("/config/:id", gralController.deleteConfig);

/** ***************************************** */
/* Rutas de acceso al catálogo de Contactos */
/** **************************************** */
router.get("/contacts/", gralController.getContacts);
router.get("/contact/:id", gralController.getContact);
router.post("/contact/", gralController.createContact);
router.put("/contact/:id", gralController.updateContact);
router.delete("/contact/:id", gralController.deleteContact);


/** *********************************************** */
/* Rutas de acceso al catálogo de Gestión de Ventas */
/** *********************************************** */
router.get("/gestionVentas/", gralController.getGestionVentas);


module.exports = router;
