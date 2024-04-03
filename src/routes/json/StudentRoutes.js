const express = require("express");
const router = express.Router();
const {
  getStudents,
  getStudent,
  getStudentDni,
  AddStudent,
  deleteStudent,
  updateStudent,
  getStudentHistoy,
} = require("../../controller/json/students");

/* *******************************************************  */
/*             Ruta de acceso a archivos Students           */
/* *******************************************************  */

router.get("/students", getStudents);
router.get("/student/:id", getStudent);
router.get("/studentdni/:dni", getStudentDni);
router.post("/student", validarData, AddStudent);
router.put("/student/:id", validarData, updateStudent);
router.delete("/student/:id", deleteStudent);
router.get("/studentHistoy/:dni", getStudentHistoy);

function validarData(req, res, next) {
  const { dni, nombre, descripcion } = req.body;

  if (!dni) {
    return res.status(400).json({
      message: "Ingrese un Dni válido..",
      exito: false,
    });
  }
  if (!nombre) {
    return res.status(400).json({
      message: "El nombre, del Estudiante está vacío..",
      exito: false,
    });
  }
  next();
}

module.exports = router;
