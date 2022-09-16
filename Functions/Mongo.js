const mongoose = require("mongoose")
const fs = require("fs")
const yaml = require('js-yaml')

module.exports = async () => {
    let config = yaml.load(fs.readFileSync("./config.yaml", "utf8"))
    await mongoose.connect(config.MongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return mongoose;
};
