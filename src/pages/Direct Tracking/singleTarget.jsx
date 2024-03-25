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

    var LeafIcon = L.Icon.extend({
        options: {
            iconSize: [48, 48],
            iconAnchor: [15, 0],
            popupAnchor: [0, -0]
        }
    });

    // let socket

    // createEffect(() => {
    //     socket = io('http://192.168.1.123:8080');

    //     socket.on("connect", () => {
    //         console.log("Connected to the server");
    //     });

    //     socket.on("target-ping-response", async (ping) => {
    //         if (ping === "TARGET ONLINE") {
    //             setload(false);
    //             Swal.fire({
    //                 icon: "success",
    //                 title: "Target Available!",
    //                 confirmButtonText: "Search for Target Location",
    //                 timer: 4000,
    //                 timerProgressBar: true,
    //                 didClose: async () => {
    //                     let swalProgress = Swal.fire({
    //                         title: 'Searching for target location...',
    //                         html: 'Please wait...',
    //                         allowOutsideClick: false,
    //                         didOpen: () => {
    //                             Swal.showLoading();
    //                         }
    //                     });
    //                     try {
    //                         const { search } = group.value;
    //                         const data = { keyword: search };
    //                         const response = await api().post("/checkpos/search", data);
    //                         const { keyword, response: [res] } = response.data.data;
    //                         swalProgress.close();

    //                         L.marker([res.lat, res.long], { icon: greenIcon }).addTo(maps)
    //                             .bindPopup(html(keyword, res))
    //                             .openPopup();

    //                         Swal.fire({
    //                             icon: "success",
    //                             title: "Success!",
    //                             text: "Target location successfully found.",
    //                             didClose: () => {
    //                                 setload(false);
    //                                 group.controls.search.setValue("");
    //                             }
    //                         });
    //                     } catch (error) {
    //                         swalProgress.close();
    //                         Swal.fire({
    //                             icon: "error",
    //                             title: "Error!",
    //                             text: "Target location could not be found."
    //                         });
    //                     }

    //                 }
    //             });
    //         } else {
    //             // Handle inactive target number
    //             Swal.fire({
    //                 icon: "error",
    //                 title: "Error!",
    //                 text: "The target number is inactive or unavailable."
    //             });

    //             setload(false);
    //         }
    //     });

    // })

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
    }
    

   

    let mapDiv

    onMount(() => buildMap(mapDiv));


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

    createEffect(() => {
        axios.get("http://localhost:5000/iframe-data/0").then(s => {
            setIframeMaps(s.data.iframe)
        })
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
        <Dialog
            open={open().openPopup}
            onClose={handleClose}
            maxWidth={"md"}
            fullWidth
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
                ".MuiPaper-root": {
                    bgcolor: "#111",
                    color: "white"
                }
            }}

        >
            <form onSubmit={onStartTracking} >

                <DialogTitle id="alert-dialog-title">
                    {"SELECT SCHEDULE OR RUN NOW ?"}
                </DialogTitle>
                <DialogContent >
                    <DialogContentText sx={{ color: "white" }} id="alert-dialog-description">
                        <div className={`grid ${open().showSchedule ? "grid-cols-2" : ""}  gap-2`}>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <Tags label="TITLE TARGET"></Tags>
                                    <Input value={group.controls.title.value} required={group.controls.title.isRequired} onChange={a => group.controls.title.setValue(a.target.value)} class="bg-primarry-2 p-1" fullWidth sx={{ color: "white" }}></Input>
                                </div>
                                <div>
                                    <Tags label="MSISDN"></Tags>
                                    <Input value={group.controls.search.value} required={group.controls.search.isRequired} onChange={a => group.controls.search.setValue(a.target.value)} class=" bg-primarry-2 p-1" fullWidth sx={{ color: "white" }}></Input>
                                </div>
                                <div className="flex gap-4">
                                    <Button onClick={() => handleSchedule(false)} color={open().showSchedule ? "secondary" : "info"} variant={!open().showSchedule ? "contained" : "outlined"}>NOW</Button>
                                    <Button onClick={() => handleSchedule(true)} color={!open().showSchedule ? "secondary" : "info"} variant={open().showSchedule ? "contained" : "outlined"}>SCHEDULE</Button>
                                </div>
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
                                    <FormControl>
                                        <Tags label="INTERVAL"></Tags>
                                        <RadioGroup
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
                                        </RadioGroup>
                                    </FormControl>
                                </div>

                            </div>}

                        </div>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleClose}>CANCEL</Button>
                    <Button type="submit">Submit</Button>
                </DialogActions>
            </form>
        </Dialog>
    </ContainerPages>
}

export default SingleTarget