import { createEffect, createSignal } from "solid-js"
import ContainerPages from ".."
import { CardBox } from "../../component/cardBox"
import { Tables } from "../../component/tables"
import { SearchForm } from "../Deck Explorer/searchFrom"
import { api } from "../../helper/_helper.api"
import { useLocation } from "@solidjs/router"
import { Loading } from "../../component/loading"
import { Button, Dialog, DialogContent } from "@suid/material"
import { Close } from "@suid/icons-material"

const FindName = () => {
    const [data, setData] = createSignal()
    const [isLoading, setIsloading] = createSignal()
    const [detail, setDetail] = createSignal()
    const [showPopup, setShowPopup] = createSignal()
    const [isloadingDetail, setisLoadingDetail] = createSignal()
    const onDetail = (id) => {
        setisLoadingDetail(true)
        setDetail()
        api().get(`/deck-explorer/sna-data-more?type=id_data&keyword=${id}`).then(s => {
            console.log(s.data.items)

            let columnsDetail = []
            setisLoadingDetail(false)
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

    const onViewGambar = (e) => {
        setShowPopup({
            status: true,
            src: e.target.src
        })

        setisLoadingDetail(true)
    }

    const onClosePopup = () => {
        setShowPopup()
    }

    return <ContainerPages>
        <Dialog

            open={showPopup()?.status}
            onClose={onClosePopup}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent sx={{
                background: "#222"
            }}>
                <div className="absolute right-0 top-0 p-4">
                    <Button onClick={onClosePopup} variant="contained" color="warning">
                        <Close></Close>
                    </Button>
                </div>
                <img className="w-full object-contain" src={showPopup()?.src}></img>
            </DialogContent>
        </Dialog>
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
            <CardBox title="Result" className="flex-1 flex flex-col">
                <div className="flex flex-col flex-1 relative">

                    <div className="absolute w-full h-full top-0 left-0">
                        {isloadingDetail() && <Loading></Loading>}
                        <div className="grid grid-cols-2 gap-2 relative h-full w-full overflow-auto">
                            {detail() ? detail().columns.map(a => (
                                <div className="fle bg-primarry-2">
                                    <div className=" font-bold p-2  bg-blue-400 w-full">{a}</div>
                                    <div className="p-2">{a === "ID CARD PHOTO" || a === "FOTO" ? <Button><img onClick={onViewGambar} className="w-[100px]" src={`data:image/jpeg;base64,${detail().data[a]}`}></img></Button> : detail().data[a]}</div>
                                </div>)) : <div className="flex items-center justify-center w-full h-full absolute bottom-0 top-0">Detail Not found</div>}
                        </div>
                    </div>
                </div>
            </CardBox>
        </div>
    </ContainerPages>
}

export default FindName