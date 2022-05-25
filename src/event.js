export const EVENT_TYPES = {
  bind: "myBindEvent",
  customControl: "mycustomControlEvent"
}

export function createAndTriggerBindEvent(value, target) {
  const bindEvent = new CustomEvent(EVENT_TYPES.bind, {
    detail: value,
  })

  target.dispatchEvent(bindEvent)
}

export function createAndTriggerCustomControlEvent(value, target) {
  const customControlEvent = new CustomEvent(EVENT_TYPES.customControl, {
    detail: value,
  })

  target.dispatchEvent(customControlEvent)
}