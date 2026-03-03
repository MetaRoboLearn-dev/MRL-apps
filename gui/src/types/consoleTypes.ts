export type LogEntry = {
  level: "INFO" | "ERROR" | "WARNING" | "OUTPUT";
  message: string;
  timestamp: Date;
}