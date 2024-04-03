module.exports = (sequelize, DataTypes) => {
  const StudentHistory = sequelize.define("studentHistory", {
    dni: { type: DataTypes.STRING, allowNull: false },
    tipoTicket: { type: DataTypes.STRING, allowNull: true },
    codigoEntrada: { type: DataTypes.STRING, allowNull: true },
    evento: { type: DataTypes.STRING, allowNull: true },
    statusProceso: { type: DataTypes.STRING, allowNull: true },
    costo: { type: DataTypes.INTEGER, allowNull: true },
    montoPagado: { type: DataTypes.INTEGER, allowNull: true },
  });

  return StudentHistory;
};
