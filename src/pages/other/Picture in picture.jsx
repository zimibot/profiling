import { Close, CloseFullscreen, OpenInFull } from "@suid/icons-material"
import { Button, Typography } from "@suid/material"
import { createSignal } from "solid-js"
import { mode } from "../../helper/_helper.theme"

const PictureInpicture = () => {

    let data = localStorage.getItem("data")
    let dataParse = JSON.parse(data)

    const [inMax, setInMax] = createSignal(false)

    const onClose = () => {
        window.api.invoke("pip_close")
        localStorage.removeItem("data")
    }
    const onMax = () => {
        window.api.invoke("pip_maximize")
        setInMax(d => !d)
    }
    const onMin = () => {
        window.api.invoke("pip_minimize")
        setInMax(d => !d)
    }

    return <div className="w-full h-full absolute flex flex-col" style={{
        "-webkit-app-region:": "drag",
    }}>
        <div className={`p-2 w-full flex justify-between items-center ${mode() === "dark" ? "bg-primarry-2" : ""}`} >
            <Typography variant="h6">
                {dataParse.title}
            </Typography>
            <div style={{
                "-webkit-app-region:": "none",
            }}>
                {inMax() ? <Button title="Close Maximize" onClick={onMin} size="small" variant="text" >
                    <CloseFullscreen fontSize="small"></CloseFullscreen>
                </Button> : <Button title="Maximize" onClick={onMax} size="small">
                    <OpenInFull fontSize="small"></OpenInFull>
                </Button>}


                <Button title="Close Window" onClick={onClose} size="small" variant="text" color="error">
                    <Close fontSize="small"></Close>
                </Button>

            </div>
        </div>
        <div className="flex-1 bg-white relative">
            <div className="absolute w-full h-full bg-primarry-1 p-2">
                {dataParse.type === "image" && <img className="w-full h-full object-center object-contain" src={dataParse?.src}></img>}
                {dataParse.type === "pdf" && <div className="w-full h-full" style={{
                    "-webkit-app-region:": "none",
                }}>
                    <object className="w-full h-full" data="https://s3.amazonaws.com/dq-blog-files/pandas-cheat-sheet.pdf"></object></div>}
                <div className="absolute bottom-0 p-2 justify-end left-0 w-full flex" style={{
                    "-webkit-app-region:": "none",
                }}>
                    {dataParse.type === "image" && <Button href={dataParse.src} download={dataParse.title} variant="contained" color="secondary">
                        DOWNLOAD PICTURE
                    </Button>}
                </div>
            </div>
        </div>
    </div>
}

export default PictureInpicture