module.exports = (node, graph) => {
  const serializeSTL = require("serialize-stl");
  const download = require("in-browser-download");

  const geometryIn = node.in("geometry");

  function getDateStr() {
    let d = new Date().toISOString();
    d = d.replace("T", " ");
    d = d.substr(0, d.indexOf("."));
    d = d.replace(/:/g, "-");
    return d;
  }

  function exportStl(ascii) {
    const geom = geometryIn.value;
    if (!geom) return;

    const stl = serializeSTL(geom.cells, geom.positions, false, ascii);
    const fileName = "Mesh " + getDateStr() + ".stl";
    download(ascii ? stl : stl.buffer, fileName);
  }

  node.in("Export STL (Binary)", () => exportStl(false), {
    connectable: false,
  });
  node.in("Export STL (Text)", () => exportStl(true), {
    connectable: false,
  });
};
