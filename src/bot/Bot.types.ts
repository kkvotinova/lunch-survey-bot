import { Context } from "telegraf";
import { Update, Message } from "telegraf/typings/core/types/typegram";

export interface BotCommand {
  name: string;
  callback: BotCommandCallback;
}

export type BotCommandCallback = (ctx: BotCallbackContext) => void;

export type BotCallbackContext = Context<{
  message: Update.New & Update.NonChannel & Message.TextMessage;
  update_id: number;
}>;
