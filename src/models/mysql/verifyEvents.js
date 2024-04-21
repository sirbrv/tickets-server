module.exports = (sequelize, DataTypes) => {
  const VerifyEvents = sequelize.define("verifyEvents", {
    event: { type: DataTypes.STRING, allowNull: false },
    ticket: { type: DataTypes.STRING, allowNull: true },
    montoPagado: { type: DataTypes.INTEGER, allowNull: true },
    montoTicket: { type: DataTypes.INTEGER, allowNull: true },
  });

  return VerifyEvents;
};
module.exports = (sequelize, DataTypes) => {
  const VerifyEvents = sequelize.define("verifyEvents", {
    event: { type: DataTypes.STRING, allowNull: false },
    ticket: { type: DataTypes.STRING, allowNull: true },
    comprador: { type: DataTypes.STRING, allowNull: true },
    montoTicket: { type: DataTypes.INTEGER, allowNull: true },
    montoPagado: { type: DataTypes.INTEGER, allowNull: true },
    solvencia: { type: DataTypes.INTEGER, allowNull: true },
  });

  return VerifyEvents;
};