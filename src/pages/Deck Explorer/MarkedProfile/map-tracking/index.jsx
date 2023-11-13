import { Button, Divider } from "@suid/material"
import { LayoutMarkedProfile } from ".."
import { CardFrame } from "../../../../component/cardFrame"
import { Tags } from "../../../../component/tags"
import { RadioField } from "../../../../component/form/radio"
import { onMount } from "solid-js";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
const data = new Array(10).fill("")
const options = [
    {
        value: "DAILY",
        label: "DAILY"
    },
    {
        value: "WEEKLY",
        label: "WEEKLY"
    },
    {
        value: "MONTHLY",
        label: "MONTHLY"
    },
    {
        value: "DISABLED",
        label: "DISABLED"
    },
]
const MapTracking = () => {

    function buildMap(div) {
        const map = L.map(div).setView([51.505, -0.09], 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
            attribution: '',
            
        }).addTo(map);

        L.marker([51.5, -0.09]).addTo(map)
            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
            .openPopup();
    }

    let mapDiv

    onMount(() => buildMap(mapDiv));

    return <LayoutMarkedProfile title={"MAP TRACKING"}>
        <div className="flex flex-col flex-1">
            <Tags label="LOCATION SOURCE"></Tags>
            <CardFrame title={"Base Transceiver Station DETECTOR"} className="flex-1 !p-0">
                <div className="grid grid-cols-8 h-full">
                    <div className="col-span-2 flex flex-col">
                        <div className="px-4 py-2 grid grid-cols-2">
                            <Tags label="History"></Tags>
                            <Button variant="contained" color="secondary">DETAIL</Button>
                        </div>
                        <Divider></Divider>
                        <div className="flex flex-col flex-1 relative">
                            <div className="absolute w-full h-full left-0 top-0 overflow-auto">
                                {data.map(() => {
                                    return <>
                                        <div className="px-4 py-2 flex gap-4 justify-between">
                                            <div>{"[26.72 Km]"} Sydney </div>
                                            <div className="text-white text-opacity-60">19MIN ago </div>
                                        </div>
                                        <Divider></Divider>
                                    </>
                                })}
                            </div>
                        </div>
                        <div className="px-4 py-2">
                            <Tags label="FEED LOCATION TRACKING"></Tags>
                            <RadioField className="!flex-col" data={options}></RadioField>
                        </div>
                    </div>
                    <div className="col-span-6">
                        <div ref={mapDiv} className="w-full h-full"></div>
                    </div>
                </div>
            </CardFrame>
        </div>
    </LayoutMarkedProfile>
}

export default MapTracking