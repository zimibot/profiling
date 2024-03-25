import ContainerPages from "../.."
import { CardBox } from "../../../component/cardBox"
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import L from 'leaflet';
import 'leaflet-semicircle';
import 'leaflet-control-geocoder';
import 'leaflet.featuregroup.subgroup'
import 'leaflet.fullscreen'
import 'leaflet.locatecontrol'
import "leaflet/dist/leaflet.css";
import { Tags } from "../../../component/tags";
import { CardFrame } from "../../../component/cardFrame";
import { DefaultInput } from "../../../component/form/input";
import { createFormControl, createFormGroup } from "solid-forms";
import { api } from "../../../helper/_helper.api";
import moment from "moment";
import Swal from "sweetalert2";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Switch,
    DialogContentText,
    DialogTitle, Chip, Divider, IconButton, Input, FormControlLabel, FormControl, RadioGroup, FormLabel, Radio
} from "@suid/material";
import axios from "axios";

import io from "socket.io-client"
import MenuTracking from "../menuTracking";
import { useLocation } from "@solidjs/router";
import { Circle, CircleOutlined, Close, PolylineOutlined } from "@suid/icons-material";

let maps

const GeoFecingAdd = () => {
    const [isLoad, setIsload] = createSignal(false)

    const [items, setData] = createSignal(null)
    const [polygonPoints, setPolygonPoints] = createSignal([]);
    const [polygons, setPolygons] = createSignal([]);
    const [isAddingPolygon, setIsAddingPolygon] = createSignal(false);
    const [tempPolygon, setTempPolygon] = createSignal(null); // Menyimpan referensi polygon sementara
    const [open, setOpen] = createSignal({
        showSchedule: true,
        openPopup: false
    });


    const location = useLocation()
    const group = createFormGroup({
        search: createFormControl(location.pathname.split("/").pop(), {
            required: true,
        }),
        title: createFormControl("", { required: true }),
        startDate: createFormControl("", { required: true }),
        startTime: createFormControl("", { required: true }),
        endDate: createFormControl("", { required: true }),
        endTime: createFormControl("", { required: true }),
        interval: createFormControl("")
    });

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

                            L.marker([res.lat, res.long], { icon: greenIcon }).addTo(maps)
                                .bindPopup(html(keyword, res))
                                .openPopup();

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

    createEffect(() => {
        console.log(polygons())
    })

    let greenIcon = new LeafIcon({ iconUrl: "./assets/marker.png" })

    function buildMap(div) {
        maps = L.map(div, {
            center: [-6.28599, 106.99646000000001],
            crs: L.CRS.EPSG3857,
            zoom: 14,
            zoomControl: true,
            preferCanvas: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
            attribution: '',

        }).addTo(maps);

        L.control.scale({ maxWidth: 100, metric: true, imperial: false }).addTo(maps);



        maps.on('click', (e) => {
            if (isAddingPolygon()) {
                addPointToPolygon(e.latlng);
            }
        });

        onCleanup(() => maps.off('click'));


    }

    var circle;
    var drawingCircle = false;
    var moved = false;

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

    function addPointToPolygon(latlng) {
        setPolygonPoints(points => [...points, latlng]);
        updateTempPolygon([...polygonPoints(), latlng]);
    }


    function updateTempPolygon(points) {
        if (tempPolygon()) {
            maps.removeLayer(tempPolygon());
        }
        const newPolygon = L.polygon(points, {
            color: '#3b82f6c4',
            fillColor: '#3b82f6c4',
            fillOpacity: 0.5,
        }).addTo(maps);
        setTempPolygon(newPolygon);
    }

    // Toggle mode penambahan polygon
    const toggleAddPolygonMode = () => {
        if (!isAddingPolygon()) {
            setIsAddingPolygon(true);
        } else {
            setIsAddingPolygon(false);
            if (polygonPoints().length > 2) {
                savePolygon();
                setPolygonPoints([]);
                if (tempPolygon()) {
                    maps.removeLayer(tempPolygon());
                    setTempPolygon(null);
                }
            }
        }
    };
    // Menyimpan polygon yang telah dibuat ke dalam state
    function savePolygon() {
        const newPolygon = L.polygon(polygonPoints(), {
            color: '#3b82f6c4',
            fillColor: '#3b82f6c4',
            fillOpacity: 0.5,
        }).addTo(maps);

        setPolygons([...polygons(), { polygon: newPolygon, title: `Polygon ${polygons().length + 1}` }]);
    }

    // Fungsi untuk menghapus polygon
    function deletePolygon(index) {
        const updatedPolygons = polygons().filter((_, i) => i !== index);
        maps.removeLayer(polygons()[index].polygon); // Hapus polygon dari map
        setPolygons(updatedPolygons);
    }


    const [load, setload] = createSignal(false)


    const onSubmit = async (e) => {
        e.preventDefault();

        const { search } = group.value;
        // setload(true);



        if (/^62\d{10,15}$/.test(search)) {
            // Handle invalid number format
            setOpen(a => ({
                ...a,
                openPopup: true
            }))
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Invalid number format. Please use the Indonesian country code format (e.g., 6287654321)."
            });

        }


        // try {
        //     // Request to check if the target is online
        //     await axios.get(`http://localhost:8080/target/+${search}`);

        //     // Listen for a response once to avoid multiple triggers

        // } catch (error) {

        //     console.log(error)
        //     if (/^62\d{10,15}$/.test(search)) {
        //         // Handle invalid number format
        //         Swal.fire({
        //             icon: "error",
        //             title: "Oops...",
        //             text: "The number is not found or might be switched off."
        //         });
        //     } else {
        //         // Handle case when the input does not follow the Indonesian country code format
        //         Swal.fire({
        //             icon: "error",
        //             title: "Oops...",
        //             text: "Invalid number format. Please use the Indonesian country code format (e.g., 6287654321)."
        //         });
        //     }

        //     setload(false);
        // }
    };

    createEffect(() => {
        setIsload(false)
        api().get("/checkpos/position").then(d => {
            setData(d.data.items)
            setIsload(true)
        })
        load()
    })



 

    const onStartTracking = async (e) => {
        e.preventDefault();

        let value = group.value;

        value = {
            ...value,
            keyword: value.search
        };


        if (/^62\d{10,15}$/.test(value.search)) {
            // Handle invalid number format

        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Invalid number format. Please use the Indonesian country code format (e.g., 6287654321)."
            });

        }

        setload(true)
        try {
            let data = await api().post("/checkpos/position", value);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Your tracking has started successfully.',
                confirmButtonText: 'Great!'
            });

            setOpen(a => ({ ...a, openPopup: false }))

            setload(false)
            // If you also want to show a success message with SweetAlert2, you can do it here.
        } catch (error) {
            console.log(error);
            // Display error message using SweetAlert2
            setload(false)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: `<div class="text-red-500">${error.response?.data?.message}</div>` || 'Please try again later.'
            });
        }
    };


    return <ContainerPages>
        <MenuTracking></MenuTracking>
        <div className="flex flex-1 flex-col py-2">
            <CardBox className="flex flex-1 gap-4" title={"Add Scheduled Tracking"}>
                <form onSubmit={onStartTracking} className="w-[450px] border-r-2 pr-4 border-primarry-2 flex  flex-col">
                    <div className={`grid ${open().showSchedule ? "grid-cols-1" : ""}  gap-2`}>
                        <div className="flex flex-col gap-4">
                            <div>
                                <Tags label="TITLE TARGET"></Tags>
                                <Input value={group.controls.title.value} required={group.controls.title.isRequired} onChange={a => group.controls.title.setValue(a.target.value)} class="bg-primarry-2 p-1" fullWidth sx={{ color: "white" }}></Input>
                            </div>
                            <div>
                                <Tags label="MSISDN"></Tags>
                                <Input value={group.controls.search.value} required={group.controls.search.isRequired} onChange={a => group.controls.search.setValue(a.target.value)} class=" bg-primarry-2 p-1" fullWidth sx={{ color: "white" }}></Input>
                            </div>
                            {/* <div className="flex gap-4">
                                <Button onClick={() => handleSchedule(false)} color={open().showSchedule ? "secondary" : "info"} variant={!open().showSchedule ? "contained" : "outlined"}>NOW</Button>
                                <Button onClick={() => handleSchedule(true)} color={!open().showSchedule ? "secondary" : "info"} variant={open().showSchedule ? "contained" : "outlined"}>SCHEDULE</Button>
                            </div> */}
                        </div>
                        {open().showSchedule && <div className="flex flex-col gap-4">
                            <div>
                                <Tags label="START TIME DATE"></Tags>
                                <div className="grid grid-cols-2 gap-3">
                                    <Input required={group.controls.startDate.isRequired} value={group.controls.startDate.value} onChange={(d) => group.controls.startDate.setValue(d.target.value)} fullWidth class="bg-primarry-2 p-1" sx={{ color: "white" }} type="date"></Input>
                                    <Input required={group.controls.startTime.isRequired} value={group.controls.startTime.value} onChange={(d) => group.controls.startTime.setValue(d.target.value)} fullWidth class="bg-primarry-2 p-1" sx={{ color: "white" }} type="time"></Input>
                                </div>
                            </div>
                            <div>
                                <Tags label="END TIME DATE"></Tags>
                                <div className="grid grid-cols-2 gap-3">
                                    <Input required={group.controls.endDate.isRequired} value={group.controls.endDate.value} onChange={(d) => group.controls.endDate.setValue(d.target.value)} fullWidth class="bg-primarry-2 p-1" sx={{ color: "white" }} type="date"></Input>
                                    <Input required={group.controls.endTime.isRequired} value={group.controls.endTime.value} onChange={(d) => group.controls.endTime.setValue(d.target.value)} fullWidth class="bg-primarry-2 p-1" sx={{ color: "white" }} type="time"></Input>
                                </div>
                            </div>
                            <div>
                                <Tags label="INTERVAL"></Tags>

                                <select value={group.controls.interval.value} className="w-full p-2 bg-primarry-2" onChange={(d) => group.controls.interval.setValue(d.target.value)}>
                                    <option value={""}>
                                        Select interval
                                    </option>
                                    <option value={"5"}>
                                        5 Seconds
                                    </option>
                                    <option value={"10"}>
                                        10 Seconds
                                    </option>
                                    <option value={"20"}>
                                        20 Seconds
                                    </option>
                                </select>

                            </div>
                            <div>
                                <Button fullWidth variant="contained" color="secondary">SUBMIT</Button>
                            </div>

                        </div>}

                    </div>
                </form>
                <div className="flex flex-col flex-1 col-span-6">
                    <div className="flex gap-2 justify-between py-1">
                        <Tags label="LOCATION SOURCE"></Tags>
                        <div className="flex gap-2 items-center">
                            <span>Tools : </span>
                            <div>
                                <Button variant="contained" color="secondary" onClick={activateCircleDraw}>
                                    <CircleOutlined></CircleOutlined>
                                </Button>
                            </div>
                            <div>
                                <Button variant="contained" color="secondary" onClick={toggleAddPolygonMode}>
                                    {isAddingPolygon() ? 'Stop Adding Polygon' : 'Start Adding Polygon'}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <CardFrame isLoading={isLoad} title={"MAPS"} className="flex-1 !p-0 flex flex-col">
                        <div className="flex-1">
                            <div className="w-full h-full relative">
                                {/* <iframe className="w-full h-full" src="http://localhost:5000/serve-html/0"></iframe> */}
                                <div ref={mapDiv} className="w-full h-full"></div>

                            </div>
                        </div>
                    </CardFrame>
                </div>
                <div className="w-[300px] flex flex-col ">
                    <Tags label="History "></Tags>
                    <CardFrame className={"flex-1"}>
                        <div>
                            <div className="flex justify-between items-center border-b border-primarry-2">
                                <div className="flex gap-2"><PolylineOutlined fontSize="small"></PolylineOutlined>
                                    <span>Polygon Area 10Km</span>
                                </div>
                                <IconButton color="error">
                                    <Close fontSize="small"></Close>
                                </IconButton>
                            </div>
                            <div className="flex justify-between items-center border-b border-primarry-2">
                                <div className="flex gap-2 items-center">
                                    <Circle fontSize="small"></Circle>
                                    <span>Circle Area 20Km</span>
                                </div>
                                <IconButton color="error">
                                    <Close fontSize="small"></Close>
                                </IconButton>
                            </div>
                        </div>
                    </CardFrame>
                </div>
            </CardBox>
        </div>

    </ContainerPages >
}

export default GeoFecingAdd