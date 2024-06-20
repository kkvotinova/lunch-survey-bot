import envConfig from "../utils/env";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { isCommandAccessible, replyWithPoll } from "./Bot.utils";
import { BotCallbackContext, BotCommand } from "./Bot.types";
import cron, { ScheduledTask } from "node-cron";

class Bot {
  private bot: Telegraf<Context<Update>> | null = null;
  private botCommands: BotCommand[] = [];

  private cronTask: ScheduledTask | null = null;

  constructor() {
    const botToken = envConfig.BOT_TOKEN;

    if (!botToken) {
      throw new Error("BOT_TOKEN must be provided!");
    }

    this.bot = new Telegraf(botToken);

    this.botCommands = [
      { name: "start", callback: this.commandStart },
      { name: "stop", callback: this.commandStop },
    ];
  }

  private commandStart(ctx: BotCallbackContext) {
    this.cronTask?.stop();

    // TODO: праздники
    this.cronTask = cron.schedule("0 12 * * 1-5", () => replyWithPoll(ctx), {
      timezone: "Europe/Moscow",
    });

    ctx.reply("Bot has been successfully launched! 🚀");
  }

  private commandStop(ctx: BotCallbackContext) {
    this.cronTask?.stop();
    ctx.reply("Bot has been successfully turned off! ☠️");
  }

  private initializeBotCommands() {
    this.botCommands.forEach(({ name, callback }) => {
      this.bot?.command(name, (ctx) => {
        if (isCommandAccessible(ctx)) callback.call(this, ctx);
        else ctx.reply("Access is denied");
      });
    });
  }

  private stopProcess(reason: string) {
    return () => {
      this.cronTask?.stop();
      this.bot?.stop(reason);
    };
  }

  start() {
    if (!this.bot) return;

    this.initializeBotCommands();

    this.bot.launch();

    process.once("SIGINT", this.stopProcess("SIGINT"));
    process.once("SIGTERM", this.stopProcess("SIGTERM"));
  }
}

export default Bot;
