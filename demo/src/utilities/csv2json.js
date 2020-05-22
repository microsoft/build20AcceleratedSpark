const fs = require('fs');
const path = require('path');

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " path/to/directory");
    process.exit(-1);
}

const dirPath = process.argv[2];
const jsonFileName = process.argv[3];
const jsonDirPath = process.argv[4];

const files = fs.readdirSync(dirPath, { withFileTypes: true })
    .filter((filePath) => {
        return !filePath.isDirectory() && path.extname(filePath.name) !== '.json'
    })
    .map((filePath) => {
        return { 
            path: `${dirPath}/${filePath.name}`, 
            name: filePath.name.split('.')[0] 
        };
    });

const recordSets = [];

files.forEach((file) => {
    const data = fs.readFileSync(file.path, { encoding: 'utf-8' });

    const parsedRecords = [];
    const rows = data.split('\r\n');
    const rl = rows.length;
    for (let r = 0; r < rl; r++) {
        const row = rows[r];
        const columns = row.split(',');
        if (columns.length === 7) {
            parsedRecords.push({
                timestamp: columns[0],
                numRows: columns[1],
                avgRowSize: columns[2],
                inputRowsPerSec: columns[3],
                processedRowsPerSec: columns[4],
                inputDurationSec: columns[5],
                processedDurationSec: columns[6]
            });
        }
    }

    const sortedRecords = parsedRecords.sort((a, b) => {
        const d1 = new Date(a.timestamp);
        const d2 = new Date(b.timestamp);
        if (d1 < d2) {
            return -1;
        }
        if (d1 > d2) {
            return 1;
        }
        return 0;
    });

    const records = [];
    const srl = sortedRecords.length;
    for(let r = 0; r < srl; r++) {
        const record = sortedRecords[r];
        const duration = +record.processedDurationSec;
        const seconds = Math.trunc(duration);
        const remainder = duration % 1;

        const prps = +record.processedRowsPerSec;
        const ars = +record.avgRowSize;
        const value = (prps * ars) / (1024 * 1024);

        for (let s = 0; s < seconds; s++) {
            records.push({
                timestamp: record.timestamp,
                numRows: record.numRows,
                avgRowSize: record.avgRowSize,
                inputRowsPerSec: record.inputRowsPerSec,
                processedRowsPerSec: record.processedRowsPerSec,
                inputDurationSec: record.inputDurationSec,
                processedDurationSec: 1,
                value: value
            });
        }
        records.push({
            timestamp: record.timestamp,
            numRows: record.numRows,
            avgRowSize: record.avgRowSize,
            inputRowsPerSec: record.inputRowsPerSec,
            processedRowsPerSec: record.processedRowsPerSec,
            inputDurationSec: record.inputDurationSec,
            processedDurationSec: remainder,
            value: value * remainder
        });
    }

    recordSets.push({
        title: file.name,
        records: records
    });
});

fs.writeFile(`${jsonDirPath}/${jsonFileName}.json`, JSON.stringify(recordSets), function (err) {
    if (err) return console.log(err);
    console.log(jsonFileName);
});

// node src/utilities/csv2json.js 'src/queries/cpu' 'cpu' 'src/data'
// node src/utilities/csv2json.js 'src/queries/fpga' 'fpga' 'src/data'