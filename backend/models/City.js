module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    city_id: {
      type: DataTypes.INTEGER(5),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      comment: '도시 아이디'
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      comment: '도시 이름'
    },
    latitude: {
      type: DataTypes.DECIMAL(16,14),
      allowNull: false,
      comment: '도시 위도'
    },
    longitude: {
      type: DataTypes.DECIMAL(17,14),
      allowNull: false,
      comment: '도시 경도'
    },
  }, {
    tableName: 'City',
    comment: '도시',
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  City.associate = function (models) {
    City.hasMany(models.Schedule, { foreignKey: { name: 'city_id', allowNull: false}});
  };
  return City;
};
  