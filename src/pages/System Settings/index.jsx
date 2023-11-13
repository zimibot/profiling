import { Button, Divider, Switch } from "@suid/material"
import ContainerPages from ".."
import { CardBox } from "../../component/cardBox"
import { CardFrame } from "../../component/cardFrame"
import { Tags } from "../../component/tags"
import { AccountBox, Logout, Preview, Upload } from "@suid/icons-material"
import { RadioField } from "../../component/form/radio"
import { createSignal } from "solid-js"
import { AccountSetting } from "./account"
import { toBase64 } from "../../helper/_helper_base64"
const SystemSettings = () => {
    let boolValue = (/true/).test(localStorage.getItem("mode"))
    const [mode, setMode] = createSignal(boolValue)
    const [pages, setpages] = createSignal(false)
    const [previewImages, setpreviewImages] = createSignal(null)
    let data = [
        {
            label: "PHONE NUMBER",
            type: "number",
            value: "phone_number"
        },
        {
            label: "ID NUMBER",
            type: "number",
            value: "id_number"
        },
        {
            label: "MARKED PROFILE",
            type: "teks",
            value: "marked_profile"
        },
    ]



    const onMode = (d) => {
        let check = d.target.checked
        setMode(d.target.checked)
        localStorage.setItem("mode", check)
        window.api.invoke("change_theme", check ? "dark" : "light")
        setTimeout(() => {
            window.location.reload()
        }, 200);
    }

    const onClose = () => {
        setpages()
    }

    const onInput = async (d) => {
        let files = d.target.files[0]
        if (files) {
            let img = new Image();
            let base64 = await toBase64(files)
            img.onload = function () {
                let w  = this.width, h = this.height
                URL.revokeObjectURL(base64);
                if ( h > 80) {
                    alert("Ukuran height logo tidak boleh lebih dari 80px")
                } else {
                    setpreviewImages(base64)
                }
            };
            img.src = base64;
        }

    }
    return <ContainerPages>

        <div className="flex flex-1 flex-col py-4">
            <div className="grid grid-cols-8 flex-1 gap-4">
                <div className="col-span-3 flex flex-col">
                    <CardBox title="System Settings" >
                        <CardFrame className="min-w-[500px] space-y-4">
                            <div>
                                <Tags label="Update Logo"></Tags>
                                <div>
                                    {previewImages() && <div className="w-48 p-2">
                                        <img src={previewImages()}></img>
                                    </div>}

                                    <div className="relative">
                                        <Button variant="contained" color="secondary" startIcon={<Upload></Upload>}>Upload Logo </Button>
                                        <input onChange={onInput} className="absolute w-full h-full top-0 left-0 opacity-0" type="file"></input>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Tags label="Default Search"></Tags>
                                <RadioField data={data}></RadioField>
                            </div>
                            <Button variant="contained" color="secondary">UPDATE</Button>
                            <Divider></Divider>
                            <div>
                                <Tags label="Account"></Tags>
                                <div>
                                    <Button onClick={() => setpages("account")} variant="contained" color="secondary" startIcon={<AccountBox></AccountBox>}>Account Settings</Button>
                                </div>
                            </div>
                            <div>
                                <Tags label="Dark Mode"></Tags>
                                <div >
                                    OFF
                                    <Switch color="default" value={"dark"} defaultChecked={mode()} onChange={onMode}></Switch>
                                    ON
                                </div>
                            </div>
                            <div>
                                <Tags label="Log Activity"></Tags>
                                <div>
                                    <Button onClick={() => setpages("preview")} variant="contained" color="secondary" startIcon={<Preview></Preview>}>Preview Log</Button>
                                </div>
                            </div>
                            <div>
                                <Tags label="Log OUT"></Tags>
                                <div>
                                    <Button onClick={() => {
                                        localStorage.clear()
                                        window.location.reload()
                                    }} variant="contained" color="secondary" startIcon={<Logout></Logout>}>EXIT</Button>
                                </div>
                            </div>
                        </CardFrame>
                    </CardBox>
                </div>
                {pages() === "account" && <AccountSetting onClose={onClose} />}
            </div>
        </div>
    </ContainerPages>
}

export default SystemSettings