const { exec } = require("child_process");
const fs = require("fs");

class FormatterManager {
  constructor() {
    this.observers = [];
    this.init();
  }
  init() {
    this.plugins = new Map();
    this.dependencies = new Map();
    const files = fs.readdirSync("./src/format/plug-in");
    for (let file_name of files) {
      let filename_splits = file_name.split(".");
      let format_name = filename_splits[0];
      let dependency = filename_splits[1];
      console.log(format_name, dependency);
      let Formatter = require("./plug-in/" + file_name);
      this.plugins.set(format_name, Formatter);
      this.dependencies.set(format_name, dependency);
      this.update({ format_name, Formatter });
    }
  }
  async install(dependency) {
    let promise = new Promise((resolve, reject) => {
      exec(`npm install ${dependency}`, (error, stdout, stderr) => {
        if (error) {
          console.error(error);
          reject();
        }
        console.log(stdout);
        console.log(stderr);
        resolve();
      });
    });
    await promise;
  }
  async uninstall(dependency) {
    let promise = new Promise((resolve, reject) => {
      exec(`npm uninstall ${dependency}`, (error, stdout, stderr) => {
        if (error) {
          console.error(error);
          reject();
        }
        console.log(stdout);
        console.log(stderr);
        resolve();
      });
    });
    await promise;
  }
  update(plugin) {
    for (let observer of this.observers) {
      observer.onPlugIn(plugin);
    }
  }
  observe(observer) {
    this.observers.push(observer);
    this.plugins.forEach((Formatter, format_name) => {
      observer.onPlugIn({ format_name, Formatter });
    });
  }
  async plugIn(format_name, jsfile, dependency) {
    if (this.plugins.has(format_name)) {
      return false;
    }

    try {
      await this.install(dependency);
      let filename = format_name + "." + dependency + ".js";
      fs.writeFileSync("./src/format/plug-in/" + filename, jsfile);

      let Formatter = require("./plug-in/" + filename);
      this.plugins.set(format_name, Formatter);
      this.dependencies.set(format_name, dependency);
      this.update({ format_name, Formatter });
      return true;
    } catch (error) {
      console.error(error);
    }
    return false;
  }
  async plugOut(format_name) {
    try {
      let dependency = this.dependencies.get(format_name);

      if (!dependency) {
        return false;
      }
      this.plugins.delete(format_name);
      this.dependencies.delete(format_name);

      /* unplug completely the module, using common js instead of ES6 
      becase ES6 makes the module static, can't be removed until the end of the app
       */
      let filename = format_name + "." + dependency + ".js";
      delete require.cache[require.resolve("./plug-in/" + filename)];

      Object.keys(require.cache).forEach((key) => {
        if (key.includes(dependency)) {
          delete require.cache[key];
        }
      });
      try {
        fs.unlinkSync("./src/format/plug-in/" + filename);
      } catch (error) {}

      for (let observer of this.observers) {
        observer.onPlugOut({ format_name });
      }

      await this.uninstall(dependency);

      return true;
    } catch (error) {
      console.error(error);
    }
    return false;
  }
  findCode(format_name) {
    if (this.plugins.has(format_name)) {
      let file = fs.readFileSync(
        "./src/format/plug-in/" +
          format_name +
          "." +
          this.dependencies(format_name) +
          ".js",
        "utf8"
      );
      return file;
    }
    return null;
  }
  findAll() {
    return this.plugins.keys();
  }
}
const formatManager = new FormatterManager();
module.exports = {
  formatManager,
};
