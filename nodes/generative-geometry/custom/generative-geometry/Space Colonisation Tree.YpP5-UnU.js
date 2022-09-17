module.exports = (node, graph) => {
  const random = require("pex-random");
  const vec3 = require("pex-math").vec3;
  const quat = require("pex-math").quat;
  const mat4 = require("pex-math").mat4;
  const spaceColonization = require("space-colonization");

  const triggerIn = node.triggerIn("in");
  const triggerOut = node.triggerOut("out");

  const pointsIn = node.in("pointsIn");
  const treeOut = node.out("tree");
  const leavesOut = node.out("leaves");
  const hormonesGeomOut = node.out("hormonesGeom");
  const pointsOut = node.out("points", []);

  pointsIn.onChange = () => {
    if (pointsIn.value) run();
  };

  let points = [];
  let iterator = null;
  let iterationResult = null;
  let numIterations = 60;
  let iterationIndex = 0;

  function run() {
    random.seed(0);
    let hormones = pointsIn.value || [];

    if (hormones.length == 0) return;

    iterationResult = null;
    iterationIndex = 0;
    iterator = spaceColonization({
      buds: [hormones[0].slice(0, 3)],
      hormones: hormones,
      deadZone: 0.1,
      growthStep: 0.03,
      splitChance: 0.6,
      viewAngle: 30,
      branchAngle: 60,
      viewDistance: 0.2,
    });
  }

  triggerIn.onTrigger = (props) => {
    if (iterator) {
      if (++iterationIndex <= numIterations) {
        props.displayMessage(
          `Creating Space Colonisation Tree. Iteration ${iterationIndex} / ${numIterations}`
        );
        node.comment = `Iteration ${iterationIndex} / ${numIterations}`;
        iterationResult = iterator();
      } else {
        iterator = null;
        const hormones = iterationResult.hormones;
        const buds = iterationResult.buds;
        node.comment = `Buds: ${buds.length}`;
        const points = buds.map((bud) => {
          return [...bud.position, 1];
        });
        pointsOut.setValue(points);
      }
    }
    triggerOut.trigger(props);
  };
};
