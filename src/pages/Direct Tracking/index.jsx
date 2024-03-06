import ContainerPages from ".."
import { CardBox } from "../../component/cardBox"
import { createEffect, createSignal, onMount } from "solid-js";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { Tags } from "../../component/tags";
import { CardFrame } from "../../component/cardFrame";
import { DefaultInput } from "../../component/form/input";
import { createFormControl, createFormGroup } from "solid-forms";
import { api } from "../../helper/_helper.api";
import moment from "moment";
import Swal from "sweetalert2";
import { Button, Chip, Divider, IconButton } from "@suid/material";
import { notify } from "../../component/notify";
import axios from "axios";

import io from "socket.io-client"
import { Circle } from "@suid/icons-material";


let maps

const DirectTracking = () => {
    const [isLoad, setIsload] = createSignal(false)

    var LeafIcon = L.Icon.extend({
        options: {
            iconSize: [48, 48],
            iconAnchor: [15, 0],
            popupAnchor: [0, -0]
        }
    });

    let socket

    createEffect(() => {
        socket = io('http://192.168.1.123:8080');

        socket.on("connect", () => {
            console.log("Connected to the server");


        });

        socket.on("target-ping-response", async (ping) => {
            console.log(ping);
            if (ping === "TARGET ONLINE") {
                setload(false);
                Swal.fire({
                    icon: "success",
                    title: "Target Available!",
                    confirmButtonText: "Search for Target Location",
                    timer: 4000,
                    timerProgressBar: true,
                    didClose: async () => {
                        let swalProgress = Swal.fire({
                            title: 'Searching for target location...',
                            html: 'Please wait...',
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });
                        try {
                            const { search } = group.value;
                            const data = { keyword: search };
                            const response = await api().post("/checkpos/search", data);
                            const { keyword, response: [res] } = response.data.data;
                            swalProgress.close();

                            // Add marker to the map for the target
                            L.marker([res.lat, res.long], { icon: greenIcon }).addTo(maps)
                                .bindPopup(html(keyword, res))
                                .openPopup();

                            // Success notification
                            Swal.fire({
                                icon: "success",
                                title: "Success!",
                                text: "Target location successfully found.",
                                didClose: () => {
                                    setload(false);
                                    group.controls.search.setValue("");
                                }
                            });
                        } catch (error) {
                            swalProgress.close();
                            Swal.fire({
                                icon: "error",
                                title: "Error!",
                                text: "Target location could not be found."
                            });
                        }

                    }
                });
            } else {
                // Handle inactive target number
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "The target number is inactive or unavailable."
                });

                setload(false);
            }
        });

    })



    let greenIcon = new LeafIcon({ iconUrl: "./assets/marker.png" })

    const [items, setData] = createSignal(null)


    function buildMap(div) {
        maps = L.map(div).setView([-6.200000, 106.816666], 7);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
            attribution: '',

        }).addTo(maps);

        L.control.scale({ maxWidth: 100, metric: true, imperial: false }).addTo(maps);



    }

    var circle;
    var drawingCircle = false;
    var moved = false;

    // Fungsi untuk menginisialisasi proses gambar lingkaran
    function activateCircleDraw() {
        if (circle) {
            maps.removeLayer(circle);
            circle = null
        }

        if (document.getElementById('dynamicTooltip')) {
            document.getElementById('dynamicTooltip').style.display = "none"
        }
        if (drawingCircle) return;
        drawingCircle = true;
        maps.dragging.disable();
        maps.scrollWheelZoom.disable();
        maps.doubleClickZoom.disable();
        moved = false; // Reset moved flag

        maps.on('mousedown', onMouseDown);
        maps.on('mouseup', onMouseUp);
    }

    // Fungsi yang dijalankan ketika mouse ditekan
    function onMouseDown(e) {
        moved = false; // Reset moved flag
        var startLatLng = e.latlng;
        maps.on('mousemove', onMouseMove);

        // Membuat elemen tooltip jika belum ada
        if (!document.getElementById('dynamicTooltip')) {
            var tooltip = document.createElement('div');
            tooltip.id = 'dynamicTooltip';
            tooltip.style.position = 'absolute';
            tooltip.style.color = "#444";
            tooltip.style.zIndex = "9999";
            tooltip.style.fontSize = "14px";
            tooltip.style.backgroundColor = 'white';
            tooltip.style.padding = '3px 6px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.border = '1px solid #ddd';
            tooltip.style.display = 'none'; // Sembunyikan dulu tooltipnya
            document.body.appendChild(tooltip);
        }

        // Fungsi yang dijalankan ketika mouse bergerak
        function onMouseMove(e) {
            moved = true;

            var radius = startLatLng.distanceTo(e.latlng);
            var radiusInKm = (radius / 1000).toFixed(2);
            if (circle) {
                maps.removeLayer(circle);
            }
            circle = L.circle(startLatLng, { radius: radius }).addTo(maps);

            // Perbarui dan tampilkan tooltip
            if (circle) {
                var tooltip = document.getElementById('dynamicTooltip');
                tooltip.style.display = 'block';
                tooltip.innerHTML = "Radius: " + radiusInKm + " km";
                tooltip.style.left = e.originalEvent.clientX + 15 + 'px'; // Menyesuaikan posisi tooltip
                tooltip.style.top = e.originalEvent.clientY + 15 + 'px';
            }
        }
    }

    function getAreaInfo(lat, lng) {
        var url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data); // Data berisi informasi lokasi, termasuk nama wilayah, kota, dll.
                alert(`Wilayah: ${data.address.suburb}, Kota: ${data.address.city}`);
            })
            .catch(error => console.error('Error:', error));
    }

    // Fungsi yang dijalankan ketika mouse dilepas
    function onMouseUp() {
        if (!moved && circle) {
            maps.removeLayer(circle);
        }
        maps.off('mousemove');
        maps.dragging.enable();
        maps.scrollWheelZoom.enable();
        maps.doubleClickZoom.enable();
        drawingCircle = false;
        // Sembunyikan tooltip
        var tooltip = document.getElementById('dynamicTooltip');
        if (tooltip) tooltip.style.display = 'none';

        if (circle && moved) {
            var radiusInKm = (circle.getRadius() / 1000).toFixed(2);
            circle.bindTooltip("Radius: " + radiusInKm + " km").openTooltip();
        }

        // if (circle && moved) {
        //     var center = circle.getLatLng();
        //     getAreaInfo(center.lat, center.lng);
        // }

        maps.off('mousedown', onMouseDown); // Cleanup
        maps.off('mouseup', onMouseUp); // Cleanup
    }

    createEffect(() => {
        document.addEventListener('mousemove', function (e) {
            if (circle && drawingCircle) {
                var tooltip = document.getElementById('dynamicTooltip');
                if (tooltip.style.display !== 'block') {
                    tooltip.style.display = 'block';
                }
                tooltip.style.left = e.clientX + 15 + 'px';
                tooltip.style.top = e.clientY + 15 + 'px';
            }
        });
    })

    let mapDiv

    onMount(() => buildMap(mapDiv));

    const group = createFormGroup({
        search: createFormControl("", {
            required: true,
        }),
    });


    const [load, setload] = createSignal(false)

    const html = (keyword, res) => {
        function myFunction() {
            // Put whatever code you want to run when the div is clicked here.
            window.api.invoke("new_browser", res.maps)
        }


        return <div class="grid gap-2 relative text-[14px] overflow-auto">
            <div class="flex gap-2">
                <div class="font-bold">MSIDN</div>
                <div>{keyword}</div>
            </div>
            <div class="flex gap-2">
                <div class="font-bold">ALAMAT</div>
                <div>{res.address}</div>
            </div>

            <div class="flex gap-2">
                <div class="font-bold">DEVICE:</div>
                <div>{res.device}</div>
            </div>
            <div class="flex gap-2">
                <div class="font-bold">PROVIDER:</div>
                <div>{res.provider}</div>
            </div>
            <div class="flex gap-2">
                <div class="font-bold">IMEI:</div>
                <div>{res.imei}</div>
            </div>
            <div class="flex gap-2">
                <div class="font-bold">IMSI:</div>
                <div>{res.imsi}</div>
            </div>
            <div class="flex gap-2 cursor-pointer" onClick={myFunction}>
                <div class="font-bold">MAPS:</div>
                <div class=" text-blue-400">{res.maps}</div>
            </div>
        </div>
    }




    const onSubmit = async (e) => {
        e.preventDefault();

        const { search } = group.value;
        setload(true);

        try {
            // Request to check if the target is online
            await axios.get(`http://localhost:8080/target/+${search}`);

            // Listen for a response once to avoid multiple triggers

        } catch (error) {
            if (/^62\d{10,15}$/.test(search)) {
                // Handle invalid number format
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "The number is not found or might be switched off."
                });
            } else {
                // Handle case when the input does not follow the Indonesian country code format
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Invalid number format. Please use the Indonesian country code format (e.g., 6287654321)."
                });
            }

            setload(false);
        }
    };

    createEffect(() => {
        setIsload(false)
        api().get("/checkpos/search").then(d => {
            setData(d.data.items)
            setIsload(true)
        })
        load()
    })

    function moveToLocation(latitude, longitude) {
        var newCenter = L.latLng(latitude, longitude);
        maps.panTo(newCenter);
        setTimeout(() => {
            maps.setView([latitude, longitude], 15);
        }, 500);
    }


    const marker = (data, keyword) => {
        let items = data[0]
        let res = items.response[0]


        L.marker([res.lat, res.long], { icon: greenIcon }).addTo(maps)
            .bindPopup(html(keyword, res))
            .openPopup();

        moveToLocation(res.lat, res.long)

        setTimeout(() => {
            if (items.active) {
                maps.eachLayer(function (layer) {
                    if (!!layer.toGeoJSON) {
                        maps.removeLayer(layer);
                    }
                });
            }
        }, 500);


    }


    return <ContainerPages>
        <div className="flex flex-1 flex-col py-4">
            <CardBox className="grid grid-cols-9 flex-1 gap-4">
                <form onSubmit={onSubmit} className="col-span-3 border-r-2 pr-4 border-primarry-2 flex flex-1 flex-col">
                    <Tags label="CHECK POS MSISDN"></Tags>
                    <DefaultInput loading={load} type={"number"} placeholder={"MSISDN"} control={group.controls.search}></DefaultInput>
                    <div className="relative flex flex-col flex-1">
                        <Tags label="HISTORY CHECK POST "></Tags>
                        <div className='flex flex-col relative flex-1'>
                            <div className="px-4 space-y-4 absolute w-full h-full left-0 top-0 overflow-auto">
                                {items() ? items().length === 0 ? "Data Not Found" : items()?.map((d, i) => {
                                    return <div>
                                        <div className="flex justify-between items-center border pr-2 border-primarry-2">
                                            <div className="flex gap-2">
                                                <Button onClick={() => {

                                                    let x = items().filter(s => d._id === s._id)

                                                    marker(x, d.keyword, d.active)


                                                    setData(a => a.map(s => ({
                                                        ...s,
                                                        active: d._id === s._id && !s.active
                                                    })
                                                    ))

                                                }}
                                                    // endIcon={d.active ? <KeyboardArrowUp></KeyboardArrowUp> : <KeyboardArrowDown fontSize="small"></KeyboardArrowDown>}
                                                    startIcon={<PinDrop></PinDrop>}
                                                >
                                                    {d.keyword}
                                                </Button>
                                            </div>
                                            <div> {moment(d.timestamp).format("D/M/YY | HH:MM:SS")}</div>
                                        </div>
                                        <div className={d.active ? "bg-[#1e1e1e] p-2" : ""}>
                                            <Collapse value={d.active} class="transition">
                                                {d.response.map((d, i) => {
                                                    return <div>
                                                        <Tags label={`CEK POS ${i + 1}x`}></Tags>
                                                        <div className="space-y-2">
                                                            <div className="text-xs grid grid-cols-5 items-center">
                                                                <div>
                                                                    ADDRESS
                                                                </div>
                                                                <div className="col-span-4" title={d.address}>
                                                                    <Chip title={d.address} icon={
                                                                        <IconButton onClick={() => {
                                                                            copyTextToClipboard(d.address)
                                                                        }} size="small"><ContentCopy fontSize="small"></ContentCopy></IconButton>
                                                                    } label={d.address} sx={{
                                                                        borderRadius: 0
                                                                    }} color="secondary"></Chip>
                                                                </div>
                                                            </div>
                                                            <Divider sx={{
                                                                borderColor: "#444"
                                                            }}></Divider>
                                                            <div className="text-xs grid grid-cols-5 items-center">
                                                                <div className="uppercase">
                                                                    network
                                                                </div>
                                                                <div className="col-span-4" title={d.network}>
                                                                    <Chip label={d.network} sx={{
                                                                        borderRadius: 0
                                                                    }} color="secondary"></Chip>
                                                                </div>
                                                            </div>
                                                            <Divider sx={{
                                                                borderColor: "#444"
                                                            }}></Divider>
                                                            <div className="text-xs grid grid-cols-5 items-center">
                                                                <div className="uppercase">
                                                                    lat
                                                                </div>
                                                                <div className="col-span-4" title={d.lat}>
                                                                    <Chip label={d.lat} sx={{
                                                                        borderRadius: 0
                                                                    }} color="secondary"></Chip>
                                                                </div>
                                                            </div>
                                                            <Divider sx={{
                                                                borderColor: "#444"
                                                            }}></Divider>
                                                            <div className="text-xs grid grid-cols-5 items-center">
                                                                <div className="uppercase">
                                                                    long
                                                                </div>
                                                                <div className="col-span-4" title={d.long}>
                                                                    <Chip label={d.long} sx={{
                                                                        borderRadius: 0
                                                                    }} color="secondary"></Chip>
                                                                </div>
                                                            </div>
                                                            <Divider sx={{
                                                                borderColor: "#444"
                                                            }}></Divider>
                                                            <div className="text-xs grid grid-cols-5 items-center">
                                                                <div className="uppercase">
                                                                    maps
                                                                </div>
                                                                <div className="col-span-4">
                                                                    <Chip title={d.maps} icon={
                                                                        <IconButton onClick={() => {
                                                                            copyTextToClipboard(d.maps)
                                                                        }} size="small"><ContentCopy fontSize="small"></ContentCopy></IconButton>
                                                                    } label={
                                                                        <div className="underline text-blue-300 cursor-pointer " onClick={() => {
                                                                            window.api.invoke("new_browser", d.maps)
                                                                        }}>{d.maps}</div>
                                                                    } sx={{
                                                                        borderRadius: 0
                                                                    }} color="secondary"></Chip>
                                                                </div>
                                                            </div>
                                                            <Divider sx={{
                                                                borderColor: "#444"
                                                            }}></Divider>
                                                            <div className="text-xs grid grid-cols-5 items-center">
                                                                <div className="uppercase">
                                                                    device
                                                                </div>
                                                                <div className="col-span-4" title={d.device}>
                                                                    <Chip label={d.device} sx={{
                                                                        borderRadius: 0
                                                                    }} color="secondary"></Chip>
                                                                </div>
                                                            </div>
                                                            <Divider sx={{
                                                                borderColor: "#444"
                                                            }}></Divider>
                                                            <div className="text-xs grid grid-cols-5 items-center">
                                                                <div className="uppercase">
                                                                    imei
                                                                </div>
                                                                <div className="col-span-4" title={d.imei}>
                                                                    <Chip label={d.imei} sx={{
                                                                        borderRadius: 0
                                                                    }} color="secondary"></Chip>
                                                                </div>
                                                            </div>
                                                            <Divider sx={{
                                                                borderColor: "#444"
                                                            }}></Divider>
                                                            <div className="text-xs grid grid-cols-5 items-center">
                                                                <div className="uppercase">
                                                                    imsi
                                                                </div>
                                                                <div className="col-span-4" title={d.imsi}>
                                                                    <Chip label={d.imsi} sx={{
                                                                        borderRadius: 0
                                                                    }} color="secondary"></Chip>
                                                                </div>
                                                            </div>


                                                        </div>
                                                    </div>
                                                })}
                                            </Collapse>
                                        </div>
                                    </div>
                                }) : "Loading..."}
                            </div>
                        </div>

                    </div>
                </form>
                <div className="flex flex-col flex-1 col-span-6">
                    <Tags label="LOCATION SOURCE"></Tags>
                    <CardFrame isLoading={isLoad} title={"MAPS"} className="flex-1 !p-0 flex flex-col">
                        <div className="flex-1">
                            <div className="w-full h-full relative">
                                <div ref={mapDiv} className="w-full h-full"></div>
                                <div className="absolute right-0 top-0 p-4 z-[1000]">
                                    <div className="bg-white p-1">
                                        <Button variant="contained" color="secondary" onClick={activateCircleDraw}>
                                            <svg fill="white" stroke="white" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M760-600v-160H600v-80h240v240h-80ZM120-120v-240h80v160h160v80H120Zm0-320v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 640v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80v80h-80Zm160 0v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Z" /></svg>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardFrame>
                </div>
            </CardBox>
        </div>
    </ContainerPages>
}

export default DirectTracking