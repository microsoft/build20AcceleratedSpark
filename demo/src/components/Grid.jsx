import React from 'react';
import Query from './Query';

class Grid extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    verticalAlign: "middle",
                    padding: 25
                }}>
                    {
                        this.props.queryDescriptions.map((queryDescription, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <div style={{
                                            backgroundColor: "rgba(0, 6, 13, 0.85)",
                                            minWidth: 400
                                        }}>
                                            <div style={{
                                                padding: 10,
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                fontFamily: "Segoe UI SemiBold",
                                                fontSize: '12pt',
                                                color: this.props.themes[index].cpuColor
                                            }}>
                                                99.7GB of NYC Yellow Taxi Trip Records
                                            </div>
                                            <div style={{
                                                borderTop: `1px solid ${this.props.themes[index].cpuColor}`,
                                                fontFamily: "Segoe UI SemiBold",
                                                fontWeight: 700,
                                                fontSize: "11pt",
                                                color: this.props.themes[index].cpuColor,
                                                paddingTop: 10,
                                                paddingLeft: 5,
                                                paddingRight: 10,
                                                paddingBottom: 5
                                            }}>
                                                <span style={{
                                                    marginLeft: 20,
                                                    fontWeight: 700,
                                                    fontSize: "12pt",
                                                    fontFamily: "Segoe UI SemiBold",
                                                    color: this.props.themes[index].cpuColor
                                                }}>
                                                    {queryDescription.title}
                                                </span>
                                                {queryDescription.sql}
                                            </div>
                                        </div>
                                        <Query
                                            effects={this.props.effects}
                                            scalar={this.props.scalar}
                                            index={index}
                                            spec={this.props.spec ? this.props.spec : "E16v3"}
                                            theme={this.props.themes[index]}
                                            recordSetCPU={this.props.recordSetsCPU[index]}
                                            recordSetFPGA={this.props.recordSetsFPGA[index]}
                                        />
                                    </div>
                                </React.Fragment>
                            );
                        })
                    }
                </div>
            </React.Fragment >
        )
    }
}

export default Grid;