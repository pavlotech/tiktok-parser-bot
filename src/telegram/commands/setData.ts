export default async function setData (ctx: any) {
  try {
    ctx.scene.enter("firstdate")
    console.log(`[SET_DATA] ${ctx.from.username}`)
  } catch (error) { console.log(`[ERROR] ${error}`) }
}