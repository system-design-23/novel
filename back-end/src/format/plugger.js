const fs = require("fs");

class Plugger {
  constructor() {
    this.plugins = this.init();
  }
  async init() {
    const files = fs.readdirSync("./src/format/plug-in");
    let plugins = {};
    for (let file_name of files) {
      let name = file_name.split(",")[0];
      plugins[name] = require("./plug-in/" + file_name);
    }
    return plugins;
  }
  async includePlugin(format_name, jsfile) {
    let plugins = await this.plugins;

    if (format_name in plugins) {
      return false;
    }

    try {
      fs.writeFileSync("./src/format/plug-in/" + format_name + ".js", jsfile);

      let Formatter = require("./plug-in/" + format_name + ".js");
      let formatter = new Formatter(await browser);
      plugins[format_name] = formatter;

      return true;
    } catch (error) {
      console.error(error);
    }
    return false;
  }
  async excludePlugin(format_name) {
    let plugins = await this.plugins;
    try {
      let formatter = plugins[format_name];

      if (!formatter) {
        return false;
      }
      delete plugins[format_name];
      /* unplug completely the module, using common js instead of ES6 
      becase ES6 makes the module static, can't be removed until the end of the app
       */
      delete require.cache[require.resolve("./plug-in/" + format_name + ".js")];

      try {
        fs.unlinkSync("./src/format/plug-in/" + format_name + ".js");
      } catch (error) {}

      return true;
    } catch (error) {
      console.error(error);
    }
    return false;
  }
  async get(format_name) {
    let plugins = await this.plugins;
    if (!format_name) {
      return Object.values(plugins)[0];
    }
    return plugins[format_name];
  }
  async findAll() {
    let plugins = await this.plugins;
    return Object.keys(plugins);
  }
}
const format_plugger = new Plugger();
module.exports = {
  format_plugger,
};
