import React from 'react';
import Query from './Query';

class Tabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        }
    }
    render() {
        return (
            <React.Fragment>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 25
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <div style={{
                            backgroundColor: "#00060ddd",
                            minWidth: 400
                        }}>
                            <div style={{
                                display: "flex",
                                padding: 5,
                                borderBottom: `1px solid ${this.props.themes[this.state.index].cpuColor}`,
                                fontFamily: "Segoe UI SemiBold",
                                fontWeight: 700,
                                fontSize: "14pt"
                            }}>
                                {
                                    this.props.queryDescriptions.map((queryDescription, index) => {
                                        return (
                                            <span
                                                key={index}
                                                value={index}
                                                onClick={(e) => this.setState({ index: index })}
                                                style={{
                                                    cursor: "pointer",
                                                    color: index === this.state.index ? this.props.themes[this.state.index].cpuColor : "#ffffff",
                                                    marginLeft: 20
                                                }}
                                            >
                                                {queryDescription.title}
                                            </span>
                                        );
                                    })
                                }
                            </div>
                            <div style={{
                                minHeight: 120,
                                fontFamily: "Segoe UI SemiBold",
                                fontWeight: 700,
                                fontSize: "12pt",
                                color: this.props.themes[this.state.index].cpuColor
                            }}>
                                {this.props.queryDescriptions[this.state.index].sql}
                            </div>
                        </div>
                        <Query
                            scalar={this.props.scalar}
                            index={this.state.index}
                            theme={this.props.themes[this.state.index]}
                            recordSetCPU={this.props.recordSetsCPU[this.state.index]}
                            recordSetFPGA={this.props.recordSetsFPGA[this.state.index]}
                        />
                    </div>
                </div>
            </React.Fragment >
        )
    }
}

export default Tabs;