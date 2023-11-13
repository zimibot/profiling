import { Add, ArrowLeft, FileUpload, Save } from "@suid/icons-material"
import { LayoutMarkedProfile } from "../.."
import { Button } from "@suid/material"
import { Tags } from "../../../../../component/tags"
import { CardFrame } from "../../../../../component/cardFrame"
import { useNavigate } from "@solidjs/router"
import { DefaultInput } from "../../../../../component/form/input"
import { createFormControl, createFormGroup } from "solid-forms"
import { MultiTags } from "../../../../../component/multiTags"
import { mode } from "../../../../../helper/_helper.theme"

const AddPicture = () => {
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

    return <LayoutMarkedProfile title={"ADD"}>
        <div className="flex-1 flex flex-col min-h-[600px] space-y-3">
            <div className="flex justify-between w-full">
                <Tags label={"ADDITIONAL INFORMATION"}></Tags>
                <Button onClick={() => redirect(-1)} variant="outlined" color="error" >CANCEL</Button>
            </div>
            <CardFrame className="relative flex-1" title={"ADD PICTURE"}>
                <form className="grid grid-cols-7 absolute w-full h-full overflow-auto top-0 left-0">
                    <div className="col-span-5 relative border-r-2 border-primarry-2 ">
                        <div className="h-full absolute  w-full overflow-hidden flex items-center justify-center p-4">
                            <div className="flex flex-col items-center border p-4 border-[#333] cursor-pointer relative">
                                <FileUpload sx={{ fontSize: 50 }}></FileUpload>
                                <span>UPLOAD YOUR PICTURE</span>
                                <input type="file" accept="image/*" className="opacity-0 w-full absolute top-0 left-0 h-full cursor-pointer" />
                            </div>
                            <div className="absolute top-0 left-0 p-4">
                                <MultiTags onChange={d => {
                                    console.log(d)
                                }}></MultiTags>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 p-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                            <div>
                                <Button variant="contained" color="secondary" fullWidth startIcon={<Add></Add>} >ADD</Button>
                            </div>
                            <div>
                                <Tags label={"TITLE "}></Tags>
                                <DefaultInput placeholder={"INPUT PICTURE NAME "} removeicon control={group.controls.title} />
                            </div>
                            <div>
                                <Tags label={"ABOUT PICTURE"}></Tags>
                                <textarea className={`p-2 w-full outline-none min-h-[200px] text-[20px] ${mode() === "dark" ? "bg-primarry-2 " : " bg-gray-200 text-[#444]"}`} spellCheck={false} placeholder="INPUT DESCRIPTION" />
                            </div>
                        </div>

                    </div>
                </form>
            </CardFrame>
        </div>
    </LayoutMarkedProfile>
}

export default AddPicture