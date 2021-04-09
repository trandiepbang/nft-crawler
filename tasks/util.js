const csv = require('csv-parser');
const csvWriters = require('csv-writer');
const fs = require('fs');
const mm = require('moment');

const parseTime = (inputDate) => {
    return mm(inputDate).local().format('DD/MM/YYYY')
};

const transformData = async (inputData) => {
    return inputData.reduce((recordIds, currentItem) => {
        recordIds[currentItem.Id] = true;
        return recordIds
    }, {});
}


const shouldAppend = (filePath) => {
    return fs.existsSync(filePath);
}

const readCSV = (fileName) => {
    if (!fs.existsSync(fileName)) {
        return [];
    }

    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(fileName)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('error', () => {
                return resolve([]);
            })
            .on('end', () => {
                return resolve(results)
            });
    })
}

const writeCSV = (fileName, headers, records, shouldAppend) => {
    if (!records) return;
    const createCsvWriter = csvWriters.createObjectCsvWriter;
    const csvWriter = createCsvWriter({
        path: fileName,
        header: headers,
        append: shouldAppend
    });

    csvWriter
        .writeRecords(records)
        .then(() => console.log('The CSV file was written successfully'));
}

module.exports = {
    writeCSV,
    parseTime,
    readCSV,
    transformData,
    shouldAppend
}