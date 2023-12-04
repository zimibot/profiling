import { IconButton, Divider, Drawer, Button, Switch } from "@suid/material"
import { LayoutMarkedProfile } from ".."
import { CardFrame } from "../../../../component/cardFrame"
import { Tags } from "../../../../component/tags"
import { createEffect, createSignal, onMount } from "solid-js";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { DefaultInput, InputField } from "../../../../component/form/input"
import { createFormControl, createFormGroup } from "solid-forms"
import { Close, PhoneAndroid, SlowMotionVideo, Stop } from "@suid/icons-material"
import { RadioField } from "../../../../component/form/radio";
import moment from "moment";
import { api } from "../../../../helper/_helper.api";
import { useLocation } from "@solidjs/router"
import Swal from "sweetalert2"

let dataInterval = [
    {
        label: "1 Minutes",
        value: 1,
    },
    {
        label: "30 Minutes",
        value: 30,
    },
    {
        label: "1 Hours",
        value: 60
    },
    {
        label: "12 Hours",
        value: 720,
    },
    {
        label: "24 Hours",
        value: 1440,
    },
]



let map

const MapTracking = () => {
    const [dataCheckPost, setDataCheckPos] = createSignal([])
    const [dataMaps, setdataMaps] = createSignal([])
    let location = useLocation()
    let parts = location.pathname.split('/');
    let path = parts[parts.length - 2];
    const [load, setload] = createSignal(false)
    const [isShchedule, setIsSchedule] = createSignal({
        isActive: false,
        data: null,
        keyword: null
    })
    function buildMap(div) {
        map = L.map(div).setView([-6.200000, 106.816666], 7);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
            attribution: '',

        }).addTo(map);

    }

    const group = createFormGroup({
        keyword: createFormControl(""),
    });

    const groupTime = createFormGroup({
        keyword: createFormControl("", { required: true, }),
        startTime: createFormControl("", { required: true }),
        startDate: createFormControl("", { required: true }),
        endDate: createFormControl("", { required: true }),
        endTime: createFormControl("", { required: true }),
        isEnabled: createFormControl(false),
        interval: createFormControl("", { required: true })
    });


    const onSchedule = (d) => {
        api().get(`/checkpos/schedule?keyword=${d.keyword}`).then(a => {
            setIsSchedule(() => ({
                keyword: d.keyword,
                data: a.data.items,
                isActive: true
            }))
            groupTime.controls.endDate.setValue(a.data.items.endDate)
            groupTime.controls.endTime.setValue(a.data.items.endTime)
            groupTime.controls.keyword.setValue(a.data.items.keyword)
            groupTime.controls.interval.setValue(a.data.items.interval)
            groupTime.controls.isEnabled.setValue(a.data.items.isEnabled)
            groupTime.controls.startDate.setValue(a.data.items.startDate)
            groupTime.controls.startTime.setValue(a.data.items.startTime)
            let dis = false
            if (a.data.items.jobId) {
                dis = true
            } else {
                dis = false
            }

            groupTime.controls.startTime.markDisabled(dis)
            groupTime.controls.startDate.markDisabled(dis)
            groupTime.controls.endDate.markDisabled(dis)
            groupTime.controls.endTime.markDisabled(dis)
            groupTime.controls.isEnabled.markDisabled(dis)
            groupTime.controls.interval.markDisabled(dis)
        })

    }


    let mapDiv

    onMount(() => buildMap(mapDiv));
    const onSaveSchedule = (e) => {
        e.preventDefault()
        const { startDate, startTime, endTime, endDate, isEnabled, interval } = groupTime.value
        let data = {
            startDate, startTime, endTime, endDate, isEnabled, interval,
            keyword: isShchedule().keyword
        }
        setload(true)

        api().post(`/checkpos/schedule`, data).then(d => {
            setload(false)
            Swal.fire({
                icon: "success",
                title: "SUCCESS",
                text: d.data.message,
                didClose: () => {
                    onSchedule({ keyword: isShchedule().keyword })

                }
            })

        }).catch(e => {
            Swal.fire({
                icon: "error",
                title: "OOPS",
                text: "The interval cannot be 0 minutes",
            })
        })

    }

    let container
    let containerTime

    createEffect(() => {
        console.log(dataMaps())
        dataMaps().map(a => {
            // L.circle([parseFloat(a.lat), parseFloat(a.long)], {
            //     color: 'red',
            //     fillColor: '#f03',
            //     fillOpacity: 0.1,
            //     radius: 100
            // }).addTo(map);
            L.marker([parseFloat(a.lat), parseFloat(a.long)]).addTo(map)
                .bindPopup(() => {
                    return <div class="grid gap-2 relative text-[14px] overflow-auto">
                        <div class="flex gap-2">
                            <div class="font-bold">MSIDN</div>
                            <div>{a.keyword}</div>
                        </div>
                        <div class="flex gap-2">
                            <div class="font-bold">ALAMAT</div>
                            <div>{a.address}</div>
                        </div>

                        <div class="flex gap-2">
                            <div class="font-bold">DEVICE:</div>
                            <div>{a.device}</div>
                        </div>
                        <div class="flex gap-2">
                            <div class="font-bold">PROVIDER:</div>
                            <div>{a.provider}</div>
                        </div>
                        <div class="flex gap-2">
                            <div class="font-bold">IMEI:</div>
                            <div>{a.imei}</div>
                        </div>
                        <div class="flex gap-2">
                            <div class="font-bold">IMSI:</div>
                            <div>{a.imsi}</div>
                        </div>
                        <div class="flex gap-2 cursor-pointer">
                            <div class="font-bold">MAPS:</div>
                            <div class=" text-blue-400">{a.maps}</div>
                        </div>
                    </div>
                })
            // .openPopup();
        })
    })

    const fetchData = () => {
        api().get(`/checkpos/search?keyword=${path}`).then(d => {
            let data = d.data.items.map(w => {
                setdataMaps(d => ([...d, ...w?.response.map((s) => ({
                    keyword: w.keyword,
                    ...s,
                })) || []]))
                return ({
                    keyword: w.keyword,
                    active: true,
                    interval: w.interval,
                    timestamp: moment(w.timestamp).fromNow(),
                    duration: w.duration,
                    _id: w._id,
                    children: w.response
                })
            })

            setDataCheckPos(data)
        })
    }

    createEffect(() => {
        fetchData()
        load()
    })



    const onSearch = (e) => {
        e.preventDefault()
        const { keyword } = group.value
        let data = {
            keyword,
            keywordTerkait: path
        }

        setload(true)

        api().post("/checkpos/search", data).then(d => {
            setload(false)
            console.log(d)
            Swal.fire({
                icon: "success",
                title: "SUCCESS",
                text: d.data.message,
            })
        }).catch(s => {
            setload(false)
        })
    }



    const onStopSchedule = () => {
        setload(true)
        api().post("/checkpos/cancelSchedule", { keyword: isShchedule().keyword }).then(d => {
            Swal.fire({
                icon: "success",
                title: "SUCCESS",
                text: d.data.message,
            })
            setload(false)
            onSchedule({ keyword: isShchedule().keyword })
        }).catch(() => {
            setload(false)
        })
    }

    return <LayoutMarkedProfile title={"MAP TRACKING"}>
        <div className="flex flex-col flex-1">
            <Tags label="LOCATION SOURCE"></Tags>
            <CardFrame title={"Base Transceiver Station DETECTOR"} className="flex-1 !p-0">
                <div className="grid grid-cols-8 h-full">
                    <div className="col-span-3 flex flex-col">
                        <div className="px-4 py-2 grid grid-cols-2">
                            <Tags label="History Cekpos"></Tags>
                        </div>
                        <Divider></Divider>
                        <div className="flex flex-col flex-1 relative">
                            <div className="absolute w-full h-full left-0 top-0 overflow-auto">
                                {dataCheckPost().length === 0 ? <div className="flex items-center justify-center p-4">EMPTY DATA</div> : dataCheckPost().map((d) => {
                                    return <>
                                        <div className="px-4 py-2 flex gap-4 justify-between items-center">
                                            <div>{d.keyword} </div>
                                            <div className="flex gap-4 items-center">
                                                <div className="text-white text-opacity-60">{d.timestamp} </div>
                                                <div className="flex items-center">
                                                    <IconButton color="info" title="SCHEDULE LOCATION TRACKING" onClick={() => onSchedule(d)}>
                                                        {d?.interval ? <Stop color="warning"></Stop> : <SlowMotionVideo></SlowMotionVideo>}
                                                    </IconButton>
                                                    <div className="px-2" title="Duration">
                                                        {d?.duration}
                                                    </div>
                                                    {/* <IconButton color="info" title="INTERVAL TRACKING" >
                                                        <ChevronRight></ChevronRight>
                                                    </IconButton> */}
                                                </div>
                                            </div>
                                        </div>
                                        <Divider></Divider>
                                    </>
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-5 relative overflow-hidden" ref={container}>
                        <div ref={mapDiv} className="w-full h-full absolute"></div>
                        <div className="py-4 pr-4 pl-[60px] absolute z-[999] top-0 w-full">
                            <form className="bg-primarry-1 w-full" onSubmit={onSearch}>
                                <DefaultInput control={group.controls.keyword} placeholder="Search By MSISDN" loading={load}></DefaultInput>
                            </form>
                        </div>
                        {container && <Drawer
                            variant="temporary"
                            container={container}
                            anchor={"left"}
                            open={isShchedule().isActive}
                            sx={{
                                display: { xs: 'block' },
                                position: "absolute",
                                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: "80%" },
                                '& .MuiPaper-root': {
                                    position: "absolute",
                                    bgcolor: "#242424"

                                },
                                '& .MuiBackdrop-root': {
                                    position: "absolute",
                                },
                            }}

                        >   <div className="relative" ref={containerTime}>
                                <div className="p-4 text-white flex justify-between items-center ">
                                    <div>
                                        SCHEDULE LOCATION TRACKING
                                    </div>
                                    <IconButton color="error" onClick={() => {
                                        setIsSchedule(d => ({
                                            ...d,
                                            isActive: false,
                                        }))

                                        groupTime.controls.endDate.setValue("")
                                        groupTime.controls.endTime.setValue("")
                                        groupTime.controls.keyword.setValue("")
                                        groupTime.controls.interval.setValue("")
                                        groupTime.controls.isEnabled.setValue("")
                                        groupTime.controls.startDate.setValue("")
                                        groupTime.controls.startTime.setValue("")

                                    }}><Close></Close></IconButton>
                                </div>
                                <form onSubmit={onSaveSchedule} className="px-4 py-2 space-y-4 text-white relative">

                                    <div className="bg-primarry-2 p-3 flex justify-between items-center">
                                        <div><PhoneAndroid fontSize="small"></PhoneAndroid> <span>{isShchedule().keyword}</span></div>
                                    </div>
                                    <div className=" space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <InputField type="date" label={"Set Start Date"} control={groupTime.controls.startDate}></InputField>
                                            </div>
                                            <div>
                                                <InputField type="time" label={"Set Start Time"} control={groupTime.controls.startTime}></InputField>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="space-y-2 relative">
                                        <div className="flex items-center  gap-4">
                                            <Tags label={<span className="font-bold">Interval Time</span>}></Tags>
                                            <Switch checked={groupTime.controls.isEnabled.value} onChange={(a) => { groupTime.controls.isEnabled.setValue(!a.target.checked) }}></Switch>
                                        </div>
                                        {groupTime.controls.isEnabled.value && <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <InputField type="date" label={"Set End Date"} control={groupTime.controls.endDate}></InputField>
                                                </div>
                                                <div>
                                                    <InputField type="time" label={"Set End Time"} control={groupTime.controls.endTime}></InputField>
                                                </div>
                                            </div>
                                            <RadioField data={dataInterval} onChange={a => groupTime.controls.interval.setValue(parseInt(a.target.value))} disabled={groupTime.controls.interval.isDisabled} defaultValue={groupTime.controls.interval.value}></RadioField>
                                        </>}


                                    </div>
                                    <div className="grid gap-4 relative z-20">
                                        {isShchedule().data?.jobId ? <Button onClick={onStopSchedule} variant="contained" color="error">STOP</Button> : <Button type="submit" variant="contained" color="info">START</Button>}
                                    </div>
                                </form>
                            </div>
                        </Drawer>}

                    </div>
                </div>
            </CardFrame>
        </div>
    </LayoutMarkedProfile>
}

export default MapTracking