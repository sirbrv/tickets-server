const Sequelize = require("sequelize");
const db = require("../../config/configDB");
const Academys = db.academys;
const Events = db.events;
const Students = db.students;
const Tickets = db.tickets;
const StudentHistory = db.studentHistory;
const GestionVentas = db.gestionVentas;
const Op = Sequelize.Op;

/*********************** Seccion de gestión de Academias  ***************** */

exports.getAcademys = async (req, res) => {
  Academys.findAll()
    .then((data) => {
      res.status(200).json({
        status: "200",
        message: "Información Registrada...",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Eror de Comunicación..",
      });
    });
};

exports.createAcademy = async (req, res) => {
  const existeitem = await Academys.findOne({
    where: {
      codigo: req.body.codigo,
    },
  });
  if (existeitem) {
    return res.status(400).json({
      status: "403",
      message: "La Información ya está registrada",
    });
  }
  const newUser = {
    codigo: req.body.codigo,
    nombre: req.body.nombre,
    email: req.body.email,
    adress: req.body.adress,
    telefono: req.body.telefono,
    url: req.body.url,
  };
  try {
    await Academys.create(newUser);
    res.status(201).json({
      status: "201",
      message: `El registro fue Creado`,
      data: newUser,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Eror de Comunicación..",
    });
  }
};

exports.getAcademy = async (req, res) => {
  const existeitem = await Academys.findOne({
    where: { id: req.params.id },
  });
  if (!existeitem) {
    return res
      .status(400)
      .json({ status: "403", message: "El ID no está registrado" });
  }
  res.status(200).json({ status: "200", data: existeitem });
};

exports.updateAcademy = async (req, res, next) => {
  await Academys.findOne({ where: { id: req.params.id } }).then((item) => {
    if (item) {
      let existeitem = {
        nombre: req.body.nombre,
        email: req.body.email,
        adress: req.body.adress,
        telefono: req.body.telefono,
        url: req.body.url,
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
          res.status(500).send({
            message: err.message || "Eror de Comunicación..",
          });
        });
    }
  });
};

exports.deleteAcademy = async (req, res, next) => {
  const existeitem = await Academys.findOne({
    where: { id: req.params.id },
  });
  if (!existeitem) {
    return res
      .status(400)
      .json({ status: "403", message: "El ID no está registrado" });
  }
  try {
    await Academys.destroy({ where: { id: req.params.id } });
    return res
      .status(200)
      .json({ status: "200", message: "Registro Eliminado." });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Eror de Comunicación..",
    });
  }
};

/*********************** Seccion de manejo de Eventos  ***************** */

exports.getEvents = async (req, res) => {
  Events.findAll()
    .then((data) => {
      res.status(200).json({
        status: "200",
        message: "Información Registrada...",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Eror de Comunicación..",
      });
    });
};

exports.createEvent = async (req, res) => {
  const existeitem = await Events.findOne({
    where: {
      codigo: req.body.codigo,
    },
  });
  if (existeitem) {
    return res.status(400).json({
      status: "403",
      message: "La Información ya está registrada",
    });
  }
  const newUser = {
    codigo: req.body.codigo,
    descripcion: req.body.descripcion,
    ubicacion: req.body.ubicacion,
    costo: req.body.costo,
    fecha: req.body.fecha,
    hora: req.body.hora,
  };
  try {
    await Events.create(newUser);
    const data = Events.findAll();
    res.status(201).json({
      status: "201",
      message: `El registro fue Creado`,
      data: newUser,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Eror de Comunicación..",
    });
  }
};

exports.getEvent = async (req, res) => {
  const existeitem = await Events.findOne({
    where: { name: req.params.id },
  });

  if (!existeitem) {
    return res
      .status(400)
      .json({ status: "400", message: "El ID no está registrado" });
  }
  res.status(200).json({ status: "200", data: existeitem });
};

