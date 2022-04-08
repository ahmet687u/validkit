import ValidateForm from "./validate"

if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = ValidateForm;
} else if (typeof define === "function" && define.amd) {
  define([], function () {
    return ValidateForm;
  });
} else if (!window.ValidateForm) {
  window.ValidateForm = ValidateForm;
}