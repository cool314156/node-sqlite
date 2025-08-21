const express = require('express');
const path = require("path");
const cors = require('cors');
const app = express();
//解决post请求无法获取参数的问题
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 使用cors中间件 解决跨域问题
app.use(cors({
  origin: ['http://localhost:8080', 'https://node-sqlite-cool3141567250-igz9bhp4.leapcell.dev'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的HTTP方法
  allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
  optionsSuccessStatus: 200 // 预检请求的结果状态
}));

var multiparty = require("multiparty");
var fs = require('fs');
var dateFormat = require("dateformat");
const { users, sequelize, QueryTypes, query, add, del, update } = require("./db");
const { aesEncryptObj2Obj, aesDecryptText, random } = require("./tool");
app.use(express.static(path.join(__dirname, 'public')));


app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "public"));
});
app.all("/test", (req, res) => {
  let data = {};
  console.log(req.method)
  if (req.method === 'GET') {
    data = req.query
  } else if (req.method === 'POST') {
    data = req.body
  }
  users().then((restult) => {
    res.send({
      code: 0,
      msg: '成功',
      data: restult,
    });
  }).catch((err) => {
    console.log(err)
    res.send({
      code: 0,
      msg: '失败',
      data: err,
    });
  })
})
app.all('/api/AccountLogin', function (req, res) {//登录验证
  let jm
  if (req.body.word) {
    jm = aesDecryptText(req.body.word);
  } else {
    jm = req.body
  }
  let mz = jm.username;
  let mm = jm.password;
  let sql = ` SELECT * FROM 用户 WHERE 用户名= '${mz}' AND 密码 = '${mm}'`;
  console.log(sql)
  query(sql).then((resul) => {
    if (resul.length > 0) {
      res.json({
        code: 1,
        msg: "登录成功",
        data: aesEncryptObj2Obj({
          userinfo:
          {
            avatar: resul[0].照片,
            token: random(32),
            user_id: resul[0].id,
            account: resul[0].用户名,
            //password:resul[0].密码,

          },
          token: random(32),
          shij: new Date(),
          username: resul[0].用户名,
          uuid: resul[0].uuid,
          photo: resul[0].照片,

        })

      });
    } else {
      res.json({
        code: 101,
        msg: "用户名或者密码错误"
      });
    }
  }).catch((err) => {
    console.log(err);
    res.json({
      code: 101,
      msg: err
    });
  })
});
app.all('/api/GetMenuTreeOnAuth', function (req, res) {
  let jc = aesDecryptText(req.body.word);
  let mz = jc.username;
  //let token = jc.token;
  let token
  if (jc.token) {
    token = jc.token;
  } else {
    token = req.headers['x-token'];
  }

  // console.log(token);
  let sql = ` SELECT * FROM 用户 WHERE 用户名= '${mz}'`;
  console.log(sql)
  query(sql).then((resul) => {
    if (token) {
      if (resul.length > 0) {
        let kb = ``;
        let kbc = ``;
        let sj = ``;
        if (resul[0].功能权限 == null) {
          kb = []
        } else {
          kb = resul[0].功能权限
        }
        if (resul[0].产品权限 == null) {
          kbc = []
        } else {
          kbc = resul[0].产品权限
        }
        if (resul[0].手机权限 == null) {
          sj = []
        } else {
          sj = resul[0].手机权限
        }
        res.json({
          code: 1,
          msg: "用户信息",
          data: aesEncryptObj2Obj({
            功能权限: kb,
            产品权限: kbc,
            手机权限: sj
          }),
        });

      } else {
        res.json({
          code: 101,
          msg: "用户名或者密码错误"
        });
      }

    }
  }).catch((err) => {
    console.log(err);
    res.json({
      code: 101,
      msg: err
    })
  });

});

