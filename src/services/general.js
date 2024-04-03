const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.generarJWT = (id) => {
  /* *******************   *********************/
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.generaId = () => {
  const random = Math.random().toString(32).substring(2);
  const fecha = Date.now().toString(32);
  return random + fecha;
};

exports.encriptar = async (password) => {
  const salt = bcrypt.genSalt(10);
  const hash = bcrypt.hash(password, 10);
  return await hash;
};

exports.comparePassword = async function (password, passwordDB) {
  console.log(password);
  console.log(passwordDB);
  const match = await bcrypt.compare(password, passwordDB);
  console.log(match);
  return  match;
};

exports.getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: users } = data;
  const currentPage = page > 0 ? page + 1 : 1;
  const totalPages = Math.ceil(totalItems / limit);
  return { users, totalItems, totalPages, currentPage };
};
