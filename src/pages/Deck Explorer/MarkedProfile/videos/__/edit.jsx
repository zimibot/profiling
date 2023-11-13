import {  Delete,  Save, Stop, Upload } from "@suid/icons-material"
import { LayoutMarkedProfile } from "../.."
import { Button, Typography } from "@suid/material"
import { Tags } from "../../../../../component/tags"
import { CardFrame } from "../../../../../component/cardFrame"
import { useNavigate } from "@solidjs/router"
import { DefaultInput } from "../../../../../component/form/input"
import { createFormControl, createFormGroup } from "solid-forms"
import { MultiTags } from "../../../../../component/multiTags"
import exampleVideo from "../../../../../assets/video/mov_bbb.mp4"
import { mode } from "../../../../../helper/_helper.theme"
const EditVideos = () => {
    const redirect = useNavigate()
    const group = createFormGroup({
        original_name: createFormControl("", {
            required: true,
        }),
        title: createFormControl("", {
            required: true,
        }),
        remarks: createFormControl("", {
            required: true,
        }),
        remarks: createFormControl("", {
            required: true,
        }),
    });
    return <LayoutMarkedProfile title={"EDIT"}>
        <div className="flex-1 flex flex-col min-h-[600px] space-y-3">
            <div className="flex justify-between w-full">
                <Tags label={"ADDITIONAL INFORMATION"}></Tags>
                <Button onClick={() => redirect(-1)} variant="outlined" color="error" >CANCEL</Button>
            </div>
            <CardFrame className="relative flex-1" title={"Edit Videos"}>
                <form className="grid grid-cols-7 absolute w-full h-full overflow-auto top-0 left-0">
                    <div className="col-span-5 relative border-r-2 border-[#333]">
                        <div className="h-full absolute  w-full overflow-hidden flex items-center justify-center p-4">
                            <div className="absolute w-full h-full overflow-hidden p-4">
                                <video className="w-full h-full object-cover" autoPlay={false} controls>
                                    <source src={exampleVideo} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div className="absolute top-0 left-0 w-full p-5">
                                <div className={`shadow-md ${mode() === "dark" ? "bg-primarry-1" : "bg-slate-100"}`}>
                                    <MultiTags onChange={d => {
                                        console.log(d)
                                    }}></MultiTags>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 p-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="contained" color="secondary" startIcon={<Save></Save>}>SAVE</Button>
                                <Button variant="contained" color="secondary" startIcon={<Delete></Delete>}>DELETE</Button>
                            </div>
                            <div>
                                <Tags label={"TITLE "}></Tags>
                                <DefaultInput placeholder={"INPUT VIDEO NAME "} removeicon control={group.controls.title} />
                            </div>
                            <div>
                                <Button variant="contained" color="secondary" class="relative" startIcon={<Upload></Upload>}>
                                    <input type="file" accept="video/*" className="absolute left-0 cursor-pointer opacity-0" />
                                    UPLOAD YOUR VIDEO
                                </Button>
                            </div>
                            <div>
                                <Tags label={"About"}></Tags>
                                <textarea className={`p-2 w-full outline-none min-h-[200px] text-[20px] ${mode() === "dark" ? "bg-primarry-2 " : " bg-gray-200 text-[#444]"}`} spellCheck={false} placeholder="INPUT DESCRIPTION" />
                            </div>

                        </div>

                    </div>
                </form>
            </CardFrame>
        </div>
    </LayoutMarkedProfile>
}

export default EditVideos