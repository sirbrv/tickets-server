module.exports = (sequelize, DataTypes) => {
  const Students = sequelize.define("students", {
    dni: { type: DataTypes.STRING, allowNull: false },
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true },
    celular: { type: DataTypes.STRING, allowNull: true },
    adress: { type: DataTypes.TEXT, allowNull: true },
    EntObligatorias: { type: DataTypes.INTEGER, allowNull: true },
    EntExtras: { type: DataTypes.INTEGER, allowNull: true },
    academia: { type: DataTypes.STRING, allowNull: true },
    ticketOb1: { type: DataTypes.STRING, allowNull: true },
    ticketOb2: { type: DataTypes.STRING, allowNull: true },
    ticketOb3: { type: DataTypes.STRING, allowNull: true },
    ticketOb4: { type: DataTypes.STRING, allowNull: true },
    ticketOb5: { type: DataTypes.STRING, allowNull: true },
    ticketOb6: { type: DataTypes.STRING, allowNull: true },
    ticketEx1: { type: DataTypes.STRING, allowNull: true },
    ticketEx2: { type: DataTypes.STRING, allowNull: true },
    ticketEx3: { type: DataTypes.STRING, allowNull: true },
    ticketEx4: { type: DataTypes.STRING, allowNull: true },
    ticketEx5: { type: DataTypes.STRING, allowNull: true },
    ticketEx6: { type: DataTypes.STRING, allowNull: true },
  });

  return Students;
};
