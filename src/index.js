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

import 'bootstrap/dist/css/bootstrap.css';
import 'video-react/dist/video-react.css';

import 'jquery';
import 'bootstrap/dist/js/bootstrap';
import 'font-awesome/css/font-awesome.min.css';

import './index.css';

import store from './config/store';
import NotFound from './NotFound';

import Home from './components/home';
import Store from './components/store';
import About from './components/about';
import Contact from './components/contact';
import Register from './components/register';
import Login from './components/login';
import Cart from './components/cart';

import CustomerOrders from './components/authenticated/customer-orders';
import MerchantOrders from './components/authenticated/merchant-orders';
import Logout from './components/authenticated/logout';
import Profile from './components/authenticated/profile';
import Products from './components/authenticated/products';
import Menu from './components/authenticated/menu';
import Roles from './components/authenticated/roles';

import Success from './components/paypal/success';
import Cancel from  './components/paypal/cancel';
import Signup from  './components/register/signup-complete';

import( /* webpackChunkName: 'application' */ './App')
    .then(({ default: App }) =>
        render(
            <Provider store={store}>
                <Router>
                    <App>
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route exact path="/about" component={About}/>
                            <Route exact path="/store" component={Store}/>
                            <Route exact path="/contact" component={Contact}/>
                            <Route exact path="/register" component={Register}/>
                            <Route exact path="/signup" component={Signup}/>
                            <Route exact path="/login" component={Login}/>
                            <Route exact path="/cart" component={Cart}/>
                            <Route exact path="/logout" component={Logout}/>
                            <Route exact path="/profile" component={Profile}/>
                            <Route exact path="/customer-orders" component={CustomerOrders}/>
                            <Route exact path="/merchant-orders" component={MerchantOrders}/>
                            <Route exact path="/products" component={Products}/>
                            <Route exact path="/success" component={Success}/>
                            <Route exact path="/cancel" component={Cancel}/>
                            <Route exact path="/menu" component={Menu}/>
                            <Route exact path="/roles" component={Roles}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </App>
                </Router>
            </Provider>, document.getElementById('root')
        )
    )

//registerServiceWorker();