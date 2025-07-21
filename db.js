const { Sequelize, DataTypes, QueryTypes } = require("sequelize");
const { connectionString } = require("./tool");
var sqlite3 = require('sqlite3');
var file = './test.db';//这里写的就是数据库文件的路径
// 从环境变量中读取数据库配置

// const sequelize = new Sequelize({
//   storage: file,
//   dialect: 'sqlite' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
//   define: {
//     timestamps: false,
//     freezeTableName: true
//   },
//   dialectModule: sqlite3 // 就是这里，必须要指明使用哪个模块来操作，否则是会报错了
// });
// const sequelize = new Sequelize({
//   database: 'neondb',
//   username: 'neondb_owner',
//   password: 'npg_I3MZLzvCt9Rx',
//   host: 'ep-rapid-sunset-a1oiy01d-pooler.ap-southeast-1.aws.neon.tech', // 例如 'localhost'
//   port: 5432, // PostgreSQL 默认端口
//   dialect: 'postgres',
//   dialectModule: require('pg'), // 指定使用 pg 模块
//   define: {
//     timestamps: false,
//     freezeTableName: true
//   },
// });

//  const [host, port] = 'mysql2.sqlpub.com:3307'.split(":");

// const sequelize = new Sequelize('jiandan', 'jiandan', 'la244vrgcjuyU0Bp', {
//   host,
//   port,
//   dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
// });
// 定义数据模型

const users = async function () {
  return await sequelize.query("SELECT * FROM `用户`", { type: QueryTypes.SELECT })
};
const query = async function (sql2) {
  return await sequelize.query(sql2, { type: QueryTypes.SELECT })
};
const add = async function (addSql) {
  return await sequelize.query(addSql, { type: QueryTypes.INSERT })
};
const del = async function (delSql) {
  return await sequelize.query(delSql, { type: QueryTypes.BULKDELETE })
};
const update = async function (upSql) {
  return await sequelize.query(upSql, { type: QueryTypes.UPDATE })
}

//异步函数，用于初始化
// async function init() {
//   //等待Counter表同步，alter参数为true
//   await Counter.sync({ alter: true });
// }

// 导出初始化方法和模型
module.exports = {
  users,
  QueryTypes,
  sequelize,
  query, add, del, update

};