app.all('/query', async function (req, res) { //查询数据
  //console.log(req.body);
  let reqs = aesDecryptText(req.body.word);
  // console.log(reqs);
  //console.log(req.headers);
  let token;
  if (reqs.token) {
    token = reqs.token;
  } else if (req.headers['x-token']) {
    token = req.headers['x-token'];
  }

  let tj = reqs.tj;
  if (tj) {
  } else {
    tj = true;
  }
  let sj = reqs.tablename;
  let lm = reqs.columns;
  let zd = reqs.field;
  let ts = reqs.limit ? reqs.limit : 1000;
  let fy = reqs.page ? reqs.page : 1;
  let px = reqs.order ? reqs.order : 'asc';
  let nr = reqs.content;
  let sql = ``;
  let countsql = ``
  if (lm) {
    sql = ` SELECT  ${lm} FROM ${sj} WHERE ${tj} LIMIT ${ts} OFFSET ${(fy-1)*ts}`;
    countsql = ` SELECT  count(*) FROM ${sj} WHERE ${tj} `;
  } else if (lm == undefined) {
    if (nr) {
      if (tj != 'for') {
        sql = nr + ' WHERE ' + tj 
        // countsql = ` SELECT  count(*) FROM ${sj} WHERE ${tj} `;
      } else {
        sql = nr
        // countsql = ` SELECT  count(*) FROM ${sj} `;
      }
    } else {
      // if (fy) {
        // console.log(reqs.field)
        if (zd) {
          if (px != 'asc') {
            sql = `SELECT * FROM ${sj} WHERE ${tj} ORDER BY ${zd} DESC LIMIT ${ts} OFFSET ${(fy-1)*ts}`;
          } else {
            sql = `SELECT * FROM ${sj} WHERE ${tj} ORDER BY ${zd} LIMIT ${ts} OFFSET ${(fy-1)*ts}`;
          }
          countsql = ` SELECT  count(*) FROM ${sj} WHERE ${tj} `;
        } else if (zd == undefined) {
          sql = `SELECT * FROM ${sj} WHERE ${tj} LIMIT ${ts} OFFSET ${(fy-1)*ts}`;
          countsql = ` SELECT  count(*) FROM ${sj} WHERE ${tj} `;
        }
    }
  }
  let count = 0
  if(countsql){
   count = await query(countsql).then((res) => {
    if(lm){
      return res[0][`count(${lm})`]
    }else{
      return res[0][`count(*)`]
    }
  
  })
}
  console.log(sql);
  query(sql).then((resul) => {
    if (token) {
      if (lm) {
        res.json(
          resul)
      } else if (nr) {
        res.json({
          code: 1,
          message: '返回成功',
          count: resul.length,
          //data:nres
          data: aesEncryptObj2Obj(resul)
        });
      } else {
        let nres = resul.map(function (v) {
          if (v.日期 != undefined) {
            return Object.assign(v, {
              日期: dateFormat(v.日期, "isoDate")
            })
          } else if (v.time != undefined) {
            let fsj = dateFormat(v.time, "isoDateTime")
            let rq = fsj.toString().split('T');
            let sj = rq[1].split('+');
            return Object.assign(v, {
              time: rq[0] + '&nbsp;' + sj[0]
            })
          } else {
            return v
          }
        });
        if (nr) {
          let fys = Number(fy) - 1;
          let tss = Number(ts);
          let csj = nres.slice(fys * tss, tss + (fys * tss));
          let jm = aesEncryptObj2Obj(csj);
          res.json({
            code: 1,
            message: '成功',
            count: resul.length,
            //data:csj
            //data:aesEncryptObj2Obj(csj)
            data: jm
          })

        }else{
             res.json({
            code: 1,
            message: '成功',
            count: count,
            data: aesEncryptObj2Obj(nres)
          });
        }
      }
      //console.log(resul.length);
    } else {
      res.json({
        code: 401,
        message: '请先登录',
      });
    }
  }).catch((err) => {
    console.log(err);
    res.json({
      code: 101,
      message: err,
    });
  })
})



