import { createEffect, createSignal } from "solid-js"
import ContainerPages from ".."
import { CardBox } from "../../component/cardBox"
import { Tables } from "../../component/tables"
import { SearchForm } from "../Deck Explorer/searchFrom"
import { api } from "../../helper/_helper.api"
import { useLocation } from "@solidjs/router"
import { Loading } from "../../component/loading"

const FindName = () => {
    const [data, setData] = createSignal()
    const [isLoading, setIsloading] = createSignal()

    const columns = [
        {
            label: "Nama Lengkap",
            name: "NAMA_LGKP",
        },
        {
            label: "Tanggal Lahir",
            name: "DESC_TGL_LHR",
        },
        {
            label: "Nama Kota",
            name: "NAMA_KAB",
        },
        {
            label: "Pekerjaan",
            name: "PEKERJAAN",
        },
        {
            label: "Save",
            name: "function",
        },
    ]

    const location = useLocation()

    createEffect(() => {
        setIsloading(true)
        const path = location.pathname.split("/").pop()
        api().get(`/deck-explorer/search_name?keyword=${path}`).then(a => {
            setData({
                items: a.data.items
            })
            setIsloading(false)
        })
    })
    return <ContainerPages>
        <div className="py-4 flex gap-2 flex-1">
            <div className="flex flex-col gap-2 w-[800px]">
                <SearchForm></SearchForm>
                <div className="flex-1 relative">
                    <div className="absolute w-full h-full top-0 left-0 flex flex-col">
                        <Tables columns={columns} data={data}></Tables>
                    </div>
                    {isLoading() && <Loading></Loading>}

                </div>
            </div>
            <CardBox title="Result">

            </CardBox>
        </div>
    </ContainerPages>
}

export default FindName