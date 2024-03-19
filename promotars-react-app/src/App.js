import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="container">
      <div className="content">
        <h3 id="title" className="title"></h3>
        <h4 id="subtitle" className="subtitle"></h4>
        <div id="media--container" className="media-container">
        </div>
        <button id="proceed" className="proceed">Proceed</button>
      </div>
    </div>
  );
}

export default App;
