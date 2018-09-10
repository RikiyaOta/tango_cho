/**
 * DBとやりとりするサーバー側のプログラム 
 * expressを使って、とにかくシンプルに動くものを作る！
 */
const fs = require("fs");
const path = require("path");

//expressのインスタンス化
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
app.use(bodyParser.json()); //リクエストボディのjsonを解析するための設定

//mysqlとやりとりするための準備
const dbInfo = require("./dbInfo.json");
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: dbInfo.host,
  user: dbInfo.user,
  password: dbInfo.password,
  database: dbInfo.database
});

//データベースに接続
connection.connect();

//今回使用するテーブルの名前。クエリに使います。
const tableName = dbInfo.table;

//ポート解放
const server = app.listen(4000, ()=>{
  console.log("-----Server START!!!--------");
  console.log("We open the " + server.address().port + " port.");
});

//ファイルを読み込んで返す関数
//filePathは、相対パスでOKです。
function readFile(filePath){
  return new Promise((resolve, reject)=>{
    const fullPath = path.resolve(filePath);
    fs.readFile(fullPath, "utf8", (err, data)=>{
      if(err) reject(err);
      else resolve(data);
    });
  });
}

//HTMLを返すwebサーバーの部分を記述。
app.get("/", (req, res, next)=>{
  
  readFile("./src/index.html")
  .then(htmlFile=>{
    console.log("-----SUCCESS HTML File Get-----");
    res.set({
      "Content-Type": "text/html"
    });
    res.status(200);
    res.send(htmlFile);
  })
  .catch(err=>{
    console.log("-----ERROR HTML File Get------");
    console.error(err);
  });

});

//clientサイドのjsファイルを返す部分。
app.get("/client.js", (req, res, next)=>{

  readFile("./src/client.js")
  .then(clientJsFile=>{
    console.log("---SUCCESS JS File Get---");
    res.set({
      "Content-Type": "text/javascript"
    });
    res.status(200);
    res.send(clientJsFile);
  })
  .catch(err=>{
    console.log("---ERROR JS File Get---");
    console.error(err);
  });

});

//all GET APIの作成
app.get("/data", (req, res, next)=>{

  console.log("----All GET API----");
  console.log("---------req.hostname---------");
  console.log(req.hostname);
  console.log("------------------------------");

  console.log("---------req.xhr---------");
  console.log(req.xhr);
  console.log("------------------------");

  const getAllData = new Promise((resolve, reject)=>{
    connection.query("SELECT * FROM " + tableName, (err, result)=>{
      if(err) reject(err);
      else resolve(result);
    });
  });

  getAllData.then(result=>{
    console.log("-------GET ALL DATA!!!------");
    console.log(result);
    console.log("----------------------------");

    res.set({
      "Content-Type": "application/json"
    });

    res.status(200);
    
    res.json(result)
  });
});

//データ挿入POSTの実装
//リクエストに、wordとmeaningの値が必要。
app.post("/data/create", upload.array(), (req, res, next)=>{
  
  console.log("------POST-------");

  console.log("-------req.body--------");
  console.log(req.body);
  console.log("-----------------------");

  const word    = req.body.word;
  const meaning = req.body.meaning;
  const params  = { word: word, meaning: meaning };

  const postData = new Promise((resolve, reject)=>{
    connection.query("INSERT INTO " + tableName + " SET ?", params, (err, result)=>{
      if(err) reject(err);
      else resolve(result);
    });
  });

  postData.then(result=>{
    console.log("------posted data-------");
    console.log(result);
    console.log("------result.insertId------");
    console.log(result.insertId);

    res.set({
      "Content-Type": "application/json"
    });
    res.status(200);
    res.json({insertId: result.insertId});
  });
});

//データの削除を実行するメソッド
app.delete("/data/delete/:id", (req, res, next)=>{
  console.log("------DELETE-------");

  console.log("--------req.params-------");
  console.log(req.params);
  console.log("-------------------------");

  const deleteData = new Promise((resolve, reject)=>{
    connection.query("DELETE FROM " + tableName + " WHERE id = ?", [req.params.id], (err, result)=>{
      if(err) reject(err);
      else resolve(result);
    });
  });

  deleteData.then(result=>{
    console.log("------deleteData result-------");
    console.log(result);
    console.log("---------------------------------");

    res.status(200).end(); //レスポンスすべきデータは特にないのでこれで。
  });

});
