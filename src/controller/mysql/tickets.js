const Sequelize = require("sequelize");
const db = require("../../config/configDB");
const Tickets = db.tickets;
const VentaTickets = db.ventaTickets;
const Academys = db.academys;
const StudentHistory = db.studentHistory;
const GestionVentas = db.gestionVentas;
const enviarMail = require("../../services/sendMail");
const Op = Sequelize.Op;

/*********************** Seccion de gestión de Tickets  ***************** */

exports.getTickets = async (req, res) => {
  Tickets.findAll()
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

exports.createTicket = async (req, res) => {
  // const existeitem = await Tickets.findOne({
  //   where: {
  //     title: req.body.title,
  //   },
  // });
  // if (existeitem) {
  //   return res.status(400).json({
  //     status: "403",
  //     message: "La Información ya está registrada",
  //   });
  // }
  const newUser = {
    nombre: req.body.nombre,
    email: req.body.email,
    comentario: req.body.comentario,
  };
  try {
    await Tickets.create(newUser);
    res.status(201).json({
      status: "201",
      message: `El registro fue Creado`,
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({ status: "409", message: error.message });
  }
};

exports.getTicket = async (req, res) => {
  const existeitem = await Tickets.findOne({
    where: { id: req.params.id },
  });
  if (!existeitem) {
    return res
      .status(400)
      .json({ status: "403", message: "El ID no está registrado" });
  }
  res.status(200).json({ status: "200", data: existeitem });
};

exports.updateTicket = async (req, res, next) => {
  await Tickets.findOne({ where: { id: req.params.id } }).then((item) => {
    if (item) {
      let existeitem = {
        academia: req.body.academia,
        evento: req.body.evento,
        tipoEntrada: req.body.tipoEntrada,
        costo: req.body.costo,
        estatus: req.body.estatus,
        responsable: req.body.responsable,
      };
      const item_data = item
        .update(existeitem)
        .then(function () {
          res.status(200).json({
            status: "200",
            data: item_data,
            message: "Actualización realizada exitosamente",
          });
        })
        .catch((err) => {
          res.status(500).json({ status: "500", message: err.message });
        });
    }
  });
};

exports.deleteTicket = async (req, res, next) => {
  const existeitem = await Tickets.findOne({
    where: { id: req.params.id },
  });
  if (!existeitem) {
    return res
      .status(400)
      .json({ status: "403", message: "El ID no está registrado" });
  }
  try {
    await Tickets.destroy({ where: { id: req.params.id } });
    return res
      .status(200)
      .json({ status: "200", message: "Registro Eliminado." });
  } catch (error) {
    res.status(400).json({ status: "400", message: error });
  }
};

/* *******************************************************/
/* **     Sección de  besqueda de tickets por codigo     */
/* *******************************************************/
exports.getTicketCodigo = async (req, res) => {
  let codigo = parseInt(req.params.codigo);
  try {
    // Buscar el ticket por su código de entrada
    const ticketEncontrado = await Tickets.findOne({
      where: {
        codigoEntrada: req.params.codigo,
      },
    });
    if (!ticketEncontrado) {
      return res
        .status(400)
        .json({ message: "El código ingresado no existe", exito: false });
    } else {
      // Si se encontró el ticket, devuelve  los datos del ticket
      return res.status(200).json({
        data: ticketEncontrado,
        message: "Consulta Exitosa",
        exito: true,
      });
    }
  } catch (error) {
    // Devolver un mensaje de error genérico en caso de error
    return res.status(500).json({
      message: "Ocurrió un error al procesar la solicitud",
      exito: false,
    });
  }
};

/* *******************************************************/
/* **          Sección de generación de Tickets          */
/* *******************************************************/
exports.generaTicket = async (req, res, next) => {
  const { academia, inicial, final, evento, tipoEntrada, costo } = req.body;
  const datoAcademia = await Academys.findOne({
    where: {
      nombre: req.body.academia,
    },
  });
  let lastId = 0;
  let codEntrada = 0;
  for (let i = inicial; i <= final; i++) {
    codEntrada = `${i}`;

    let newticket = {
      codigoEntrada: codEntrada, // Generar el código de entrada
      academia: academia,
      urlAcademia: datoAcademia.url,
      evento: evento,
      tipoEntrada: tipoEntrada,
      costo: costo,
      estatus: "Generada", // Estatus: Tickets generado //
      responsable: "", // falta traer de catalogo de asignacion
      montoPagado: 0,
      estatusPago: "",
      comprador: "",
    };

    await Tickets.create(newticket);
    lastId++;
  }

  return res.status(201).send({
    message: "Proceso finalizado correctamente...",
    exito: true,
  });
};

/* *******************************************************/
/* **          Sección de  envio de correos              */
/* *******************************************************/
exports.enviaTicket = async (req, res, next) => {
  // console.log("Envia Correo.....:", req.body);
  enviarMail({
    url: req.body.urlAcademia,
    numTicket: req.body.codigoEntrada,
    email: req.body.emailComprador,
    compreador: req.body.nombreComprador,
    evento: req.body.evento,
    subject: "Compra de Entradas",
  });
};

//* *************************************************************** *//
//                 Verifica datos escaneados en el QR               //
//* *************************************************************** *//
exports.getVefify = async (req, res) => {
  const ticket = await Tickets.findOne({
    where: {
      codigoEntrada: req.body.codigo,
    },
  });
  let saldo = parseFloat(ticket.costo) - parseFloat(ticket.montoPagado);

  let html = `<div style="padding: 20px 20px; font-size: 10px">
              <h1 style="text-align: center;"> Verificación de Entradas</><bR>
              <p style="text-align: ceter; font-weight: 100;">Hemos realizado la vefificación de la Entrada ${ticket.codigoEntrada} perteneciente a </p>
              <p style="text-align: ceter; font-weight: 100;">${ticket.comprador} la cual se encuentra <scan style="font-weight: 600; color: green;">Solvente</scan>...
              <a href="http://localhost:5173/qrTicket" class="btn btn-success"> Ir a la Sección de Scaner </a>
              </div>
              `;
  // <a href="https://ticketselectra.netlify.app/qrTicket" class="btn btn-success"> Ir a la Sección de Scaner </a>

  if (saldo > 0 || ticket.estatusPago != "pagada") {
    html = `<div style="padding: 20px 50px; font-size: 10px">
                <h1 style="text-align: center; ">Verificación de Entradas</><bR>
                <p style="text-align: ceter; font-weight: 100;">Hemos realizado la vefificación de la Entrada ${ticket.codigoEntrada} perteneciente a </p>
                <p style="text-align: ceter; font-weight: 100;">${ticket.comprador} la cual se encuentra <scan style="font-weight: 600; color: red;">no solvente</scan>...
                <p style="text-align: ceter; font-weight: 100; margin-top: 30px;">A la fecha presenta una deuda de ${saldo} $ sobre el costo de la entrada de ${ticket.costo}$. </p>
              <a href="http://localhost:5173/qrTicket" class="btn btn-success"> Ir a la Sección de Scaner </a>
              </div>
              
              `;
    // <a href="https://ticketselectra.netlify.app/qrTicket" class="btn btn-success"> Ir a la Sección de Scaner </a>
  }
  return res.status(200).send(html);
};

exports.AddTicket = async (req, res) => {
  let nuevoticket = {
    codigoEntrada: req.body.codigoEntrada,
    academia: req.body.academia,
    evento: req.body.evento,
    emailComprador: req.body.emailComprador,
    nombreComprador: req.body.nombreComprador,
    costo: req.body.costo,
    metodoPago: req.body.metodoPago,
    responsable: req.body.responsable,
    montoPago: req.body.montoPago,
    formaPago: req.body.formaPago,
    urlAcademia: req.body.urlAcademia,
    fechaVenta: Date.now(),
  };
  let ticketMontoPago = 0;
  let efectivo = 0;
  let tensferencia = 0;
  let debito = 0;
  let credito = 0;
  let deposito = 0;
  // console.log(req.body.metodoPago);
  if (req.body.metodoPago === "Efectivo") {
    efectivo = 1;
  }
  if (req.body.metodoPago === "Transferencia") {
    tensferencia = 1;
  }
  if (req.body.metodoPago === "Deposito") {
    deposito = 1;
  }
  if (req.body.metodoPago === "Débito") {
    debito = 1;
  }
  if (req.body.metodoPago === "Crédito") {
    credito = 1;
  }

  try {
    const ticket = await VentaTickets.findOne({
      where: { codigoEntrada: req.body.codigoEntrada },
    });
    if (ticket) {
      return res.status(400).send({
        data: "",
        message: "El número de Entrada Indicado, ya fué Vendido..",
        exito: false,
      });
    }
    await VentaTickets.create(nuevoticket);
    // *************************************************//
    // Se actualiza catalogo de Tickets
    // *************************************************//
    const fsTicket = await Tickets.findOne({
      where: { codigoEntrada: req.body.codigoEntrada },
    });
    let saldo = 0;
    let estatus = "";
    let estatusPago = "";
    if (fsTicket) {
      saldo = parseFloat(req.body.costo) - parseFloat(req.body.montoPago);
      estatus = "Vendida";
      estatusPago = "pagada";
      if (saldo > 0) {
        estatusPago = "pendiente";
      }
    }

    await Tickets.findOne({
      where: { codigoEntrada: req.body.codigoEntrada },
    }).then((item) => {
      if (item) {
        ticketMontoPago = item.metodoPago;
        let existeitem = {
          saldo: saldo,
          estatus: estatus,
          estatusPago: estatusPago,
          montoPagado:
            parseFloat(req.body.montoPago) > 0
              ? parseFloat(req.body.montoPago)
              : 0,
          comprador: req.body.nombreComprador,
        };
        const item_data = item
          .update(existeitem)
          .then(function () {})
          .catch((err) => {
            console.log(err.message);
          });
      }
    });

    const fsHisTicket = await StudentHistory.findOne({
      where: { codigoEntrada: req.body.codigoEntrada },
    });

    if (fsHisTicket) {
      resumenGestion(
        fsHisTicket.dni,
        1,
        req.body.montoPago,
        efectivo,
        tensferencia,
        credito
      );
    }
    // **********************fin ***************************//
    return res.status(200).send({
      data: nuevoticket,
      message: "Venta realizada de forma exitosa",
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

/*********************** Fin de Seccion   ***************** */

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

exports.deleteTicketsVendido = async (req, res, next) => {
  const existeitem = await VentaTickets.findOne({
    where: { id: req.params.id },
  });
  if (!existeitem) {
    return res
      .status(400)
      .json({ status: "403", message: "El ID no está registrado" });
  }
  try {
    await VentaTickets.destroy({ where: { id: req.params.id } });
    return res
      .status(200)
      .json({ status: "200", message: "Registro Eliminado." });
  } catch (error) {
    res.status(400).json({ status: "400", message: error });
  }
};

exports.updateTicketsVendido = async (req, res) => {
  let efectivo = 0;
  let ticketMontoPago = 0;
  let tensferencia = 0;
  let debito = 0;
  let credito = 0;
  let deposito = 0;
  if (req.body.metodoPago === "Efectivo") {
    efectivo = 1;
  }
  if (req.body.metodoPago === "Transferencia") {
    tensferencia = 1;
  }
  if (req.body.metodoPago === "Deposito") {
    deposito = 1;
  }
  if (req.body.metodoPago === "Débito") {
    debito = 1;
  }
  if (req.body.metodoPago === "Crédito") {
    credito = 1;
  }

  const ticket = await VentaTickets.findOne({
    where: { id: req.params.id },
  });
  if (!ticket) {
    return res.status(400).send({
      data: "",
      message: "El número indicado no existe...",
      exito: false,
    });
  }
  try {
    await VentaTickets.findOne({ where: { id: req.params.id } }).then(
      (item) => {
        if (item) {
          ticketMontoPago = item.montoPago;
          let existeitem = {
            emailComprador: req.body.emailComprador,
            nombreComprador: req.body.nombreComprador,
            metodoPago: req.body.metodoPago,
            montoPago: req.body.montoPago,
            formaPago: req.body.formaPago,
          };
          const item_data = item.update(existeitem).then(function () {
            // console.log("item_data.....:", item_data);
          });
        }
      }
    );
    // *************************************************//
    // Se actualiza catalogo de Tickets
    // *************************************************//
    const fsTicket = await Tickets.findOne({
      where: { codigoEntrada: req.body.codigoEntrada },
    });
    let saldo = 0;
    let estatus = "";
    let estatusPago = "";
    if (fsTicket) {
      saldo = parseFloat(req.body.costo) - parseFloat(req.body.montoPago);
      estatus = "Vendida";
      estatusPago = "pagada";
      if (saldo > 0) {
        estatusPago = "pendiente";
      }
    }

    await Tickets.findOne({
      where: { codigoEntrada: req.body.codigoEntrada },
    }).then((item) => {
      if (item) {
        let existeitem = {
          saldo: saldo,
          estatus: estatus,
          estatusPago: estatusPago,
          montoPagado:
            parseFloat(req.body.montoPago) > 0
              ? parseFloat(req.body.montoPago)
              : 0,
          comprador: req.body.nombreComprador,
        };
        const item_data = item
          .update(existeitem)
          .then(function () {})
          .catch((err) => {
            console.log(err.message);
          });
      }
    });
    const fsHisTicket = await StudentHistory.findOne({
      where: { codigoEntrada: req.body.codigoEntrada },
    });
    if (fsHisTicket) {
      let monto = 0;
      if (parseFloat(ticketMontoPago) < parseFloat(req.body.montoPago)) {
        monto = parseFloat(req.body.montoPago) - parseFloat(ticketMontoPago);
      }
      resumenGestion(
        fsHisTicket.dni,
        1,
        monto,
        efectivo,
        tensferencia,
        credito
      );
    }
    // **********************fin ***************************//
    return res.status(200).send({
      message: "Venta actualizada de forma exitosa",
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

//* *************************************************************** *//
//                 Verifica datos escaneados en el QR               //
//* *************************************************************** *//
exports.getVefify = async (req, res) => {
  try {
    const ticket = await Tickets.findOne({
      where: { codigoEntrada: req.params.codigo },
    });

    if (!ticket) {
      return res.status(400).send({
        data: "",
        message: "El número de Entrada Indicado, No Exíste..",
        exito: false,
      });
    } else {
      return res.status(200).json({
        data: ticket,
        message: "Consulta Exitosa",
        exito: true,
      });
    }
  } catch (error) {
    // Devolver un mensaje de error genérico en caso de error
    return res.status(500).json({
      message: "Ocurrió un error al procesar la solicitud",
      exito: false,
    });
  }
};

const resumenGestion = async (
  dni,
  numTickets,
  totalTickets,
  numTicketsEfec,
  numTicketsTrans,
  numTicketsCred
) => {
  // console.log("DNI......:", dni);
  await GestionVentas.findOne({ where: { dni: dni } }).then((item) => {
    if (item) {
      let existeitem = {
        ticketPagado: item.ticketPagado + parseFloat(numTickets),
        montoTotalPagado: item.montoTotalPagado + parseFloat(totalTickets),
        montoEfectivo: item.montoEfectivo + parseFloat(numTicketsEfec),
        montoTransf: item.montoTransf + parseFloat(numTicketsTrans),
        montoCredito: item.montoCredito + parseFloat(numTicketsCred),
      };
      const item_data = item
        .update(existeitem)
        .then(function () {})
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    }
  });
  costoTotalTicket = 0;
};