app.all('/aud', function (req, res) {  //数据增删改
  let reqs = aesDecryptText(req.body.word);
  let token;
  if (reqs.token) {
    token = reqs.token;
  } else if (req.headers['x-token']) {
    token = req.headers['x-token'];
  }
  let lx = reqs.reqType;
  let bm = reqs.tablename;
  let nr = reqs.content;
  let ipdz = req.ip;
  switch (lx) {
    case 'append':
      let arr = Object.keys(nr[0]); //获取键名  
      // console.log(arr);
      //(async function(){
      //await new Promise((resolve, reject) => {
      let sjz = nr.map(function (val) { // 循环找出每组的内容
        let narr = arr.map(function (v) { //获取键名对应的值
          return `'${val[v]}' `;
        });
        if (bm != '日志') {
          return `(${narr})`;
        } else {
          return `${narr}`;
        }
      });
      let sz = sjz.toString();   // 把获取键名对应的值的数组转化为字符串
      let lz = arr.toString();    // 把获取键名的数组转化为字符串
      //console.log(sz);
      //console.log(lz);
      let addSql = ``;
      if (bm == '日志') {
        addSql = ` INSERT INTO ${bm}(ip,${lz}) VALUES('${ipdz}',${sz})`;
      } else {
        addSql = `INSERT INTO ${bm}  (${lz}) VALUES ${sz} `;
      }

      console.log(addSql);
      add(addSql).then((resul) => {
        console.log(resul)
        if (token) {
          res.json({
            code: 1,
            message: '新增成功',
            count: resul[1],
            data:aesEncryptObj2Obj('ok')
          });
        } else {
          res.json({
            code: 401,
            message: '请先登录',
          });
        }
      }).catch((err) => {
        console.log(err);
        res.json({
          code: 101,
          message: err,
        })
      });
      break;
    case 'delete':
      let sc = nr.toString();
      //console.log(nr.toString())
      let delSql = `DELETE FROM ${bm} WHERE id IN(${sc})`;
      console.log(delSql)
      del(delSql).then((resul) => {
        console.log(resul);
        if (token) {
          let wj = reqs.wjm;
          let lx = reqs.wdlx;
          if (wj && wj) {
            if (lx == '员工资料') {
              /*  fs.unlink(`/public/upload/atta/${wj}`, (err) => { //这个是异步删除文件
                   if(err) throw err;
                   console.log('删除成功');
               });  */
              fs.unlinkSync(`public/upload/atta/${wj}`);  // 同步删除文件
            } else if (lx == '消息通知') {
              fs.unlinkSync(`public/upload/msg/${wj}`);
            }
          }
          res.json({
            code: 1,
            message: '删除成功',
            count: resul,
            data:aesEncryptObj2Obj('ok')
          });
          //console.log(result);
          //return false;
        } else {
          res.json({
            code: 401,
            message: '请先登录',
          });
        }
      }).catch((err) => {
        console.log(err);
        res.json({
          code: 101,
          message: err,
        })
      })

      break;
    case 'update':
      //let uobj= eval('('+ nr +')'); //转换为对象：
      let uarr;
      let uarr2;
      //console.log(nr)   
      let uobj = nr[0];
      console.log(uobj);
      let arr2 = Object.keys(uobj); //获取键名
      console.log(arr2); //获取键名
      uarr = arr2.map(function (v,) { //拼接修改条件
        if (v != 'id') {
          return `${v} = '${uobj[v]}'`
        }
      });
      uarr2 = uarr.filter(function (v2) { //过滤出id
        if (v2 != 'undefined') {
          return v2
        }
      }).toString();
      console.log(uarr2);
      let modSql = `UPDATE ${bm} SET ${uarr2} WHERE id = ${uobj.id}`;
      console.log(modSql);
      update(modSql).then((resul) => {
        if (token) {
          res.json({
            code: 1,
            message: '修改成功',
            count: resul[1],
            data:aesEncryptObj2Obj('ok')
          });
        } else {
          res.json({
            code: 401,
            message: '请先登录',
          });
        }
      }).catch((err) => {
        console.log(err);
        res.json({
          code: 101,
          message: err,
        })
      })

      break;

    case 'updateshuzu':
      let upSql = nr;

      console.log(upSql);
      update(upSql).then((resul) => { //修改数组
        console.log(resul)
        if (token) {
          res.json({
            code: 1,
            message: '修改成功',
            count: resul[1],
            data:aesEncryptObj2Obj('ok')
          });
        } else {
          res.json({
            code: 401,
            message: '请先登录',
          });
        }
      }).catch((err) => {
        console.log(err);
        res.json({
          code: 101,
          message: err,
        })
      })
      break;

  }

})
app.all('/uploadAtta', function (req, res) {
  //生成multiparty对象，并配置上传目标路径
  let user
  if (req.cookies.user) {
    user = decodeURIComponent(req.cookies.user);
  } else if (req.query.user) {
    user = decodeURIComponent(req.query.user);
  }
  let addSql = ``
  var form = new multiparty.Form({ uploadDir: './public/upload/atta' });
  form.parse(req, function (err, fields, files) {
    //console.log(files);
    //console.log(fields);
    let oldPath = files.file[0].path;
    //console.log(oldPath)
    let wjm = files.file[0].originalFilename
    let newPath = `public/upload/atta/${wjm}`;
    console.log(user);
    fs.rename(oldPath, newPath, function (err) {
      if (err) {
        console.error(err);
        return;
      }
      //console.log('重命名成功');
    });
    if (err) {
    } else {
      res.json({
        code: 1,
        data: { src: `./upload/atta/${wjm}` },
        location: `./public/upload/atta/${wjm}`,
        file: `${wjm}`
      });
      if (req.query.cpid) {
        let cpid = req.query.cpid;
        addSql = `INSERT INTO 文档 (文档类型,文件名,上传人,产品ID) VALUES('产品资料','${wjm}','${user}','${cpid}')`;
      } else {
        addSql = `INSERT INTO 文档 (文档类型,文件名,上传人) VALUES('员工资料','${wjm}','${user}')`;
      }
      console.log(addSql)
      add(addSql).then((result) => {
        //console.log(result.affectedRows); 

      }).catch((err) => {
        console.log(err);
        res.json({
          code: 101,
          message: err,

        });
      })
    }
  });

});

