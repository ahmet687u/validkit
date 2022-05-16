import Utils from "./utils";

export default class {
  constructor({ root, submitOnValid, inputEvent, submitFunc }) {
    this.root = document.querySelector(root);
    this.inputs = [...this.root.querySelectorAll("input, select, textarea")];

    this.submitOnValid = submitOnValid;
    this.inputEvent = inputEvent;
    this.submitFunc = submitFunc;

    this.mistakes = [];

    //--- Root element submit event
    this.root.addEventListener("submit", (event) => {
      event.preventDefault();
      
      this.submitOnValid && !this.hasMistake && this.root.submit()
      
      if(!this.submitOnValid && this.submitFunc && typeof this.submitFunc === "function") {
        this.refresh()
        this.submitFunc(this)
      } 
      
      //--- Event bubbling cancel
      event.stopImmediatePropagation();
    });
  }

  get mistake() {
    return this.mistakes
  }

  get hasMistake() {
    return this.mistakes.length > 0;
  }

  get values() {
    return this.inputs.reduce((p, c) => ({...p, [c.name]: c.value}) , {})
  }

  refresh() {
    this.inputs.forEach(input => input.dispatchEvent(new KeyboardEvent(this.inputEvent, { 'key': '' })))
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

  /**
   * 
   * @param {{targets: Array}} param0 
   */
  bind({ error, targets }) {
    let values = targets.map(val => this.root.querySelector(val).value)

    if(values.find(value => values.every(c => c === value)) === undefined) {
      this.mistakes.push({ process: "add", error })
    } else {
      this.mistakes = this.mistakes.filter(err => err.error !== error)
    }

    targets.forEach(item => {
      this.root.querySelector(item).addEventListener("keyup", (event) => {
      this.bind(arguments[0])

      //-- Event bubbling cancel
      event.stopImmediatePropagation();
      })
    })
  }
}
