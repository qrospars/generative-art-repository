module.exports = (node, graph) => {
  const trigger1In = node.triggerIn("in1");
  const trigger2In = node.triggerIn("in2");
  const triggerOut = node.triggerOut("out");

  trigger1In.onTrigger = (props) => {
    triggerOut.trigger(props);
  };

  trigger2In.onTrigger = (props) => {
    triggerOut.trigger(props);
  };
};
