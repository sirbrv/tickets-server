const fs = require("fs").promises;
const ticketsFile = "src/json/tickets.json";
const ventaTicketsFile = "src/json/ventaTickets.json";
const academysFile = "src/json/academys.json";

const enviarMail = require("../services/sendMail");

//* *************************************************************** *//
//       definición de rutas  de acceso a archivo tickets           //
//* *************************************************************** *//

const getTickets = async (req, res) => {
  try {
    const datos = await fs.readFile(ticketsFile, "utf-8");
    const tickets = JSON.parse(datos);
    setTimeout(() => {
      res
        .send({ data: tickets, message: "Consulta Exitosa", exito: true })
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

const getTicket = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(ticketsFile, "utf-8");
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

/* *******************************************************/
/* **     Sección de  besqueda de tickets por codigo     */
/* *******************************************************/
const getTicketCodigo = async (req, res) => {
  let codigo = parseInt(req.params.codigo);

  try {
    const datos = await fs.readFile(ticketsFile, "utf-8");
    const tickets = JSON.parse(datos);
    // Buscar el ticket por su código de entrada
    const ticketEncontrado = tickets.find((ticket) => {
      if (ticket.codigoEntrada == req.params.codigo) {
        return ticket;
      }
    });

    if (!ticketEncontrado) {
      return res
        .status(400)
        .json({ message: "El código ingresado no existe", exito: false });
    } else {
      // Si se encontró el ticket, devolver los datos del ticket
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

const AddTicket = async (req, res) => {
  let nuevoticket = {
    id: parseInt(req.body.id),
    codigoEntrada: req.body.codigoEntrada,
    academia: req.body.academia,
    evento: req.body.evento,
    emailComprador: req.body.emailComprador,
    nombreComprador: req.body.nombreComprador,
    metodoPago: req.body.metodoPago,
    costo: req.body.costo,
    responsable: req.body.responsable,
    montoPago: req.body.montoPago,
    formaPago: req.body.formaPago,
    fechaVenta: Date.now(),
  };

  try {
    const datos = await fs.readFile(ventaTicketsFile, "utf-8");
    const tickets = JSON.parse(datos);
    const ticket = tickets.find(
      (ticket) => ticket.codigoEntrada == req.body.codigoEntrada
    );
    if (ticket) {
      return res.status(400).send({
        data: "",
        message: "El número de Entrada Indicado, ya fué Vendido..",
        exito: false,
      });
    }
    let id = getNextId(tickets);
    nuevoticket.id = id;
    tickets.push(nuevoticket);
    await fs.writeFile(ventaTicketsFile, JSON.stringify(tickets));

    // *************************************************//
    // Se actualiza catalogo de Tickets
    // *************************************************//
    const fsDatos = await fs.readFile(ticketsFile, "utf-8");
    const fstickets = JSON.parse(fsDatos);
    const fsTicket = fstickets.find(
      (ticket) => ticket.codigoEntrada == req.body.codigoEntrada
    );
    let ticketID = null;
    if (fsTicket) {
      ticketID = fsTicket.id;
      let saldo = parseFloat(req.body.costo) - parseFloat(req.body.montoPago);
      fsTicket.montoPagado = req.body.montoPago;
      fsTicket.estatus = "Vendida";
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
      await fs.writeFile(ticketsFile, JSON.stringify(fstickets));
    }
    // **********************fin ***************************//
    return res.status(201).send({
      data: nuevoticket,
      message: "Venta realizada de forma éxitosa",
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

const deleteTicket = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(ticketsFile, "utf-8");
    const tickets = JSON.parse(datos);
    const index = tickets.findIndex((item) => item.id === id);
    if (index >= 0) {
      tickets.splice(index, 1);
      await fs.writeFile(ticketsFile, JSON.stringify(tickets));
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

const updateTicket = async (req, res) => {
  let id = parseInt(req.params.id);
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
    const datos = await fs.readFile(ticketsFile, "utf-8");
    const tickets = JSON.parse(datos);
    const index = tickets.findIndex((item) => parseInt(item.id) == id);
    if (index >= 0) {
      tickets[index] = nuevoDato;
      await fs.writeFile(ticketsFile, JSON.stringify(tickets));
    }
    // *************************************************//
    // Se actualiza catalogo de Tickets
    // *************************************************//
    const fsDatos = await fs.readFile(ticketsFile, "utf-8");
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
      await fs.writeFile(ticketsFile, JSON.stringify(fstickets));
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
  const datos = await fs.readFile(ticketsFile, "utf-8");
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

  await fs.writeFile(ticketsFile, JSON.stringify(tickets));
  return res.status(201).send({
    message: "Proceso finalizado correctamente...",
    exito: true,
  });
};

/* *******************************************************/
/* **          Sección de  envio de correos              */
/* *******************************************************/
const enviaTicket = async (req, res) => {
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
const getVefify = async (req, res) => {
  const datos = await fs.readFile(ticketsFile, "utf-8");
  const tickets = JSON.parse(datos);

  const ticket = tickets.find(
    (ticket) => ticket.codigoEntrada == req.params.codigo
  );
  let saldo = parseFloat(ticket.costo) - parseFloat(ticket.montoPagado);

  let html = `<div style="padding: 20px 20px; font-size: 10px">
          <h1 style="text-align: center;"> Verificación de Entradas</><bR>
          <p style="text-align: ceter; font-weight: 100;">Hemos realizado la vefificación de la Entrada ${ticket.codigoEntrada} perteneciente a </p>
          <p style="text-align: ceter; font-weight: 100;">${ticket.comprador} la cual se encuentra <scan style="font-weight: 600; color: green;">Solvente</scan>...
          </div>
          `;

  if (saldo > 0 || ticket.estatusPago != "pagada") {
    html = `<div style="padding: 20px 50px; font-size: 10px">
                <h1 style="text-align: center; ">Verificación de Entradas</><bR>
                
                <p style="text-align: ceter; font-weight: 100;">Hemos realizado la vefificación de la Entrada ${ticket.codigoEntrada} perteneciente a </p>
                <p style="text-align: ceter; font-weight: 100;">${ticket.comprador} la cual se encuentra <scan style="font-weight: 600; color: red;">no solvente</scan>...
                <p style="text-align: ceter; font-weight: 100; margin-top: 30px;">A la fecha presenta una deuda de ${saldo} $ sobre el costo de la entrada de ${ticket.costo}$. </p>
                <a href="https://ticketselectra.netlify.app/qrTicket" class="btn btn-success"> Ir a la Sección de Scaner </a>
            
                // <a href="http://localhost:5173/qrTicket" class="btn btn-success"> Ir a la Sección de Scaner </a>
            </div>

            `;
  }
  return res.status(200).send(html);
};

//* *************************************************************** *//
//       se genera ID en funcion a los regisatro del archivo         //
//* *************************************************************** *//
function getNextId(data) {
  if (data.length === 0) {
    return 1;
  }
  let maxId = Math.max(...data.map((item) => item.id));
  return maxId + 1;
}

module.exports = {
  getTickets,
  getTicket,
  getTicketCodigo,
  AddTicket,
  deleteTicket,
  updateTicket,
  generaTicket,
  enviaTicket,
  getVefify,
};
