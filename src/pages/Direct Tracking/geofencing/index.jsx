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

import axios from "axios";

import io from "socket.io-client"
import { useLocation, useNavigate } from "@solidjs/router";
import MenuTracking from "../menuTracking";

let maps

const DirectTracking = () => {
    const [isLoad, setIsload] = createSignal(false)

    const [items, setData] = createSignal(null)


    const group = createFormGroup({
        search: createFormControl("", {
            required: true,
        }),
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



    let mapDiv

    onMount(() => buildMap(mapDiv));


    const [load, setload] = createSignal(false)

    const location = useLocation()
    const navi = useNavigate()


    const onSubmit = async (e) => {
        e.preventDefault();

        const { search } = group.value;
        // setload(true);



        if (/^62\d{10,15}$/.test(search)) {
            // Handle invalid number format

            const path = location.pathname

            navi(`${path}/add/${search}`, { replace: true })


        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Invalid number format. Please use the Indonesian country code format (e.g., 6287654321)."
            });

        }


    };

    createEffect(() => {
        setIsload(false)
        api().get("/checkpos/position").then(d => {
            setData(d.data.items)
            setIsload(true)
        })
        load()
    })







    return <ContainerPages>
        <MenuTracking></MenuTracking>
        <div className="flex flex-1 flex-col py-2">
            <CardBox className="grid grid-cols-9 flex-1 gap-4" title={"Single Target"}>
                <form onSubmit={onSubmit} className="col-span-3 border-r-2 pr-4 border-primarry-2 flex flex-1 flex-col">
                    <Tags label="CHECK POS MSISDN"></Tags>
                    <DefaultInput loading={load} type={"number"} placeholder={"MSISDN"} control={group.controls.search}></DefaultInput>
                    <div className="relative flex flex-col flex-1">
                        <Tags label="HISTORY CHECK POST "></Tags>
                        <div className='flex flex-col relative flex-1'>
                            <div className="px-4 space-y-4 absolute w-full h-full left-0 top-0 overflow-auto">
                                {items() ? items().length === 0 ? "Data Not Found" : items()?.map((d, i) => {
                                    return <div>
                                        <div className="flex justify-between items-center bg-primarry-2 border-b pr-2 border-blue-400">
                                            <div className="flex gap-2">
                                                <div className="pl-2 py-2">
                                                    <div>
                                                        {d.title}
                                                    </div>
                                                    <div>
                                                        {d.keyword}
                                                    </div>

                                                </div>
                                            </div>
                                            <div> {moment(d.timestamp).format("D/M/YY | HH:MM:SS")}</div>
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
                                {/* <iframe className="w-full h-full" src="http://localhost:5000/serve-html/0"></iframe> */}
                                <div ref={mapDiv} className="w-full h-full"></div>
                            </div>
                        </div>
                    </CardFrame>
                </div>
            </CardBox>
        </div>
    </ContainerPages>
}

export default DirectTracking