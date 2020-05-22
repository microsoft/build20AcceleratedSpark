import React from 'react';
import './App.css';
import Record from './models/Record';
import Theme from './models/Theme';
import cpu from './data/cpu.json';
import fpga from './data/fpga.json';
import Grid from './components/Grid';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recordSetsCPU: null,
            recordSetsFPGA: null,
            recordSetsIndex: 0,
            recordSetsLoaded: false,
            queryDescriptions: [
                {
                    title: "Spark Job",
                    sql:
                        <ul>
                            <li>
                                taxi_input_df
                            </li>
                            <li>
                                .groupBy('payment_type')
                                .count()
                                .select('payment_type', F.col('count').alias('total'))
                                .show()
                            </li>
                        </ul>
                },
                {
                    title: "Query 1",
                    sql:
                        <ul>
                            <li>
                                SELECT payment_type, COUNT(*) as total
                        </li>
                            <li>
                                <ul>
                                    <li>
                                        FROM NewYorkYellowTaxi
                                </li>
                                    <li>
                                        GROUP BY payment_type
                                </li>
                                </ul>
                            </li>
                        </ul>
                },
                {
                    title: "Query 2",
                    sql:
                        <ul>
                            <li>
                                SELECT passenger_count,
                            </li>
                            <li>
                                AVG(total_amount) as avg_amount
                            </li>
                            <li>
                                <ul>
                                    <li>
                                        FROM $tableName
                                    </li>
                                    <li>
                                        GROUP BY passenger_count
                                    </li>
                                </ul>
                            </li>
                        </ul>
                },
                {
                    title: "Query 3",
                    sql:
                        <ul>
                            <li>
                                SELECT passenger_count,
                            </li>
                            <li>
                                year(tpep_pickup_datetime) year,
                            </li>
                            <li>
                                COUNT(*) total
                            </li>
                            <li>
                                <ul>
                                    <li>
                                        FROM $tableName
                                    </li>
                                    <li>
                                        GROUP BY passenger_count, year
                                    </li>
                                </ul>
                            </li>
                        </ul>
                },
            ],
            themes: [
                new Theme('themes', 'blue', '#0882D8', '#34c1ee', '#fff', '#8CDDF7', '#8cddf7', '#000', '#042246'),
                new Theme('themes', 'green', '#44683A', '#44683A', '#fff', '#82B74F', '#82B74F', '#000', '#042246'),
                new Theme('themes', 'green2', '#308950', '#308950', '#fff', '#80B173', '#80B173', '#000', '#042246'),
                new Theme('themes', 'magenta', '#E3008C', '#E3008C', '#fff', '#B4009E', '#B4009E', '#fff', '#042246'),
                new Theme('themes', 'orange', '#EB7415', '#EB7415', '#fff', '#F3AA6D', '#F3AA6D', '#000', '#042246'),
                new Theme('themes', 'purple', '#5059C8', '#5059C8', '#fff', '#7B83EB', '#7B83EB', '#fff', '#042246')
            ]
        }
    }

    componentDidMount() {
        this.setState({
            recordSetsCPU: this.importRecordSets(cpu),
            recordSetsFPGA: this.importRecordSets(fpga)
        }, () => {
            this.setState({
                recordSetsLoaded: true
            });
        });
    }

    render() {
        return this.state.recordSetsLoaded ? (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <React.Fragment>
                            <Grid
                                effects={true}
                                scalar={1}
                                themes={[
                                    this.state.themes[0]
                                ]}
                                queryDescriptions={[
                                    this.state.queryDescriptions[0]
                                ]}
                                recordSetsCPU={[
                                    this.state.recordSetsCPU[1]
                                ]}
                                recordSetsFPGA={[
                                    this.state.recordSetsFPGA[0]
                                ]}
                            />
                        </React.Fragment>
                    </Route>
                </Switch>
            </Router>
        ) : null
    }

    importRecordSets = (dataSets) => {
        const recordSets = [];
        const dl = dataSets.length;
        for (let d = 0; d < dl; d++) {
            const recordSet = [];
            const dataSet = dataSets[d];
            const rl = dataSet.records.length;
            for (let r = 0; r < rl; r++) {
                recordSet.push(Record.fromData(dataSet.records[r]));
            }
            recordSets.push(recordSet);
        }
        return recordSets;
    }
}

export default App;