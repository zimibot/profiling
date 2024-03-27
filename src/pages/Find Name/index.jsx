import { createEffect, createSignal } from "solid-js"
import ContainerPages from ".."
import { CardBox } from "../../component/cardBox"
import { Tables } from "../../component/tables"
import { SearchForm } from "../Deck Explorer/searchFrom"
import { api } from "../../helper/_helper.api"
import { useLocation } from "@solidjs/router"
import { Loading } from "../../component/loading"
import { Button } from "@suid/material"

const FindName = () => {
    const [data, setData] = createSignal()
    const [isLoading, setIsloading] = createSignal()
    const [detail, setDetail] = createSignal()

    const onDetail = (id) => {
        api().get(`/deck-explorer/sna-data-more?type=id_data&keyword=${id}`).then(s => {
            console.log(s.data.items)

            let columnsDetail = []

            for (const key in s.data.items) {
                columnsDetail.push(key)
            }

            setDetail({
                columns: columnsDetail, data: s.data.items
            })
        })
    }

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
            label: "",
            function: (data) => {
                console.log(data)
                return <Button onClick={() => onDetail(data.NIK)} variant="contained" color="info">
                    Detail
                </Button>
            }
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
                <div className="grid grid-cols-2 gap-2">
                    {detail() ? detail().columns.map(a => (
                        <div className="fle bg-primarry-2 p-2">
                            <div className="w-36">{a}</div>
                            <div>{a === "ID CARD PHOTO" ? <img className="w-[100px]" src={`data:image/jpeg;base64,${detail().data[a]}`}></img> : detail().data[a]}</div>
                        </div>)) : ""}
                </div>
            </CardBox>
        </div>
    </ContainerPages>
}

export default FindName