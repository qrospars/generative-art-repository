module.exports = (node, graph) => {
  const voxelsIn = node.in('voxelsIn')
  const pointsOut = node.out('points')
  
  node.comment = 'Convert voxels into list of points'
  
  voxelsIn.onChange = () => {
    if (!voxelsIn.value) return
    
    var { voxels, origin, resolution } = voxelsIn.value
    var { shape } = voxels
    
    var points = []
    for (var i = 0; i < shape[0]; i++) {
      for (var j = 0; j < shape[1]; j++) {
        for (var k = 0; k < shape[1]; k++) {          
          if (voxels.get(i, j, k)) {
            var pos = [ resolution * i + origin[0], resolution * j + origin[1], resolution * k + origin[2] ]
            points.push(pos)
          }
        }
      }
    }
    
    node.comment = `Points: ${points.length}`
    
    pointsOut.setValue(points)
  }
}