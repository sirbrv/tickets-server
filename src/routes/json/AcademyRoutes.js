const express = require("express");
const router = express.Router();
const {
  getAcademys,
  getAcademy,
  getAcademyCodigo,
  AddAcademy,
  deleteAcademy,
  updateAcademy,
} = require("../../controller/json/academy");

/* *******************************************************  */
/*             Ruta de acceso a archivos academys           */
/* *******************************************************  */

router.get("/academys", getAcademys);
router.get("/academy/:id", getAcademy);
router.get("/academy/:codigo", getAcademyCodigo);
router.post("/academy", validarData, AddAcademy);
router.put("/academy/:id", validarData, updateAcademy);
router.delete("/academy/:id", deleteAcademy);

function validarData(req, res, next) {
  const { codigo, nombre, descripcion } = req.body;

  if (!codigo) {
    return res.status(400).json({
      message: "Ingrese un codigo válido..",
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
