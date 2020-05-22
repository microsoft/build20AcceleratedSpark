import React from 'react';

export class ProgressGrower extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div style={{
                    position: "absolute",
                    width: `${245 * this.props.scalar}px`,
                    height: `${5 * this.props.scalar}px`,
                    zIndex: 1,
                    transform: `translate(${53 * this.props.scalar}px, ${375 * this.props.scalar}px)`,
                    transition: "all 0.5s ease 0s"
                }}>
                    <div style={{
                        position: "absolute",
                        height: `${5 * this.props.scalar}px`,
                        width: `${245 * this.props.scalar}px`,
                        overflow: "hidden",
                        backgroundColor: "#333"
                    }}>
                        <div style={{
                            position: "absolute",
                            height: `${5 * this.props.scalar}px`,
                            width: `${250 * this.props.scalar}px`,
                            background: `linear-gradient(to right, ${this.props.color} ${this.props.mapMbProcessed(this.props.mbProcessed, 0, 95)}%, #333 ${this.props.mapMbProcessed(this.props.mbProcessed, 5, 100)}%)`
                        }}></div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}