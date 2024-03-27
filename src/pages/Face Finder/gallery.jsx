import { createEffect, createSignal } from "solid-js"
import { api } from "../../helper/_helper.api"
import { CardBox } from "../../component/cardBox"
import { Button } from "@suid/material"

export const GalleryData = () => {
    const [data, setData] = createSignal()

    createEffect(() => {
        api().get("/deck-explorer/gallery").then(a => {
            console.log(a)
            setData(a.data)
        })
    })
    return <CardBox title="GALLERY">
        <div className="grid grid-cols-4">
            {data() ? data().items.map(a => {
                return <Button>
                    <img src={a.baseurl}></img>
                </Button>
            }) : ""}
        </div>
    </CardBox>
}
