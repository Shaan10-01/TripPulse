type LogLevel = 'info' | 'warn' | 'error';

function formatLog(level: LogLevel, message: string): string {
  const ts = new Date().toISOString();
  return `[${ts}] [${level.toUpperCase()}] ${message}`;
}

export const logger = {
  info: (msg: string) => console.log(formatLog('info', msg)),
  warn: (msg: string) => console.warn(formatLog('warn', msg)),
  error: (msg: string) => console.error(formatLog('error', msg)),
};
