import { Button, CircularProgress, FormControlLabel } from "@suid/material"
import { mode } from "../../../../helper/_helper.theme";
import { Add, Edit } from "@suid/icons-material";
import { LayoutMarkedProfile } from "../";
import { Tags } from "../../../../component/tags";
import { useAppState } from "../../../../helper/_helper.context";
import { useLocation } from "@solidjs/router";





const PagesIdentity = () => {
    const location = useLocation()
    const [items] = useAppState()
    let parts = location.pathname.split('/');
    let path = parts[parts.length - 2];

    console.log(path)

    return <LayoutMarkedProfile title={"IDENTIFICATION"}>

        <div className="flex-1 flex flex-col min-h-[600px]">
            <div className="w-full grid grid-cols-2 gap-2">
                <Button href={`#/deck-explorer/marked-profile/${path}/additional-info`} fullWidth variant="contained" color="secondary" startIcon={<Add></Add>}>ADDITIONAL INFO</Button>
                <Button href={`#/deck-explorer/marked-profile/${path}/identification/edit`} fullWidth variant="contained" color="secondary" startIcon={<Edit></Edit>}>EDIT MARKED PROFILE</Button>
            </div>
            <div className="relative flex-1">
                <div className="absolute left-0 w-full top-0 overflow-auto h-full grid grid-cols-2 gap-3 px-2 py-3">
                    <div className="flex gap-4 col-span-full">
                        <Button variant="contained" color="secondary">SYSTEM DATABASE INFORMATION {`[${items()?.getProfile?.data?.length || 0}]`}</Button>
                        <Button color="primary">ADDITIONAL INFO</Button>
                    </div>
                    {items().loading ? <div className="w-full flex-1 flex items-center justify-center">
                        <CircularProgress size={25}></CircularProgress>
                    </div> : items()?.getProfile?.data?.map((b, k) => {
                        return <div className={`bg-[#1e1e1e] p-2 ${k === 0 ? " col-span-full" : items()?.getProfile?.data?.length < 2 ? "col-span-full" : ""}`}>
                            <div className="border border-primarry-2 px-4 bg-primarry-1 sticky top-[5px] z-50 flex justify-between items-center">
                                <Tags label={<span>DATA DARI <b>{b.label}</b></span>}></Tags>
                                <div>{k + 1}</div>
                            </div>
                            {b.data.map(x => {
                                return <div className={`flex gap-4 relative border-b ${mode() === "dark" ? "border-[#333]" : "border-[#aaa]"}  py-2 `}>
                                    <div className="flex gap-4 items-start flex-1 relative">
                                        <div className={`${mode() === "dark" ? "text-[#aaa]" : "text-[#444]"} sticky top-[10px] whitespace-nowrap w-[200px] z-10 px-4 pt-2`}> {x.total_data === 1 ? "" : `[${x.total_data}]`} {x.label}</div>
                                        <div className="flex-1 ">
                                            <div className="gap-2 flex flex-wrap px-4">
                                                {x.data.map((d) => {
                                                    return <div title={d.label}>
                                                        <FormControlLabel
                                                            class={`pl-4 !m-0 border-[#454545] bg-[#2C2C2C] pr-2 py-1 flex gap-4 border-[0] max-w-sm`}
                                                            label={<div className="whitespace-nowrap max-w-xs relative">
                                                                <div className="text-ellipsis overflow-hidden relative">
                                                                    {x.label !== "FOTO" ? d.label : <div>
                                                                        <img className="w-20" src={d.label} />
                                                                    </div>}
                                                                </div>
                                                            </div>} />
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full flex justify-between items-center absolute bottom-[-5px] left-0">
                                        <div className={`h-2 w-2 ${mode() === "dark" ? "bg-[#222222]" : "bg-[#aaa]"} left-0`}></div>
                                        <div className={`h-2 w-2 ${mode() === "dark" ? "bg-[#222222]" : "bg-[#aaa]"} right-0`}></div>
                                    </div>
                                </div>
                            })}

                        </div>
                    })}
                   
                </div>
            </div>

        </div>
    </LayoutMarkedProfile>
}

export default PagesIdentity


