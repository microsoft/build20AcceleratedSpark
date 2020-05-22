import React from 'react';
import { Meter } from './Meter';

export class CPU extends React.Component {
    render() {
        const theme = this.props.theme;
        return (
            <React.Fragment>
                <Meter             
                    effects={this.props.effects}
                    spec={this.props.spec ? this.props.spec : "E16v3"}
                    specColor={theme.cpuSpecColor}
                    specShift={0}
                    scalar={this.props.scalar}
                    theme={theme}
                    background={theme.cpu}
                    color={theme.cpuColor}
                    hoverColor={theme.cpuHoverColor}
                    start={theme.startCPU}
                    stop={theme.stopCPU}
                    meterRange={this.props.meterRange}
                    recordSet={this.props.recordSet}
                />
            </React.Fragment>
        )
    }
}