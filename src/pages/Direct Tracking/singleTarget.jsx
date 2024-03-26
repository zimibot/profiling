import ContainerPages from ".."
import { CardBox } from "../../component/cardBox"
import { createEffect, createSignal, onMount } from "solid-js";
import L from 'leaflet';
import 'leaflet-semicircle';
import 'leaflet-control-geocoder';
import 'leaflet.featuregroup.subgroup'
import 'leaflet.fullscreen'
import 'leaflet.locatecontrol'
import "leaflet/dist/leaflet.css";
import { Tags } from "../../component/tags";
import { CardFrame } from "../../component/cardFrame";
import { DefaultInput } from "../../component/form/input";
import { createFormControl, createFormGroup } from "solid-forms";
import { api } from "../../helper/_helper.api";
import moment from "moment";
import Swal from "sweetalert2";
import { PinDrop } from "@suid/icons-material";
import MenuTracking from "./menuTracking";
import { Button } from "@suid/material";

// import io from "socket.io-client"

let maps

const SingleTarget = () => {
    const [isLoad, setIsload] = createSignal(false)

    const [items, setData] = createSignal(null)
    const [iframeMaps, setIframeMaps] = createSignal(null)

    const [open, setOpen] = createSignal({
        showSchedule: false,
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

    const group = createFormGroup({
        search: createFormControl("", {
            required: true,
        }),
    });




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
    }


    let mapDiv

    onMount(() => buildMap(mapDiv));



    const [load, setload] = createSignal(false)


    createEffect(() => {
        api().get("/checkpos/search").then(s => {
            console.log(s)

            setData(s.data.items)

        })
        load()
    })


    const onSubmit = async (e) => {
        e.preventDefault();

        setload(true);

        const { search } = group.value;
        if (/^62\d{10,15}$/.test(search)) {
            try {
                let data = await api().post("/checkpos/search", { keyword: search });

                // Success notification with location found message


                let result = data.data.items.response[0]
                console.log(result)
                // Onmarker(result)

                Swal.fire({
                    icon: 'success',
                    title: 'Location Found!',
                    text: 'The location details have been successfully retrieved.'
                });

            } catch (error) {
                console.error(error);

                // Notification for API or network error
                Swal.fire({
                    icon: 'error',
                    title: 'Data Retrieval Failed',
                    text: 'An error occurred while fetching the data. Please try again later.'
                });

            }

            setload(false);
        } else {
            // Notification for invalid number format
            Swal.fire({
                icon: "error",
                title: "Invalid Number Format",
                text: "Please ensure you are using the correct Indonesian country code format (e.g., 6287654321)."
            });
            setload(false);
        }
    };





    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);

        // Mendapatkan komponen tanggal
        const day = date.getDate().toString().padStart(2, '0'); // Menambahkan leading zero
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Bulan di JavaScript dimulai dari 0
        const year = date.getFullYear();

        // Mendapatkan komponen waktu
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        // Menggabungkan komponen untuk membentuk string tanggal dan waktu
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    const Onmarker = (d) => {

        console.log(d)
        var marker = L.marker([d.lat, d.long]).addTo(maps); // Menambahkan marker ke peta

        var popupText = `<b>MSISDN:</b> ${d.msisdn}<br>
        <b>Age:</b> ${d.age}<br>
        <b>Alamat:</b> ${d.alamat}<br>
        <b>CGI:</b> ${d.cgi}<br>
        <b>IMEI:</b> ${d.imei}<br>
        <b>IMSI:</b> ${d.imsi}<br>
        <b>Latitude:</b> ${d.lat}<br>
        <b>Longitude:</b> ${d.long}<br>
        <b>Maps Link:</b> <a href="${d.maps}" target="_blank">Open Map</a><br>
        <b>Timestamp:</b> ${formatTimestamp(d.timestamp)}`; // Asumsikan formatTimestamp adalah fungsi yang telah didefinisikan

        marker.bindPopup(popupText).openPopup();

        // Bergerak ke lokasi marker dan mengatur zoom level
        // Angka 13 adalah zoom level, bisa disesuaikan sesuai kebutuhan
        maps.setView([d.lat, d.long], 13);
    }
    const onSetMarker = (d) => {
        if (d.length === 0) {
            // Tampilkan notifikasi bahwa lokasi tidak ditemukan
            Swal.fire({
                icon: 'error',
                title: 'Location Not Found',
                text: 'No location data found. Please try again with different parameters.',
            });
        } else {
            d = d[0]; // Mengambil data pertama dari array jika ada
    
            Onmarker(d); // Asumsikan Onmarker adalah fungsi yang sudah Anda definisikan sebelumnya
        }
    }
    



    return <ContainerPages>
        <MenuTracking></MenuTracking>
        <div className="flex flex-1 flex-col py-2">
            <CardBox className="grid grid-cols-9 flex-1 gap-4" title={"One Time Tracking"}>
                <form onSubmit={onSubmit} className="col-span-3 border-r-2 pr-4 border-primarry-2 flex flex-1 flex-col">
                    <Tags label="CHECK POS MSISDN"></Tags>
                    <DefaultInput loading={load} type={"number"} placeholder={"MSISDN"} control={group.controls.search}></DefaultInput>
                    <div className="relative flex flex-col flex-1">
                        <Tags label="HISTORY CHECK POST "></Tags>
                        <div className='flex flex-col relative flex-1'>
                            <div className="space-y-4 absolute w-full h-full left-0 top-0 overflow-auto">
                                {items() ? items().length === 0 ? "Data Not Found" : items()?.map((d, i) => {
                                    return <div className="flex justify-between items-center bg-primarry-2 border-b  border-blue-400">
                                        <Button onClick={() => onSetMarker(d.response)} fullWidth>
                                            <div className="flex justify-between w-full items-center">
                                                <div className="flex gap-2">
                                                    <div className="pl-2 py-2">
                                                        <div>
                                                            {d.keyword}
                                                        </div>

                                                    </div>
                                                </div>
                                                <div> {moment(d.timestamp).format("D/M/YY | HH:MM:SS")}</div>
                                            </div>
                                        </Button>

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
                            </div>
                        </div>
                    </CardFrame>
                </div>
            </CardBox>
        </div>

    </ContainerPages>
}

export default SingleTarget