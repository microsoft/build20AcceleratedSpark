import React from 'react';
import { Meter } from './Meter';

export class FPGA extends React.Component {
    render() {
        const theme = this.props.theme;
        return (
            <React.Fragment>
                <Meter
                    effects={this.props.effects}
                    spec={this.props.spec ? this.props.spec : "NP10"}
                    specColor={theme.fpgaSpecColor}
                    specShift={5}
                    scalar={this.props.scalar}
                    theme={theme}
                    background={theme.fpga}
                    color={theme.fpgaColor}
                    hoverColor={theme.fpgaHoverColor}
                    start={theme.startFPGA}
                    stop={theme.stopFPGA}
                    meterRange={this.props.meterRange}
                    recordSet={this.props.recordSet}
                />
            </React.Fragment>
        )
    }
}