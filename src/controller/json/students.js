const fs = require("fs").promises;
const studentsFile = "src/json/students.json";
const ticketsFile = "src/json/tickets.json";
const tstudentHistoryFile = "src/json/studentHistory.json";

//* *************************************************************** *//
//       definición de rutas  de acceso a archivo students           //
//* *************************************************************** *//

const getStudents = async (req, res) => {
  try {
    const datos = await fs.readFile(studentsFile, "utf-8");
    const students = JSON.parse(datos);
    setTimeout(() => {
      res
        .send({ data: students, message: "Consulta Exitosa", exito: true })
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

const getStudent = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(studentsFile, "utf-8");
    const students = JSON.parse(datos);
    const student = students.find((student) => student.id === id);
    return res
      .status(200)
      .json([{ data: student, message: "Consulta Exitosa", exito: true }]);
  } catch (error) {
    // Devolver un mensaje de error genérico en caso de error
    return res.status(500).json({
      message: "Ocurrió un error al procesar la solicitud",
      exito: false,
    });
  }
};

const getStudentDni = async (req, res) => {
  let dni = parseInt(req.params.dni);
  try {
    const datos = await fs.readFile(studentsFile, "utf-8");
    const students = JSON.parse(datos);
    const student = students.find((student) => student.dni == dni);
    let messageResult = "";
    let status = false;
    if (student === undefined) {
      messageResult = "El Dni ingresado no existe";
      status = false;
    } else {
      messageResult = "Consulta Exitosa";
      status = true;
    }
    return res
      .status(200)
      .json({ data: student, message: messageResult, exito: status });
  } catch (error) {
    // Devolver un mensaje de error genérico en caso de error
    return res.status(500).json({
      message: "Ocurrió un error al procesar la solicitud",
      exito: false,
    });
  }
};

const AddStudent = async (req, res) => {
  let numOb = 0;
  let numEx = 0;
  if (req.body.ticketOb1) {
    await grabaTicket(req.body.ticketOb1, req.body.nombre, req.body.dni, "obl");
    numOb = numOb + 1;
  }
  if (req.body.ticketOb2) {
    await grabaTicket(req.body.ticketOb2, req.body.nombre, req.body.dni, "obl");
    numOb = numOb + 1;
  }
  if (req.body.ticketOb3) {
    await grabaTicket(req.body.ticketOb3, req.body.nombre, req.body.dni, "obl");
    numOb = numOb + 1;
  }
  if (req.body.ticketOb4) {
    await grabaTicket(req.body.ticketOb4, req.body.nombre, req.body.dni, "obl");
    numOb = numOb + 1;
  }
  if (req.body.ticketOb5) {
    await grabaTicket(req.body.ticketOb5, req.body.nombre, req.body.dni, "obl");
    numOb = numOb + 1;
  }
  if (req.body.ticketOb6) {
    await grabaTicket(req.body.ticketOb6, req.body.nombre, req.body.dni, "obl");
    numOb = numOb + 1;
  }

  if (req.body.ticketEx1) {
    await grabaTicket(req.body.ticketEx1, req.body.nombre, req.body.dni, "ext");
    numEx = numEx + 1;
  }
  if (req.body.ticketEx2) {
    await grabaTicket(req.body.ticketEx2, req.body.nombre, req.body.dni, "ext");
    numEx = numEx + 1;
  }
  if (req.body.ticketEx3) {
    await grabaTicket(req.body.ticketEx3, req.body.nombre, req.body.dni, "ext");
    numEx = numEx + 1;
  }
  if (req.body.ticketEx4) {
    await grabaTicket(req.body.ticketEx4, req.body.nombre, req.body.dni, "ext");
    numEx = numEx + 1;
  }
  if (req.body.ticketEx5) {
    await grabaTicket(req.body.ticketEx5, req.body.nombre, req.body.dni, "ext");
    numEx = numEx + 1;
  }
  if (req.body.ticketEx6) {
    await grabaTicket(req.body.ticketEx6, req.body.nombre, req.body.dni, "ext");
    numEx = numEx + 1;
  }
  let nuevostudent = {
    id: parseInt(req.body.id),
    dni: req.body.dni,
    nombre: req.body.nombre,
    email: req.body.email,
    celular: req.body.celular,
    adress: req.body.adress,
    EntObligatorias: numOb,
    EntExtras: numEx,
    academia: req.body.academia,
    ticketOb1: req.body.ticketOb1,
    ticketOb2: req.body.ticketOb2,
    ticketOb3: req.body.ticketOb3,
    ticketOb4: req.body.ticketOb4,
    ticketOb5: req.body.ticketOb5,
    ticketOb6: req.body.ticketOb6,
    ticketEx1: req.body.ticketEx1,
    ticketEx2: req.body.ticketEx2,
    ticketEx3: req.body.ticketEx3,
    ticketEx4: req.body.ticketEx4,
    ticketEx5: req.body.ticketEx5,
    ticketEx6: req.body.ticketEx6,
  };

  try {
    const datos = await fs.readFile(studentsFile, "utf-8");
    const students = JSON.parse(datos);
    const student = students.find((student) => student.dni == req.body.dni);
    if (student) {
      return res.status(400).send({
        data: "",
        message: "El Número de documento ingresado, ya está registrado..",
        exito: false,
      });
    }
    let id = getNextId(students);
    nuevostudent.id = id;
    students.push(nuevostudent);
    await fs.writeFile(studentsFile, JSON.stringify(students));
    return res.status(201).send({
      data: nuevostudent,
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

const deleteStudent = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(studentsFile, "utf-8");
    const students = JSON.parse(datos);
    const index = students.findIndex((item) => item.id === id);
    if (index >= 0) {
      students.splice(index, 1);
      await fs.writeFile(studentsFile, JSON.stringify(students));
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

const updateStudent = async (req, res) => {
  let id = parseInt(req.params.id);
  let numOb = 0;
  let numEx = 0;
  if (req.body.ticketOb1) {
    await grabaTicket(req.body.ticketOb1, req.body.nombre, req.body.dni, "obl");
    numOb = numOb + 1;
  }
  if (req.body.ticketOb2) {
    await grabaTicket(req.body.ticketOb2, req.body.nombre, req.body.dni, "obl");
    numOb = numOb + 1;
  }
  if (req.body.ticketOb3) {
    await grabaTicket(req.body.ticketOb3, req.body.nombre, req.body.dni, "obl");
    numOb = numOb + 1;
  }
  if (req.body.ticketOb4) {
    await grabaTicket(req.body.ticketOb4, req.body.nombre, req.body.dni, "obl");
    numOb = numOb + 1;
  }
  if (req.body.ticketOb5) {
    await grabaTicket(req.body.ticketOb5, req.body.nombre, req.body.dni, "obl");
    numOb = numOb + 1;
  }
  if (req.body.ticketOb6) {
    await grabaTicket(req.body.ticketOb6, req.body.nombre, req.body.dni, "obl");
    numOb = numOb + 1;
  }

  if (req.body.ticketEx1) {
    await grabaTicket(req.body.ticketEx1, req.body.nombre, req.body.dni, "ext");
    numEx = numEx + 1;
  }
  if (req.body.ticketEx2) {
    await grabaTicket(req.body.ticketEx2, req.body.nombre, req.body.dni, "ext");
    numEx = numEx + 1;
  }
  if (req.body.ticketEx3) {
    await grabaTicket(req.body.ticketEx3, req.body.nombre, req.body.dni, "ext");
    numEx = numEx + 1;
  }
  if (req.body.ticketEx4) {
    await grabaTicket(req.body.ticketEx4, req.body.nombre, req.body.dni, "ext");
    numEx = numEx + 1;
  }
  if (req.body.ticketEx5) {
    await grabaTicket(req.body.ticketEx5, req.body.nombre, req.body.dni, "ext");
    numEx = numEx + 1;
  }
  if (req.body.ticketEx6) {
    await grabaTicket(req.body.ticketEx6, req.body.nombre, req.body.dni, "ext");
    numEx = numEx + 1;
  }
  let nuevoDato = {
    id: parseInt(req.body.id),
    dni: req.body.dni,
    nombre: req.body.nombre,
    email: req.body.email,
    celular: req.body.celular,
    adress: req.body.adress,
    EntObligatorias: numOb,
    EntExtras: numEx,
    academia: req.body.academia,
    ticketOb1: req.body.ticketOb1,
    ticketOb2: req.body.ticketOb2,
    ticketOb3: req.body.ticketOb3,
    ticketOb4: req.body.ticketOb4,
    ticketOb5: req.body.ticketOb5,
    ticketOb6: req.body.ticketOb6,
    ticketEx1: req.body.ticketEx1,
    ticketEx2: req.body.ticketEx2,
    ticketEx3: req.body.ticketEx3,
    ticketEx4: req.body.ticketEx4,
    ticketEx5: req.body.ticketEx5,
    ticketEx6: req.body.ticketEx6,
  };
  try {
    const datos = await fs.readFile(studentsFile, "utf-8");
    const students = JSON.parse(datos);
    const index = students.findIndex((item) => parseInt(item.id) == id);
    if (index >= 0) {
      students[index] = nuevoDato;
      await fs.writeFile(studentsFile, JSON.stringify(students));
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

const grabaTicket = async (ticketNum, nombre, dni, tipo) => {
  // *************************************************//
  // Se actualiza catalogo de Tickets
  // *************************************************//
  const fsDatos = await fs.readFile(ticketsFile, "utf-8");
  const fstickets = JSON.parse(fsDatos);
  const fsTicket = fstickets.find(
    (ticket) => ticket.codigoEntrada == ticketNum
  );
  let ticketID = null;
  if (fsTicket) {
    ticketID = fsTicket.id;
    fsTicket.estatus = !fsTicket.estatus ? "Asignada" : fsTicket.estatus;
    fsTicket.responsable = nombre;
  }
  const index2 = fstickets.findIndex((item) => item.id === ticketID);

  if (index2 >= 0) {
    fstickets[index2] = fsTicket;
    await fs.writeFile(ticketsFile, JSON.stringify(fstickets));
  }
  // *************************************************//
  // Se actualiza catalogo historico de student
  // *************************************************//
  const fsHisDatos = await fs.readFile(tstudentHistoryFile, "utf-8");
  const fsHistickets = JSON.parse(fsHisDatos);
  let idHist = getNextId(fsHistickets);
  let register = {
    id: idHist,
    dni: dni,
    tipoTicket: tipo,
    codigoEntrada: fsTicket.codigoEntrada,
    evento: fsTicket.evento,
    statusProceso: fsTicket.estatus,
    costo: fsTicket.costo,
    montoPagado: fsTicket.montoPagado,
  };

  const fsHisTicket = fsHistickets.find(
    (ticket) => ticket.codigoEntrada == ticketNum
  );

  if (fsHisTicket) {
    const index = fsHistickets.findIndex(
      (item) => item.codigoEntrada === ticketNum
    );

    register = {
      id: fsHisTicket.id,
      dni: fsHisTicket.dni,
      tipoTicket: fsHisTicket.tipoTicket,
      codigoEntrada: fsHisTicket.codigoEntrada,
      evento: fsHisTicket.evento,
      statusProceso: fsTicket.estatus,
      costo: fsHisTicket.costo,
      montoPagado: fsTicket.montoPagado,
    };
    fsHistickets[index] = register;
  } else {
    fsHistickets.push(register);
  }

  await fs.writeFile(tstudentHistoryFile, JSON.stringify(fsHistickets));

  // **********************fin ***************************//
};

const getStudentHistoy = async (req, res) => {
  const fsHisDatos = await fs.readFile(tstudentHistoryFile, "utf-8");
  const fsHistickets = JSON.parse(fsHisDatos);

  const fsHisTicket = fsHistickets.filter(
    (ticket) => ticket.dni === req.params.dni
  );
  setTimeout(() => {
    res
      .send({
        data: fsHisTicket,
      })
      .status(200);
  }, 10);
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
  getStudents,
  getStudent,
  getStudentDni,
  AddStudent,
  deleteStudent,
  updateStudent,
  getStudentHistoy,
};
