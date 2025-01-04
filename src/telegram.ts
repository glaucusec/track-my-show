import { Telegraf } from "telegraf";
import { telnotifyType } from "../types";
const bot = new Telegraf(process.env.BOT_TOKEN);

const chatId = "1119459023";

export async function telnotify({ msg }: telnotifyType) {
  await bot.telegram.sendMessage(chatId, msg, { parse_mode: "HTML" });
}

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
