var _jsxFileName = "/Users/rikiyaota/Documents/tango_cho/src/client-raw.js";

/**
 * クライアント側のプログラム
 * dbとやりとりして、データを表示したり。
 * サーバー・クライアントをはっきり分けたから、かなりやりやすいはず
 *
 * Reactを使って、動的なシングルページアプリケーションを作る
 */
const React = require("react");

const ReactDOM = require("react-dom");

"use strict"; //HTML要素のルート


const root = document.getElementById("root"); //MySQLのデータベースからデータを全て取得して
//それらを配列にして返してくれる関数

function getAllData() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/data");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  return new Promise((resolve, reject) => {
    xhr.onload = resolve;
    xhr.send();
  }).then(() => {
    if (xhr.status == 200) {
      console.log("------getAllData成功!!------");
      console.log("JSON.parse(xhr.response)=", JSON.parse(xhr.response));
      console.log("----------------------------");
      return JSON.parse(xhr.response);
    } else {
      console.log("-----getAllData取得失敗-----");
      throw new Error("Fail getAllData: xhr.response=" + xhr.response);
    }
  });
} //POSTリクエストを実行する関数
//params = { word, meaning }
//return {insertId: xxxx}


function postData(word, meaning) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/data/create");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  return new Promise((resolve, reject) => {
    xhr.onload = resolve;
    xhr.send(JSON.stringify({
      word: word,
      meaning: meaning
    }));
  }).then(() => {
    if (xhr.status === 200) {
      console.log("-----postData function 通信成功!!!-----");
      console.log("xhr.response=" + xhr.response);
      console.log("---------------------------------------");
      return JSON.parse(xhr.response);
    } else {
      console.log("----postData function 通信失敗------");
      console.log("xhr.response=" + xhr.response);
      console.log("------------------------------------");
      throw new Error("xhr.response=" + xhr.response);
    }
  });
} //DELETEリクエストを実行する関数


function deleteData(dataId) {
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", "data/delete/" + dataId);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  return new Promise((resolve, reject) => {
    xhr.onload = resolve;
    xhr.send();
  }).then(() => {
    if (xhr.status === 200) {
      console.log("-----deleteData通信成功--------");
    } else {
      console.log("----deleteData通信失敗---------");
    }
  });
} //テーブルの行要素を返すComponent


class TableRow extends React.Component {
  render() {
    return React.createElement("tr", {
      "data-id": this.props.dataId,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 93
      },
      __self: this
    }, React.createElement("td", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 94
      },
      __self: this
    }, this.props.data.word), React.createElement("td", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 95
      },
      __self: this
    }, this.props.data.meaning), React.createElement("td", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 96
      },
      __self: this
    }, React.createElement("button", {
      onClick: this.props.deleteExecute,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 96
      },
      __self: this
    }, "Delete")));
  }

} //テーブル全体を返すComponent
//props.datas = データベースから取ってきたデータの配列


class Table extends React.Component {
  render() {
    const rows = [];
    this.props.datas.forEach(data => {
      rows.push(React.createElement(TableRow, {
        data: data,
        key: data.id,
        dataId: data.id,
        deleteExecute: this.props.deleteExecute,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 108
        },
        __self: this
      }));
    });
    return React.createElement("table", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 112
      },
      __self: this
    }, React.createElement("thead", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 113
      },
      __self: this
    }, React.createElement("tr", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 114
      },
      __self: this
    }, React.createElement("th", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 115
      },
      __self: this
    }, "\u5358\u8A9E"), React.createElement("th", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 116
      },
      __self: this
    }, "\u610F\u5473"), React.createElement("th", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 117
      },
      __self: this
    }))), React.createElement("tbody", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 120
      },
      __self: this
    }, rows));
  }

} //メインComponent


