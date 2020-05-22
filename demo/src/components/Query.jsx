import React from 'react';
import { CPU } from './CPU';
import { FPGA } from './FPGA';

class Query extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meterRange: {
                start: 0,
                end: 500
            }
        }
    }

    componentDidMount() {
        this.setMeterRangeEnd();
    }

    componentDidUpdate(prevProps) {
        if(this.props.index !== prevProps.index) {
            this.setMeterRangeEnd();
        }
    }

    render() {
        return (
            <React.Fragment>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <CPU
                        effects={this.props.effects}
                        spec={this.props.spec ? this.props.spec : "E16v3"}
                        scalar={this.props.scalar}
                        meterRange={this.state.meterRange}
                        theme={this.props.theme}
                        recordSet={this.props.recordSetCPU}
                    />
                    <FPGA                
                        effects={this.props.effects}
                        scalar={this.props.scalar}
                        meterRange={this.state.meterRange}
                        theme={this.props.theme}
                        recordSet={this.props.recordSetFPGA}
                    />
                </div>
            </React.Fragment>
        )
    }

    setMeterRangeEnd = () => {
        let maxValue = 0;
        const l = this.props.recordSetFPGA.length;
        for (let i = 0; i < l; i++) {
            const record = this.props.recordSetFPGA[i];
            const value = Math.trunc(record.calculateValue());
            if (maxValue < value) {
                maxValue = value;
            }
        }
        this.setState({
            meterRange: {
                start: 0,
                end: maxValue
            }
        })
    }
}

export default Query;