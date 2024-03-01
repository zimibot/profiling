import * as go from "gojs";
import { createEffect } from "solid-js";

export const Diagram = ({ data }) => {

  function init() {
    var $ = go.GraphObject.make; // untuk mendefinisikan template
    var myDiagram =
      $(go.Diagram, "myDiagramDiv", { // ID dari DIV tempat diagram akan ditampilkan
        "undoManager.isEnabled": true, // enable undo & redo
        layout: $(go.ForceDirectedLayout, {
          defaultSpringLength: 10,
          defaultElectricalCharge: 50,
        }),
        "animationManager.isEnabled": true,
        "animationManager.initialAnimationStyle": go.AnimationManager.AnimateLocations, // Animasi perubahan lokasi
        "animationManager.duration": 800 // Durasi animasi dalam milidetik
      });

    // Mendefinisikan template node
  // Mendefinisikan template node dengan tooltip
myDiagram.nodeTemplate =
$(go.Node, "Auto",
  // Tooltip Adornment
  { // ToolTip definition
    toolTip:  // define a tooltip for each node that displays the text value of the model data
      $("ToolTip",
        $(go.TextBlock, { margin: 4 },
          new go.Binding("text", "", function(data) { return "Key: " + data.key + "\nColor: " + data.color; }))
      )  // end of Adornment
  },
  $(go.Shape, "Circle",
    { strokeWidth: 2, fill: "white" },
    new go.Binding("fill", "color")),
  $(go.TextBlock, { margin: 10 },
    new go.Binding("text", "key"))
);

    // Mendefinisikan template link
    myDiagram.linkTemplate =
      $(go.Link,
        { routing: go.Link.Normal, curve: go.Link.Bezier }, // Anda bisa mengatur routing dan curve sesuai kebutuhan
        $(go.Shape, { strokeWidth: 2, stroke: "white" }) // Mengatur warna link menjadi putih
      );

    // Mendefinisikan model dengan data node
    var nodeDataArray = [
      { key: "1", color: "orange" },
      { key: "2", color: "orange" },

      { key: "3", color: "lightblue" }, // root node
      { key: "4", color: "lightblue" }, // root node
      { key: "5", color: "lightblue" }, // root node
      { key: "6", color: "lightblue" }, // root node
      { key: "7", color: "lightblue" }, // root node
      { key: "8", color: "lightblue" }, // root node
      { key: "9", color: "lightblue" }, // root node
      { key: "10", color: "lightblue" }, // root node
      // child nodes dengan parent
      // Tambahkan child nodes lain di sini
    ];

    var linkDataArray = [
      // Definisikan hubungan antar nodes
      { from: "10", to: "2" },
      { from: "5", to: "1" },


      { from: "3", to: "2" },
      { from: "4", to: "2" },
      { from: "5", to: "2" },
      { from: "6", to: "2" },
      { from: "7", to: "2" },
      { from: "8", to: "2" },
      { from: "9", to: "2" },
      // Tambahkan hubungan lainnya di sini
    ];

    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

    myDiagram.layoutCompleted = function (e) {
      var root = e.diagram.findNodeForKey("6281211548212");
      if (root !== null) {
        root.location = e.diagram.actualBounds.center;
      }
    };
  }

  createEffect(() => {
    init();
  });

  return (
    <div className="w-full h-full">
      <div id="myDiagramDiv" className="w-full h-full"></div>
      <div id="myInspector"></div>
    </div>
  );
};
