import { ArrowLeft, Close, Edit, FileUpload, PictureAsPdf, Tag } from "@suid/icons-material"
import { LayoutMarkedProfile } from "../.."
import { Button, Chip, Typography } from "@suid/material"
import { Tags } from "../../../../../component/tags"
import { CardFrame } from "../../../../../component/cardFrame"
import { useNavigate } from "@solidjs/router"
import { defaultPathRedirect } from "../../../../../helper/_helper.default.path"
import { createSignal } from "solid-js"
import { mode } from "../../../../../helper/_helper.theme"

const ViewsPicture = () => {
    const redirect = useNavigate()

    let { currentHref } = defaultPathRedirect

    const [maximize, setMaximize] = createSignal(false)

    const onMaximize = (title, url, type) => {
        localStorage.setItem("data", JSON.stringify({
            src: url,
            type: type,
            title: title
        }))

        window.api.invoke('pip')
    }

    return <LayoutMarkedProfile title={"VIEWS"}>
        <div className="flex-1 flex flex-col min-h-[600px] space-y-3">
            <div className="flex justify-between w-full">
                <Tags label={"ADDITIONAL INFORMATION"}></Tags>
                <Button onClick={() => redirect(-1)} variant="outlined" color="error" >CANCEL</Button>
            </div>
            <CardFrame className="relative flex-1" title={"VIEWS DOCUMENT"}>
                <form className="grid grid-cols-7 absolute w-full h-full overflow-auto top-0 left-0">
                    <div className="col-span-5 relative ">
                        <div className="h-full w-full flex items-center justify-center p-4">
                            <div className={`left-0  w-full overflow-hidden p-4 group transition-all ${maximize() ? "!fixed left-0 h-full z-50 " : ""} absolute top-0  h-full`}>
                                <div className="w-full h-full relative">
                                    <object className="w-full h-full" data={`/assets/barang_bukti/pdf/1.pdf`}></object>
                                    <div className="absolute w-full  left-0  flex flex-col bottom-0">
                                        <div className="p-4">
                                            <div className="space-x-2">
                                                <Chip label="MICHAEL DANTON" color="secondary" icon={<Tag fontSize="11px"></Tag>} size="small" sx={{
                                                    borderRadius: 0
                                                }}></Chip>
                                                <Chip label="HIDAYAT" color="secondary" icon={<Tag fontSize="11px"></Tag>} size="small" sx={{
                                                    borderRadius: 0
                                                }}></Chip>
                                                <Chip label="HIDAYAT" color="secondary" icon={<Tag fontSize="11px"></Tag>} size="small" sx={{
                                                    borderRadius: 0
                                                }}></Chip>

                                            </div>
                                        </div>
                                        <div className="p-4 bg-black bg-opacity-70 backdrop-blur">
                                            <Typography color={mode() === "dark" ? "" : "white"} variant="h4">
                                                DOCUMENT KASUS NARKOBA
                                            </Typography>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 p-4 flex-1 flex flex-col justify-between">
                        <div className="grid grid-cols-2 gap-2">
                            <Button onClick={() => onMaximize("DOCUMENT KASUS NARKOBA", "https://s3.amazonaws.com/dq-blog-files/pandas-cheat-sheet.pdf", "pdf")} variant="contained" color="secondary" startIcon={<PictureAsPdf></PictureAsPdf>}>MAXIMIZE</Button>
                            <Button href={`#${currentHref().replace("views", "")}/edit`} variant="contained" color="secondary" startIcon={<Edit></Edit>}>EDIT</Button>
                        </div>
                        <div className="space-y-3 flex flex-col flex-1">
                            <div className="flex-1 flex flex-col pb-4">
                                <Tags label={"Description"}></Tags>
                                <div className="relative flex-1">
                                    <div className="absolute w-full h-full left-0 top-0 overflow-auto">
                                        <Typography whiteSpace="break-spaces" sx={{
                                            overflowWrap: "break-word",
                                            color: mode() === "dark" ? "white" : "#444"
                                        }}>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.

                                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.

                                            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

                                            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.

                                            Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance.

                                            The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            </CardFrame>
        </div>
    </LayoutMarkedProfile>
}

export default ViewsPicture