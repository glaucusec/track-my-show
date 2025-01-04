const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

import { Agenda } from "@hokify/agenda";

const agenda = new Agenda({ db: { address: MONGO_CONNECTION_STRING } });

process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down...");
  await agenda.stop(); // Stop Agenda gracefully
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down...");
  await agenda.stop(); // Stop Agenda gracefully
  process.exit(0);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

export default agenda;
