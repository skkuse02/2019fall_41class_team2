module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define('Schedule', {
      schedule_id: {
        type: DataTypes.INTEGER(10),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        comment: '일정 아이디'
      },
      title: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '일정 제목'
      },
      content: {
        type: DataTypes.STRING(30),
        allowNull: true,
        comment: '일정 설명'
      },
      latitude: {
        type: DataTypes.DECIMAL(16,14),
        allowNull: false,
        comment: '일정 위도'
      },
      longitude: {
        type: DataTypes.DECIMAL(17,14),
        allowNull: false,
        comment: '일정 경도'
      },
      budget: {
        type: DataTypes.FLOAT(20),
        allowNull: false,
        comment: '일정 예산'
      },
      start_time: {
        type: DataTypes.TIME(),
        allowNull: false,
        comment: '일정 시작 시각'
      },
      end_time: {
        type: DataTypes.TIME(),
        allowNull: false,
        comment: '일정 종료 시각'
      },
      date: {
        type: DataTypes.DATEONLY(),
        allowNull: false,
        comment: '일정 수행일'
      }
    }, {
      tableName: 'Schedule',
      comment: '일정',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
    Schedule.associate = function (models) {
      Schedule.hasMany(models.Spend, { foreignKey: { name: 'schedule_id', allowNull: false}});
      Schedule.belongsTo(models.Travel, { foreignKey: { name: 'travel_id', allowNull: false}});
      Schedule.belongsTo(models.City, { foreignKey: { name: 'city_id', allowNull: false}});
    };
    return Schedule;
  };
  