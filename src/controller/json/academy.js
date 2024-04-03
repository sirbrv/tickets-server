const fs = require("fs").promises;
const academysFile = "src/json/academys.json";

//* *************************************************************** *//
//       definición de rutas  de acceso a archivo academys           //
//* *************************************************************** *//

const getAcademys = async (req, res) => {
  try {
    const datos = await fs.readFile(academysFile, "utf-8");
    const academys = JSON.parse(datos);
    setTimeout(() => {
      res
        .send({ data: academys, message: "Consulta Exitosa", exito: true })
        .status(200);
    }, 10);
    return;
  } catch (error) {
    // Devolver un mensaje de error genérico en caso de error
    return res.status(500).json({
      message: "Ocurrió un error al procesar la solicitud",
      exito: false,
    });
  }
};

const getAcademy = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(academysFile, "utf-8");
    const academys = JSON.parse(datos);
    const academy = academys.find((academy) => academy.id === id);
    return res
      .status(200)
      .json([{ data: academy, message: "Consulta Exitosa", exito: true }]);
  } catch (error) {
    // Devolver un mensaje de error genérico en caso de error
    return res.status(500).json({
      message: "Ocurrió un error al procesar la solicitud",
      exito: false,
    });
  }
};

const getAcademyCodigo = async (req, res) => {
  let codigo = parseInt(req.params.codigo);
  try {
    const datos = await fs.readFile(academysFile, "utf-8");
    const academys = JSON.parse(datos);
    const academy = academys.find((academy) => academy.codigo == codigo);
    let messageResult = "";
    let status = false;
    if (academy === undefined) {
      messageResult = "El codigo ingresado no existe";
      status = false;
    } else {
      messageResult = "Consulta Exitosa";
      status = true;
    }
    return res
      .status(200)
      .json({ data: academy, message: messageResult, exito: status });
  } catch (error) {
    // Devolver un mensaje de error genérico en caso de error
    return res.status(500).json({
      message: "Ocurrió un error al procesar la solicitud",
      exito: false,
    });
  }
};

const AddAcademy = async (req, res) => {

  let nuevoacademy = {
    id: parseInt(req.body.id),
    codigo: req.body.codigo,
    nombre: req.body.nombre,
    email: req.body.email,
    adress: req.body.adress,
    telefono: req.body.telefono,
    url: req.body.url,
  };

  try {
    const datos = await fs.readFile(academysFile, "utf-8");
    const academys = JSON.parse(datos);
    const academy = academys.find(
      (academy) => academy.codigo == req.body.codigo
    );
    if (academy) {
      return res.status(400).send({
        data: "",
        message: "El Número de documento ingresado, ya está registrado..",
        exito: false,
      });
    }
    let id = getNextId(academys);
    nuevoacademy.id = id;
    academys.push(nuevoacademy);
    await fs.writeFile(academysFile, JSON.stringify(academys));
    await fs.writeFile(academysFile, JSON.stringify(academys));

    return res.status(201).send({
      data: nuevoacademy,
      message: "Registro agregado con éxito",
      exito: true,
    });
  } catch (error) {
    // Devolver un mensaje de error genérico en caso de error
    return res.status(500).json({
      message: "Ocurrió un error al procesar la solicitud",
      exito: false,
    });
  }
};

const deleteAcademy = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(academysFile, "utf-8");
    const academys = JSON.parse(datos);
    const index = academys.findIndex((item) => item.id === id);
    if (index >= 0) {
      academys.splice(index, 1);
      await fs.writeFile(academysFile, JSON.stringify(academys));
    }
    return res.status(200).send({
      message: "Registro eliminado con éxito",
      exito: true,
    });
  } catch (error) {
    // Devolver un mensaje de error genérico en caso de error
    return res.status(500).json({
      message: "Ocurrió un error al procesar la solicitud",
      exito: false,
    });
  }
};

const updateAcademy = async (req, res) => {
  let id = parseInt(req.params.id);
  let nuevoDato = {
    id: parseInt(req.body.id),
    codigo: req.body.codigo,
    nombre: req.body.nombre,
    email: req.body.email,
    adress: req.body.adress,
    telefono: req.body.telefono,
    url: req.body.url,
  };
  try {
    const datos = await fs.readFile(academysFile, "utf-8");
    const academys = JSON.parse(datos);
    const index = academys.findIndex((item) => parseInt(item.id) == id);
    if (index >= 0) {
      academys[index] = nuevoDato;
      await fs.writeFile(academysFile, JSON.stringify(academys));
    }
    return res
      .status(200)
      .json({ data: nuevoDato, message: "Registro Actualizado", exito: true });
  } catch (error) {
    // Devolver un mensaje de error genérico en caso de error
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
  getAcademys,
  getAcademy,
  getAcademyCodigo,
  AddAcademy,
  deleteAcademy,
  updateAcademy,
};
