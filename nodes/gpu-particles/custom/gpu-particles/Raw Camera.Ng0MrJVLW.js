module.exports = (node, graph) => {
  const triggerIn = node.triggerIn("in");
  const triggerOut = node.triggerOut("out");
  const { perspective, orbiter: createOrbiter } = require("pex-cam");
  const nearIn = node.in("near", 1);
  const farIn = node.in("far", 100);
  const ctx = graph.ctx;

  node.comment = "Camera with Orbiter";

  const camera = perspective({
    target: [0, 0, 5],
    fov: Math.PI / 4,
    near: 10,
    far: 200,
    aspect: ctx.gl.drawingBufferWidth / ctx.gl.drawingBufferHeight,
  });

  const orbiter = createOrbiter({
    camera: camera,
    lon: 180,
    // lat: 0,
    element: ctx.gl.canvas,
    distance: 30,
    maxDistance: 60,
    easing: 0.1,
    autoUpdate: false,
  });

  node.onResize = () => {
    camera.set({
      aspect: ctx.gl.drawingBufferWidth / ctx.gl.drawingBufferHeight,
    });
  };

  const clearCmd = {
    pass: ctx.pass({
      clearColor: [255, 106, 59].map((c) => c / 255),
      clearDepth: 1,
    }),
  };

  nearIn.onChange = () => camera.set({ near: nearIn.value });
  farIn.onChange = () => camera.set({ far: farIn.value });

  triggerIn.onTrigger = (props) => {
    ctx.submit(clearCmd);

    orbiter.updateCamera();

    triggerOut.trigger({
      ...props,
      camera,
      orbiter,
    });
  };
};
