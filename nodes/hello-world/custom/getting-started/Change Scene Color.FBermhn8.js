module.exports = (node, graph) => {
  const colorIn = node.in('color', [0.3, 0.5, 0.5, 1], { type: 'color' })
  
  colorIn.onChange = () => {
    // color is array of r,g,b,a floats
    const color = colorIn.value
    
    // so we need to convert it to the css color
    const r = Math.floor(255 * color[0])
    const g = Math.floor(255 * color[1])
    const b = Math.floor(255 * color[2])
    
    graph.sceneContainer.style.background = `rgb(${r}, ${g}, ${b})`
  }
}