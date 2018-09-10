const path = require("path");

module.exports = {
  entry: "./src/client-raw.js",
  output: {
    filename: "client.js",
    path: path.resolve(__dirname, "src")
  },
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|browser_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-react", {development: true}]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
