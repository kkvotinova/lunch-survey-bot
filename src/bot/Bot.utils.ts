import envConfig from "../utils/env";
import { BotCallbackContext } from "./Bot.types";

export const replyWithPoll = (ctx: BotCallbackContext) => {
  ctx.replyWithPoll(
    "Привет! Сегодня в 12:30~ приглашаю на обед! \nВыбери, куда бы ты хотел(а) пойти:",
    ["Небо", "Клара", "Посмотреть результат"],
    {
      is_anonymous: false,
      allows_multiple_answers: true,
      //   TODO:
      //   close_date
      //   open_period
    }
  );
};

export const isCommandAccessible = (ctx: BotCallbackContext): boolean =>
  ctx.update.message.from.username === envConfig.ADMIN_NAME;
