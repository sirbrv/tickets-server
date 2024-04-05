module.exports = (sequelize, DataTypes) => {
    
  const GestionVentas = sequelize.define("gestionVentas", {
    dni: { type: DataTypes.STRING, allowNull: false },
    nombre: { type: DataTypes.STRING, allowNull: false },
    ticketAsignado: { type: DataTypes.INTEGER, allowNull: true },
    ticketPagado: { type: DataTypes.INTEGER, allowNull: true },
    montoTotalPagado: { type: DataTypes.INTEGER, allowNull: true },
    montoTotalTicket: { type: DataTypes.INTEGER, allowNull: true },
    montoEfectivo: { type: DataTypes.INTEGER, allowNull: true },
    montoTransf: { type: DataTypes.INTEGER, allowNull: true },
    montoCredito: { type: DataTypes.INTEGER, allowNull: true },
    montoDebito: { type: DataTypes.INTEGER, allowNull: true },
  });

  return GestionVentas;
};