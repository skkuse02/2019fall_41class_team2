module.exports = (sequelize, DataTypes) => {
  const Nation = sequelize.define('Nation', {
    nation_id: {
      type: DataTypes.INTEGER(5),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      comment: '나라 아이디'
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      comment: '나라 이름'
    },
    latitude: {
      type: DataTypes.DECIMAL(16,14),
      allowNull: false,
      comment: '나라 위도'
    },
    longitude: {
      type: DataTypes.DECIMAL(17,14),
      allowNull: false,
      comment: '나라 경도'
    },
  }, {
    tableName: 'Nation',
    comment: '나라',
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  Nation.associate = function (models) {
    Nation.hasMany(models.Travel, { foreignKey: { name: 'nation_id', allowNull: false}});
  };
  return Nation;
};
