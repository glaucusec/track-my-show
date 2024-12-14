import { Telegraf } from "telegraf";
import { TelNotificationType } from "./types";
const bot = new Telegraf(process.env.BOT_TOKEN);

const chatId = "1119459023";

export async function telNotification({ msg, type }: TelNotificationType) {
  if (!msg && type == "error") {
    return bot.telegram.sendMessage(
      chatId,
      "Something went wrong!. Please check the config"
    );
  }

  await bot.telegram.sendMessage(chatId, msg);
}

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
