module.exports = (node, graph) => {
  const serializeOBJ = require("serialize-wavefront-obj");
  const download = require("in-browser-download");

  const geometryIn = node.in("geometry");

  function getDateStr() {
    let d = new Date().toISOString();
    d = d.replace("T", " ");
    d = d.substr(0, d.indexOf("."));
    d = d.replace(/:/g, "-");
    return d;
  }

  function exportObj() {
    const geom = geometryIn.value;
    if (!geom) return;

    const objStr = serializeOBJ(geom.cells, geom.positions, geom.normals);
    const fileName = "Mesh " + getDateStr() + ".obj";
    download(objStr, fileName);
  }

  node.in("Export OBJ", exportObj, { connectable: false });
};
