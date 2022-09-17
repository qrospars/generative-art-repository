module.exports = (node, graph) => {
  const triggerIn = node.triggerIn('in')
  const triggerOut = node.triggerOut('out')
  const noiseScaleIn = node.in('noiseScale', 0.13, { min: 0.01, max: 2 })
  const speedIn = node.in('speed', 0.2, { min: 0, max: 2 })
  
  const ctx = graph.ctx
  const { PingPong, snoise, snoise3 } = graph.ps
  
  const updatePositionsCmdDef = {
    frag: `
      #ifdef GL_ES
      precision highp float;
      #endif
      
      ${snoise.frag}
      ${snoise3.frag}
  
      varying vec2 vTexCoord;
      uniform sampler2D uPositionsTex;
      uniform float uTime;
      uniform float uDeltaTime;
      uniform float uNoiseScale;
      uniform float uSpeed;
      
      void main() {
        vec4 positionLife = texture2D(uPositionsTex, vTexCoord);
        vec3 position = positionLife.xyz;
        float life = positionLife.a;
      	
      	float scale = uNoiseScale;
      	position += snoise3((position + vec3(uTime, 0.0, 0.0)) * uNoiseScale) * uDeltaTime;
  
        gl_FragColor = vec4(position, life);
      }
      `
  }
  
  let updatePositionsCmd = null
  let time = 0
  
  triggerIn.onTrigger = (props) => {
    const { ps, deltaTime } = props
      
    if (!updatePositionsCmd) {
      updatePositionsCmd = ps.createUpdateCmd(updatePositionsCmdDef)
    }
    
    time += deltaTime * speedIn.value
  
    updatePositionsCmd.pass = ps.positionsFbo.getPass()    
    ctx.submit(updatePositionsCmd, {
      uniforms: {
        uPositionsTex: ps.positionsFbo.getTexture(),
        uTime: time,
        uDeltaTime: deltaTime,
        uNoiseScale: noiseScaleIn.value
      }
    })
    ps.positionsFbo.flip()
    triggerOut.trigger(props)
  }
  
}