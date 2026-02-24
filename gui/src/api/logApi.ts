export const enum Action {
  CODE_EDIT = "code_edit",
  CODE_ERR = "code_err",
  SIM_RUN = "sim_run",
  SIM_END_SUCC = "sim_end_succ",
  SIM_END_FAIL = "sim_end_fail",
  SIM_END_STUCK = "sim_end_stuck",
  ROBOT_RUN = "robot_run",
  ROBOT_RUN_FAIL = "robot_run_fail",
  ROBOT_END_SUCC = "robot_end_succ",
  ROBOT_END_FAIL = "robot_end_fail",
  TASK_START = "tast_start",
  TASK_CONTINUE = "task_continue",
  TASK_FINISH = "task_finish"
}

export const log_action = (group:string, mode:string, action:Action, value:string) => {
  const url = "api/log-action";
  fetch(url, {
    method: "POST",
    body: JSON.stringify({ group, mode, action, value }),
    headers: {
      "Content-Type": "application/json"
    }
  }).catch((err) => {
    console.error("log_action failed:", err);
  });
}