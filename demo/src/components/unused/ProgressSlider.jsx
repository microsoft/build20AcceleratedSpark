import React from 'react';

export class ProgressSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            position: 0
        };
    }

    update = () => {
        if(this.props.running) {
            this.setState({
                position: this.state.position < 245 ? this.state.position + 10 : -245
            })
            setTimeout(() => {
                this.update();                
            }, 1000/this.props.mapMbPerSecond(this.props.mbPerSecond, 30, 60));
        }
    }

    componentDidMount() {
        this.update();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.running !== this.props.running && this.props.running) {
            this.update();
        }
    }

    render() {
        return (
            <React.Fragment>
                <div style={{
                    position: "absolute",
                    height: `${5*this.props.scalar}px`,
                    width: `${245*this.props.scalar}px`,
                    overflow: "hidden",
                    backgroundColor: "#333"
                }}>
                    <div style={{
                        position: "absolute",
                        height: `${5*this.props.scalar}px`,
                        width: `${122*this.props.scalar}px`,
                        transform: `translate(${(this.state.position+0)*this.props.scalar}px, 0)`,
                        background: `linear-gradient(to left, ${this.props.color} ${this.props.mapMbPerSecond(this.props.mbPerSecond, 0, 50)}%, #333 ${this.props.mapMbPerSecond(this.props.mbPerSecond, 55, 75)}%)`
                    }}></div>
                    <div style={{
                        position: "absolute",
                        height: `${5*this.props.scalar}px`,
                        width: `${123*this.props.scalar}px`,
                        transform: `translate(${(this.state.position+122)*this.props.scalar}px, 0)`,
                        background: `linear-gradient(to right, ${this.props.color} ${this.props.mapMbPerSecond(this.props.mbPerSecond, 0, 50)}%, #333 ${this.props.mapMbPerSecond(this.props.mbPerSecond, 55, 75)}%)`
                    }}></div>
                </div>
            </React.Fragment>
        );
    }
}