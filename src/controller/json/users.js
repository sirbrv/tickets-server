// const { Console } = require("console");

const fs = require("fs").promises;
const usersFile = "src/json/users.json";

//* *************************************************************** *//
//       definición de rutas  de acceso a archivo users           //
//* *************************************************************** *//

const getUsers = async (req, res) => {
  try {
    const datos = await fs.readFile(usersFile, "utf-8");
    const users = JSON.parse(datos);
    setTimeout(() => {
      res
        .send({ data: users, message: "Consulta Exitosa", exito: true })
        .status(200);
    }, 10);
    return;
  } catch (error) {
    // console.log("Este es el error....:", error);
  }
};

const getUser = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(usersFile, "utf-8");
    const users = JSON.parse(datos);
    const user = users.find((user) => user.id === id);
    return res
      .status(200)
      .json([{ data: user, message: "Consulta Exitosa", exito: true }]);
  } catch (error) {
    console.log("Error en consilta...", error);
  }
};

const getUserDni = async (req, res) => {
  let dni = parseInt(req.params.dni);
  try {
    const datos = await fs.readFile(usersFile, "utf-8");
    const users = JSON.parse(datos);
    const user = users.find((user) => user.dni == dni);
    let messageResult = "";
    let status = false;
    if (user === undefined) {
      messageResult = "El Dni ingresado no existe";
      status = false;
    } else {
      messageResult = "Consulta Exitosa";
      status = true;
    }
    return res
      .status(200)
      .json({ data: user, message: messageResult, exito: status });
  } catch (error) {
    console.log("Error en consulta...", error);
  }
};

const AddUser = async (req, res) => {
  // console.log("Entre a adduser");
  // console.log(req.body);
  let nuevouser = {
    id: parseInt(req.body.id),
    dni: req.body.dni,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    password: req.body.password,
    fechaNacimiento: req.body.fechaNacimiento,
    adress: req.body.adress,
    adress2: req.body.adress2,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    confirm: req.body.confirm,
  };

  try {
    // console.log("en el tray");
    const datos = await fs.readFile(usersFile, "utf-8");
    const users = JSON.parse(datos);
    const user = users.find((user) => user.dni == req.body.dni);
    // console.log("Valor de la tabla....", user);
    if (!user) {
      return res.status(400).send({
        data: "",
        message: "El Número de documento ingresado, ya está registrado..",
        exito: false,
      });
    }
    // console.log("Registro grabado....");
    let id = getNextId(users);
    nuevouser.id = id;
    users.push(nuevouser);
    await fs.writeFile(usersFile, JSON.stringify(users));
    // console.log("Salida....");
    return res.status(201).send({
      data: nuevouser,
      message: "Registro agregado con éxito",
      exito: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  // console.log("borrar.....:", req.params);
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(usersFile, "utf-8");
    const users = JSON.parse(datos);
    const index = users.findIndex((item) => item.id === id);
    if (index >= 0) {
      users.splice(index, 1);
      await fs.writeFile(usersFile, JSON.stringify(users));
    }
    return res.status(200).send({
      message: "Registro eliminado con éxito",
      exito: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  // console.log(req.body);
  let id = parseInt(req.params.id);
  let nuevoDato = {
    id: parseInt(req.body.id),
    dni: req.body.dni,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    fechaNacimiento: req.body.fechaNacimiento,
    password: req.body.password,
    adress: req.body.adress,
    adress2: req.body.adress2,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    confirm: req.body.confirm,
  };
  try {
    const datos = await fs.readFile(usersFile, "utf-8");
    const users = JSON.parse(datos);
    // console.log("Id....:", id);
    const index = users.findIndex((item) => parseInt(item.id) == id);
    // console.log("index...", index);
    if (index >= 0) {
      users[index] = nuevoDato;
      await fs.writeFile(usersFile, JSON.stringify(users));
    }
    // console.log("users.....", nuevoDato);
    return res
      .status(200)
      .json({ data: nuevoDato, message: "Registro Actualizado", exito: true });
  } catch (error) {
    console.log(error);
  }
};

const getLogin = async (req, res) => {
  // console.log(req.body);
  try {
    const datos = await fs.readFile(usersFile, "utf-8");
    const users = JSON.parse(datos);
    const dataUser = users.find((user) => user.email === req.body.email);
    // console.log(dataUser);
    let message = "Consulta Exitosa";
    let status = 200;
    if (!dataUser) {
      message = "El usuário, no está registrado";
      return res.status(400).json([{ data: [], message: message }]);
    } else {
      if (dataUser?.password !== req.body.password) {
        message = "La contraseña es incorrecta";
        return res.status(400).json([{ data: [], message: message }]);
      }
    }
    return res.status(status).json([{ data: dataUser }]);
  } catch (error) {
    // Devolver un mensaje de error genérico en caso de error
    // console.log(error);
    return res.status(500).json({
      message: "Ocurrió un error al procesar la solicitud",
      exito: false,
    });
  }
};

//* *************************************************************** *//
//       se genera ID en funcion a los regisatro del archivo         //
//* *************************************************************** *//

function getNextId(data) {
  if (data.length === 0) {
    return 1;
  }
  const maxId = Math.max(...data.map((item) => item.id));
  return maxId + 1;
}

module.exports = {
  getUsers,
  getUser,
  getUserDni,
  AddUser,
  deleteUser,
  updateUser,
  getLogin,
};
