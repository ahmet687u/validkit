export default class Utils {
  static min(value, item) {
    if (value.length <= item.value) {
      return {process: "add", message: item.error}
    } else {
      return {process: "delete", message: item.error}
    }
  }

  static max(value, item) {
    if (value.length > item.value) {
      return {process: "add", message: item.error}
    } else {
      return {process: "delete", message: item.error}
    }
  }

  static required(value, item) {
    if (value.length === 0) {
      return {process: "add", message: item}
    } else {
      return {process: "delete", message: item}
    }
  }

  static radio(item, input) {
    if(!input.checked) {
      return {process: "add", message: item}
    } else {
      return {process: "delete", message: item}
    }
  }

  static email(value, item) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) === false) {
      return {process: "add", message: item}
    } else {
      return {process: "delete", message: item}
    }
  }
}
