module.exports = (node, graph) => {
  const instancedGeometryOut = node.out('instancedGeometry')
  const { cube: createCube } = require('primitive-geometry')
  
  const pointsIn = node.in('points', null)
  const resolutionIn = node.in('resolution', 0.02)
  
  node.comment = 'Convert points\ninto instanced cubes'
  
  function update () {
    if (!pointsIn.value) return        
    var g = createCube(resolutionIn.value)
    g.offsets = pointsIn.value
    instancedGeometryOut.setValue(g)
  }
  
  
  pointsIn.onChange = update
  resolutionIn.onChange = update
}