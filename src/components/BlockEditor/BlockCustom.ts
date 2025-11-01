// motion blocks
const start = {
  type: "motion_start",
  message0: "start",
  args0: [],
  nextStatement: "motion",
  colour: "#5CB85C",
  tooltip: "",
  helpUrl: "",
};

const stop = {
  type: "motion_stop",
  message0: "stop",
  args0: [],
  previousStatement: "motion",
  colour: "#D9534F",
  tooltip: "",
  helpUrl: "",
};

const goForward = {
  type: "motion_forward",
  message0: "go forward, duration: %1, speed: %2",
  args0: [
    {
      type: "field_number",
      name: "DURATION",
      value: 1,
      min: 0.1,
    },
    {
      type: "field_number",
      name: "SPEED",
      value: 30,
      min: 1,
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: "#008e91",
  tooltip: "",
  helpUrl: "",
};

const goBackwards = {
  type: "motion_backwards",
  message0: "go backwards, duration: %1, speed: %2",
  args0: [
    {
      type: "field_number",
      name: "DURATION",
      value: 1,
      min: 0.1,
    },
    {
      type: "field_number",
      name: "SPEED",
      value: 30,
      min: 1,
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: "#008e91",
  tooltip: "",
  helpUrl: "",
};

const turnLeft = {
  type: "motion_turn_left",
  tooltip: "",
  helpUrl: "",
  message0: "turn left, duration: %1, speed %2",
  args0: [
    {
      type: "field_number",
      name: "DURATION",
      value: 1,
      min: 0.1,
    },
    {
      type: "field_number",
      name: "SPEED",
      value: 50,
      min: 1,
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: "#008e91",
};

const turnRight = {
  type: "motion_turn_right",
  tooltip: "",
  helpUrl: "",
  message0: "turn right, duration: %1, speed %2",
  args0: [
    {
      type: "field_number",
      name: "DURATION",
      value: 1,
      min: 0.1,
    },
    {
      type: "field_number",
      name: "SPEED",
      value: 50,
      min: 1,
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: "#008e91",
};

const listsChar = {
  type: "lists_char",
  message0: "make list of characters from %1",
  args0: [
    {
      type: "input_value",
      name: "TEXT",
      check: "String",
    },
  ],
  output: "Array",
  colour: "#4a148c",
  tooltip: "Creates a list containing each character of the given text.",
  helpUrl: "",
};


export default [
  start,
  stop,
  goForward,
  goBackwards,
  turnLeft,
  turnRight,
  listsChar
]