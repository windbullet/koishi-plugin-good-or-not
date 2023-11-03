import { Context, Schema, h, Random } from 'koishi'

export const name = 'good-or-not'

export const usage = ` `

export interface Config {
  好: string
  不好: string
  平: string
}

export const Config: Schema<Config> = Schema.object({
  好: Schema.string()
    .description("好的概率大于不好时，机器人的回复")
    .default("我觉得好喵！"),
  不好: Schema.string()
    .description("不好的概率大于好时，机器人的回复")
    .default("我觉得不好喵"),
  平: Schema.string()
    .description("好的概率与不好一样时，机器人的回复")
    .default("我觉得不好说喵......")
})

export function apply(ctx: Context, config: Config) {
  ctx.middleware(async (session, next) => {
    if (session.content.endsWith('好不好') && session.content.length > 3) {
      const good = Random.int(0, 101)
      const bad = Random.int(0, 101)
      let result;
      if (good > bad) {
        result = config.好
      } else if (good < bad) {
        result = config.不好
      } else {
        result = config.平
      }
      return h('quote', session.event.message.id) + `好的概率是：${good}％\n不好的概率是：${bad}％\n${result}`
    } else {
      return next()
    }
  }), true
}