exports.updateEvent = async (req, res, next) => {
  await Events.findOne({ where: { id: req.params.id } }).then((item) => {
    if (item) {
      let existeitem = {
        descripcion: req.body.descripcion,
        ubicacion: req.body.ubicacion,
        costo: req.body.costo,
        fecha: req.body.fecha,
        hora: req.body.hora,
      };
      const item_data = item
        .update(existeitem)
        .then(function () {
          const data = Events.findAll();
          res.status(200).json({
            status: "200",
            data: existeitem,
            message: "Actualización realizada exitosamente",
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Eror de Comunicación..",
          });
        });
    }
  });
};

exports.deleteEvent = async (req, res, next) => {
  const existeitem = await Events.findOne({
    where: { id: req.params.id },
  });
  if (!existeitem) {
    return res
      .status(400)
      .json({ status: "400", message: "El ID no está registrado" });
  }
  try {
    await Events.destroy({ where: { id: req.params.id } });
    return res.status(200).json({
      status: "200",
      message: "Registro Eliminado.",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Eror de Comunicación..",
    });
  }
};

/*********************** Seccion de manejo de Estudiantes  ***************** */

exports.getStudents = async (req, res) => {
  Students.findAll()
    .then((data) => {
      res.status(200).json({
        status: "200",
        message: "Información Registrada...",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Eror de Comunicación..",
      });
    });
};

exports.createStudent = async (req, res) => {
  const existeitem = await Students.findOne({
    where: {
      dni: req.body.dni,
    },
  });
  if (existeitem) {
    return res.status(400).json({
      status: "403",
      message: "La Información ya está registrada",
    });
  }

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
  let newUser = {
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
    await Students.create(newUser);
    resumenGestion(req.body.dni, req.body.nombre, numOb, numEx);
    const data = Students.findAll();

    res.status(201).json({
      status: "201",
      message: `El registro fue Creado`,
      data: newUser,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Eror de Comunicación..",
    });
  }
};

exports.getStudent = async (req, res) => {
  const existeitem = await Students.findOne({
    where: { name: req.params.id },
  });

  if (!existeitem) {
    return res
      .status(400)
      .json({ status: "400", message: "El ID no está registrado" });
  }
  res.status(200).json({ status: "200", data: existeitem });
};

