module.exports = async (arg) => {
  console.log('running')
  throw new Error('Throwing')
}
