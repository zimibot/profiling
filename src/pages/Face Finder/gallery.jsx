import { createEffect, createSignal } from "solid-js"
import { api } from "../../helper/_helper.api"
import { CardBox } from "../../component/cardBox"
import { Button } from "@suid/material"

export const GalleryData = () => {
    const [data, setData] = createSignal()

    createEffect(() => {
        api().get("/deck-explorer/gallery?page=2").then(a => {
            setData(a.data)
        })
    })
    return <CardBox title="GALLERY" className="flex flex-col flex-1">
        <div className="relative flex-1">
            <div className="w-full h-full absolute left-0 top-0 overflow-auto">
                <div className="grid grid-cols-4">
                    {data() ? data().items.map(a => {
                        return <Button>
                            <img src={a.baseurl}></img>
                        </Button>
                    }) : ""}
                </div>
            </div>
        </div>
    </CardBox>
}
