export default async function getStat (ctx: any) {
  try {
    ctx.scene.enter("getname")
    console.log(`[GET_STAT] ${ctx.from.username}`)
  } catch (error) { console.log(`[ERROR] ${error}`) }
}