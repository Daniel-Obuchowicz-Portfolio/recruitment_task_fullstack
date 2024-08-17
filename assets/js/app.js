/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
//import './css/app.css';

// start the Stimulus application
//import './bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import '../css/app.css';
import Home from './components/Home';
import SetupCheck from "./components/SetupCheck";
import ExchangeRatesView from './components/ExchangeRatesView';

ReactDOM.render(
  <Router>
    <div>
      {/* Home jako nagłówek */}
      <Home />
      
      {/* Główne trasy */}
      <Switch>
        <Route exact path="/">
          <Redirect to="/setup-check" />
        </Route>
        <Route path="/setup-check" component={SetupCheck} />
        <Route path="/exchange-rates/:startDate/:endDate?" component={ExchangeRatesView} />
        <Route path="/exchange-rates/" component={ExchangeRatesView} />
      </Switch>
    </div>
  </Router>,
  document.getElementById('root')
);
