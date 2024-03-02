import * as go from "gojs";
import { createEffect, createSignal } from "solid-js";

export const Diagram = ({ data }) => {
  let myDiagram, $
  const [preview, setPreview] = createSignal({
    data: null,
    column: []
  })



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


        "animationManager.isEnabled": true,
        "animationManager.initialAnimationStyle": go.AnimationManager.AnimateLocations, // Animasi perubahan lokasi
        "animationManager.duration": 800 // Durasi animasi dalam milidetik
      });
  })

  function init() {
    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        {
          locationObjectName: "PORT",
          locationSpot: go.Spot.Top, // location point is the middle top of the PORT
          toolTip:
            $("ToolTip",
              $(go.TextBlock, { margin: 4, width: 140 },
                new go.Binding("text", "", data => "tester"))
            ),
          click: function (e, node) { // Tambahkan event handler click pada node
            let column = []
            for (const key in node.data.items) {
              column.push(key)
            }
            setPreview({
              data: node.data,
              column
            })

            e.diagram.commandHandler.scrollToPart(node); // Memfokuskan view pada node yang diklik
            // Opsional: Centang view ke node yang diklik
            e.diagram.centerRect(node.actualBounds);
          }
        },
        $(go.Shape, "Circle",
          {
            strokeWidth: 2,
            fill: "#333",
            // Menambahkan binding untuk width dan height berdasarkan totaluniqFrom
          },
          new go.Binding("fill", "color"),
        ),
        $(go.TextBlock,
          { margin: 5, stroke: "white" },
          new go.Binding("text", "key")
        ),
        // Menambahkan TreeExpanderButton dengan visibility binding berdasarkan properti 'root'
        $("TreeExpanderButton",
          {
            alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top,
            click: (e, obj) => {
              var clickedNode = obj.part; // Mendapatkan node tempat TreeExpanderButton diklik
              if (clickedNode !== null) {
                var clickedKey = clickedNode.data.key; // Key dari node yang diklik

                e.diagram.nodes.each(function (n) {
                  if (n.data.key !== clickedKey) {
                    n.visible = !n.visible; // Toggle visibility berdasarkan kondisi yang ditentukan
                  }
                });
              }
            }
          }, // Menyesuaikan posisi tombol
          // Binding untuk menentukan visibilitas berdasarkan properti 'root'
          new go.Binding("visible", "", function (node) {
            // Mengecek apakah properti 'root' dari data node adalah true
            return node.data.root === true;
          }).ofObject(),

        ),
      );

    function formatDuration(seconds) {
      const days = Math.floor(seconds / (3600 * 24));
      seconds -= days * 3600 * 24;
      const hours = Math.floor(seconds / 3600);
      seconds -= hours * 3600;
      const minutes = Math.floor(seconds / 60);
      seconds -= minutes * 60;

      // Membangun string format waktu
      let timeString = "";
      if (days > 0) timeString += `${days} D, `;
      if (hours > 0 || days > 0) timeString += `${hours} H, `;
      if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes} M, `;
      timeString += `${seconds} S`;

      return timeString;
    }

    const Tolltip = () => ({
      toolTip:
        $("ToolTip",
          $(go.TextBlock, { margin: 2, width: 200 },
            new go.Binding("text", "", (data) => {
              return `
                    From: ${data.to}
                    To: ${data.from}
                    -----------------------------
                    Total Call: ${data.totaluniqFrom}x
                    Total Duration: ${formatDuration(data.totalDuration)}
                    `
            }))
        )
    })

    // Template untuk link dengan strokeWidth yang menyesuaikan berdasarkan totaluniq
    myDiagram.linkTemplate =
      $(go.Link, { routing: go.Link.Normal, curve: go.Link.Bezier },
        $(go.Shape, // Ini untuk garis link
          {
            cursor: "pointer",
            toolTip: Tolltip().toolTip
          },
          new go.Binding("stroke", "totaluniqFrom", function (total) {
            // Menghitung intensitas biru berdasarkan totaluniqFrom
            const blueIntensity = Math.min(255, 100 + total * 15);
            return `rgb(96, 165, ${blueIntensity})`;
          }),
          new go.Binding("strokeWidth", "totaluniqFrom", function (total) {
            return Math.max(2, total / 3);
          })),
        $(go.Shape, // Ini untuk arrowhead
          {
            fromArrow: "OpenTriangle",
            stroke: null,
            fill: "rgb(96, 165, 255)"
          },
          new go.Binding("fill", "totaluniqFrom", function (total) {
            const blueIntensity = Math.min(255, 100 + total * 15);
            return `rgb(96, 165, ${blueIntensity})`;
          })),
        $(go.Panel, "Auto", // Menggunakan Panel "Auto" untuk menambahkan "padding"
          {
            toolTip:
              Tolltip().toolTip,
            segmentIndex: 0,
            segmentFraction: 0.5,
            segmentOrientation: go.Link.OrientUpright,
          },
          $(go.Shape, "Rectangle", // Shape untuk background, bisa disesuaikan
            {
              fill: "#333", // Warna background
              stroke: null,
              // Menghilangkan border
            }),
          $(go.TextBlock,
            {
              stroke: "black", // Warna teks
              textAlign: "center",
              stroke: "white",
              margin: 4
            },
            new go.Binding("text", "totaluniqFrom", (data) => `${data}x`))
        )
      );



    function isValidPhoneNumber(phoneNumber) {
      // Contoh regex yang mengecek apakah string diawali dengan '62' atau '081' atau '082'
      // dan diikuti oleh angka lainnya
      const regex = /^(62|081|082)\d+$/;
      return regex.test(phoneNumber);
    }

    let rawData = data().data;
    // Filter rawData untuk hanya memasukkan item dengan BNUMBER yang valid sebagai nomor telepon
    let filteredData = rawData.filter(item => isValidPhoneNumber(item[data().config.parent]));

    // Hitung jumlah kemunculan untuk ANUMBER dan BNUMBER
    let aNumberCounts = new Map();
    let bNumberCounts = new Map();

    filteredData.forEach(item => {
      aNumberCounts.set(item[data().config.root], (aNumberCounts.get(item[data().config.root]) || 0) + 1);
      bNumberCounts.set(item[data().config.parent], (bNumberCounts.get(item[data().config.parent]) || 0) + 1);
    });

    let totalDurationPerBNumber = new Map();

    rawData.forEach(item => {
      if (item.DURATION && /^\d+$/.test(item.DURATION)) {
        let currentDuration = totalDurationPerBNumber.get(item[data().config.parent]) || 0;
        totalDurationPerBNumber.set(item[data().config.parent], currentDuration + parseInt(item.DURATION, 10));
      }
    });

    // Konversi data menjadi format yang dibutuhkan untuk link
    let linkData = filteredData.map(a => ({
      items: a,
      from: a[data().config.parent],
      to: a[data().config.root],
      totaluniqFrom: bNumberCounts.get(a[data().config.parent]),
      totalDuration: totalDurationPerBNumber.get(a[data().config.parent]),
    }));

    // Menghapus duplikat dari linkData
    const uniqueLinkData = [...new Map(linkData.map(item => [`${item.from}->${item.to}`, item])).values()];

    // Menghapus duplikat dari data node berdasarkan 'ANUMBER'
    const uniqueNodeData = [...new Map(filteredData.map(item => [item[data().config.root], item])).values()];

    // Membuat array node unik dengan menambahkan 'totaluniq'
    let nodes = uniqueNodeData.map(a => ({
      key: a[data().config.root],
      color: "#46a5ff",
      items: a,
      root: true,
      totalDuration: totalDurationPerBNumber.get(a[data().config.parent]),
      totaluniq: aNumberCounts.get(a[data().config.root]) // Total kemunculan ANUMBER di rawData
    }));

    // Menambahkan node yang unik dari data link yang mungkin belum termasuk
    uniqueLinkData.forEach(link => {
      if (!nodes.some(node => node.key === link.from)) {
        nodes.push({
          key: link.from,
          items: link.items,
          totaluniq: bNumberCounts.get(link.from),
          totalDuration: totalDurationPerBNumber.get(link.from),
        });
      }
    });

    // Menetapkan model dengan data node dan link yang unik
    myDiagram.addDiagramListener("BackgroundSingleClicked", function (e) {
      setPreview()
    });

    myDiagram.model = new go.GraphLinksModel(nodes, uniqueLinkData);
  }


  createEffect(() => {
    init();
  });

  createEffect(() => {
    console.log(preview())
  })
  return (
    <div className="w-full h-full">
      <div id="myDiagramDiv" className="w-full h-full"></div>
      {preview() && preview().data && !preview().data.root && <div className="p-4 absolute left-0 top-0 z-10">
        <div className="bg-primarry-2 min-w-52  max-h-64 overflow-auto">
          <div className=" bg-blue-500 p-2 sticky top-0">INFORMATION</div>
          <div>
            {preview().column.map(a => {
              return <div className="p-2 flex justify-between text-sm">
                <div>
                  {a}
                </div>
                <div className="text-blue-300">
                  {a === "DURATION" ? preview().data.totalDuration : preview().data.items[a]}
                </div>
              </div>
            })}

          </div>
        </div>
      </div>}

    </div>
  );
};
