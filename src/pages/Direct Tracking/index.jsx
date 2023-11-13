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
import { Collapse } from "solid-collapse";
import { ArrowBack, ArrowDownward, ContentCopy, CopyAll, KeyboardArrowDown, KeyboardArrowUp, LocationCity, LocationSearching, PinDrop, SwipeDown } from "@suid/icons-material";
import { Button, Chip, Divider, IconButton } from "@suid/material";
import { notify } from "../../component/notify";
const data = new Array(10).fill("")

let maps

const DirectTracking = () => {

    var LeafIcon = L.Icon.extend({
        options: {
            iconSize: [48, 48],
            iconAnchor: [15, 0],
            popupAnchor: [0, -0]
        }
    });


    let greenIcon = new LeafIcon({ iconUrl: "./assets/marker.png" })

    const [items, setData] = createSignal(null)


    function buildMap(div) {
        maps = L.map(div).setView([-6.200000, 106.816666], 7);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
            attribution: '',

        }).addTo(maps);

    }

    let mapDiv

    onMount(() => buildMap(mapDiv), [items()]);

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
        e.preventDefault()

        let { search } = group.value

        let data = {
            keyword: search
        }
        setload(true)

        try {
            const as = await api().post("/checkpos/search", data)
            let keyword = as.data.data.keyword
            let res = as.data.data.response[0]
            console.log(as.data.data.keyword)
            L.marker([res.lat, res.long], { icon: greenIcon }).addTo(maps)
                .bindPopup(html(keyword, res))
                .openPopup();

            Swal.fire({
                icon: "success",
                title: "SUCCESS",
                text: as.data.message,
                didClose: () => {
                    setload(false)
                    group.controls.search.setValue("")
                }
            })

        } catch (error) {
            if (/^62\d{10,15}$/.test(search)) {
                Swal.fire({
                    icon: "error",
                    title: "OOPS",
                    text: "Number not found or switch off"
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "OOPS",
                    text: "Invalid phone number. Please use the Indonesian country code (e.g., 6287654321)."
                })
            }

            setload(false)
        }


    }

    createEffect(() => {
        api().get("/checkpos/search").then(d => {
            setData(d.data.items)

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

    function copyTextToClipboard(text) {
        // Menggunakan Clipboard API untuk menyalin teks ke clipboard
        navigator.clipboard.writeText(text)
            .then(() => {
                notify({ title: "Success", text: "Text successfully copied to the clipboard.", position: "center" })
            })
            .catch((error) => {
                console.error('Gagal menyalin teks ke clipboard:', error);
            });
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
                    <Tags label="CHECK POS PHONE NUMBER"></Tags>
                    <DefaultInput loading={load} type={"number"} placeholder={"PHONE NUMBER"} control={group.controls.search}></DefaultInput>
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
                                        {/* <div className={d.active ? "bg-[#1e1e1e] p-2" : ""}>
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
                                        </div> */}
                                    </div>
                                }) : "Loading..."}
                            </div>
                        </div>

                    </div>
                </form>
                <div className="flex flex-col flex-1 col-span-6">
                    <Tags label="LOCATION SOURCE"></Tags>
                    <CardFrame title={"MAPS"} className="flex-1 !p-0 flex flex-col">
                        <div className="flex-1">
                            <div className="w-full h-full">
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