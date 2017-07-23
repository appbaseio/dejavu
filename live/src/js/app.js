import "babel-polyfill";

const React = require("react");
const ReactDOM = require("react-dom");
const HomePage = require("./HomePage.js");

ReactDOM.render(<HomePage />, document.getElementById("main"));
