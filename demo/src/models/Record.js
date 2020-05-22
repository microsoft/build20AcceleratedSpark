class Record {
    constructor(timestamp, numRows, avgRowSize, inputRowsPerSec, processedRowsPerSec, inputDurationSec, processedDurationSec, value) {
        this.timestamp = timestamp;
        this.numRows = numRows;
        this.avgRowSize = avgRowSize;
        this.inputRowsPerSec = inputRowsPerSec;
        this.processedRowsPerSec = processedRowsPerSec;
        this.inputDurationSec = inputDurationSec;
        this.processedDurationSec = processedDurationSec;
        this.value = value;
    }

    static fromData(data) {
        return new Record(
            data.timestamp, 
            data.numRows, 
            data.avgRowSize, 
            data.inputRowsPerSec,
            data.processedRowsPerSec,
            data.inputDurationSec,
            data.processedDurationSec,
            data.value
        );
    }

    calculateValue = () => {
        return +this.value;
        // const prps = +this.processedRowsPerSec;
        // const ars = +this.avgRowSize;
        // const value = (prps * ars) / (1024 * 1024);

        // return value;
    }

    // processingTime = () => {
    //     return +this.inputDurationSec + +this.processedDurationSec;
    //     //boris
    //     //return +this.processedDurationSec;
    // }

    // throughput = () => {
    //     return +this.numRows / (+this.inputDurationSec + +this.processedDurationSec);
    //     //boris
    //     //return + this.processedRowsPerSec;
    // }

    // totalBytesProcessed = () => {
    //     return +this.numRows * +this.avgRowSize;
    // }
}

export default Record;