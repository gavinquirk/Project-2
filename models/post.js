module.exports = function (sequelize, DataTypes) {
  var resources = sequelize.define("resources", {
    link: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1]
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [1]
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    voteCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true
    }

  });
  return resources;
  console.log("models page: post.js" + resources);

};