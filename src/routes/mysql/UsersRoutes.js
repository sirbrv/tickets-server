const express = require("express");
const router = express.Router();

/* *******************************************************  */
/*             Ruta de acceso para verificar usuarios       */
/* *******************************************************  */
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  loginUser,
  cambioClaveUser,
  logoutUser,
} = require("../../controller/mysql/users");

/* *******************************************************  */
/*             Ruta de acceso a archivos Users           */
/* *******************************************************  */

router.get("/users", getUsers);
router.get("/user/:id", getUser);
// router.get("/user/:dni", getUserDni);
router.put("/user/cambio", cambioClaveUser);
router.post("/user", validarData, createUser);
router.put("/user/:id", validarData, updateUser);
router.delete("/user/:id", deleteUser);
router.post("/user/login", loginUser);
router.get("/user/logout", logoutUser);

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
