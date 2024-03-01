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
          defaultSpringLength: 100,
          defaultElectricalCharge: 200,
          epsilonDistance: 1,
          maxIterations: 200,
          infinityDistance: 1000,
          arrangementSpacing: new go.Size(100, 100)
        }),
        "LayoutCompleted": function (e) {
          // Temukan root node berdasarkan properti 'root' yang true
          e.diagram.nodes.each(function (n) {
            if (n.data.root === true) {
              // Menghitung titik tengah dari actualBounds
              var diagramBounds = e.diagram.documentBounds;
              var centerX = diagramBounds.x + diagramBounds.width / 2;
              var centerY = diagramBounds.y + diagramBounds.height / 2;
              var center = new go.Point(centerX, centerY);
              // Pindahkan root node ke titik tengah diagram
              e.diagram.model.setDataProperty(n.data, "location", go.Point.stringify(center));
              // Atau, jika Anda ingin langsung memindahkan part tanpa animasi:
              // n.location = center;
            }
          });
        },


        "animationManager.isEnabled": true,
        "animationManager.initialAnimationStyle": go.AnimationManager.AnimateLocations, // Animasi perubahan lokasi
        "animationManager.duration": 800 // Durasi animasi dalam milidetik
      });
  })

  function init() {
    // Inisialisasi diagram dengan gojs

    var $ = go.GraphObject.make; // Untuk menyederhanakan pembuatan definisi grafis

    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "Circle",
          { strokeWidth: 2, fill: "white" },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 10 },
          new go.Binding("text", "key")),
        // Membuat panel yang berisi tombol custom untuk expand/collapse, ditampilkan hanya pada root
        $("Panel", "Horizontal",
          { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top },
          new go.Binding("itemArray", "", function (node) {
            // Mengembalikan array kosong jika bukan root, sehingga tidak menampilkan tombol
            return node.data.root ? [{}] : [];
          }).ofObject(),
          { // Template untuk tombol expand/collapse
            itemTemplate:
              $("Button",
                { click: toggleChildrenVisibility }, // Menambahkan event listener untuk klik tombol
                $(go.TextBlock, "±") // Teks dalam tombol
              )
          }
        )
      );

    // Fungsi untuk toggle visibilitas children
    function toggleChildrenVisibility(e, obj) {
      var node = obj.part; // Mendapatkan node dari tombol yang diklik
      if (node === null) return;
      var diagram = node.diagram;
      diagram.startTransaction("toggleChildren");
      // Toggle visibilitas dari setiap child node dan link ke child
      node.findTreeChildrenNodes().each(function (child) {
        child.visible = !child.visible; // Toggle visibilitas node child
        var link = node.findTreeParentLink(child);
        if (link !== null) {
          link.visible = child.visible; // Menyesuaikan visibilitas link
        }
      });
      diagram.commitTransaction("toggleChildren");
    }


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


    function isValidPhoneNumber(phoneNumber) {
      // Contoh regex yang mengecek apakah string diawali dengan '62' atau '081' atau '082'
      // dan diikuti oleh angka lainnya
      const regex = /^(62|081|082)\d+$/;
      return regex.test(phoneNumber);
    }

    let rawData = data().data;

    // Filter rawData untuk hanya memasukkan item dengan BNUMBER yang valid sebagai nomor telepon
    let filteredData = rawData.filter(item => isValidPhoneNumber(item.BNUMBER));

    // Hitung jumlah kemunculan untuk ANUMBER dan BNUMBER
    let aNumberCounts = new Map();
    let bNumberCounts = new Map();

    filteredData.forEach(item => {
      aNumberCounts.set(item.ANUMBER, (aNumberCounts.get(item.ANUMBER) || 0) + 1);
      bNumberCounts.set(item.BNUMBER, (bNumberCounts.get(item.BNUMBER) || 0) + 1);
    });

    // Konversi data menjadi format yang dibutuhkan untuk link
    let linkData = filteredData.map(a => ({
      from: a.BNUMBER,
      to: a.ANUMBER,
      totaluniqFrom: bNumberCounts.get(a.BNUMBER) // Menambahkan totaluniq dari BNUMBER
    }));

    // Menghapus duplikat dari linkData
    const uniqueLinkData = [...new Map(linkData.map(item => [`${item.from}->${item.to}`, item])).values()];

    // Menghapus duplikat dari data node berdasarkan 'ANUMBER'
    const uniqueNodeData = [...new Map(filteredData.map(item => [item.ANUMBER, item])).values()];

    // Membuat array node unik dengan menambahkan 'totaluniq'
    let nodes = uniqueNodeData.map(a => ({
      key: a.ANUMBER,
      color: "#46a5ff",
      root: true,
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
