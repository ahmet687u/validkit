import Utils from "./utils";
import { createAndTriggerBindEvent, createAndTriggerCustomControlEvent, EVENT_TYPES } from "./event";

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

    //--- Inputs events with custom event
    for(let i = 0; i < this.inputs.length; i++) {
      this.inputs[i][`on${this.inputEvent}`] = (event) => {
        createAndTriggerBindEvent(event.target.value, this.inputs[i])
        createAndTriggerCustomControlEvent(event.target.value, this.inputs[i])

        //--- Event bubbling cancel
        event.stopImmediatePropagation();
      }
    }
  }

  get mistake() {
    return this.mistakes
  }

  get hasMistake() {
    return this.mistakes.length > 0;
  }

  get values() {
    return this.inputs.reduce((p, c, i) => ({...p, [c.name ? c.name : `value${i}`]: c.value}) , {})
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
    this.root.querySelector(settings.target).addEventListener(EVENT_TYPES.customControl, e => {
      this.customControl(arguments[0], true)

      e.stopImmediatePropagation()
    });
  }

  //--- UNUTMA = error değil message olacak düzelt
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

    this.mistakes = [...new Set(this.mistakes.map(a => JSON.stringify(a)))].map(a => JSON.parse(a))

    for(let i = 0; i < targets.length; i++) {
      this.root.querySelector(targets[i]).addEventListener(EVENT_TYPES.bind, e => {
        this.bind(arguments[0])

        e.stopImmediatePropagation()
      })
    }
  }
}
