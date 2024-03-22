const fs = require("fs").promises;
const eventsFile = "src/json/events.json";

//* *************************************************************** *//
//       definición de rutas  de acceso a archivo events           //
//* *************************************************************** *//

const getEvents = async (req, res) => {
  try {
    const datos = await fs.readFile(eventsFile, "utf-8");
    const events = JSON.parse(datos);
    setTimeout(() => {
      res
        .send({ data: events, message: "Consulta Exitosa", exito: true })
        .status(200);
    }, 10);
    return;
  } catch (error) {
    console.log("Este es el error....:", error);
  }
};

const getEvent = async (req, res) => {
  console.log("id.....", req.params);
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(eventsFile, "utf-8");
    const events = JSON.parse(datos);
    const event = events.find((event) => event.id === id);
    return res
      .status(200)
      .json([{ data: event, message: "Consulta Exitosa", exito: true }]);
  } catch (error) {
    console.log("Error en consilta...", error);
  }
};

const getEventCodigo = async (req, res) => {
  console.log("codigo.....", req.params);
  let codigo = parseInt(req.params.codigo);
  try {
    const datos = await fs.readFile(eventsFile, "utf-8");
    const events = JSON.parse(datos);
    const event = events.find((event) => event.codigo == codigo);
    console.log(event);
    let messageResult = "";
    let status = false;
    if (event === undefined) {
      messageResult = "El codigo ingresado no existe";
      status = false;
    } else {
      messageResult = "Consulta Exitosa";
      status = true;
    }
    return res
      .status(200)
      .json({ data: event, message: messageResult, exito: status });
  } catch (error) {
    console.log("Error en consulta...", error);
  }
};

const AddEvent = async (req, res) => {
  console.log("Entre a addevent");
  console.log(req.body);
  let nuevoevent = {
    id: parseInt(req.body.id),
    codigo: req.body.codigo,
    descripcion: req.body.descripcion,
    ubicacion: req.body.ubicacion,
    costo: req.body.costo,
    fecha: req.body.fecha,
    hora: req.body.hora,
  };

  try {
    console.log("en el tray");
    const datos = await fs.readFile(eventsFile, "utf-8");
    const events = JSON.parse(datos);
    const event = events.find((event) => event.codigo == req.body.codigo);
    console.log("en el tray....", event);
    if (event) {
      return res.status(400).send({
        data: "",
        message: "El Número de documento ingresado, ya está registrado..",
        exito: false,
      });
    }
    console.log("pase");
    let id = getNextId(events);
    nuevoevent.id = id;
    events.push(nuevoevent);
    await fs.writeFile(eventsFile, JSON.stringify(events));
    return res.status(201).send({
      data: nuevoevent,
      message: "Registro agregado con éxito",
      exito: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteEvent = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(eventsFile, "utf-8");
    const events = JSON.parse(datos);
    const index = events.findIndex((item) => item.id === id);
    if (index >= 0) {
      events.splice(index, 1);
      await fs.writeFile(eventsFile, JSON.stringify(events));
    }
    return res.status(200).send({
      message: "Registro eliminado con éxito",
      exito: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateEvent = async (req, res) => {
  console.log(req.body);
  let id = parseInt(req.params.id);
  let nuevoDato = {
    id: parseInt(req.body.id),
    codigo: req.body.codigo,
    descripcion: req.body.descripcion,
    ubicacion: req.body.ubicacion,
    costo: req.body.costo,
    fecha: req.body.fecha,
    hora: req.body.hora,
  };
  try {
    const datos = await fs.readFile(eventsFile, "utf-8");
    const events = JSON.parse(datos);
    console.log("Id....:", id);
    const index = events.findIndex((item) => parseInt(item.id) == id);
    console.log("index...", index);
    if (index >= 0) {
      events[index] = nuevoDato;
      await fs.writeFile(eventsFile, JSON.stringify(events));
    }
    console.log("events.....", nuevoDato);
    return res
      .status(200)
      .json({ data: nuevoDato, message: "Registro Actualizado", exito: true });
  } catch (error) {
    console.log(error);
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
  getEvents,
  getEvent,
  getEventCodigo,
  AddEvent,
  deleteEvent,
  updateEvent,
};
