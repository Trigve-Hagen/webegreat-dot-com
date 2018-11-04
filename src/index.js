import '@babel/polyfill';
import React, { Component } from 'react';
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
import Home from './components/home';


class DynamicImport extends Component {
    state = {
        component: null
    }
    componentWillMount() {
        this.props.load()
            .then((mod) => this.setState(() => ({
                component: mod.default
            })))
    }
    render() {
        return this.props.children(this.state.component)
    }
}

const NotFound = (props) => (
    <DynamicImport load={() => import('./NotFound')}>
        {
            (Component) => Component == null
                ? <div></div>
                : <Component {...props} />
       }
    </DynamicImport>
)

const Signup = (props) => (
    <DynamicImport load={() => import('./components/register/signup-complete')}>
        {
            (Component) => Component == null
                ? <div></div>
                : <Component {...props} />
       }
    </DynamicImport>
)

const Success = (props) => (
    <DynamicImport load={() => import('./components/paypal/success')}>
        {
            (Component) => Component == null
                ? <div></div>
                : <Component {...props} />
       }
    </DynamicImport>
)

const Cancel = (props) => (
    <DynamicImport load={() => import('./components/paypal/cancel')}>
        {
            (Component) => Component == null
                ? <div></div>
                : <Component {...props} />
       }
    </DynamicImport>
)

const Store = (props) => (
    <DynamicImport load={() => import('./components/store')}>
        {
            (Component) => Component == null
                ? <div></div>
                : <Component {...props} />
       }
    </DynamicImport>
)

const About = (props) => (
    <DynamicImport load={() => import('./components/about')}>
        {
            (Component) => Component == null
                ? <div></div>
                : <Component {...props} />
       }
    </DynamicImport>
)

const Cart = (props) => (
    <DynamicImport load={() => import('./components/cart')}>
        {
            (Component) => Component == null
                ? <div></div>
                : <Component {...props} />
       }
    </DynamicImport>
)

const Contact = (props) => (
    <DynamicImport load={() => import('./components/contact')}>
        {
            (Component) => Component == null
                ? <div></div>
                : <Component {...props} />
       }
    </DynamicImport>
)

const Register = (props) => (
    <DynamicImport load={() => import('./components/register')}>
        {
            (Component) => Component == null
                ? <div></div>
                : <Component {...props} />
       }
    </DynamicImport>
)

const Login = (props) => (
    <DynamicImport load={() => import('./components/login')}>
        {
            (Component) => Component == null
                ? <div></div>
                : <Component {...props} />
       }
    </DynamicImport>
)

const Logout = (props) => (
    <DynamicImport load={() => import('./components/authenticated/logout')}>
        {
            (Component) => Component == null
                ? <div></div>
                : <Component {...props} />
       }
    </DynamicImport>
)

const Roles = (props) => (
    <DynamicImport load={() => import('./components/authenticated/roles')}>
        {
            (Component) => Component == null
                ? <div></div>
                : <Component {...props} />
       }
    </DynamicImport>
)

const Profile = (props) => (
    <DynamicImport load={() => import('./components/authenticated/profile')}>
        {
            (Component) => Component == null
                ? <div></div>
                : <Component {...props} />
       }
    </DynamicImport>
)

const Products = (props) => (
    <DynamicImport load={() => import('./components/authenticated/products')}>
        {
            (Component) => Component == null
                ? <div></div>
                : <Component {...props} />
       }
    </DynamicImport>
)

const Menu = (props) => (
    <DynamicImport load={() => import('./components/authenticated/menu')}>
        {
            (Component) => Component == null
                ? <div></div>
                : <Component {...props} />
       }
    </DynamicImport>
)

const CustomerOrders = (props) => (
    <DynamicImport load={() => import('./components/authenticated/customer-orders')}>
        {
            (Component) => Component == null
                ? <div></div>
                : <Component {...props} />
       }
    </DynamicImport>
)

const MerchantOrders = (props) => (
    <DynamicImport load={() => import('./components/authenticated/merchant-orders')}>
        {
            (Component) => Component == null
                ? <div></div>
                : <Component {...props} />
       }
    </DynamicImport>
)


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
                            <Route exact path="/cancel/:id" component={Cancel}/>
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