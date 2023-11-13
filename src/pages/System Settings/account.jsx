import { Button } from "@suid/material"
import { CardBox } from "../../component/cardBox"
import { CardFrame } from "../../component/cardFrame"
import { DefaultInput } from "../../component/form/input"
import { Tags } from "../../component/tags"
import { createFormControl, createFormGroup } from "solid-forms"
import { Close } from "@suid/icons-material"

export const AccountSetting = ({ onClose }) => {
    const group = createFormGroup({
        password: createFormControl("", {
            required: true,
        }),
        re_password: createFormControl("", {
            required: true,
        }),
        other_password: createFormControl("", {
            required: true,
        }),
    });
    return <div className="col-span-5 flex flex-col flex-1">
        <CardBox title={"Account Settings"} className="space-y-4">
            <CardFrame title={<div className="flex justify-between items-center">
                <span>
                    Reset Password
                </span>
                <div>
                    <Button onClick={onClose} color="error" variant="outlined" startIcon={<Close></Close>}>CLOSE</Button>
                </div>
            </div>}>
                <form className="max-w-[500px] space-y-4">
                    <div>
                        <Tags label="Current Password"></Tags>
                        <DefaultInput removeicon control={group.controls.password} />
                    </div>
                    <div>
                        <Tags label="New Password"></Tags>
                        <DefaultInput type="password" removeicon control={group.controls.re_password}></DefaultInput>
                    </div>
                    <div>
                        <Tags label="RE New Password"></Tags>
                        <DefaultInput type="password" removeicon control={group.controls.other_password}></DefaultInput>
                    </div>
                    <div>
                        <Button color="secondary" variant="contained" size="large">SAVE</Button>
                    </div>
                </form>
            </CardFrame>
        </CardBox>
    </div>
}