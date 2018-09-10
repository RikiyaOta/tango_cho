/**
 * クライアント側のプログラム
 * dbとやりとりして、データを表示したり。
 * サーバー・クライアントをはっきり分けたから、かなりやりやすいはず
 *
 * Reactを使って、動的なシングルページアプリケーションを作る
 */

//webpackでバンドルします。 
import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const React = require("react");
const ReactDOM = require("react-dom");

"use strict";

//HTML要素のルート
const root = document.getElementById("root");

//MySQLのデータベースからデータを全て取得して
//それらを配列にして返してくれる関数
function getAllData(){
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/data");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

  return new Promise((resolve, reject)=>{
    xhr.onload = resolve;
    xhr.send();
  })
  .then(()=>{
    if(xhr.status == 200){
      console.log("------getAllData成功!!------");
      console.log("JSON.parse(xhr.response)=", JSON.parse(xhr.response));
      console.log("----------------------------");
      return JSON.parse(xhr.response);
    }else{
      console.log("-----getAllData取得失敗-----");
      throw new Error("Fail getAllData: xhr.response=" + xhr.response);
    }
  });
}

//POSTリクエストを実行する関数
//params = { word, meaning }
//return {insertId: xxxx}
function postData(word, meaning){
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/data/create");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

  return new Promise((resolve, reject)=>{
    xhr.onload = resolve;
    xhr.send(JSON.stringify({word: word, meaning: meaning}));
  })
  .then(()=>{
    if(xhr.status === 200){
      console.log("-----postData function 通信成功!!!-----");
      console.log("xhr.response=" + xhr.response);
      console.log("---------------------------------------");
      return JSON.parse(xhr.response);
    }else{
      console.log("----postData function 通信失敗------");
      console.log("xhr.response=" + xhr.response);
      console.log("------------------------------------");
      throw new Error("xhr.response=" + xhr.response);
    }
  });
}

//DELETEリクエストを実行する関数
function deleteData(dataId){
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", "data/delete/"+dataId);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

  return new Promise((resolve, reject)=>{
    xhr.onload = resolve;
    xhr.send();
  })
  .then(()=>{
    if(xhr.status === 200){
      console.log("-----deleteData通信成功--------");
    }else{
      console.log("----deleteData通信失敗---------");
    }
  });
}

//アラート用のJSXをレンダリングするComponent
//条件次第で切り替えるので注意。
class Alert extends React.Component {
  
  render(){
    if(!this.props.alert) return null;
    const alertJSX = (
      <div className="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>未入力!!</strong>wordかmeaningか、どっちか入力しとらんで。あかんで。
        <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.props.deleteAlert}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
    return alertJSX;
  }

}

//テーブルの行要素を返すComponent
class TableRow extends React.Component {
  render(){
    return (
      <tr data-id={this.props.dataId}>
        <td scope="row" className="text-center">{this.props.data.word}</td>
        <td className="text-center">{this.props.data.meaning}</td>
        <th className="text-center"><button type="button" className="btn btn-danger" onClick={this.props.deleteExecute}>Delete</button></th>
      </tr>
    );
  }
}

//テーブル全体を返すComponent
//props.datas = データベースから取ってきたデータの配列
class Table extends React.Component {
  render(){
    const rows = [];
    this.props.datas.forEach((data)=>{
      rows.push(<TableRow data={data} key={data.id} dataId={data.id} deleteExecute={this.props.deleteExecute} />);
    });

    return (
      <table className="table table-hover">
        <thead className="thead-light">
          <tr>
            <th className="text-center" scope="col">単語</th>
            <th className="text-center" scope="col">意味</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

//メインComponent
class MainComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      word: "",
      meaning: "",
      alert: false,
      datas: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteExecute = this.deleteExecute.bind(this);
    this.deleteAlert = this.deleteAlert.bind(this);
  }

  //this.state.datasは、DBから非同期で取得したいので、
  //こちらでセットすることにする。
  //https://qiita.com/megane42/items/213e927a2af72530e920
  componentDidMount(){
    console.log("-----componentDidMount func.-------");
    getAllData().then(resp=>{
      this.setState({datas: resp});
    });
  }

  handleChange(event){
    console.log("------handleChange event------");
    console.log(event.target);
    console.log("------------------------------");

    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event){
    event.preventDefault();

    console.log("-----handleSubmit event------");
    console.log(event.target);
    console.log("-----------------------------");

    const word    = event.target.word.value;
    const meaning = event.target.meaning.value;
    if(!word || !meaning){
      //どちらか未入力の場合は中断
      //アラートを出してユーザーに通知
      this.setState({
        alert: true
      });
      return;
    }

    if(this.state.alert){
      this.setState({
        alert: false
      });
    }
    
    console.log("word=" + word, "meaning=" + meaning);

    const datas = this.state.datas;

    postData(word, meaning).then(resp=>{
      const insertId = resp.insertId;
      datas.push({id: insertId, word: word, meaning: meaning});
      this.setState({
        word: "",
        meaning: "",
        datas: datas
      });
    });

  }

  deleteExecute(event){
    console.log("------deleteExecute------");

    console.log("------event.target------");
    console.log(event.target);
    console.log("------------------------");

    console.log("------event.target.parentNode.parentNode------");
    console.log(event.target.parentNode.parentNode);
    console.log("-----------------------------------");

    console.log("-----event.target.parentNode.parentNode.dataset.id------");
    console.log(event.target.parentNode.parentNode.dataset.id);
    console.log("--------------------------------------------------------");

    const clickedRow = event.target.parentNode.parentNode;
    const dataId = clickedRow.dataset.id;

    //DBへDELETEリクエストを発行した後、
    //this.state.datasの中から、id==dataIdとなるものを削除する。
    deleteData(dataId).then(()=>{
      const datas = this.state.datas;
      const deletedData = datas.filter(data=>data.id != dataId);
      this.setState({
        datas: deletedData
      });
    });

  }

  deleteAlert(event){
    this.setState({
      alert: false
    });
  }

  render(){
    return (
      <div>
        <Alert alert={this.state.alert} deleteAlert={this.deleteAlert} />
        <form className="form-inline" onSubmit={this.handleSubmit}>
          <label className="sr-only">追加する英単語</label><br />
          <input className="form-control mb-2 mr-sm-2" type="text" name="word" value={this.state.word} onChange={this.handleChange} placeholder="word" />
          <br />
          <label className="sr-only">意味</label><br />
          <input className="form-control mb-2 mr-sm-2" type="text" name="meaning" value={this.state.meaning} onChange={this.handleChange} placeholder="meaning" />
          <br />
          <input className="btn btn-primary mb-2" type="submit" value="追加" />
        </form>
        <br />
        <br />
        <Table datas={this.state.datas} deleteExecute={this.deleteExecute} />
      </div>
    );
  }

}

ReactDOM.render(
  <MainComponent />,
  root
);
