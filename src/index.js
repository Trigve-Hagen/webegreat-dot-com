import '@babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
//import registerServiceWorker from './registerServiceWorker';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { Provider } from 'react-redux';

import './index.css';
import store from './config/store';
import NotFound from './NotFound';

import Home from './components/home';
import About from './components/about';
import Contact from './components/contact';
import Register from './components/register';
import Login from './components/login';
import Cart from './components/cart';

import( /* webpackChunkName: 'application' */ './App')
    .then(({ default: App }) =>
        render(
            <Provider store={store}>
                <Router>
                    <App>
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route exact path="/about" component={About}/>
                            <Route exact path="/contact" component={Contact}/>
                            <Route exact path="/register" component={Register}/>
                            <Route exact path="/login" component={Login}/>
                            <Route exact path="/cart" component={Cart}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </App>
                </Router>
            </Provider>, document.getElementById('root')
        )
    )

//registerServiceWorker();