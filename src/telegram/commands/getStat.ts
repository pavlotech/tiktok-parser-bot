export default async function getStat (ctx: any) {
  try {
    ctx.scene.enter("firstdate")
    console.log(`[GET_STAT] ${ctx.from.username}`)
  } catch (error) { console.log(`[ERROR] ${error}`) }
}