const fs = require("fs").promises;
const studentsFile = "src/json/students.json";

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
    console.log("Este es el error....:", error);
  }
};

const getStudent = async (req, res) => {
  console.log("id.....", req.params);
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(studentsFile, "utf-8");
    const students = JSON.parse(datos);
    const student = students.find((student) => student.id === id);
    return res
      .status(200)
      .json([{ data: student, message: "Consulta Exitosa", exito: true }]);
  } catch (error) {
    console.log("Error en consilta...", error);
  }
};

const getStudentDni = async (req, res) => {
  console.log("Dni.....", req.params);
  let dni = parseInt(req.params.dni);
  try {
    const datos = await fs.readFile(studentsFile, "utf-8");
    const students = JSON.parse(datos);
    const student = students.find((student) => student.dni == dni);
    console.log(student);
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
    console.log("Error en consulta...", error);
  }
};

const AddStudent = async (req, res) => {
  console.log("Entre a addStudent");
  console.log(req.body);
  let nuevostudent = {
    id: parseInt(req.body.id),
    dni: req.body.dni,
    nombre: req.body.nombre,
    email: req.body.email,
    celular: req.body.celular,
    adress: req.body.adress,
    academia: req.body.academia,
  };

  try {
    console.log("en el tray");
    const datos = await fs.readFile(studentsFile, "utf-8");
    const students = JSON.parse(datos);
    const student = students.find((student) => student.dni == req.body.dni);
    console.log("en el tray....", student);
    if (student) {
      return res.status(400).send({
        data: "",
        message: "El Número de documento ingresado, ya está registrado..",
        exito: false,
      });
    }
    console.log("pase");
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
    console.log(error);
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
    console.log(error);
  }
};

const updateStudent = async (req, res) => {
  console.log(req.body);
  let id = parseInt(req.params.id);
  let nuevoDato = {
    id: parseInt(req.body.id),
    dni: req.body.dni,
    nombre: req.body.nombre,
    email: req.body.email,
    celular: req.body.celular,
    adress: req.body.adress,
    academia: req.body.academia,
  };
  try {
    const datos = await fs.readFile(studentsFile, "utf-8");
    const students = JSON.parse(datos);
    console.log("Id....:", id);
    const index = students.findIndex((item) => parseInt(item.id) == id);
    console.log("index...", index);
    if (index >= 0) {
      students[index] = nuevoDato;
      await fs.writeFile(studentsFile, JSON.stringify(students));
    }
    console.log("students.....", nuevoDato);
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
  getStudents,
  getStudent,
  getStudentDni,
  AddStudent,
  deleteStudent,
  updateStudent,
};
