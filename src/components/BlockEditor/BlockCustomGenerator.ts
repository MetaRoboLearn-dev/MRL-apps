import {pythonGenerator} from "blockly/python";
import * as Blockly from "blockly";

//// motion blocks
// start
pythonGenerator.forBlock["motion_start"] = function (): string {
  return ``;
};

// stop
pythonGenerator.forBlock["motion_stop"] = function (): string {
  return ``;
};

// turn left
pythonGenerator.forBlock["motion_turn_left"] = function (block: Blockly.Block): string {
  const number_speed: string = block.getFieldValue("SPEED");
  const number_duration: string = block.getFieldValue("DURATION");

  return `turn_left(${number_duration}, ${number_speed})\n`;
};

// turn right
pythonGenerator.forBlock["motion_turn_right"] = function (block: Blockly.Block): string {
  const number_speed: string = block.getFieldValue("SPEED");
  const number_duration: string = block.getFieldValue("DURATION");

  return `turn_right(${number_duration}, ${number_speed})\n`;
};

// go forward
pythonGenerator.forBlock["motion_forward"] = function (block: Blockly.Block): string {
  const number_speed: string = block.getFieldValue("SPEED");
  const number_duration: string = block.getFieldValue("DURATION");

  return `forward(${number_duration}, ${number_speed})\n`;
};

// go backwards
pythonGenerator.forBlock["motion_backwards"] = function (block: Blockly.Block): string {
  const number_speed: string = block.getFieldValue("SPEED");
  const number_duration: string = block.getFieldValue("DURATION");

  return `back(${number_duration}, ${number_speed})\n`;
};

//// list blocks
pythonGenerator.forBlock["lists_char"] = function (block: Blockly.Block) {
  const text = pythonGenerator.valueToCode(block, "TEXT", 0) || "''";
  const code = `list(${text})`;
  return [code, 0];
};