import * as Blockly from "blockly/core";

// motion blocks
const goForward = {
  type: "motion_forward",
  message0: "go forward, duration: %1, speed: %2",
  args0: [
    {
      type: "field_number",
      name: "DURATION",
      value: 1,
      min: 1,
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
      min: 1,
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
      min: 1,
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
      min: 1,
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

export default [
  goForward,
  goBackwards,
  turnLeft,
  turnRight,
]