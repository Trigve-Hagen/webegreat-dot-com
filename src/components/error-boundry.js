import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            errors: '',
            information: '',
        };
    }
  
    componentDidCatch(error, info) {
        console.log("Error: " + error);
        console.log("Info: " + JSON.stringify(info));
        this.setState({ hasError: true, errors: error, information: info });
    }
  
    render() {
        if (this.state.hasError) {
            return <div className="container">
                <h1>Something went wrong.</h1>
            </div>
        }
        return this.props.children;
    }
}

export default ErrorBoundary;