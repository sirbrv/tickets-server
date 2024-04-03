const Sequelize = require("sequelize");
const db = require("../../config/configDB");
const Contacts = db.contacts;
const Config = db.config;
const Op = Sequelize.Op;

/*********************** Seccion de gestión de Contacts  ***************** */

exports.getContacts = async (req, res) => {

  Contacts.findAll()
    .then((data) => {
      res.json({
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

exports.createContact = async (req, res) => {
  // const existeitem = await Contacts.findOne({
  //   where: {
  //     title: req.body.title,
  //   },
  // });
  // if (existeitem) {
  //   return res.json({
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
    await Contacts.create(newUser);
    res.json({
      status: "200",
      message: `El registro fue Creado`,
      data: newUser,
    });
  } catch (error) {
    res.json({ status: "409", message: error.message });
  }
};

exports.getContact = async (req, res) => {
  const existeitem = await Contacts.findOne({
    where: { id: req.params.id },
  });
  if (!existeitem) {
    return res.json({ status: "403", message: "El ID no está registrado" });
  }
  res.json({ status: "200", data: existeitem });
};

exports.updateContact = async (req, res, next) => {
  await Contacts.findOne({ where: { id: req.params.id } }).then((item) => {
    if (item) {
      let existeitem = {
        nombre: req.body.nombre,
        email: req.body.email,
        comentario: req.body.comentario,
      };
      const item_data = item
        .update(existeitem)
        .then(function () {
          res.json({
            status: "200",
            data: item_data,
            message: "Actualización realizada exitosamente",
          });
        })
        .catch((err) => {
          res.json({ status: "500", message: err.message });
        });
    }
  });
};

exports.deleteContact = async (req, res, next) => {
  const existeitem = await Contacts.findOne({
    where: { id: req.params.id },
  });
  if (!existeitem) {
    return res.json({ status: "403", message: "El ID no está registrado" });
  }
  try {
    await Contacts.destroy({ where: { id: req.params.id } });
    return res.json({ status: "200", message: "Registro Eliminado." });
  } catch (error) {
    res.json({ status: "400", message: error });
  }
};

/*********************** Seccion de manejo de Config  ***************** */

exports.getConfigTotal = async (req, res) => {

  Config.findAll()
    .then((data) => {
      res.json({
        status: "200",
        message: "Información Registrada...",
        configs: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "No hay Información Registrada..",
      });
    });
};

exports.createConfig = async (req, res) => {
  const existeitem = await Config.findOne({
    where: {
      name: req.body.name,
    },
  });
  if (existeitem) {
    return res.json({
      status: "403",
      message: "La Información ya está registrada",
    });
  }
  const newUser = {
    name: req.body.name,
    description: req.body.description,
    sequence: req.body.sequence,
  };
  try {
    await Config.create(newUser);
    const data = Config.findAll();
    res.json({
      status: "200",
      message: `El registro fue Creado`,
      config: newUser,
      configs: data,
    });
  } catch (error) {
    res.json({ status: "409", message: error.message });
  }
};

exports.getConfig = async (req, res) => {
  const existeitem = await Config.findOne({
    where: { name: req.params.id },
  });

  if (!existeitem) {
    return res.json({ status: "400", message: "El ID no está registrado" });
  }
  res.json({ status: "200", config: existeitem });
};

exports.getConfigure = async (req, res) => {
  await Config.findOne({ where: { name: req.params.id } }).then((item) => {
    if (item) {
      let existeitem = {
        name: item.name,
        description: item.description,
        sequence: item.sequence + 1,
      };
      item.update(existeitem).then(function () {
        res.json({
          status: "200",
          config: item,
        });
      });
    }
  });
};

exports.updateConfig = async (req, res, next) => {
  await Config.findOne({ where: { id: req.params.id } }).then((item) => {
    if (item) {
      let existeitem = {
        name: req.body.name,
        description: req.body.description,
        sequence: req.body.sequence,
      };
      const item_data = item
        .update(existeitem)
        .then(function () {
          const data = Config.findAll();
          //  console.log("datod.....:", data);
          res.json({
            status: "200",
            config: existeitem,
            //        configs: data,
            message: "Actualización realizada exitosamente",
          });
        })
        .catch((err) => {
          res.json({ status: "500", message: err.message });
        });
    }
  });
};

exports.deleteConfig = async (req, res, next) => {
  const existeitem = await Config.findOne({
    where: { id: req.params.id },
  });
  if (!existeitem) {
    return res.json({ status: "433", message: "El ID no está registrado" });
  }
  try {
    await Config.destroy({ where: { id: req.params.id } });
    return res.json({
      status: "200",
      message: "Registro Eliminado.",
    });
  } catch (error) {
    res.json({ status: "400", message: error });
  }
};
