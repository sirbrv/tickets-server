module.exports = (sequelize, DataTypes) => {
  const Academys = sequelize.define("academys", {
    codigo: { type: DataTypes.STRING, allowNull: false },
    nombre: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    adress: { type: DataTypes.STRING, allowNull: true },
    telefono: { type: DataTypes.STRING, allowNull: true },
    url: { type: DataTypes.STRING, allowNull: true },
  });

  return Academys;
};
