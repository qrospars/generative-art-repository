module.exports = (node, graph) => {
  // This node decleares one input parameter 'name' of type string 
  // allowing you to enter your name in the property inspector

  // port data type unless specified is automatically deducted
  // from the param default value
  const nameIn = node.in("name", "World");
  const nameOut = node.out("name out", "");

  // this function runs whenever 'nameIn' port changes
  nameIn.onChange = () => {
    // assigning node.comment will make it appear next to node name in the graph
    node.comment = nameIn.value;

    // pass input value to the output port
    nameOut.setValue(nameIn.value);
  };
};
