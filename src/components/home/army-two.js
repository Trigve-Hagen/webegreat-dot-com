import React from 'react';
import { relative } from 'path';

class ArmyTwo extends React.Component {
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
                    alt="Army Two"
                    src={ `/img/home/army-2.jpg` }
                    className="img-fluid"
                    style={{
                        position: "absolute",
                        left: this.state.animate ? 0 : -600,
                        top: this.state.animate ? 290 : 100,
                        transition: 'all 3s',
                    }}
                />
            </div>
        )
    }
}

export default ArmyTwo