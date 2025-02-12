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
//  const [host, port] = 'juy2o.h.filess.io:3307'.split(":");
// console.log(process.env.SQL_URL)
//const connectionString = process.env.SQL_URL

const sequelize = new Sequelize(connectionString, {
  logging: true,
});


// const sequelize = new Sequelize("jiandan_grewshopon", 'jiandan_grewshopon', 'bb63ce563a9adc5ad72c42acb4fb9a172a024172', {
//   host,
//   port,
//   dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
//   logging: true,
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