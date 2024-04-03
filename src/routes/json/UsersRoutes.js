const express = require("express");
const router = express.Router();

/* *******************************************************  */
/*             Ruta de acceso para verificar usuarios       */
/* *******************************************************  */
const {
  getUsers,
  getUser,
  getLogin,
  AddUser,
  deleteUser,
  updateUser,
} = require("../../controller/json/users");

/* *******************************************************  */
/*             Ruta de acceso a archivos Users           */
/* *******************************************************  */

router.get("/users", getUsers);
router.get("/user/:id", getUser);
// router.get("/user/:dni", getUserDni);
router.post("/user", validarData, AddUser);
router.put("/user/:id", validarData, updateUser);
router.delete("/user/:id", deleteUser);
router.post("/user/login", getLogin);

function validarData(req, res, next) {
  console.log("Body....", req.body);
  const { dni, nombre, descripcion } = req.body;

  // if (!dni) {
  //  return res.status(400).json({
  //    message: "Ingrese un Dne del Usuário válido..",
  //    exito: false,
  //  });
  // }
  if (!nombre) {
    return res.status(400).json({
      message: "El nombre, del Usuário está vacío..",
      exito: false,
    });
  }
  next();
}

module.exports = router;
