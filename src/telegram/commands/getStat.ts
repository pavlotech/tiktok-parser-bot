export default async function getStat (ctx: any) {
  try {
    ctx.scene.enter("get_name")
    console.log(`[GET_STAT] ${ctx.from.username}`)
  } catch (error) { console.error(`[ERROR]`, error); }
}