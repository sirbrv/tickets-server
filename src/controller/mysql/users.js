const Sequelize = require("sequelize");
const db = require("../../config/configDB");
const Op = Sequelize.Op;
const Users = db.users;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const enviarMail = require("../services/sendMail");
const path = require("path");

const url = process.env.HOST_URL;
const url_api = process.env.HOST_URL_API;

const {
  generarJWT,
  generaId,
  comparePassword,
} = require("../../services/general");

// cookies options
const options = {
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  httpOnly: true,
  // sameSite: "none",
  secure: false,
};

exports.getUsers = async (req, res) => {
  var condition = {};
  let page = req.query.page ? req.query.page - 1 : 0;
  page = page < 0 ? 0 : page;
  let limit = parseInt(req.query.limit || 10);
  limit = limit < 0 ? 10 : limit;
  const offset = page * limit;
  Users.findAndCountAll({
    where: condition,
    limit,
    offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.status(200).json({
        status: "200",
        data: response.users,
        // message: "Información Registrada...",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "No hay Información Registrada..",
      });
    });
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: users } = data;
  const currentPage = page > 0 ? page + 1 : 1;
  const totalPages = Math.ceil(totalItems / limit);
  return { users, totalItems, totalPages, currentPage };
};

exports.getUser = async (req, res) => {
  const usuario = await Users.findOne({ where: { id: req.params.id } });
  if (!usuario) {
    return res
      .status(400)
      .json({ status: "400", message: "El ID no está registrado" });
  }
  res.status(200).json({
    status: "200",
    data: usuario,
    message: "Información del Usuário",
  });
};

exports.createUser = async (req, res) => {
  const usuario = await Users.findOne({
    where: { email: req.body.email },
  });
  if (usuario) {
    return res
      .status(400)
      .json({ status: "400", message: "Usuário registrado" });
  }
  let encriClave = "";
  if (req.body.password) {
    encriClave = await bcrypt.hash(req.body.password, 10);
  }
  let filePath = null;
  if (req.file) {
    const filename = req.file.filename;
    filePath = `/uploads/${filename}`;
    if (usuario) {
      fs.unlink(filePath, (err) => {
        if (err) {
          res.status(500).json({ message: "Error deleting file" });
        }
      });
      //  return next(new ErrorHandler("User already exists", 400));
    }
  }

  // const filename = req.file.filename;
  //  const fileUrl = path.join(filename);
  const fileUrl = filePath;
  const newUser = {
    email: req.body.email,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    numTelefono: req.body.numTelefono,
    password: encriClave,
    city: req.body.city,
    adress: req.body.adress,
    role: req.body.role,
    avatar: fileUrl,
    status: req.body.status,
    token: generaId(),
  };

  try {
    await Users.create(newUser);
    // const user = {
    //   nombre: newUser.nombre,
    //   email: newUser.email,
    //   password: newUser.password,
    //   avatar: newUser.fileUrl,
    // };

    // const activationToken = createActivationToken(user);
    // const activationUrl = `${url_api}/admin/user/activation/${activationToken}`;
    // console.log("Voy a enviar mensaje..:", activationUrl);
    // await enviarMail({
    //   email: user.email,
    //   subject: "Activa tu cuenta (Todo Mercado)",
    //   message: `Hola ${user.nombre}, activa tu cuenta en el enlace siguiente.: ${activationUrl}`,
    // });
    // console.log(" mensaje enviado..:");
    // console.log(newUser);
    res.status(201).json({
      status: "201",
      data: newUser,
      // message: `El registro fue Creado, por favor revísa tu email. ${user.email} para activar tu cuenta!`,
      message: `El registro fue Creado`,
    });
  } catch (error) {
    res.status(200).json({ status: "500", message: error.message });
  }
};

