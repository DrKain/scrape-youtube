const fs = require("fs");

/**
 * TODO use return instead
 */

/**
 * Make Directory
 * @param {string} dir
 */
const mkdir = (dir, callback) => {
  if (!fs.existsSync(dir)) {
    fs.mkdir(dir, (err) => {
      if (err) throw err;
      console.log("Folder has been created successfully");
      if (callback) {
        callback(data);
      }
    });
  } else {
    console.log("Folder already exists");
  }
};

/**
 * Remove Directory
 * @param {string} dir
 */
const rmdir = (dir, callback) => {
  if (fs.existsSync(dir)) {
    fs.rmdir(dir, (err) => {
      if (err) throw err;
      console.log("Folder has been removed successfully");
      if (callback) {
        callback(data);
      }
    });
  } else {
    console.log("Folder not found");
  }
};

/**
 * Make File
 * @param {string} file
 * @param {string} data
 */
const touch = (file, data, callback) => {
  if (!fs.existsSync(file)) {
    fs.writeFile(file, data, (err) => {
      if (err) throw err;
      console.log("File has been created successfully");
      if (callback) {
        callback(data);
      }
    });
  } else {
    console.log("File already exits");
  }
};

/**
 * Remove File
 * @param {string} file
 */
const rm = (file, callback) => {
  if (fs.existsSync(file)) {
    fs.unlink(file, (err) => {
      if (err) throw err;
      console.log("File has been removed successfully");
      if (callback) {
        callback(data);
      }
    });
  } else {
    console.log("File not found");
  }
};

/**
 * Read File
 * @param {string} file
 */
const read = (file, callback) => {
  if (fs.existsSync(file)) {
    fs.readFile(file, (err, data) => {
      if (err) throw err;
      if (callback) {
        callback(data);
      }
    });
  } else {
    console.log("File not found");
  }
};
/**
 * Write to  File
 * @param {string} file
 */
const write = (file, data, callback) => {
  if (fs.existsSync(file)) {
    fs.writeFile(file, data, (err, data) => {
      if (err) throw err;
      if (callback) {
        callback(data);
      }
    });
  } else {
    console.log("File not found");
  }
};

module.exports = { mkdir, rmdir, rm, touch, read, write };
