const fs = require('fs');

const readDataFromFile = (filePath) => {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
};

const writeDataToFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

module.exports = { readDataFromFile, writeDataToFile };