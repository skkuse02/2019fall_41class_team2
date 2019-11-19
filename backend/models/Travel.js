module.exports = (sequelize, DataTypes) => {
    const Travel = sequelize.define('Travel', {
      travel_id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        comment: '여행 아이디'
      },
      title: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '여행 제목'
      },
      content: {
        type: DataTypes.STRING(30),
        allowNull: true,
        comment: '여행 설명'
      },
      category: {
        type: DataTypes.STRING(5),
        allowNull: false,
        comment: '여행 카테고리'
      },
      total_budget: {
        type: DataTypes.FLOAT(20),
        allowNull: false,
        comment: '여행 총 예산'
      },
      start_date: {
        type: DataTypes.DATE(),
        allowNull: false,
        comment: '여행 시작일'
      },
      end_date: {
        type: DataTypes.DATE(),
        allowNull: false,
        comment: '여행 종료일'
      }
    }, {
      tableName: 'Travel',
      comment: '여행',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
    Travel.associate = function (models) {
      Travel.hasMany(models.User_Travel, { foreignKey: { name: 'travel_id', allowNull: false}});
      Travel.belongsTo(models.Nation, { foreignKey: { name: 'nation_id', allowNull: false}});
      Travel.hasMany(models.Schedule, { foreignKey: { name: 'travel_id', allowNull: false}});
    };
    return Travel;
  };
  