app.all('/uploadMsg', function (req, res) {
  //生成multiparty对象，并配置上传目标路径
  let user = decodeURIComponent(req.cookies.user);
  let addSql = ``
  var form = new multiparty.Form({ uploadDir: './public/upload/msg' });
  form.parse(req, function (err, fields, files) {
    //console.log(files);
    //console.log(fields);
    let oldPath = files.file[0].path;
    //console.log(oldPath)
    let wjm = files.file[0].originalFilename
    let newPath = `public/upload/msg/${wjm}`;
    console.log(user);
    fs.rename(oldPath, newPath, function (err) {
      if (err) {
        console.error(err);
        return;
      }
      //console.log('重命名成功');
    });
    if (err) {
    } else {
      res.json({
        code: 1,
        data: { src: `./upload/msg/${wjm}` },
        location: `./public/upload/msg/${wjm}`,
        file: `${wjm}`
      });
      addSql = `INSERT INTO 文档 (文档类型,文件名,上传人) VALUES('消息通知','${wjm}','${user}')`;
      console.log(addSql)
      add(addSql).then((result) => {
        //console.log(result.affectedRows); 

      }).catch((err) => {
        res.json({
          code: 101,
          message: err,

        });
      })

    }
  });
});
app.all('/tongji', function (req, res) { //查询数据

  let reqs = aesDecryptText(req.body.word);
  let token;
  if (reqs.token) {
    token = reqs.token;
  } else if (req.headers['x-token']) {
    token = req.headers['x-token'];
  }
  // console.log(reqs);
  let tj = reqs.tj;
  let sj = reqs.tablename;
  let tjl = reqs.reqType;
  let count = reqs.count;
  let lm = reqs.group;
  let sql = ``
  console.log(tjl);

  if (tjl == 'group') {
    if (tj) {
      sql = `SELECT  ${lm}, DATE_FORMAT(日期, '%Y%m') AS 月份,DATE_FORMAT(日期, '%Y') AS 年份, SUM(数量) AS 总量 ,
     SUM(金额) AS 总金额 FROM ${sj} WHERE ${tj}  GROUP BY ${lm} ORDER BY ${lm}; `;
    }
  } else if (tjl == 'group2') {
    if (tj) {
      sql = `SELECT  ${lm}, DATE_FORMAT(日期, '%Y') AS 年份, SUM(数量) AS 总量 ,
    SUM(金额) AS 总金额 FROM ${sj} WHERE ${tj}  GROUP BY ${lm} ORDER BY ${lm}; `;
    }
  } else if (tjl == 'cross') {
    let gh = reqs.hgroup;
    let hj = reqs.hj;
    console.log(gh);
    sql = `SELECT IFNULL(${lm},'total') AS ${lm},${gh}, ${hj} FROM ${sj}  WHERE ${tj} GROUP BY ${lm} WITH ROLLUP ;`
  } else if (tjl == 'count') {
    sql = count
  }
  // console.log(sql);
  query(sql).then((resul) => {
    if (token) {
      if (lm) {
        res.json({
          code: 1,
          message: '成功',
          count: resul.length,
          data: aesEncryptObj2Obj(resul)
        })

      }
    } else {
      res.json({
        code: 401,
        message: '请先登录',
      });
    }
  }).catch((err) => {
    console.log(err);
    res.json({
      code: 101,
      message: err,

    });
  })

})
const PORT = 8099;
app.listen(PORT, () => {
  console.log(`服务已启动 端口是:${PORT}`);
});

module.exports = app