exports.updateUser = async (req, res, next) => {
  let encriClave = "";
  if (req.body.password) {
    encriClave = await bcrypt.hash(req.body.password, 10);
  }
  let fileUrl = null;
  if (req.file) {
    const filename = req.file.filename;
    const filePath = `/uploads/${filename}`;
    fileUrl = filePath;
  }
  await Users.findOne({ where: { id: req.params.id } }).then((user) => {
    /*  if (user) {
      fs.unlink(filePath, (err) => {
        if (err) {
          res.status(500).json({ message: "Error deleting file" });
        }
      });
      fileUrl = filePath;
    } */
    if (user) {
      let usuario = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        numTelefono: req.body.numTelefono,
        avatar: fileUrl && fileUrl,
        password: encriClave,
        city: req.body.city,
        adress: req.body.adress,
        role: req.body.role,
        status: req.body.status,
      };
      const user_data = user
        .update(usuario)
        .then(function () {
          res.status(200).json({
            status: "200",
            user: usuario,
            message: "Actualización realizada exitosamente",
          });
        })
        .catch((err) => {
          res.status(200).json({ status: "500", message: err.message });
        });
    }
  });
};

exports.deleteUser = async (req, res, next) => {
  const usuario = await Users.findOne({ where: { id: req.params.id } });
  if (!usuario) {
    return res
      .status(400)
      .json({ status: "400", message: "El ID no está registrado" });
  }
  try {
    await Users.destroy({ where: { id: req.params.id } });
    return res
      .status(200)
      .json({ status: "200", message: "Registro Eliminado." });
  } catch (error) {
    res.status(500).json({ status: "500", message: error });
  }
};

exports.loginUser = async (req, res) => {
  const usuario = await Users.findOne({
    where: { email: req.body.email },
  });
  if (!usuario) {
    return res.status(400).json({
      status: "400",
      message: "El usuario no está registrado",
    });
  }
  const compare = await comparePassword(req.body.password, usuario.password);
  if (!compare) {
    return res
      .status(400)
      .json({ status: "400", message: "Contraseña incorrecta.." });
  } else {
    const data = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      role: usuario.role,
      avatar: usuario.avatar,
      token: usuario.token,
      status: usuario.status,
      phoneNumber: usuario.numTelefono,
      login: true,
    };
    let userToken = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      role: usuario.role,
      token: usuario.token,
    };
    // let token = generarJWT(userToken);
    let token = 1234;
    res.cookie("gral_token", token, options).send({
      status: "200",
      data: data,
      // message: "Logín procesado de forma exitosa",
    });
  }
};

exports.cambioClaveUser = async (req, res) => {
  console.log("Entre....:", req.body);
  let encriClave = await bcrypt.hash(req.body.newPassword, 10);
  console.log("Encrita....:", encriClave);
  const usuario = await Users.findOne({
    where: { email: req.body.email },
  });
  console.log("usuario..........:", );
  if (!usuario) {
     return res
        .status(400)
        .json({ status: "400", message: "El Usuário, no está Registrado..." });
  } else {
    console.log("pase a verificación.....:")
    const compare = await comparePassword(
      req.body.oldPassword,
      usuario.password
    );
    if (!compare) {
      return res
        .status(400)
        .json({ status: "400", message: "Clave actual incorrecta..." });
    }
  }
console.log("Pase a grabar.....")
  await Users.findOne({ where: { email: req.body.email } }).then((user) => {
    if (user) {
      let usuario = user;
      usuario = {
        password: encriClave,
      };

      user
        .update(usuario)
        .then(function () {
          res.status(200).json({
            status: "200",
            message: "Contraseña Actualizada Correctamente...",
          });
        })
        .catch((err) => {
          res.status(500).json({ status: "500", message: err.message });
        });
    }
  });
};

exports.tokenUsers = async (req, res) => {
  await Users.findOne({ where: { token: req.params.token } })
    .then((user) => {
      if (user) {
        let usuario = {
          token: "",
          statu: "activo",
        };
        const user_data = user
          .update(usuario)
          .then(function () {
            res.status(200).json({
              status: "200",
              data: user_data,
              message: "Usuário Confirmado Correctamente",
            });
          })
          .catch((err) => {
            res.status(500).json({ status: "500", message: err.message });
          });
      }
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ status: "400", message: "Token no válido" });
    });
};

