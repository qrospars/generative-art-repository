module.exports = (node, graph) => {
  const inputAIn = node.in('inputA')
  const inputBIn = node.in('inputB')
  
  function update () {
    node.comment = `Input ${inputAIn.value}\n${inputBIn.value}`
    node.log(`Input ${inputAIn.value} ${inputBIn.value}`)
  }
  
  inputAIn.onChange = update
  inputBIn.onChange = update
}