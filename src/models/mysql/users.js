module.exports = (sequelize, DataTypes) => {

  const Users = sequelize.define("Users", {
    nombre: { type: DataTypes.STRING, allowNull: true },
    apellido: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: true },
    numTelefono: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    adress: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.STRING, allowNull: true },
    avatar: { type: DataTypes.STRING, allowNull: true },
    token: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: true },
  });

  return Users;
  
};
