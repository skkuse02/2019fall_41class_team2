module.exports = (sequelize, DataTypes) => {
  const Spend = sequelize.define('Spend', {
    spend_id: {
      type: DataTypes.INTEGER(10),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      comment: '지출 아이디'
    },
    detail: {
      type: DataTypes.STRING(30),
      allowNull: false,
      comment: '지출 이름'
    },
    latitude: {
      type: DataTypes.DECIMAL(16,14),
      allowNull: true,
      comment: '지출 위도'
    },
    longitude: {
      type: DataTypes.DECIMAL(17,14),
      allowNull: false,
      comment: '지출 경도'
    },
    expense: {
      type: DataTypes.FLOAT(20),
      allowNull: true,
      comment: '지출 금액'
    },
  }, {
    tableName: 'Spend',
    comment: '지출',
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  Spend.associate = function (models) {
    Spend.belongsTo(models.Schedule, { foreignKey: { name: 'schedule_id', allowNull: false}});
  };
  return Spend;
};
