import * as go from "gojs";
import {
  createEffect
} from "solid-js";

export const Diagram = () => {
  let myDiagram;

  function init() {
    // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
    // For details, see https://gojs.net/latest/intro/buildingObjects.html
    const $ = go.GraphObject.make; // for conciseness in defining templates

    // some constants that will be reused within templates
    var mt8 = new go.Margin(8, 0, 15, 0);
    var mr8 = new go.Margin(0, 8, 0, 0);
    var ml8 = new go.Margin(0, 0, 0, 8);
    var roundedRectangleParams = {
      parameter1: 2, // set the rounded corner
      spot1: go.Spot.TopLeft,
      spot2: go.Spot.BottomRight, // make content go all the way to inside edges of rounded corners
    };
    myDiagram = new go.Diagram("myDiagramDiv", {
      initialContentAlignment: go.Spot.Center,
      initialDocumentSpot: go.Spot.Top,
      initialViewportSpot: go.Spot.Top,
      layout: $(go.TreeLayout,
        {
          treeStyle: go.TreeLayout.StyleLastParents,
          arrangement: go.TreeLayout.ArrangementHorizontal,
          // properties for most of the tree:
          angle: 90,
          layerSpacing: 35,
          // properties for the "last parents":
          alternateAngle: 90,
          alternateLayerSpacing: 35,
          alternateAlignment: go.TreeLayout.AlignmentBus,
          alternateNodeSpacing: 20
        }),
      "commandHandler.copiesTree": true,
      "commandHandler.deletesTree": true,
      "draggingTool.dragsTree": true,
      "undoManager.isEnabled": true
    });


    // This function provides a common style for most of the TextBlocks.
    // Some of these values may be overridden in a particular TextBlock.
    function textStyle(field) {
      return [{
        font: "13px Rajdhani",
        stroke: "#fff",
        visible: false, // only show textblocks when there is corresponding data for them
      },
      new go.Binding("visible", field, (val) => val !== undefined),
      ];
    }

    // define Converters to be used for Bindings
    function theNationFlagConverter(nation) {
      return "https://www.nwoods.com/images/emojiflags/" + nation + ".png";
    }


    // define the Node template

    myDiagram.nodeTemplate = $(
      go.Node,

      "Auto",

      {
        // Hide the node's children by default
        isTreeExpanded: false,
        click: function (e, node) {
          // Langsung geser tampilan ke node yang diklik
          e.diagram.commandHandler.scrollToPart(node);
        }
      }, {
      locationSpot: go.Spot.Top,
      isShadowed: true,
      shadowBlur: 1,
      shadowOffset: new go.Point(0, 1),
      shadowColor: "rgba(0, 0, 0, .14)",
      selectionAdornmentTemplate: $(
        go.Adornment,
        "Auto",
        $(go.Shape, "RoundedRectangle", roundedRectangleParams, {
          fill: null,
          stroke: "#7986cb",
          strokeWidth: 3,
        }),
        $(go.Placeholder)
      ),
    },
      $(
        go.Shape,
        "RoundedRectangle",
        roundedRectangleParams, {
        name: "SHAPE",
        fill: "#ffffff",
        strokeWidth: 0
      },
        new go.Binding("fill", "", function (v, shape) {
          var node = shape.part;
          return v.key === 0 ? "#0083ff" : node.findTreeChildrenNodes().count > 0 ? "#0040c5" : "#222";
        }).ofObject()
      ),
      $(
        go.Panel,
        "Vertical",
        $(
          go.Panel,
          "Horizontal", {
          margin: 10
        },
          $(
            go.Picture, {
            margin: mr8,
            visible: false,
            desiredSize: new go.Size(55, 55)
          },
            new go.Binding("source", "nation", theNationFlagConverter),
            new go.Binding("visible", "nation", (nat) => nat !== undefined)
          ),
          $(
            go.Panel,
            "Table",
            $(
              go.TextBlock, {
              row: 0,
              alignment: go.Spot.Left,
              font: "bold 17px Rajdhani",
              stroke: "#fff",
              maxSize: new go.Size(160, NaN),
            },
              new go.Binding("text", "name")
            ),
            $(
              go.TextBlock,
              textStyle("title"), {
              row: 1,
              alignment: go.Spot.Left,
              maxSize: new go.Size(160, NaN),
            },
              new go.Binding("text", "title")
            ),

            $("PanelExpanderButton", "INFO", {
              row: 0,
              column: 1,
              rowSpan: 2,
              margin: ml8,
            })
          )
        ),
        $(
          go.Shape,
          "LineH", {
          stroke: "#444",
          strokeWidth: 1,
          height: 1,
          fill: "#fff",
          stretch: go.GraphObject.Horizontal,
        },
          new go.Binding("visible").ofObject("INFO"),
          new go.Binding("stroke", "", function (v, shape) {
            var node = shape.part;
            return v.key === 0 ? "#fff" : node.findTreeChildrenNodes().count > 0 ? "#aaa" : "#444";
          }).ofObject()
        ),
        $(
          go.Panel,
          "Vertical", {
          name: "INFO",
          stretch: go.GraphObject.Horizontal,
          margin: new go.Margin(10, 10, 28, 10),
          defaultAlignment: go.Spot.Left,
        },
          $(
            go.TextBlock,
            textStyle("headOf"),
            new go.Binding("text", "headOf", (head) => "Head of: " + head)
          ),
          $(
            go.TextBlock,
            textStyle("boss"),
            new go.Binding("margin", "headOf", (head) => mt8),
            new go.Binding("text", "boss", (boss) => {
              var boss = myDiagram.model.findNodeDataForKey(boss);
              return boss !== null ? "Reporting to: " + boss.name : "";
            })
          )
        )
      ),

      $("Panel",
        {
          alignment: go.Spot.Bottom,
          alignmentFocus: go.Spot.Top,
          visible: false // Initially not visible
        },
        new go.Binding("visible", "", function (node) {
          return node.findTreeChildrenNodes().count > 0;
        }).ofObject(), // This binding controls the visibility based on whether the node has children
        $(go.Panel, "Auto", // Auto Panel adjusts its size to its content
          {
            cursor: "pointer",
            click: function (e, obj) {
              var node = obj.part;
              if (node === null) return;
              var diagram = node.diagram;
              diagram.startTransaction("CollapseExpandTree");
              if (node.isTreeExpanded) {
                diagram.commandHandler.collapseTree(node);
              } else {
                diagram.commandHandler.expandTree(node);
              }
              diagram.commitTransaction("CollapseExpandTree");
            }
          },
          $(go.Shape, "Rectangle", // Shape provides the background for the TextBlock
            {
              fill: "#333",
              strokeWidth: 0,
            }
          ),
          $(go.TextBlock,
            {
              text: "+",
              margin: new go.Margin(4, 5),
              font: "bold 12pt Rajdhani",
              stroke: "white",
            },
            new go.Binding("text", "", function (node) {
              // If you want to display the count of children, adjust the logic here
              return node.isTreeExpanded ? "-" : "+" + node.findTreeChildrenNodes().count;
            }).ofObject() // Binding to change the text based on the expanded state
          )
        )
      )

    );
    myDiagram.linkTemplate = $(
      go.Link,
      { routing: go.Link.Orthogonal, corner: 5 },
      $(go.Shape,
        { strokeWidth: 3 },
        // Menggunakan binding untuk menyesuaikan warna stroke berdasarkan apakah node target memiliki children
        new go.Binding("stroke", "", function (link) {
          // Dapatkan node target dari link
          var targetNode = link.toNode;
          // Periksa apakah node target memiliki children
          if (targetNode !== null && targetNode.findTreeChildrenNodes().count > 0) {
            return "#0040c5"; // Warna untuk link yang menuju node dengan children
          } else {
            return "#424242"; // Warna default untuk link lain
          }
        }).ofObject()
      ),
      $(go.Shape, // Tanda panah di ujung link
        { toArrow: "Standard", stroke: null, fill: "#424242", strokeWidth: 0, scale: 1.5 },
        // Opsional: Mengikat fill dari toArrow untuk berubah berdasarkan kondisi yang sama
        new go.Binding("fill", "", function (link) {
          var targetNode = link.toNode;
          if (targetNode !== null && targetNode.findTreeChildrenNodes().count > 0) {
            return "#0040c5"; // Warna untuk tanda panah yang menuju node dengan children
          } else {
            return "#424242"; // Warna default untuk tanda panah lain
          }
        }).ofObject()
      )
    );



    // myDiagram.layout = $(go.ForceDirectedLayout, {
    //   defaultSpringLength: 100,
    //   defaultElectricalCharge: 150,
    // });

    // set up the nodeDataArray, describing each person/position
    var nodeDataArray = [{
      key: 0,
      name: "Ban Ki-moon 반기문",
      nation: "SouthKorea",
      title: "Secretary-General of the United Nations",
      headOf: "Secretariat",
    },

    {
      key: 1,
      boss: 0,
      name: "Patricia O'Brien",
      nation: "Ireland",
      title: "Under-Secretary-General for Legal Affairs and United Nations Legal Counsel",
      headOf: "Office of Legal Affairs",
    },
    {
      key: 2,
      boss: 1,
      name: "Peter Taksøe-Jensen",
      nation: "Denmark",
      title: "Assistant Secretary-General for Legal Affairs",
    },
    {
      key: 3,
      boss: 1,
      name: "Other Employees"
    },
    {
      key: 4,
      boss: 1,
      name: "Other Employees"
    },
    {
      key: 5,
      boss: 3,
      name: "Other Employees"
    },
    {
      key: 6,
      boss: 3,
      name: "Other Employees"
    },
    {
      key: 7,
      boss: 3,
      name: "Other Employees"
    },
    {
      key: 8,
      boss: 4,
      name: "Other Employees"
    },
    {
      key: 9,
      boss: 5,
      name: "Other Employees"
    },
    {
      key: 10,
      boss: 4,
      name: "Other Employees"
    },
    ];

    // create the Model with data for the tree, and assign to the Diagram
    myDiagram.model = new go.TreeModel({
      nodeParentKeyProperty: "boss", // this property refers to the parent node data
      nodeDataArray: nodeDataArray,
    });
  }

  // the Search functionality highlights all of the nodes that have at least one data property match a RegExp

  createEffect(() => {
    init();
  });

  return (<div className="w-full h-full" >
    <div id="myDiagramDiv" className="w-full h-full"> </div>
    <div id="myInspector" > </div> </div>
  );
};