exports.releasePassword = async (req, res) => {
  await Users.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (user) {
        const newuser = {
          nombre: user.nombre,
          email: user.email,
          password: user.password,
        };
        const token = createActivationToken(newuser);
        const enlaceUrl = `${url_api}/admin/user/forgetpassword/${token}`;
        // enviarMail({
        //   email: user.email,
        //   subject: "Cambio de Password (Todo Mercado)",
        //   message: `Hola ${user.nombre}, podrás cambiar la clave utilizando el enlace siguiente.: ${enlaceUrl}. Si no solicitaste esta acción, obvia este email.`,
        // });
        const wuser = user;
        user
          .update(wuser)
          .then(function () {
            res.status(200).json({
              status: "200",
              message:
                "Se envió email a su Correo Electrónico, para que genere la nueva contraseña..",
            });
          })
          .catch((err) => {
            res.status(500).json({ status: "500", message: err.message });
          });
      } else {
        return res.status(400).json({
          status: "400",
          message: "El Email no está registrádo",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ status: "500", message: err.message });
    });
};

exports.forgetPasswordToken = async (req, res, next) => {
  const activation_token = req.params.token;
  const newUser = await jwt.verify(
    activation_token,
    process.env.ACTIVATION_SECRET
  );
  if (!newUser) {
    return res.status(400).json({
      status: "400",
      message: "Token no válido",
    });
  } else {
    let newpassword = await bcrypt.hash("abc", 10);
    await Users.findOne({ where: { email: newUser.email } }).then((user) => {
      if (user) {
        let usuario = {
          email: user.email,
          nombre: user.nombre,
          role: user.role,
          phoneNumber: user.numTelefono,
          avatar: user.avatar,
          status: user.status,
          password: newpassword,
        };
        user.update(usuario).then(function () {
          res.status(200).json({
            status: "200",
            message:
              "Su clave fué inicializada, y se creó la password 'abc' para que usted, pueda generar su nueva contraseña..",
          });
        });
      }
    });
  }
};

exports.avatar = async (req, res) => {
  await Users.findOne({ where: { id: req.user.id } }).then((user) => {
    if (user) {
      const existAvatarPath = `uploads/${user.avatar}`;
      fs.unlinkSync(existAvatarPath);
      const fileUrl = path.join(req.file.filename);
      let usuario = user;
      usuario = {
        avatar: fileUrl,
      };
      const user_data = user
        .update(usuario)
        .then(function () {
          res.status(200).json({
            status: "200",
            data: user_data,
            message: "Actualización realizada exitosamente",
          });
        })
        .catch((err) => {
          res.status(500).json({ status: "500", message: err.message });
        });
    }
  });
};

exports.logoutUser = async (req, res) => {
  try {
    // res.clearCookie("gral_token");
    res.status(200).json({
      success: true,
      message: "La sesión se cerró correctamente!",
    });
  } catch (error) {
    res.status(500).json({ status: "500", message: error.message });
  }
};

exports.cambioClaveUser2 = async (req, res) => {
  console.log(req.body);
  let encriClave = await bcrypt.hash(req.body.newPassword, 10);
  const usuario = await Users.findOne({
    where: { email: req.body.email },
  });
  if (!usuario) {
    return res.json({
      status: "403",
      message: "El Usuario, no está Registrado...",
    });
  } else {
    console.log(req.body.oldPassword);
    console.log(usuario);
    const compare = await comparePassword(
      req.body.oldPassword,
      usuario.password
    );
    if (!compare) {
      return res.json({ status: "403", message: "Clave actual incorrecta..." });
    }
  }

  await Users.findOne({ where: { email: req.body.email } }).then((user) => {
    if (user) {
      let usuario = user;
      usuario = {
        password: encriClave,
      };

      user
        .update(usuario)
        .then(function () {
          res.json({
            status: "200",
            message: "Contraseña Actualizada Correctamente...",
          });
        })
        .catch((err) => {
          res.json({ status: "500", message: err.message });
        });
    }
  });
};

/* **************************** Fin de Seccion   ************************** */
