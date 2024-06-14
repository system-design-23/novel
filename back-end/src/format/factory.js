const { formatManager } = require("./manager.js");
class FormatterFactory {
  constructor() {
    this.formatters = new Map();
  }
  onPlugIn(data) {
    const { format_name, Formatter } = data;
    this.formatters.set(format_name, Formatter);
  }
  onPlugOut(data) {
    const { format_name } = data;
    this.formatters.delete(format_name);
  }
  create(format_name) {
    const Formatter = this.formatters.get(format_name);
    if (!Formatter) {
      return null;
    }
    return new Formatter(format_name);
  }
}
const formatFactory = new FormatterFactory();
formatManager.observe(formatFactory);
module.exports = {
  formatFactory,
};
