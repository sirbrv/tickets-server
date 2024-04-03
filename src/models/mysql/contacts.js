module.exports = (sequelize, DataTypes) => {
  const Contacts = sequelize.define("contacts", {
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    comentario: { type: DataTypes.TEXT, allowNull: true },
  });

  return Contacts;
};
