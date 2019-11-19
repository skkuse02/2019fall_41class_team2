module.exports = (sequelize, DataTypes) => {
    const User_Travel = sequelize.define('User_Travel', {
    }, {
      tableName: 'User_Travel',
      comment: '유저, 여행 매핑 테이블',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
    User_Travel.associate = function (models) {
      User_Travel.belongsTo(models.User, { foreignKey: { name: 'user_id', allowNull: false}});
      User_Travel.belongsTo(models.Travel, { foreignKey: { name: 'travel_id', allowNull: false}});
    };
    return User_Travel;
  };
  