import ContainerPages from "../.."
import { CardBox } from "../../../component/cardBox"
import { createEffect, createSignal, onMount } from "solid-js";
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

let maps

const GeoFecingAdd = () => {
    const [isLoad, setIsload] = createSignal(false)

    const [items, setData] = createSignal(null)
    const [polygonPoints, setPolygonPoints] = createSignal([]);

    const [open, setOpen] = createSignal({
        showSchedule: true,
        openPopup: false
    });


    const handleClose = () => {
        setOpen(a => ({
            ...a,
            openPopup: false
        }));
    };

    const handleSchedule = (d) => {
        setOpen(a => ({
            ...a,
            showSchedule: d
        }))
    }

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

    let polygon;

    // Fungsi untuk menambahkan titik ke poligon dan mengupdate state
    function addPointToPolygon(latlng) {
        setPolygonPoints([...polygonPoints(), latlng]);
        updatePolygon(maps, polygon, polygonPoints());
    }

    function updatePolygon(map, polygon, points) {
        if (polygon) {
            map.removeLayer(polygon);
        }
        polygon = L.polygon(points, {
            color: '#3b82f6c4',
            fillColor: '#3b82f6c4',
            fillOpacity: 0.5,
        }).addTo(map);
    }

    // Listener untuk menambahkan titik ke poligon ketika peta diklik
    createEffect(() => {
        maps.on('click', function (e) {
            addPointToPolygon(e.latlng);
        });
    })


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
            <CardBox className="grid grid-cols-9 flex-1 gap-4" title={"Add Schedule Target Geofencing"}>
                <form onSubmit={onStartTracking} className="col-span-2 border-r-2 pr-4 border-primarry-2 flex flex-1 flex-col">
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
                                <FormControl>

                                    {/* <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue={group.controls.interval.value}
                                        onChange={(d) => group.controls.interval.setValue(d.target.value)}
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel
                                            value="0"
                                            control={() => <Radio />}
                                            label="Disabled"
                                        />

                                        <FormControlLabel
                                            value="5"
                                            control={() => <Radio />}
                                            label="5 Second"
                                        />
                                        <FormControlLabel
                                            value="10"
                                            control={() => <Radio />}
                                            label="10 Second"
                                        />
                                        <FormControlLabel value="15" control={() => <Radio />} label="15 Second" />
                                        <FormControlLabel
                                            value="30"
                                            control={() => <Radio />}
                                            label="30 Second"
                                        />
                                    </RadioGroup> */}
                                </FormControl>
                            </div>

                        </div>}

                    </div>
                </form>
                <div className="flex flex-col flex-1 col-span-6">
                    <Tags label="LOCATION SOURCE"></Tags>
                    <CardFrame isLoading={isLoad} title={"MAPS"} className="flex-1 !p-0 flex flex-col">
                        <div className="flex-1">
                            <div className="w-full h-full relative">
                                {/* <iframe className="w-full h-full" src="http://localhost:5000/serve-html/0"></iframe> */}
                                <div ref={mapDiv} className="w-full h-full"></div>
                                <div className="absolute right-0 top-0 p-4 z-[1000]">
                                    <div className="p-1">
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

    </ContainerPages >
}

export default GeoFecingAdd