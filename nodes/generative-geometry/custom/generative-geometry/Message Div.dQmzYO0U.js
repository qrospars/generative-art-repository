module.exports = (node, graph) => {
  const triggerIn = node.triggerIn("in");
  const triggerOut = node.triggerOut("out");

  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.top = "0";
  div.style.color = "#000000";
  div.style.padding = "1em";
  div.innerText = "Message";

  graph.sceneContainer.appendChild(div);
  graph.messageDiv = div;

  node.onDestroy = () => {
    graph.sceneContainer.removeChild(div);
  };

  function displayMessage(msg) {
    div.innerText = msg;
  }

  triggerIn.onTrigger = (props) => {
    div.innerText = "";
    triggerOut.trigger({
      ...props,
      displayMessage: displayMessage,
    });
  };
};