exports.updateStudent = async (req, res, next) => {
  await Students.findOne({ where: { id: req.params.id } }).then((item) => {
    if (item) {
      let numOb = 0;
      let numEx = 0;
      if (req.body.ticketOb1) {
        grabaTicket(req.body.ticketOb1, req.body.nombre, req.body.dni, "obl");
        numOb = numOb + 1;
      }
      if (req.body.ticketOb2) {
        grabaTicket(req.body.ticketOb2, req.body.nombre, req.body.dni, "obl");
        numOb = numOb + 1;
      }
      if (req.body.ticketOb3) {
        grabaTicket(req.body.ticketOb3, req.body.nombre, req.body.dni, "obl");
        numOb = numOb + 1;
      }
      if (req.body.ticketOb4) {
        grabaTicket(req.body.ticketOb4, req.body.nombre, req.body.dni, "obl");
        numOb = numOb + 1;
      }
      if (req.body.ticketOb5) {
        grabaTicket(req.body.ticketOb5, req.body.nombre, req.body.dni, "obl");
        numOb = numOb + 1;
      }
      if (req.body.ticketOb6) {
        grabaTicket(req.body.ticketOb6, req.body.nombre, req.body.dni, "obl");
        numOb = numOb + 1;
      }

      if (req.body.ticketEx1) {
        grabaTicket(req.body.ticketEx1, req.body.nombre, req.body.dni, "ext");
        numEx = numEx + 1;
      }
      if (req.body.ticketEx2) {
        grabaTicket(req.body.ticketEx2, req.body.nombre, req.body.dni, "ext");
        numEx = numEx + 1;
      }
      if (req.body.ticketEx3) {
        grabaTicket(req.body.ticketEx3, req.body.nombre, req.body.dni, "ext");
        numEx = numEx + 1;
      }
      if (req.body.ticketEx4) {
        grabaTicket(req.body.ticketEx4, req.body.nombre, req.body.dni, "ext");
        numEx = numEx + 1;
      }
      if (req.body.ticketEx5) {
        grabaTicket(req.body.ticketEx5, req.body.nombre, req.body.dni, "ext");
        numEx = numEx + 1;
      }
      if (req.body.ticketEx6) {
        grabaTicket(req.body.ticketEx6, req.body.nombre, req.body.dni, "ext");
        numEx = numEx + 1;
      }
      let existeitem = {
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

      const item_data = item
        .update(existeitem)
        .then(function () {
          resumenGestion(req.body.dni, req.body.nombre, numOb, numEx);
          const data = Students.findAll();
          //  console.log("datod.....:", data);
          res.status(200).json({
            status: "200",
            data: existeitem,
            //        Students: data,
            message: "Actualización realizada exitosamente",
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Eror de Comunicación..",
          });
        });
    }
  });
};

exports.deleteStudent = async (req, res, next) => {
  const existeitem = await Students.findOne({
    where: { id: req.params.id },
  });
  if (!existeitem) {
    return res
      .status(400)
      .json({ status: "400", message: "El ID no está registrado" });
  }
  try {
    await Students.destroy({ where: { id: req.params.id } });
    return res.status(200).json({
      status: "200",
      message: "Registro Eliminado.",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Eror de Comunicación..",
    });
  }
};

const grabaTicket = async (ticketNum, nombre, dni, tipo) => {
  // *************************************************//
  // Se actualiza catalogo de Tickets
  // *************************************************//
  let fsTicket0 = {};
  await Tickets.findOne({ where: { codigoEntrada: ticketNum } }).then(
    (item) => {
      if (item) {
        let existeitem = {
          estatus: item.estatus != "Vendida" ? "Asignada" : item.estatus,
          responsable: nombre,
        };
        fsTicket0 = item
          .update(existeitem)
          .then(function () {})
          .catch((err) => {
            console.log(err.message);
          });
      }
    }
  );

  // *************************************************//
  // Se actualiza catalogo historico de student
  // *************************************************//
  const fsTicket = await Tickets.findOne({
    where: { codigoEntrada: ticketNum },
  });
  const fsHisTicket = await StudentHistory.findOne({
    where: { dni: dni },
  });
  console.log("entrada.....:", fsTicket);
  console.log("fsHisTicket.....:", fsHisTicket);
  if (!fsHisTicket) {
    let newRegister = {
      dni: dni,
      tipoTicket: tipo,
      codigoEntrada: fsTicket.codigoEntrada,
      evento: fsTicket.evento,
      statusProceso: fsTicket.estatus,
      costo: parseFloat(fsTicket.costo),
      montoPagado:
        parseFloat(fsTicket.montoPagado) > 0
          ? parseFloat(fsTicket.montoPagado)
          : 0,
    };
    await StudentHistory.create(newRegister);
  } else {
    await StudentHistory.findOne({
      where: { dni: dni },
    }).then((item) => {
      if (item) {
        let existeitem = {
          statusProceso: fsTicket.estatus,
          montoPagado: parseFloat(fsTicket.montoPagado),
        };
        const item_data = item
          .update(existeitem)
          .then(function () {})
          .catch((err) => {
            console.log(err.message);
          });
      }
    });
  }
};

exports.getStudentHistoy = async (req, res) => {
  StudentHistory.findAll({
    where: { dni: req.params.dni },
  }).then((data) => {
    res.status(200).json({
      data: data,
    });
  });
};

// **********************fin ***************************//

const resumenGestion = async (dni, nombre, numOb, numEx) => {
  let datos = {
    dni: dni,
    nombre: nombre,
    ticketAsignado: numOb + numEx,
    ticketPagado: 0,
    montoTotalPagado: 0,
    montoTotalTicket: 0,
    montoEfectivo: 0,
    montoTransf: 0,
    montoCredito: 0,
    montoDebito: 0,
  };

  const existe = await GestionVentas.findOne({
    where: { dni: dni },
  });

  if (!existe) {
    await GestionVentas.create(datos);
  }

  await GestionVentas.findOne({ where: { dni: dni } }).then((item) => {
    if (item) {
      let existeitem = {
        ticketAsignado: numOb + numEx,
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
};
