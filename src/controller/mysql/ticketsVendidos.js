const Sequelize = require("sequelize");
const db = require("../../config/configDB");
const Tickets = db.tickets;
const VentaTickets = db.ventaTickets;
const Academys = db.academys;
const Op = Sequelize.Op;

const fs = require("fs").promises;
const ventaTicketsFile = "src/json/ventaTickets.json";

//* *************************************************************** *//
//       definición de rutas  de acceso a archivo tickets           //
//* *************************************************************** *//

exports.getTicketsVendidos = async (req, res) => {

  VentaTickets.findAll()
    .then((data) => {
      res.status(200).json({
        status: "200",
        message: "Información Registrada...",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "No hay Información Registrada..",
      });
    });
};

const getTicketsVendido = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(ventaTicketsFile, "utf-8");
    const tickets = JSON.parse(datos);
    const ticket = tickets.find((ticket) => ticket.id === id);
    return res
      .status(200)
      .json([{ data: ticket, message: "Consulta Exitosa", exito: true }]);
  } catch (error) {
    // Devolver un mensaje de error genérico en caso de error
    return res.status(500).json({
      message: "Ocurrió un error al procesar la solicitud",
      exito: false,
    });
  }
};

const deleteTicketsVendido = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(ventaTicketsFile, "utf-8");
    const tickets = JSON.parse(datos);
    const index = tickets.findIndex((item) => item.id === id);
    if (index >= 0) {
      tickets.splice(index, 1);
      await fs.writeFile(ventaTicketsFile, JSON.stringify(tickets));
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

const updateTicketsVendido = async (req, res) => {
  let id = parseInt();
  let nuevoDato = {
    id: parseInt(req.body.id),
    codigoEntrada: req.body.codigoEntrada,
    academia: req.body.academia,
    evento: req.body.evento,
    tipoEntrada: req.body.tipoEntrada,
    costo: req.body.costo,
    estatus: req.body.estatus,
    responsable: req.body.responsable,
  };
  try {
    const datos = await fs.readFile(ventaTicketsFile, "utf-8");
    const tickets = JSON.parse(datos);
    const index = tickets.findIndex((item) => parseInt(item.id) == id);
    if (index >= 0) {
      tickets[index] = nuevoDato;
      await fs.writeFile(ventaTicketsFile, JSON.stringify(tickets));
    }
    // *************************************************//
    // Se actualiza catalogo de Tickets
    // *************************************************//
    const fsDatos = await fs.readFile(ventaTicketsFile, "utf-8");
    const fstickets = JSON.parse(fsDatos);
    const fsTicket = fstickets.find(
      (ticket) => ticket.codigoEntrada == req.body.codigoEntrada
    );
    let ticketID = null;
    if (fsTicket) {
      ticketID = fsTicket.id;
      let saldo = parseFloat(req.body.costo) - parseFloat(req.body.montoPago);
      fsTicket.montoPagado = req.body.montoPago;
      if (saldo) {
        fsTicket.estatusPago = "pendiente";
      } else {
        fsTicket.estatusPago = "pagada";
      }
      fsTicket.comprador = req.body.nombreComprador;
    }
    const index2 = fstickets.findIndex((item) => item.id === ticketID);
    if (index2 >= 0) {
      fstickets[index2] = fsTicket;
      await fs.writeFile(ventaTicketsFile, JSON.stringify(fstickets));
    }
    // **********************fin ***************************//
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

/* *******************************************************/
/* **          Sección de generacion de Tickets          */
/* *******************************************************/
const generaTicket = async (req, res) => {
  const { academia, correlativo, inicial, final, tipoEntrada, costo } =
    req.body;

  // Se busca urL de la academia.
  const datosAcm = await fs.readFile(academysFile, "utf-8");
  const datosAcademy = JSON.parse(datosAcm);
  const datoAcademia = datosAcademy.find(
    (datosAc) => datosAc.nombre == req.body.academia
  );

  // Se genera nuevas entradas.
  const datos = await fs.readFile(ventaTicketsFile, "utf-8");
  const tickets = JSON.parse(datos);
  let lastId = getNextId(tickets);
  let codEntrada = 0;
  for (let i = inicial; i <= final; i++) {
    codEntrada = `${i}`;
    if (correlativo) {
      codEntrada = `${correlativo}-${i}`;
    }
    let newticket = {
      id: lastId + 1,
      codigoEntrada: codEntrada, // Generar el código de entrada
      academia: academia,
      urlAcademia: datoAcademia.url,
      evento: req.body.evento,
      tipoEntrada: tipoEntrada,
      costo: costo,
      estatus: "Generada", // Estatus: Tickets generado //
      responsable: "", // falta traer de catalogo de asignacion
      montoPagado: "",
      estatusPago: "",
      comprador: "",
    };
    tickets.push(newticket);
    lastId++;
  }

  await fs.writeFile(ventaTicketsFile, JSON.stringify(tickets));
  return res.status(201).send({
    message: "Proceso finalizado correctamente...",
    exito: true,
  });
};

module.exports = {
  getTicketsVendido,
  deleteTicketsVendido,
  updateTicketsVendido,
};