class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "",
      meaning: "",
      datas: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteExecute = this.deleteExecute.bind(this);
  } //this.state.datasは、DBから非同期で取得したいので、
  //こちらでセットすることにする。
  //https://qiita.com/megane42/items/213e927a2af72530e920


  componentDidMount() {
    console.log("-----componentDidMount func.-------");
    getAllData().then(resp => {
      this.setState({
        datas: resp
      });
    });
  }

  handleChange(event) {
    console.log("------handleChange event------");
    console.log(event.target);
    console.log("------------------------------");
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("-----handleSubmit event------");
    console.log(event.target);
    console.log("-----------------------------");
    const word = event.target.word.value;
    const meaning = event.target.meaning.value;
    const params = {
      word: word,
      meaning: meaning
    }; //postリクエスト用

    console.log("word=" + word, "meaning=" + meaning);
    const datas = this.state.datas;
    postData(word, meaning).then(resp => {
      const insertId = resp.insertId;
      datas.push({
        id: insertId,
        word: word,
        meaning: meaning
      });
      this.setState({
        word: "",
        meaning: "",
        datas: datas
      });
    });
  }

  deleteExecute(event) {
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
    const dataId = clickedRow.dataset.id; //DBへDELETEリクエストを発行した後、
    //this.state.datasの中から、id==dataIdとなるものを削除する。

    deleteData(dataId).then(() => {
      const datas = this.state.datas;
      const deletedData = datas.filter(data => data.id != dataId);
      this.setState({
        datas: deletedData
      });
    });
  }

  render() {
    return React.createElement("div", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 221
      },
      __self: this
    }, React.createElement("form", {
      onSubmit: this.handleSubmit,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 222
      },
      __self: this
    }, React.createElement("label", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 223
      },
      __self: this
    }, "\u8FFD\u52A0\u3059\u308B\u82F1\u5358\u8A9E"), React.createElement("input", {
      type: "text",
      name: "word",
      value: this.state.word,
      onChange: this.handleChange,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 224
      },
      __self: this
    }), React.createElement("br", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 225
      },
      __self: this
    }), React.createElement("label", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 226
      },
      __self: this
    }, "\u610F\u5473"), React.createElement("input", {
      type: "text",
      name: "meaning",
      value: this.state.meaning,
      onChange: this.handleChange,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 227
      },
      __self: this
    }), React.createElement("input", {
      type: "submit",
      value: "\u8FFD\u52A0",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 229
      },
      __self: this
    })), React.createElement("br", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 231
      },
      __self: this
    }), React.createElement("br", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 232
      },
      __self: this
    }), React.createElement(Table, {
      datas: this.state.datas,
      deleteExecute: this.deleteExecute,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 233
      },
      __self: this
    }));
  }

}

