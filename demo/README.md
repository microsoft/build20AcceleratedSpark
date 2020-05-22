*** This app uses React, React Router and React Responsive. ***

*** To change settings in this app, in App.js ***

    1. Set themes and query descriptions in the state.
    2. Create routes to display pairs of meters (CPU, FPGA) in either Grid (row, col) or Tabs components:
        a. Pass selected record data sets, styled themes and query descriptions.
        b. Pass scalar to set display size (defaults to 1)
        c. Pass effects to turn on/off blur and saturation filters on the Meter component (defaults to true).
        d. Use React Responsive Media Query with scalar for responsive scaling of the pairs of meters.

*** The Project Hierarchy (with descriptions) ***

public:
    themes: (each folder contains color themed jpg and svg images for meter component)
        blue:
        green:
        green2:
        magenta:
        orange:
        purple:
src:
    components:
        App.js - loads the data, sets up the themes and query descriptions and handles the routing
        Grid.jsx - composes the pairs of meters in a centered row of columns
        Query.jsx - composes the paired CPU and FPGA components in a centered row of columns
        CPU.jsx - presents a meter using CPU specific settings
        FPGA.jsx - presents a meter using FPGA specific settings
        Meter.jsx - displays a simulation of a live metering of data processing
        ProgressGrower.jsx - displays a custom made progress bar
        unused:
            ProgressSlider.jsx - displays a custom progress spinner
            Tabs.jsx - composes the pairs of meters in a tab navigation
    data:
        cpu.json - stores the data in the cpu csv files as arrays of records
        fpga.json - stores the data in the fpgs csv files as arrays of records

    models:
        Record.js - a javascript class model for a row of data from the CPU and FPGA csv query files
        Theme.js - a javascript class model for a styled theme for the Grid and Meter components
    queries: 
        cpu:
        fpga:
    utilities:
        count.js - a node js app to verify the total data processed
        csv2json.js - a node js app to convert csv data files to json (reads all files in src/queries folder and writes json files to src/data folder).



*** THE FOLLOWING IS THE AUTO GENERATED README FOR PROJECTS BOOTSTRAPPED USING CREATE REACT APP ***

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
