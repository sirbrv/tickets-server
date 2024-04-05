const router = require("express").Router();
const adminController = require("../../controller/mysql/administration.js");

/** ***************************************** */
/* Rutas de acceso al catálogo de Academias */
/** **************************************** */
router.get("/academys/", adminController.getAcademys);
router.get("/academy/:id", adminController.getAcademy);
router.post("/academy/", adminController.createAcademy);
router.put("/academy/:id", adminController.updateAcademy);
router.delete("/academy/:id", adminController.deleteAcademy);

/** ***************************************** */
/* Rutas de acceso al catálogo de Eventos */
/** **************************************** */
router.get("/events/", adminController.getEvents);
router.get("/event/:id", adminController.getEvent);
router.post("/event/", adminController.createEvent);
router.put("/event/:id", adminController.updateEvent);
router.delete("/event/:id", adminController.deleteEvent);

/** ***************************************** */
/* Rutas de acceso al catálogo de Students */
/** **************************************** */
router.get("/students/", adminController.getStudents);
router.get("/student/:id", adminController.getStudent);
router.post("/student/", adminController.createStudent);
router.put("/student/:id", adminController.updateStudent);
router.delete("/student/:id", adminController.deleteStudent);
router.get("/studentHistoy/:dni", adminController.getStudentHistoy);

module.exports = router;