ReactDOM.render(React.createElement(MainComponent, {
  __source: {
    fileName: _jsxFileName,
    lineNumber: 241
  },
  __self: this
}), root);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUFBO0FBQUE7QUFBQSxNQUZGLEVBR0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFIRixFQUlFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQUpGLEVBS0U7QUFBTyxNQUFBLElBQUksRUFBQyxNQUFaO0FBQW1CLE1BQUEsSUFBSSxFQUFDLFNBQXhCO0FBQWtDLE1BQUEsS0FBSyxFQUFFLEtBQUssS0FBTCxDQUFXLE9BQXBEO0FBQTZELE1BQUEsUUFBUSxFQUFFLEtBQUssWUFBNUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFMRixFQU9FO0FBQU8sTUFBQSxJQUFJLEVBQUMsUUFBWjtBQUFxQixNQUFBLEtBQUssRUFBQyxjQUEzQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQVBGLENBREYsRUFVRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQVZGLEVBV0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFYRixFQVlFLG9CQUFDLEtBQUQ7QUFBTyxNQUFBLEtBQUssRUFBRSxLQUFLLEtBQUwsQ0FBVyxLQUF6QjtBQUFnQyxNQUFBLGFBQWEsRUFBRSxLQUFLLGFBQXBEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BWkYsQ0FERjtBQWdCRDs7QUEzR3lDOztBQStHNUMsUUFBUSxDQUFDLE1BQVQsQ0FDRSxvQkFBQyxhQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBREYsRUFFRSxJQUZGIiwiZmlsZSI6ImNsaWVudC1iYWJlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICog44Kv44Op44Kk44Ki44Oz44OI5YG044Gu44OX44Ot44Kw44Op44OgXG4gKiBkYuOBqOOChOOCiuOBqOOCiuOBl+OBpuOAgeODh+ODvOOCv+OCkuihqOekuuOBl+OBn+OCiuOAglxuICog44K144O844OQ44O844O744Kv44Op44Kk44Ki44Oz44OI44KS44Gv44Gj44GN44KK5YiG44GR44Gf44GL44KJ44CB44GL44Gq44KK44KE44KK44KE44GZ44GE44Gv44GaXG4gKlxuICogUmVhY3TjgpLkvb/jgaPjgabjgIHli5XnmoTjgarjgrfjg7PjgrDjg6vjg5rjg7zjgrjjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7PjgpLkvZzjgotcbiAqL1xuXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmNvbnN0IFJlYWN0RE9NID0gcmVxdWlyZShcInJlYWN0LWRvbVwiKTtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vSFRNTOimgee0oOOBruODq+ODvOODiFxuY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKTtcblxuLy9NeVNRTOOBruODh+ODvOOCv+ODmeODvOOCueOBi+OCieODh+ODvOOCv+OCkuWFqOOBpuWPluW+l+OBl+OBplxuLy/jgZ3jgozjgonjgpLphY3liJfjgavjgZfjgabov5TjgZfjgabjgY/jgozjgovplqLmlbBcbmZ1bmN0aW9uIGdldEFsbERhdGEoKXtcbiAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHhoci5vcGVuKFwiR0VUXCIsIFwiL2RhdGFcIik7XG4gIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJYLVJlcXVlc3RlZC1XaXRoXCIsIFwiWE1MSHR0cFJlcXVlc3RcIik7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG4gICAgeGhyLm9ubG9hZCA9IHJlc29sdmU7XG4gICAgeGhyLnNlbmQoKTtcbiAgfSlcbiAgLnRoZW4oKCk9PntcbiAgICBpZih4aHIuc3RhdHVzID09IDIwMCl7XG4gICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLWdldEFsbERhdGHmiJDlip8hIS0tLS0tLVwiKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpPVwiLCBKU09OLnBhcnNlKHhoci5yZXNwb25zZSkpO1xuICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKTtcbiAgICB9ZWxzZXtcbiAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS1nZXRBbGxEYXRh5Y+W5b6X5aSx5pWXLS0tLS1cIik7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsIGdldEFsbERhdGE6IHhoci5yZXNwb25zZT1cIiArIHhoci5yZXNwb25zZSk7XG4gICAgfVxuICB9KTtcbn1cblxuLy9QT1NU44Oq44Kv44Ko44K544OI44KS5a6f6KGM44GZ44KL6Zai5pWwXG4vL3BhcmFtcyA9IHsgd29yZCwgbWVhbmluZyB9XG4vL3JldHVybiB7aW5zZXJ0SWQ6IHh4eHh9XG5mdW5jdGlvbiBwb3N0RGF0YSh3b3JkLCBtZWFuaW5nKXtcbiAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHhoci5vcGVuKFwiUE9TVFwiLCBcIi9kYXRhL2NyZWF0ZVwiKTtcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlgtUmVxdWVzdGVkLVdpdGhcIiwgXCJYTUxIdHRwUmVxdWVzdFwiKTtcblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcbiAgICB4aHIub25sb2FkID0gcmVzb2x2ZTtcbiAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeSh7d29yZDogd29yZCwgbWVhbmluZzogbWVhbmluZ30pKTtcbiAgfSlcbiAgLnRoZW4oKCk9PntcbiAgICBpZih4aHIuc3RhdHVzID09PSAyMDApe1xuICAgICAgY29uc29sZS5sb2coXCItLS0tLXBvc3REYXRhIGZ1bmN0aW9uIOmAmuS/oeaIkOWKnyEhIS0tLS0tXCIpO1xuICAgICAgY29uc29sZS5sb2coXCJ4aHIucmVzcG9uc2U9XCIgKyB4aHIucmVzcG9uc2UpO1xuICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xuICAgIH1lbHNle1xuICAgICAgY29uc29sZS5sb2coXCItLS0tcG9zdERhdGEgZnVuY3Rpb24g6YCa5L+h5aSx5pWXLS0tLS0tXCIpO1xuICAgICAgY29uc29sZS5sb2coXCJ4aHIucmVzcG9uc2U9XCIgKyB4aHIucmVzcG9uc2UpO1xuICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ4aHIucmVzcG9uc2U9XCIgKyB4aHIucmVzcG9uc2UpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vREVMRVRF44Oq44Kv44Ko44K544OI44KS5a6f6KGM44GZ44KL6Zai5pWwXG5mdW5jdGlvbiBkZWxldGVEYXRhKGRhdGFJZCl7XG4gIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICB4aHIub3BlbihcIkRFTEVURVwiLCBcImRhdGEvZGVsZXRlL1wiK2RhdGFJZCk7XG4gIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1SZXF1ZXN0ZWQtV2l0aFwiLCBcIlhNTEh0dHBSZXF1ZXN0XCIpO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuICAgIHhoci5vbmxvYWQgPSByZXNvbHZlO1xuICAgIHhoci5zZW5kKCk7XG4gIH0pXG4gIC50aGVuKCgpPT57XG4gICAgaWYoeGhyLnN0YXR1cyA9PT0gMjAwKXtcbiAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS1kZWxldGVEYXRh6YCa5L+h5oiQ5YqfLS0tLS0tLS1cIik7XG4gICAgfWVsc2V7XG4gICAgICBjb25zb2xlLmxvZyhcIi0tLS1kZWxldGVEYXRh6YCa5L+h5aSx5pWXLS0tLS0tLS0tXCIpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8v44OG44O844OW44Or44Gu6KGM6KaB57Sg44KS6L+U44GZQ29tcG9uZW50XG5jbGFzcyBUYWJsZVJvdyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiAoXG4gICAgICA8dHIgZGF0YS1pZD17dGhpcy5wcm9wcy5kYXRhSWR9PlxuICAgICAgICA8dGQ+e3RoaXMucHJvcHMuZGF0YS53b3JkfTwvdGQ+XG4gICAgICAgIDx0ZD57dGhpcy5wcm9wcy5kYXRhLm1lYW5pbmd9PC90ZD5cbiAgICAgICAgPHRkPjxidXR0b24gb25DbGljaz17dGhpcy5wcm9wcy5kZWxldGVFeGVjdXRlfT5EZWxldGU8L2J1dHRvbj48L3RkPlxuICAgICAgPC90cj5cbiAgICApO1xuICB9XG59XG5cbi8v44OG44O844OW44Or5YWo5L2T44KS6L+U44GZQ29tcG9uZW50XG4vL3Byb3BzLmRhdGFzID0g44OH44O844K/44OZ44O844K544GL44KJ5Y+W44Gj44Gm44GN44Gf44OH44O844K/44Gu6YWN5YiXXG5jbGFzcyBUYWJsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpe1xuICAgIGNvbnN0IHJvd3MgPSBbXTtcbiAgICB0aGlzLnByb3BzLmRhdGFzLmZvckVhY2goKGRhdGEpPT57XG4gICAgICByb3dzLnB1c2goPFRhYmxlUm93IGRhdGE9e2RhdGF9IGtleT17ZGF0YS5pZH0gZGF0YUlkPXtkYXRhLmlkfSBkZWxldGVFeGVjdXRlPXt0aGlzLnByb3BzLmRlbGV0ZUV4ZWN1dGV9IC8+KTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8dGFibGU+XG4gICAgICAgIDx0aGVhZD5cbiAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGg+5Y2Y6KqePC90aD5cbiAgICAgICAgICAgIDx0aD7mhI/lkbM8L3RoPlxuICAgICAgICAgICAgPHRoPjwvdGg+XG4gICAgICAgICAgPC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5PlxuICAgICAgICAgIHtyb3dzfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgPC90YWJsZT5cbiAgICApO1xuICB9XG59XG5cbi8v44Oh44Kk44OzQ29tcG9uZW50XG5jbGFzcyBNYWluQ29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgd29yZDogXCJcIixcbiAgICAgIG1lYW5pbmc6IFwiXCIsXG4gICAgICBkYXRhczogW11cbiAgICB9O1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVN1Ym1pdCA9IHRoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5kZWxldGVFeGVjdXRlID0gdGhpcy5kZWxldGVFeGVjdXRlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvL3RoaXMuc3RhdGUuZGF0YXPjga/jgIFEQuOBi+OCiemdnuWQjOacn+OBp+WPluW+l+OBl+OBn+OBhOOBruOBp+OAgVxuICAvL+OBk+OBoeOCieOBp+OCu+ODg+ODiOOBmeOCi+OBk+OBqOOBq+OBmeOCi+OAglxuICAvL2h0dHBzOi8vcWlpdGEuY29tL21lZ2FuZTQyL2l0ZW1zLzIxM2U5MjdhMmFmNzI1MzBlOTIwXG4gIGNvbXBvbmVudERpZE1vdW50KCl7XG4gICAgY29uc29sZS5sb2coXCItLS0tLWNvbXBvbmVudERpZE1vdW50IGZ1bmMuLS0tLS0tLVwiKTtcbiAgICBnZXRBbGxEYXRhKCkudGhlbihyZXNwPT57XG4gICAgICB0aGlzLnNldFN0YXRlKHtkYXRhczogcmVzcH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGV2ZW50KXtcbiAgICBjb25zb2xlLmxvZyhcIi0tLS0tLWhhbmRsZUNoYW5nZSBldmVudC0tLS0tLVwiKTtcbiAgICBjb25zb2xlLmxvZyhldmVudC50YXJnZXQpO1xuICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBbZXZlbnQudGFyZ2V0Lm5hbWVdOiBldmVudC50YXJnZXQudmFsdWVcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZVN1Ym1pdChldmVudCl7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnNvbGUubG9nKFwiLS0tLS1oYW5kbGVTdWJtaXQgZXZlbnQtLS0tLS1cIik7XG4gICAgY29uc29sZS5sb2coZXZlbnQudGFyZ2V0KTtcbiAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuXG4gICAgY29uc3Qgd29yZCAgICA9IGV2ZW50LnRhcmdldC53b3JkLnZhbHVlO1xuICAgIGNvbnN0IG1lYW5pbmcgPSBldmVudC50YXJnZXQubWVhbmluZy52YWx1ZTtcbiAgICBjb25zdCBwYXJhbXMgID0geyB3b3JkOiB3b3JkLCBtZWFuaW5nOiBtZWFuaW5nIH07Ly9wb3N044Oq44Kv44Ko44K544OI55SoXG5cbiAgICBjb25zb2xlLmxvZyhcIndvcmQ9XCIgKyB3b3JkLCBcIm1lYW5pbmc9XCIgKyBtZWFuaW5nKTtcblxuICAgIGNvbnN0IGRhdGFzID0gdGhpcy5zdGF0ZS5kYXRhcztcblxuICAgIHBvc3REYXRhKHdvcmQsIG1lYW5pbmcpLnRoZW4ocmVzcD0+e1xuICAgICAgY29uc3QgaW5zZXJ0SWQgPSByZXNwLmluc2VydElkO1xuICAgICAgZGF0YXMucHVzaCh7aWQ6IGluc2VydElkLCB3b3JkOiB3b3JkLCBtZWFuaW5nOiBtZWFuaW5nfSk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgd29yZDogXCJcIixcbiAgICAgICAgbWVhbmluZzogXCJcIixcbiAgICAgICAgZGF0YXM6IGRhdGFzXG4gICAgICB9KTtcbiAgICB9KTtcblxuICB9XG5cbiAgZGVsZXRlRXhlY3V0ZShldmVudCl7XG4gICAgY29uc29sZS5sb2coXCItLS0tLS1kZWxldGVFeGVjdXRlLS0tLS0tXCIpO1xuXG4gICAgY29uc29sZS5sb2coXCItLS0tLS1ldmVudC50YXJnZXQtLS0tLS1cIik7XG4gICAgY29uc29sZS5sb2coZXZlbnQudGFyZ2V0KTtcbiAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcblxuICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS0tLS0tLVwiKTtcbiAgICBjb25zb2xlLmxvZyhldmVudC50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlKTtcbiAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuXG4gICAgY29uc29sZS5sb2coXCItLS0tLWV2ZW50LnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUuZGF0YXNldC5pZC0tLS0tLVwiKTtcbiAgICBjb25zb2xlLmxvZyhldmVudC50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmRhdGFzZXQuaWQpO1xuICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG5cbiAgICBjb25zdCBjbGlja2VkUm93ID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICBjb25zdCBkYXRhSWQgPSBjbGlja2VkUm93LmRhdGFzZXQuaWQ7XG5cbiAgICAvL0RC44G4REVMRVRF44Oq44Kv44Ko44K544OI44KS55m66KGM44GX44Gf5b6M44CBXG4gICAgLy90aGlzLnN0YXRlLmRhdGFz44Gu5Lit44GL44KJ44CBaWQ9PWRhdGFJZOOBqOOBquOCi+OCguOBruOCkuWJiumZpOOBmeOCi+OAglxuICAgIGRlbGV0ZURhdGEoZGF0YUlkKS50aGVuKCgpPT57XG4gICAgICBjb25zdCBkYXRhcyA9IHRoaXMuc3RhdGUuZGF0YXM7XG4gICAgICBjb25zdCBkZWxldGVkRGF0YSA9IGRhdGFzLmZpbHRlcihkYXRhPT5kYXRhLmlkICE9IGRhdGFJZCk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZGF0YXM6IGRlbGV0ZWREYXRhXG4gICAgICB9KTtcbiAgICB9KTtcblxuICB9XG5cbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxmb3JtIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG4gICAgICAgICAgPGxhYmVsPui/veWKoOOBmeOCi+iLseWNmOiqnjwvbGFiZWw+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIndvcmRcIiB2YWx1ZT17dGhpcy5zdGF0ZS53b3JkfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IC8+XG4gICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgPGxhYmVsPuaEj+WRszwvbGFiZWw+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm1lYW5pbmdcIiB2YWx1ZT17dGhpcy5zdGF0ZS5tZWFuaW5nfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IC8+XG5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwi6L+95YqgXCIgLz5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICA8YnIgLz5cbiAgICAgICAgPGJyIC8+XG4gICAgICAgIDxUYWJsZSBkYXRhcz17dGhpcy5zdGF0ZS5kYXRhc30gZGVsZXRlRXhlY3V0ZT17dGhpcy5kZWxldGVFeGVjdXRlfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG59XG5cblJlYWN0RE9NLnJlbmRlcihcbiAgPE1haW5Db21wb25lbnQgLz4sXG4gIHJvb3Rcbik7XG4iXX0=