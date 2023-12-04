import { createEffect, createSignal } from "solid-js"
import ContainerPages from "../.."
import { CardTables } from "../cardTables"
import { OnSearch } from "../searchFrom"
import { SubContainer } from "../subContainer"
import { api } from "../../../helper/_helper.api"
import { IconButton } from "@suid/material"
import { useLocation, useNavigate } from "@solidjs/router"
import { notify } from "../../../component/notify"
import { useAppState } from "../../../helper/_helper.context"
import Swal from "sweetalert2"
import { LinkOutlined, Search, Visibility } from "@suid/icons-material"
import moment from "moment"
import { CardBox } from "../../../component/cardBox"
import { DefaultInput } from "../../../component/form/input"
import { createFormControl, createFormGroup } from "solid-forms"
import { RadioField } from "../../../component/form/radio"


const SearchResult = () => {
    const [history, setHistory] = createSignal()
    const [keyword, setkeyword] = createSignal("")
    const [loading, setLoading] = createSignal()
    const [category, setCategory] = createSignal("")
    const [items, { update }] = useAppState()


    const navi = useNavigate()
    const location = useLocation()
    const path = location.pathname.split("/")[3]

    let dataSearch = [

        {
            label: "PERSONAL ID",
            type: "number",
            value: "NIK"
        },
        {
            label: "MSISDN",
            type: "number",
            value: "MSISDN"
        },
        {
            label: "FAMILY ID",
            type: "number",
            value: "NKK"
        },
        {
            label: "VEHICLE",
            type: "teks",
            value: "vehicle"
        },
        {
            label: "ALL",
            type: "teks",
            value: ""
        },
    ]



    let columnHistory = [
        {
            label: "Keyword",
            name: "keyword",
        },
        {
            label: "Category",
            name: "category",
        },
        {
            label: "Relate",
            name: "terkait",
        },
        {
            label: "Date",
            name: "timestamp",
            function: (__, d) => {
                return moment(d).format("DD MMMM YYYY HH:mm")
            }
        },
        {
            name: "path",
            function: (d, p) => {
                console.log(d.marked)
                return <div className=" text-center">
                    <IconButton onClick={async () => {
                        setLoading(true)
                        try {
                            if (d.marked || d.relate) {
                                navi(p)
                            } else {
                                let data = { search: d.keyword, type: d.type, path: `/deck-explorer/search-result/database-information/${d.keyword}` }
                                let postLogin = await OnSearch(data)
                                let dataSearch = postLogin.data.items
                                if (postLogin.status === 200) {
                                    notify({ title: "Search Keyword", text: `${d.keyword} Success` })
                                    update(d => ({ ...d, dataSearch, terkait: dataSearch.terkait }))
                                    localStorage.setItem("dataSearch", JSON.stringify(dataSearch))
                                    localStorage.setItem("typeSearch", d.category)
                                    setLoading(false)
                                    navi(p)
                                }
                            }

                        } catch (error) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: `${d.keyword} can not be found`,
                            })
                            setLoading(false)
                        }


                    }} disabled={loading()} color="primary" size="small">

                        {d.relate ? <LinkOutlined fontSize="small"></LinkOutlined> : !d.marked ? <Search fontSize="small" /> : <Visibility fontSize="small"></Visibility>}

                    </IconButton>
                </div>
            }
        }
    ]
    createEffect(() => {
        api().get(`/deck-explorer/result-search?type=${path}&page=${items()?.currentPage || 1}&keyword=${keyword()}&category=${category()}`).then(d => {
            setHistory(d.data)
        })
    })

    const SearchCard = () => {
        const group = createFormGroup({
            keyword: createFormControl(""),
        });

        const onSubmit = (e) => {
            e.preventDefault()
            const { keyword } = group.value
            setkeyword(keyword)

        }


        return <CardBox className="space-y-4" title={<span className="uppercase">SEARCH {path}</span>}>
            <form onSubmit={onSubmit}>
                <DefaultInput placeholder={"Search By Keyword"} control={group.controls.keyword}></DefaultInput>
            </form>
            <RadioField defaultValue="" onChange={(d) => {
                setCategory(d.target.value)
                update(s => ({ ...s, currentPage: 1 }))

            }} data={dataSearch} />

        </CardBox>
    }

    return <ContainerPages>
        <SubContainer
            full
            classContentRight={"col-span-full"} contenLeft={<SearchCard />}
            contenRight={history() && <CardTables paggination={true} subTitle={`HISTORY RESULT `} title={`RESULT [${history()?.totalItems || 0}]`} data={history} columns={columnHistory} />} />
    </ContainerPages>
}

export default SearchResult