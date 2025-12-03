export const enum Action {
  CODE_EDIT = "code_edit",
  CODE_ERR = "code_err",
  SIM_RUN = "sim_run",
  SIM_END_SUCC = "sim_end_succ",
  SIM_END_FAIL = "sim_end_fail",
  SIM_END_STUCK = "sim_end_stuck",
  ROBOT_RUN = "robot_run",
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