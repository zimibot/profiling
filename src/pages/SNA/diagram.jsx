import * as go from "gojs";
import { createEffect } from "solid-js";

export const Diagram = ({ data }) => {
  let myDiagram, $
  createEffect(() => {
    $ = go.GraphObject.make; // untuk mendefinisikan template
    myDiagram =
      $(go.Diagram, "myDiagramDiv", { // ID dari DIV tempat diagram akan ditampilkan
        "undoManager.isEnabled": true, // enable undo & redo
        layout: $(go.ForceDirectedLayout, {
          defaultSpringLength: 50,
          defaultElectricalCharge: 100,
        }),
        "LayoutCompleted": function (e) {
          var root = e.diagram.findNodeForKey("from"); // Ganti "rootKey" dengan kunci sebenarnya dari root
          if (root) {
            root.location = e.diagram.actualBounds.center;
          }
        },
        "animationManager.isEnabled": true,
        "animationManager.initialAnimationStyle": go.AnimationManager.AnimateLocations, // Animasi perubahan lokasi
        "animationManager.duration": 800 // Durasi animasi dalam milidetik
      });
  })

  function init() {
    // Inisialisasi diagram dengan gojs
    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "Circle", { strokeWidth: 2, fill: "white" }, new go.Binding("fill", "color")),
        $(go.TextBlock, { margin: 10 }, new go.Binding("text", "key"))
      );

    // Template untuk link dengan strokeWidth yang menyesuaikan berdasarkan totaluniq
    myDiagram.linkTemplate =
      $(go.Link, { routing: go.Link.Normal, curve: go.Link.Bezier },
        $(go.Shape,
          new go.Binding("stroke", "totaluniqFrom", function (total) {
            // Menghitung intensitas biru berdasarkan totaluniqFrom
            const blueIntensity = Math.min(255, 100 + total * 15); // Dasar + peningkatan per totaluniq
            return `rgb(96, 165, ${blueIntensity})`; // Menghasilkan warna biru dengan intensitas yang dihitung
          }),
          new go.Binding("strokeWidth", "totaluniqFrom", function (total) {
            // Misalnya, setiap 5 kemunculan meningkatkan strokeWidth sebanyak 1
            return Math.max(2, total / 5); // Minimum strokeWidth adalah 2
          }))
      );


    let rawData = data().data;

    // Hitung jumlah kemunculan untuk ANUMBER dan BNUMBER
    let aNumberCounts = new Map();
    let bNumberCounts = new Map();

    rawData.forEach(item => {
      aNumberCounts.set(item.ANUMBER, (aNumberCounts.get(item.ANUMBER) || 0) + 1);
      bNumberCounts.set(item.BNUMBER, (bNumberCounts.get(item.BNUMBER) || 0) + 1);
    });

    // Konversi data menjadi format yang dibutuhkan untuk link
    let linkData = rawData.map(a => ({
      from: a.BNUMBER,
      to: a.ANUMBER,
      totaluniqFrom: bNumberCounts.get(a.BNUMBER) // Menambahkan totaluniq dari BNUMBER
    }));

    // Menghapus duplikat dari linkData
    const uniqueLinkData = [...new Map(linkData.map(item => [`${item.from}->${item.to}`, item])).values()];

    // Menghapus duplikat dari data node berdasarkan 'ANUMBER'
    const uniqueNodeData = [...new Map(rawData.map(item => [item.ANUMBER, item])).values()];

    // Membuat array node unik dengan menambahkan 'totaluniq'
    let nodes = uniqueNodeData.map(a => ({
      key: a.ANUMBER,
      color: "#46a5ff",
      totaluniq: aNumberCounts.get(a.ANUMBER) // Total kemunculan ANUMBER di rawData
    }));

    // Menambahkan node yang unik dari data link yang mungkin belum termasuk
    uniqueLinkData.forEach(link => {
      if (!nodes.some(node => node.key === link.from)) {
        nodes.push({
          key: link.from,
          totaluniq: bNumberCounts.get(link.from) // Total kemunculan BNUMBER di rawData
        });
      }
    });

    myDiagram.addDiagramListener("PartMoved", function (e) {
      var part = e.subject.part; // Mendapatkan node yang dipindahkan
      if (part instanceof go.Node && part.data.key === "from") { // Ganti "rootKey" dengan kunci sebenarnya dari root
        // Node yang dipindahkan adalah root, sesuaikan posisi parent-node disini
        var rootLocation = part.location;

        // Iterasi melalui semua node yang terhubung dan sesuaikan posisi mereka
        part.findLinksConnected().each(function (link) {
          var parent = link.getOtherNode(part);
          // Logika untuk menentukan posisi baru parent-node relatif terhadap root
          // Contoh sederhana: Memindahkan semua parent sejauh 100 unit ke kanan dari root
          // Ini harus disesuaikan sesuai dengan logika layout yang diinginkan
          parent.location = new go.Point(rootLocation.x + 100, rootLocation.y);
        });
      }
    });

    // Menetapkan model dengan data node dan link yang unik
    myDiagram.model = new go.GraphLinksModel(nodes, uniqueLinkData);
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
