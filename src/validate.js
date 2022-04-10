import Utils from "./utils";

export default class {
  constructor({ root, submitOnValid, inputEvent, submitFunc }) {
    this.root = document.querySelector(root);
    this.inputs = [...this.root.querySelectorAll("input, select, textarea")];

    this.submitOnValid = submitOnValid;
    this.inputEvent = inputEvent;

    this.mistakes = [];

    //--- Root element submit event
    this.root.addEventListener("submit", (e) => {
      e.preventDefault();
      
      this.submitOnValid && !this.hasMistake && this.root.submit()

      !this.submitOnValid && submitFunc && typeof submitFunc === "function" && submitFunc(this)
      
      //--- Event bubbling cancel
      e.stopImmediatePropagation();
    });
  }

  get mistake() {
    return this.mistakes
  }

  get hasMistake() {
    return this.mistakes.length > 0;
  }

  customControl(settings, hide = false) {
    const currentInput = this.root.querySelector(settings.target);
    const value = currentInput.value;

    let customMistake = Object.keys(settings)
      .map((item) => typeof Utils[item] === "function" &&  Utils[item](value, settings[item], currentInput))
      .filter((c) => c)
      .filter(c => {
        if(c.process === "delete") {
          this.mistakes = this.mistakes.filter(set => c.message !== set.message)
        }

        return c;
      })
      .filter(c => c.process === "add")

    this.mistakes = [...this.mistakes, ...customMistake]
    this.mistakes = [...new Set(this.mistakes.map(a => JSON.stringify(a)))].map(a => JSON.parse(a))

    if(hide) {
      //--- We are running the callback function
      settings.error && typeof settings.error === "function" && settings.error(customMistake, currentInput)
    }

    //--- Target element event
    this.root.querySelector(settings.target).addEventListener(this.inputEvent, (event) => {
        this.customControl(settings, true);

        //--- Event bubbling cancel
        event.stopImmediatePropagation();
    });
  }
}
