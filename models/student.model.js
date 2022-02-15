module.exports = (sequelize, Sequelize) => {
    const Student = sequelize.define("students", {
        student_name: {
            type: Sequelize.STRING
        },
        class_id: {
            type: Sequelize.INTEGER
        },
        student_email: {
            type: Sequelize.STRING
        },
        gender: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
    });
    return Student;
};
