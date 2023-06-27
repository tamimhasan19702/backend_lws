/**
 * title: this is data file for alternative of database
 *
 * @format
 */

const fs = require("fs");
const path = require("path");

//module scaffholding

const lib = {};

lib.basedir = path.join(__dirname, "../.data/");

//write data to the database
lib.create = (dir, file, data, callback) => {};

// reading file from the database
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf8", (err, data) => {
    callback(err, data);
  });
};

//update existing file into the database
lib.update = (dir, file, data, callback) => {};

//delete existing file into the database
lib.delete = (dir, file, data, callback) => {};

module.exports = lib;
