module.exports = (sequelize, DataTypes) => {
    
  const VentaTickets = sequelize.define("ventaTickets", {
    codigoEntrada: { type: DataTypes.STRING, allowNull: false },
    academia: { type: DataTypes.STRING, allowNull: true },
    evento: { type: DataTypes.STRING, allowNull: true },
    emailComprador: { type: DataTypes.STRING, allowNull: true },
    nombreComprador: { type: DataTypes.STRING, allowNull: true },
    metodoPago: { type: DataTypes.STRING, allowNull: true },
    costo: { type: DataTypes.INTEGER, allowNull: true },
    responsable: { type: DataTypes.STRING, allowNull: true },
    montoPago: { type: DataTypes.INTEGER, allowNull: true },
    formaPago: { type: DataTypes.STRING, allowNull: true },
    fechaVenta: { type: DataTypes.DATE, allowNull: true },
  });

  return VentaTickets;
};