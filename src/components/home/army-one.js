import React from 'react';

class ArmyOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animate: false
        }
    }

    componentDidMount() {
        const ANIMATION_TIMEOUT = 50;

        setTimeout(() => {
        this.setState({ animate: true });
        }, ANIMATION_TIMEOUT);
    }

    render() {
        return (
            <div>
                <img
                    alt="Army One"
                    src={ `/img/home/army-1.jpg` }
                    className="img-fluid"
                    style={{
                        opacity: this.state.animate ? 1 : 0,
                        left: this.state.animate ? 0 : -600,
                        height: this.state.animate ? 1900 : 100,
                        transition: 'all 3s',
                    }}
                />
            </div>
        )
    }
}

export default ArmyOne