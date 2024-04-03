module.exports = (sequelize, DataTypes) => {
  const Tickets = sequelize.define("tickets", {
    codigoEntrada: { type: DataTypes.STRING, allowNull: false },
    academia: { type: DataTypes.STRING, allowNull: true },
    urlAcademia: { type: DataTypes.STRING, allowNull: true },
    evento: { type: DataTypes.TEXT, allowNull: true },
    tipoEntrada: { type: DataTypes.STRING, allowNull: true },
    costo: { type: DataTypes.INTEGER, allowNull: true },
    estatus: { type: DataTypes.STRING, allowNull: true },
    responsable: { type: DataTypes.STRING, allowNull: true },
    montoPagado: { type: DataTypes.INTEGER, allowNull: true },
    estatusPago: { type: DataTypes.STRING, allowNull: true },
    comprador: { type: DataTypes.STRING, allowNull: true },
  });

  return Tickets;
};
