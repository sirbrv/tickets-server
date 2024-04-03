module.exports = (sequelize, DataTypes) => {

  const Events = sequelize.define("events", {
    codigo: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: false },
    ubicacion: { type: DataTypes.STRING, allowNull: true },
    costo: { type: DataTypes.DECIMAL, allowNull: true },
    fecha: { type: DataTypes.DATE, allowNull: true },
    hora: { type: DataTypes.TIME, allowNull: true },
  });

  return Events;
};
