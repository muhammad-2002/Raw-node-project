// dependensis
const fs = require('fs');
const path = require('path');

// module scaffholding
const lib = {};
// base directory of data folder
lib.basedir = path.join(__dirname, '/../.data/');

// write data to file
lib.create = (dir, file, data, calback) => {
    // open file to write
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // conver to string data
            const stringData = JSON.stringify(data);
            // write data to close it
            fs.writeFile(fileDescriptor, stringData, (err1) => {
                if (!err1) {
                    fs.close(fileDescriptor, (err2) => {
                        if (!err2) {
                            calback(false);
                        } else {
                            calback('err closing the new file');
                        }
                    });
                } else {
                    calback('Error writing to new file');
                }
            });
        } else {
            calback('you could not create new file ,it may alrady exist');
        }
    });
};
// read dato into file
lib.read = (dir, file, calback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf-8', (err, data) => {
        calback(err, data);
    });
};
// ubdate data
lib.update = (dir, file, data, calback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.truncate(fileDescriptor, (err1) => {
                if (!err1) {
                    // write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err2) => {
                        if (!err2) {
                            fs.close(fileDescriptor, (err3) => {
                                if (!err3) {
                                    calback(false);
                                } else {
                                    calback('Error Flile not Clossed');
                                }
                            });
                        } else {
                            calback('Error Writing to file');
                        }
                    });
                } else {
                    calback('Error tranking file');
                }
            });
        } else {
            calback('Error ubdating . file not exist');
        }
    });
};
// delete data
lib.delete = (dir, file, calback) => {
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            calback(false);
        } else {
            calback('Error File not delete');
        }
    });
};
module.exports = lib;
