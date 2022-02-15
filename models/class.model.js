module.exports = (sequelize, Sequelize) => {
  const Class = sequelize.define("classes", {
    // class_id: {
    //   type: Sequelize.ID,
    //   primaryKey: true,
    //   defaultValue: Sequelize.UUIDV4,
    //   allowNull: false,
    // },
    class_name: {
      type: Sequelize.STRING
    },
    num_of_student: {
      type: Sequelize.NUMERIC
    },
    section: {
      type: Sequelize.STRING
    },
  });
  return Class;
};
