import React from 'react';
import { ProgressGrower } from './ProgressGrower';

export class Meter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            angleOffset: -130,
            angle: 0,
            mbPerSecond: 0,
            mbProcessed: 0,
            index: 0,
            total: 0,
            running: false
        };
    }

    mapMbPerSecond = (input, start, end) => {
        const inputStart = this.props.meterRange.start;
        const inputEnd = this.props.meterRange.end;
        const outputStart = start;
        const outputEnd = end;
        const inputRange = inputEnd - inputStart;
        const outputRange = outputEnd - outputStart;

        const output = (input - inputStart) * outputRange / inputRange + outputStart;
        return input === 0 ? 0 : output <= end ? output : end;
    }

    mapMbProcessed = (input, start, end) => {
        const inputStart = 0;
        const inputEnd = this.state.total;
        const outputStart = start;
        const outputEnd = end;
        const inputRange = inputEnd - inputStart;
        const outputRange = outputEnd - outputStart;

        const output = (input - inputStart) * outputRange / inputRange + outputStart;
        return input === 0 ? 0 : output <= end ? output : end;
    }

    normalize(input, min, max) {
        return ((input - min) * 100) / (max - min);
    }

    start = (event) => {
        this.setState({
            angle: 0,
            mbPerSecond: 0,
            mbProcessed: 0,
            index: 0,
            total: this.total(),
            running: true
        }, () => {
            this.update();
        })
    }

    total = () => {
        let total = 0;
        const l = this.props.recordSet.length;
        for (let i = 0; i < l; i++) {
            const record = this.props.recordSet[i];
            total += +record.value;
        }
        return total;
    }

    update = () => {
        if (this.state.running) {
            const record = this.props.recordSet[this.state.index];
            const seconds = +record.processedDurationSec * 1000;
            const prevIndex = this.state.index - 1;
            const nextIndex = this.state.index + 1;
            const mbPerSecond = record.calculateValue();
            let mbProcessed = 0;
            if (prevIndex >= 0) {
                const prevRecord = this.props.recordSet[prevIndex];
                mbProcessed = prevRecord.calculateValue();
            }
            if (nextIndex < this.props.recordSet.length) {
                this.setState({
                    angle: mbPerSecond,
                    mbPerSecond: mbPerSecond,
                    mbProcessed: this.state.mbProcessed + mbProcessed,
                    index: nextIndex
                }, () => {
                    setTimeout(() => {
                        this.update();
                    }, seconds);
                });
            } else {
                this.finish();
            }
        }
    }

    stop = (event) => {
        this.setState({
            angle: 0,
            mbPerSecond: 0,
            mbProcessed: 0,
            total: 0,
            index: 0,
            running: false
        })
    }

    finish = () => {
        this.setState({
            angle: 0,
            mbPerSecond: 0
        })
    }

    noise = () => {
        const value = this.state.running && this.state.mbPerSecond > 0 ? Math.sin(new Date().getTime()) * 1 : 0;
        return value > 0 ? value : 0;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.meterRange !== prevProps.meterRange) {
            this.stop();
        }
    }
    
    render() {
        let blurValue = this.mapMbPerSecond(this.state.mbPerSecond, 0, 0.35);
        let saturateValue = this.mapMbPerSecond(this.state.mbPerSecond, 1, 7);
        saturateValue = saturateValue > 0 ? saturateValue : 1;
        return (
            <React.Fragment>
                <div style={{
                    marginBottom: 35,
                    padding: 25,
                    WebkitFilter: this.props.effects ? `blur(${blurValue}px) saturate(${saturateValue})` : null,
                    filter: this.props.effects ? `blur(${this.blurValue}px) saturate(${saturateValue})` : null,
                    transition: this.props.effects ? "all 0.25s ease 0s" : null
                }}>
                    <div style={{
                        position: "relative",
                        width: `${352 * this.props.scalar}px`,
                        height: `${558 * this.props.scalar}px`
                    }}>
                        <img
                            width={352 * this.props.scalar}
                            height={558 * this.props.scalar}
                            style={{
                                position: "absolute"
                            }}
                            src={`${this.props.background}.svg`}
                            alt={this.props.background}
                        />
                        {/* <div style={{
                            position: "absolute",
                            width: `${352 * this.props.scalar}px`,
                            height: `${558 * this.props.scalar}px`,
                            transform: `translate(${220 * this.props.scalar + this.props.specShift}px, ${20.5 * this.props.scalar}px)`
                        }}>
                            <div style={{
                                fontFamily: "Segoe UI SemiBold",
                                lineHeight: "normal",
                                fontSize: `${16 * this.props.scalar}pt`,
                                color: this.props.specColor
                            }}>
                                ({this.props.spec})
                            </div>
                        </div> */}
                        <div style={{
                            position: "absolute",
                            width: `${18 * this.props.scalar}px`,
                            height: `${105 * this.props.scalar}px`,
                            transform: `translate(${170 * this.props.scalar}px, ${164 * this.props.scalar}px) rotate(${this.mapMbPerSecond(this.state.angle, 0, 270) + this.state.angleOffset + this.noise()}deg)`,
                            transition: "all 0.5s ease 0s"
                        }}>
                            <img
                                width={18 * this.props.scalar}
                                height={62 * this.props.scalar}
                                style={{
                                    position: "absolute"
                                }}
                                src={this.props.theme.needle}
                                alt="needle"
                            />
                        </div>
                        <ProgressGrower
                            scalar={this.props.scalar}
                            color={this.props.color}
                            mbProcessed={this.state.mbProcessed}
                            mapMbProcessed={this.mapMbProcessed}
                        />
                        <div style={{
                            position: "absolute",
                            width: `${352 * this.props.scalar}px`,
                            height: `${558 * this.props.scalar}px`,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            transform: `translate(${-43 * this.props.scalar}px, ${-19 * this.props.scalar}px)`
                        }}>
                            <div style={{
                                fontFamily: "Segoe UI SemiBold",
                                lineHeight: "normal",
                                fontSize: `${10.5 * this.props.scalar}pt`,
                                color: "#fff"
                            }}>
                                {this.props.meterRange.start}
                            </div>
                        </div>
                        <div style={{
                            position: "absolute",
                            width: `${352 * this.props.scalar}px`,
                            height: `${558 * this.props.scalar}px`,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            transform: `translate(${39 * this.props.scalar}px, ${-19 * this.props.scalar}px)`
                        }}>
                            <div style={{
                                fontFamily: "Segoe UI SemiBold",
                                lineHeight: "normal",
                                fontSize: `${10.5 * this.props.scalar}pt`,
                                color: "#fff"
                            }}>
                                {this.props.meterRange.end}
                            </div>
                        </div>
                        <div style={{
                            position: "absolute",
                            width: `${352 * this.props.scalar}px`,
                            height: `${558 * this.props.scalar}px`,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            transform: `translate(${-1 * this.props.scalar}px, ${30 * this.props.scalar}px)`
                        }}>
                            <div style={{
                                fontFamily: "Segoe UI SemiBold",
                                fontWeight: `${700 * this.props.scalar}`,
                                lineHeight: "normal",
                                fontSize: `${40 * this.props.scalar}pt`,
                                color: "#fff"
                            }}>
                                {(this.state.mbPerSecond + this.noise()).toLocaleString(navigator.language, { minimumIntegerDigits: 3, maximumFractionDigits: 0 })}
                            </div>
                        </div>
                        <div style={{
                            position: "absolute",
                            width: `${352 * this.props.scalar}px`,
                            height: `${558 * this.props.scalar}px`,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            transform: `translate(${-1 * this.props.scalar}px, ${70 * this.props.scalar}px)`
                        }}>
                            <div style={{
                                fontFamily: "Segoe UI SemiBold",
                                fontWeight: `${700 * this.props.scalar}`,
                                lineHeight: "normal",
                                fontSize: `${10.5 * this.props.scalar}pt`,
                                color: "#fff"
                            }}>
                                MB/SECOND
                            </div>
                        </div>
                        <div style={{
                            position: "absolute",
                            width: `${352 * this.props.scalar}px`,
                            direction: "rtl",
                            transform: `translate(${-190 * this.props.scalar}px, ${386 * this.props.scalar}px)`
                        }}>
                            <div style={{
                                fontFamily: "Segoe UI SemiBold",
                                fontWeight: `${700 * this.props.scalar}`,
                                lineHeight: "normal",
                                fontSize: `${14 * this.props.scalar}pt`,
                                color: "#fff"
                            }}>
                                {this.state.mbProcessed.toLocaleString(navigator.language, { minimumIntegerDigits: 1, maximumFractionDigits: 0 })}
                            </div>
                        </div>
                        <div style={{
                            position: "absolute",
                            width: `${352 * this.props.scalar}px`,
                            transform: `translate(${170 * this.props.scalar}px, ${386 * this.props.scalar}px)`
                        }}>
                            <div style={{
                                fontFamily: "Segoe UI SemiBold",
                                fontWeight: `${700 * this.props.scalar}`,
                                lineHeight: "normal",
                                fontSize: `${14 * this.props.scalar}pt`,
                                color: "#fff"
                            }}>
                                MB PROCESSED
                            </div>
                        </div>
                        <div style={{
                            position: "absolute",
                            width: `${138 * this.props.scalar}px`,
                            height: `${52 * this.props.scalar}px`,
                            transform: `translate(${105 * this.props.scalar}px, ${445 * this.props.scalar}px)`,
                            transition: "all 0.5s ease 0s"
                        }}>
                            <div
                                style={{
                                    marginTop: 5,
                                    padding: 2,
                                    fontFamily: "Segoe UI",
                                    fontWeight: `${600 * this.props.scalar}`,
                                    lineHeight: "normal",
                                    fontSize: `${18 * this.props.scalar}pt`,
                                    color: this.props.color,
                                    backgroundColor: 'transparent',
                                    border: `1px solid ${this.props.color}`,
                                    borderRadius: 25,
                                    width: `${130 * this.props.scalar}px`,
                                    height: `${30 * this.props.scalar}px`,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: 'pointer',
                                    transition: "all 0.5s ease 0s"
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = this.props.color;
                                    e.target.style.color = this.props.hoverColor;
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = this.props.color;
                                }}
                                onClick={this.start}
                            >
                                START
                            </div>
                        </div>
                        <div style={{
                            position: "absolute",
                            width: `${138 * this.props.scalar}px`,
                            height: `${52 * this.props.scalar}px`,
                            transform: `translate(${105 * this.props.scalar}px, ${491 * this.props.scalar}px)`,
                            transition: "all 0.5s ease 0s"
                        }}>
                            <div
                                style={{
                                    marginTop: 5,
                                    padding: 2,
                                    fontFamily: "Segoe UI",
                                    fontWeight: `${600 * this.props.scalar}`,
                                    lineHeight: "normal",
                                    fontSize: `${18 * this.props.scalar}pt`,
                                    color: this.props.color,
                                    backgroundColor: 'transparent',
                                    border: `1px solid ${this.props.color}`,
                                    borderRadius: 25,
                                    width: `${130 * this.props.scalar}px`,
                                    height: `${30 * this.props.scalar}px`,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: 'pointer',
                                    transition: "all 0.125s ease 0.125s"
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = this.props.color;
                                    e.target.style.color = this.props.hoverColor;
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = this.props.color;
                                }}
                                onClick={(e) => {
                                    this.stop();
                                }}
                            >
                                STOP
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}