module.exports = (sequelize, DataTypes) => {
  const Config = sequelize.define("config", {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    sequence: { type: DataTypes.INTEGER, allowNull: true },
  });

  return Config;
};
