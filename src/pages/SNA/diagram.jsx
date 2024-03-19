import { Download, Redo, Save, Undo } from "@suid/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
} from "@suid/material";
import * as go from "gojs";
import { createEffect, createSignal, onCleanup, } from "solid-js";
import { jsPDF } from "jspdf";
import { Tags } from "../../component/tags";
import { createFormControl, createFormGroup } from "solid-forms";
import { api } from "../../helper/_helper.api";
import Swal from "sweetalert2";
import { useBeforeLeave } from "@solidjs/router";


export const Diagram = ({ data, myDiagram, $ }) => {


  const [update, setUpdate] = createSignal({
    model: false,
    redo: false,
    export: false,
    isload: false
  })

  const [items, setItmes] = createSignal({
    node: [],
    linkData: []
  })

  const group = createFormGroup({
    resolution: createFormControl("", {
      required: true,
    }),
    mode: createFormControl("", {
      required: true,
    }),
  });




  createEffect(() => {
    $ = go.GraphObject.make; // untuk mendefinisikan template
    myDiagram =
      $(go.Diagram, "myDiagramDiv", { // ID dari DIV tempat diagram akan ditampilkan
        initialContentAlignment: go.Spot.Center,
        "undoManager.isEnabled": true, // enable undo & redo
        "animationManager.isEnabled": true,
        "zoomToFit": true,
        "animationManager.initialAnimationStyle": go.AnimationManager.AnimateLocations, // Animasi perubahan lokasi
        "animationManager.duration": 800,
        // "ViewportBoundsChanged": function (e) {
        //   // Mengubah ukuran node dan font berdasarkan skala saat ini
        //   var scale = e.diagram.scale;
        //   myDiagram.nodes.each(function (node) {
        //     var shape = node.findObject("SHAPE");
        //     var text = node.findObject("TEXT");
        //     if (shape && text) {
        //       // Atur ulang ukuran dan stroke sesuai skala
        //       var inverseScale = Math.max(1 / scale, 0.5); // Batasi nilai minimal untuk mencegah terlalu besar
        //       shape.width = 150 * inverseScale;
        //       shape.height = 150 * inverseScale;
        //       shape.strokeWidth = 2 * inverseScale;
        //       // Sesuaikan ukuran font
        //       text.font = `${12 * inverseScale}px sans-serif`;
        //     }
        //   });
        // }
      });
  })



  const layout = (status) => {
    myDiagram.layout = $(go.ForceDirectedLayout, {
      isInitial: status,
      isOngoing: status,
      defaultSpringLength: 100,
      defaultElectricalCharge: 200,
      epsilonDistance: 1,
      defaultElectricalCharge: 100,
      maxIterations: 200,
      infinityDistance: 1000,
      arrangementSpacing: new go.Size(100, 100)
    })

  }
  const FormatData = (person_data, root, clickedNode, rootType = "other", nameType) => {
    const color = rootType === "person" ? "#4aa232" : "#245ac2";
    let angle = 0; // Sudut awal
    const radius = 360; // Jarak dari pusat node induk
    const angleIncrement = (2 * Math.PI) / person_data.length; // Distribusi node secara merata dalam lingkaran

    person_data.forEach(person => {
      for (let prop in person) {
        if (["msisdn", "NO_PESERTA", "INSTANSI", "TANGGAL"].indexOf(prop) === -1) {


          // Menghitung lokasi baru berdasarkan sudut dan radius
          var location = new go.Point(clickedNode.location.x + Math.cos(angle) * radius, clickedNode.location.y + Math.sin(angle) * radius);

          // Menyiapkan data untuk node dan link
          let newData = {
            from: person[prop],
            to: root,
            color,
            type: "person",
            nameType, // Menggunakan nameType sebagai kunci properti dinamis
            childrenLoaded: false,
            everExpanded: false
          };

          if (Array.isArray(person[prop])) {
            person[prop].forEach(element => {
              myDiagram.model.addLinkData({ ...newData, from: element });
              myDiagram.model.addNodeData({ key: element, ...newData, loc: go.Point.stringify(location) });
            });
          } else {
            myDiagram.model.addLinkData(newData);
            myDiagram.model.addNodeData({ key: person[prop], ...newData, loc: go.Point.stringify(location) });
          }

          myDiagram.model.setDataProperty(clickedNode.data, "everExpanded", true);
          myDiagram.model.setDataProperty(clickedNode.data, "color", "#44aacc");

          // Menyesuaikan sudut untuk node berikutnya
          angle += angleIncrement; // Menggunakan peningkatan sudut yang dihitung untuk distribusi merata
        }
      }
    });
  };




  function init() {
    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        {
          locationObjectName: "PORT",
          locationSpot: go.Spot.Top, // location point is the middle top of the PORT
          // toolTip:
          //   $("ToolTip",
          //     $(go.TextBlock, { margin: 4, width: 140 },
          //       new go.Binding("text", "", data => "tester"))
          //   ),
          click: function (e, node) {
            var clickedNode = node.part; // Dapatkan node yang diklik

            // Cek apakah node sudah memiliki children yang dimuat
            if (clickedNode.data.childrenLoaded) {
              console.log("Children already loaded for node", node.data.key);
              return; // Jangan memanggil API jika children sudah dimuat
            }

            if (clickedNode.data.rootType === "person") {
              // Displaying a swal loading indicator before starting the request
              Swal.fire({
                title: 'Loading...',
                text: 'Please wait.',
                allowOutsideClick: false,
                didOpen: () => {
                  Swal.showLoading()
                }
              });


              function removeDuplicates(items, key) {
                const uniqueMap = new Map(items.map(item => [item[key], item]));
                return Array.from(uniqueMap.values());
              }

              // Fungsi untuk memproses tiap tipe data
              async function processData(type, nodeKey) {
                try {
                  const response = await api().get(`/deck-explorer/sna-data-more?type=${type}&keyword=${nodeKey}`);
                  let items = response.data.items[type === "reg_data" ? "reg_data" : "person_data"];
                  let uniqueData = type === "reg_data" ? removeDuplicates(items, 'PENCARIAN') : items;

                  if (uniqueData.length > 0) {
                    let nameType = type === "reg_data" ? "PERSONAL-ID" : "PERSONAL";
                    FormatData(uniqueData, nodeKey, clickedNode, type, nameType);
                    setUpdate(a => ({ ...a, model: true }));
                    return true; // Data ditemukan dan diproses
                  } else {
                    return false; // Data tidak ditemukan
                  }
                } catch (error) {
                  return false; // Terjadi error fetch
                }
              }

              // Fungsi utama untuk mengatur proses data
              async function handleDataProcessing() {
                const regDataResult = await processData("reg_data", node.data.key);
                if (!regDataResult) {
                  // Jika tidak ada data reg_data, coba proses person_data
                  const personDataResult = await processData("person_data", node.data.key);
                  if (!personDataResult) {
                    // Jika tidak ada data person_data, tandai sebagai kegagalan
                    markAsFailure();
                  } else {
                    markAsSuccess(); // person_data berhasil diproses
                  }
                } else {
                  markAsSuccess(); // reg_data berhasil diproses
                }
              }

              // Menandai sukses atau kegagalan
              function markAsSuccess() {
                clickedNode.data.childrenLoaded = true;
                myDiagram.model.setDataProperty(clickedNode.data, "childrenLoaded", true);
                Swal.fire({
                  title: 'Success!',
                  text: 'Data has been loaded successfully.',
                  icon: 'success',
                  confirmButtonText: 'OK'
                });
              }

              function markAsFailure() {
                myDiagram.model.setDataProperty(clickedNode.data, "color", "red");
                Swal.fire({
                  title: 'Error!',
                  text: 'Failed to load any data.',
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
              }

              // Memulai proses data
              handleDataProcessing().catch(() => {
                Swal.fire({
                  title: 'Unexpected Error!',
                  text: 'An unexpected error occurred.',
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
              });



            }

            e.diagram.commandHandler.scrollToPart(node); // Focus view on the clicked node
            e.diagram.centerRect(node.actualBounds);
          }

        },
        $(go.Shape, "Circle",
          {
            name: "SHAPE",
            strokeWidth: 2,
            fill: "#333",
            // Menambahkan binding untuk width dan height berdasarkan totaluniqFrom
          },
          new go.Binding("fill", "color"),
        ),
        $(go.TextBlock,
          { margin: 5, stroke: "white", name: "TEXT", },
          new go.Binding("text", "key")
        ),
        // Menambahkan TreeExpanderButton dengan visibility binding berdasarkan properti 'root'
        $("TreeExpanderButton",
          {
            alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top,
            click: (e, obj) => {
              var node = obj.part;  // get the Node containing this Button
              if (node === null) return;
              e.handled = true;
              expandNode(node);
            }
          }, // Menyesuaikan posisi tombol
          // Binding untuk menentukan visibilitas berdasarkan properti 'root'
          new go.Binding("visible", "", function (node) {
            // Mengecek apakah properti 'root' dari data node adalah true
            return node.data.root === true || node.data.everExpanded;
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
            new go.Binding("visible", "type", function (type) {
              return type !== "person"; // Panel hanya terlihat jika type bukan "person"
            }),
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


    function expandNode(node) {
      var diagram = node.diagram;
      diagram.startTransaction("CollapseExpandTree");

      var data = node.data;
      if (!data.everExpanded && !node.isTreeExpanded) {
        // Mark the node as ever expanded on first expansion
        diagram.model.setDataProperty(data, "everExpanded", true);
      }

      if (node.isTreeExpanded) {
        // Collapse the tree at this node
        diagram.commandHandler.collapseTree(node);

        // Hide children nodes
        setChildrenVisibility(node, false);
      } else {
        // Expand the tree at this node
        diagram.commandHandler.expandTree(node);

        // Show children nodes
        setChildrenVisibility(node, true);
      }

      diagram.commitTransaction("CollapseExpandTree");
    }

    function setChildrenVisibility(node, isVisible) {
      var diagram = node.diagram;
      var key = node.data.key;
      // Iterate through all nodes to find and update the visibility of children
      diagram.nodes.each(function (n) {
        if (n.data.parent === key) {
          // Use 'isVisible' property or direct visibility setting as per your requirement
          diagram.model.setDataProperty(n.data, "isVisible", isVisible);

          // Alternatively, if using direct visibility setting without binding:
          // n.visible = isVisible;
        }
      });
    }

    // Template untuk link dengan strokeWidth yang menyesuaikan berdasarkan totaluniq
    myDiagram.linkTemplate =
      $(go.Link, { routing: go.Link.Normal, curve: go.Link.Bezier },
        $(go.Shape, // Ini untuk garis link
          {
            cursor: "pointer",
            toolTip: Tolltip().toolTip
          },
          new go.Binding("stroke", "", function (data) {
            // Jika color ada di data, gunakan itu sebagai warna stroke
            if (data.color) return data.color;

            // Jika tidak, hitung warna berdasarkan totaluniqFrom
            const blueIntensity = Math.min(255, 100 + data.totaluniqFrom * 15);
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
            segmentFraction: 2,
            segmentOrientation: go.Link.OrientUpright45,
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
            new go.Binding("text", "", (data) => {
              return data.totaluniqFrom ? data.totaluniqFrom : data.nameType
            }))
        )
      );


    myDiagram.addModelChangedListener(function (e) {
      if (e.isTransactionFinished) { // Periksa apakah transaksi telah selesai
        // Mendapatkan semua perubahan yang terjadi selama transaksi
        var txn = e.object; // Transaksi

        if (txn?.name === "Initial Layout") {
          setUpdate(a => ({
            ...a,
            model: false
          }))
        } else {
          setUpdate(a => ({
            ...a,
            redo: myDiagram.commandHandler.canRedo(),
            model: myDiagram.commandHandler.canUndo()
          }))
        }

      }
    });



  }

  createEffect(() => {
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
      everExpanded: false,
      rootType: "person",
      totalDuration: totalDurationPerBNumber.get(a[data().config.parent]),
      totaluniq: aNumberCounts.get(a[data().config.root]) // Total kemunculan ANUMBER di rawData
    }));

    // Menambahkan node yang unik dari data link yang mungkin belum termasuk
    uniqueLinkData.forEach(link => {
      if (!nodes.some(node => node.key === link.from)) {
        nodes.push({
          key: link.from,
          everExpanded: false,
          items: link.items,
          rootType: "person",
          totaluniq: bNumberCounts.get(link.from),
          totalDuration: totalDurationPerBNumber.get(link.from),
        });
      }
    });


    setItmes(() => ({
      node: nodes,
      linkData: uniqueLinkData,
      modelData: data().modelData
    }))

    onCleanup(() => {
      setItmes(() => ({
        node: [],
        linkData: [],
        modelData: null
      }))
    })
  })

  createEffect(() => {
    console.log(items())
    setTimeout(() => {
      if (items()?.modelData) {
        myDiagram.model = go.Model.fromJson(items().modelData);
        layout(false)
      } else {
        layout(true)
        myDiagram.model = new go.GraphLinksModel(items().node, items().linkData)
      }
    }, 200);

  })

  createEffect(() => {
    init();
    function adjustNodeLocations() {
      myDiagram.nodes.each(function (node) {
        // Periksa apakah data node memiliki informasi lokasi yang disimpan
        if (node.data.location) {
          // Jika ya, sesuaikan lokasi node
          var loc = go.Point.parse(node.data.location); // Pastikan lokasi adalah format yang benar
          node.location = loc;
        }
      });
    }

    // Panggil adjustNodeLocations setelah diagram selesai melakukan layout
    myDiagram.addDiagramListener("LayoutCompleted", function (e) {
      adjustNodeLocations();
    });
  });





  const onRedo = () => {
    if (myDiagram.commandHandler.canRedo()) {
      myDiagram.commandHandler.redo();
    }

  }

  const onUndo = () => {
    if (myDiagram.commandHandler.canUndo()) {
      myDiagram.commandHandler.undo();
    } else {
      setUpdate(a => ({ ...a, model: false }))
    }
    myDiagram.commandHandler.undo();
  }

  function calculateDynamicScale(desiredWidth = 3840, desiredHeight = 2160) {
    var nodeCount = myDiagram.model.nodeDataArray.length;
    var bounds = myDiagram.documentBounds;
    var averageAreaPerNode = (bounds.width * bounds.height) / nodeCount; // Asumsi kesederhanaan
    var desiredArea = desiredWidth * desiredHeight;
    var scale = Math.sqrt(desiredArea / (nodeCount * averageAreaPerNode)); // Akar kuadrat untuk menyesuaikan area

    return scale;
  }

  function exportDiagramToFullHDPNG(resolution, name) {
    myDiagram.makeImageData({
      scale: calculateDynamicScale(resolution.width, resolution.height),
      background: "white",
      maxSize: new go.Size(Infinity, Infinity),
      returnType: "blob",
      callback: function (blob) {
        // Buat URL dari blob dan trigger download atau tampilkan di UI
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = `Diagram - ${name}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    });
  }


  function exportDiagramToHighResPDF(resolution, name) {
    myDiagram.makeImageData({
      scale: calculateDynamicScale(resolution.width, resolution.height),
      background: "white",
      maxSize: new go.Size(Infinity, Infinity),  // Sesuaikan untuk batas ukuran gambar
      returnType: "blob",
      callback: function (blob) {
        // Proses blob untuk konversi ke base64 atau langsung ke PDF seperti sebelumnya
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          var base64data = reader.result;
          var pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [resolution.width, resolution.height] // Atur ukuran dokumen PDF sesuai target resolusi
          });
          pdf.addImage(base64data, 'PNG', 0, 0, resolution.width, resolution.height);
          pdf.save(`Diagram - ${name}.pdf`);
        }
      }
    });
  }

  const onExport = (e) => {
    e.preventDefault()
    const value = group.value
    const resolution = value.resolution.split("x")
    if (value.mode === "pdf") {
      exportDiagramToHighResPDF({ width: resolution[0], height: resolution[1] }, value.resolution)
    } else {
      exportDiagramToFullHDPNG({ width: resolution[0], height: resolution[1] }, value.resolution)
    }
  }



  useBeforeLeave(() => {
    if (update().model) {
      Swal.fire({
        title: 'Warning!',
        text: 'Are you sure you want to continue?',
        icon: 'warning',
        confirmButtonText: 'OK',
        cancelButtonText: "CANCEL"
      }).then(a => {
        console.log(a)
      })


      // const data2 = myDiagram.model.toJson();
      // api().put(`/deck-explorer/sna-update?id=${data().id}`, {
      //   modelData: data2
      // }).then(response => {
      //   Swal.fire({
      //     title: 'Success!',
      //     text: 'Data has been saved successfully.',
      //     icon: 'success',
      //     confirmButtonText: 'OK'
      //   })

      // }).catch(error => {
      //   // Tampilkan notifikasi error
      //   Swal.fire({
      //     title: 'Error!',
      //     text: 'Failed to save data.',
      //     icon: 'error',
      //     confirmButtonText: 'OK'
      //   })
      // });
    }
  })


  return (
    <div className="w-full h-full relative">
      <div id="myDiagramDiv" className="w-full h-full"></div>
      <div className="absolute left-0 top-0 z-10 flex gap-3">

        <div>
          {update().model &&
            <>
              <Button onClick={onUndo} color="info" variant="contained" startIcon={<Undo></Undo>}>UNDO</Button>
              {update().redo && <Button onClick={onRedo} color="info" variant="contained" startIcon={<Redo></Redo>}>REDO</Button>
              }
            </>
          }
          <Button onClick={() => setUpdate(a => ({ ...a, export: true }))} color="secondary" variant="contained" startIcon={<Download></Download>}>EXPORT</Button>
        </div>

      </div>


      <Dialog
        open={update().export}
        onClose={() => {
          setUpdate(a => ({ ...a, export: false }))
        }}
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '.MuiPaper-root': {
            bgcolor: "#111"
          }
        }}
      >
        <form onSubmit={onExport}>
          <DialogTitle id="alert-dialog-title">
            {"SETTINGS EXPORT"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{
              color: "white"
            }}>
              <div className="grid gap-4">
                <div>
                  <Tags label={"RESOLUTION"}></Tags>
                  <select value={group.controls.resolution.value} required={group.controls.resolution.isRequired} onChange={(e) => group.controls.resolution.setValue(e.target.value)} className="bg-primarry-2 w-full p-2">
                    <option value="">Select Resolution</option>
                    <option value="1280x720">HD - 1280x720</option>
                    <option value="1920x1080">Full HD - 1920x1080</option>
                    <option value="2560x1440">2K - 2560x1440</option>
                    <option value="3840x2160">4K - 3840x2160</option>
                    <option value="7680x4320">8K - 7680x4320</option>
                  </select>
                </div>
                <div>
                  <Tags label={"MODE"}></Tags>
                  <select value={group.controls.mode.value} required={group.controls.mode.isRequired} onChange={(e) => group.controls.mode.setValue(e.target.value)} className="bg-primarry-2 w-full p-2">
                    <option value="">Select Mode</option>
                    <option value={"pdf"}>PDF</option>
                    <option value={"image"}>IMAGE</option>
                  </select>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdate(a => ({ ...a, export: false }))} color="error">Cancel</Button>
            <Button type="submit">Download</Button>
          </DialogActions>
        </form>
      </Dialog>

    </div>
  );
};
