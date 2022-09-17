module.exports = function (node, graph) {
  const triggerIn = node.triggerIn('in')
  const triggerOut = node.triggerOut('out')
  const timeOut = node.out('time')

  let time = 0 //TODO: time vs totalTime?
  let prevTime = 0
  
  const resetBtn = node.in('Reset', () => {
    time = 0
    prevTime = Date.now()
  }, { connectable: false })
  
  node.comment = 'Counts time in seconds'
    
  triggerIn.onTrigger = (props) => {
    const now = Date.now()
    if (!prevTime) prevTime = now
    const deltaTime = (now - prevTime) / 1000 //ms -> s
    time += deltaTime
    prevTime = now
    
    triggerOut.trigger({
      ...props,
      time: time,
      deltaTime
    })
    
    timeOut.setValue(time)
    
    node.comment = `Counts time in seconds\nTime: ${time.toFixed(1)}`
  }
}