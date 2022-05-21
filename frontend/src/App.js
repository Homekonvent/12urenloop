import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header id="header">
          <div className={"top"} >

          </div>
        <img src={logo} className="logo" alt="logo" />
        <ul id={"menu"}>
            <li className={"active"} >Bierprijs</li>
        </ul>
      </header>
    </div>
  );
}

export default App;
