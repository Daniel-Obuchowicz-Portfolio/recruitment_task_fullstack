import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import SetupCheck from './SetupCheck';
import ExchangeRatesView from './ExchangeRatesView';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link className="navbar-brand" to="#">Telemedi Zadanko</Link>
                    <button className="navbar-toggler" type="button" onClick={this.toggle}
                        aria-controls="navbarText" aria-expanded={this.state.isOpen} aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`${this.state.isOpen ? 'show' : ''} collapse navbar-collapse`} id="navbarText">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/setup-check">React Setup Check</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/exchange-rate">Exchange Rate</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
                <Switch>
                    <Route path="/exchange-rate" component={ExchangeRatesView} />
                </Switch>
            </div>
        )
    }
}

export default Home;
