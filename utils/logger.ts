import path from "path";
import pino from "pino";

const fileTransport = pino.transport({
  target: "pino/file",
  options: { destination: path.resolve(__dirname, "../app.log") },
});

export default pino({}, fileTransport);
