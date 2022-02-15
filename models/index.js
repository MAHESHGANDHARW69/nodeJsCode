const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB,dbConfig.USER,dbConfig.PASSWORD,{
    host:dbConfig.HOST,
    dialect:dbConfig.dialect,
    operatorsAliases:false,
    pool:{
        max:dbConfig.pool.max,
        min:dbConfig.pool.min,
        acquire:dbConfig.pool.acquire,
        idle:dbConfig.pool.idle
    }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
// db.users = require("./register.model.js")(sequelize,Sequelize);
db.classes = require("./class.model.js")(sequelize,Sequelize);
db.students = require("./student.model.js")(sequelize,Sequelize);
db.students.belongsTo(db.classes,{foreignKey:'class_id'});
module.exports = db;
