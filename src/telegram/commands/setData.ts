export default async function setData (ctx: any) {
  try {
    ctx.scene.enter("first_date")
    console.log(`[SET_DATA] ${ctx.from.username}`)
  } catch (error) { console.error(`[ERROR] ${error}`) }
}