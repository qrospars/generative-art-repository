module.exports = (node, graph) => {
  const triggerOut = node.triggerOut('out')
  
  let isRunning = true
  const props = {
    frame: 0
  }
  
  function loop () {
    props.frame++
    triggerOut.trigger(props)
    
    if (isRunning) {
    	requestAnimationFrame(loop)
    }
  }
  
  requestAnimationFrame(loop)
  
  node.onDestroy = () => {
    isRunning = false
  }
}