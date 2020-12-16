import React, { Component } from 'react';
import './App.css';
import { Route, Redirect } from 'react-router';
import { BrowserRouter, Switch, Link } from 'react-router-dom';
import { AiOutlineShop, AiOutlineShoppingCart } from "react-icons/ai"
import Market from "./components/Market";
import Cart from "./components/Cart";

class App extends Component {
  constructor() {
    super();
    this.state = {
    }
  }

  render() {
    return (
      <div className="MainContainer">
        <BrowserRouter>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/"><img src="/images/icons/icon.png" width="32" height="32" alt="Compile Me" />Your Market!</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" style={{ marginLeft: "20%" }} id="navbarSupportedContent">
              
              <ul className="navbar-nav mr-auto">
              <li className="nav-item" style={{ paddingRight: "30%" }}>
                  <div style={{ width: "max-content" }}>
                    <Link className="nav-link text-dark" to="/"><AiOutlineShop size={20} />Market</Link>
                  </div>
                </li>
                <li className="nav-item" style={{ paddingRight: "30%" }}>
                  <div style={{ width: "max-content" }}>
                    <Link className="nav-link text-dark" to="/cart"><AiOutlineShoppingCart size={20} />Cart</Link>
                  </div>
                </li>

              </ul>
              

            </div>
          </nav>
          <Switch>
            <Route path="/" exact component={() => <Market />} />
            <Route path="/cart" exact component={() => <Cart />} />
  
          </Switch>
        </BrowserRouter>


      </div>
    );
  }
}

export default App;
