module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      user_id: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true,
        comment: '사용자 아이디'
      },
      password: {
        type: DataTypes.STRING(256),
        allowNull: false,
        comment: '사용자 비밀번호'
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        comment: '사용자 이름'
      },
      authority: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        comment: '사용자 권한'
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false,
        comment: '사용자 닉네임'
      }
    }, {
      tableName: 'User',
      comment: '유저',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
    User.associate = function (models) {
      User.hasMany(models.User_Travel, { foreignKey: { name: 'user_id', allowNull: false}});
    };
    return User;
  };
  