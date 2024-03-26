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
        title: createFormControl("", { required: true }),
        startDate: createFormControl("", { required: true }),
        startTime: createFormControl("", { required: true }),
        endDate: createFormControl("", { required: true }),
        endTime: createFormControl("", { required: true }),
        interval: createFormControl(0)
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




    const onSubmit = async (e) => {
        e.preventDefault();

        setload(true)

        const { search } = group.value;
        // setload(true);
        if (/^62\d{10,15}$/.test(search)) {
            try {
                let data = await api().post("/checkpos/search", { keyword: search })

                console.log(data)

            } catch (error) {

            }

            setload(false)
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Invalid number format. Please use the Indonesian country code format (e.g., 6287654321)."
            });

        }


    };









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