const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = async (arg) => {
  await wait(500)
  arg.awaitRun = true
}
