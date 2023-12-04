import ContainerPages from ".."
import { CardBox } from "../../component/cardBox/index.jsx"
import { CardFrame } from "../../component/cardFrame/index.jsx"
import { Tags } from "../../component/tags"
import { Button, Grow, IconButton, Paper } from "@suid/material"
import { LinkOutlined, Search, Visibility } from "@suid/icons-material"
import { mode } from "../../helper/_helper.theme"
import { CardTables } from "./cardTables"
import { Empty } from "../../component/empty"
import { SubContainer } from "./subContainer"
import { OnSearch, SearchForm } from "./searchFrom";
import { Link, useNavigate } from "@solidjs/router"
import { useAppState } from "../../helper/_helper.context"
import { createEffect, createSignal } from "solid-js"
import { api } from "../../helper/_helper.api"
import moment from "moment"
import { notify } from "../../component/notify"
import Swal from "sweetalert2"
import avatar from "../../assets/images/avatar.svg"


const DeckExplorer = () => {
    const navi = useNavigate()
    const [items, { update }] = useAppState()

    const [loading, setLoading] = createSignal(false)
    const [choosen] = createSignal("personal")
    let columns = [
        {
            label: "Category",
            name: "category",
        },
        {
            label: "Keyword",
            name: "keyword",
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
                return <div className=" text-center">
                    <IconButton onClick={async () => {
                        setLoading(true)
                        try {
                            if (d.marked) {
                                let type = d.type === "person" ? "phone-list" : d.type === "family_data" ? 'family-member' : d.type === "vehicle" ? "vehicle" : "identification"
                                navi(`/deck-explorer/marked-profile/${d.path}/${type}`)
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
                            if (error.code === "ERR_BAD_RESPONSE") {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: `Error Time Out, Please Try Again`,
                                })
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: `${d.keyword} CAN NOT BE FOUND`,
                                })
                            }
                            setLoading(false)
                        }


                    }} disabled={loading()} color="primary" size="small">
                        {d.relate ? <LinkOutlined fontSize="small"></LinkOutlined> : !d.marked ? <Search fontSize="small" /> : <Visibility fontSize="small"></Visibility>}
                    </IconButton>
                </div>
            }
        }
    ]


    const [history, setHistory] = createSignal(null)
    const [marked, setmarked] = createSignal(null)

    createEffect(() => {
        api().get("/deck-explorer/history").then((d) => {
            setHistory(d.data)
        })
        items()?.refresh
    })

    createEffect(() => {
        if (choosen() === "personal") {
            api().get("/deck-explorer/marked_profile").then(d => {
                setmarked(d.data.items)
            })
        } else {
            api().get("/deck-explorer/profile_family").then(d => {
                setmarked(d.data.items)
            })
        }
    })


    return <ContainerPages>
        <SubContainer contenLeft={<>
            <SearchForm></SearchForm>
            <CardTables loading={loading} subTitle="RECENT KEYWORD" title={"HISTORY"} count={history}
                data={history}
                columns={columns} />

        </>}
            contenRight={<CardBox className={"flex flex-1 flex-col min-h-[600px]"} title={<span>MARKED PROFILE</span>}>
                <Tags label="RECENTLY VIEW MARKED PROFILE" />
                <CardFrame className={"flex flex-col flex-1 relative"}>
                    <div className="absolute w-full h-full overflow-auto left-0 px-6 pb-6 flex gap-4">
                        {!marked() ? "" : marked().length === 0 ? <Empty className="h-full justify-center items-center" /> : marked().map((d, i) => {
                            let type = d.type === "MSISDN" ? "phone-list" : d.type === "FAMILY ID" ? 'family-member' : d.type === "VEHICLE" ? "vehicle" : "identification"
                            let path = d.type !== "PERSONAL ID" ? `/deck-explorer/marked-profile/${d.keyword}/${type}` : `/deck-explorer/marked-profile/${d.keyword}/${type}`


                            return <Grow {...({ timeout: i * 200 })} in={true} style={{ transformOrigin: "0 0 0" }}>
                                <Paper class="w-[25%] h-[350px]">
                                    <Link href={path} className={`${mode() === "dark" ? "bg-[#2a2a2a]" : "bg-gray-200"}  h-full flex flex-col`}>
                                        <div className="overflow-hidden relative flex-1 group">
                                            <img className="w-full h-full object-cover object-center saturate-0 group-hover:saturate-100" src={d?.foto_url?.label ? d.foto_url.type === "file" ? d?.foto_url.label : d?.foto_url.label : avatar} />
                                            <div className="absolute w-full h-full top-0 transition-all hover:bg-black group-hover:bg-opacity-20 cursor-pointer flex justify-center items-center">
                                                <div className="bg-white px-2 py-2  text-[#333] hidden group-hover:block">
                                                    <LinkOutlined></LinkOutlined>
                                                </div>
                                            </div>
                                        </div>
                                        <div class={`flex gap-2 justify-between lh-low ${mode() === "dark" ? "text-[#eee]" : "text-[#222]"} `} >
                                            <div className="py-2 pl-2 flex-1 relative max-w-[60%]">
                                                <div className="text-[14px] relative whitespace-nowrap ">
                                                    <p class="text-ellipsis overflow-hidden">
                                                        {d.profile_name}
                                                    </p>
                                                </div>
                                                <div className="text-[14px] relative whitespace-nowrap ">
                                                    <p class="text-ellipsis overflow-hidden">
                                                        CASE: {d.case_group}
                                                    </p>
                                                </div>
                                                <div className="text-[14px] relative whitespace-nowrap ">
                                                    <p class="text-ellipsis overflow-hidden">
                                                        REMARKS: {d.remarks}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex-1 bg-[#D9D9D9] text-[#222] flex items-center justify-center text-xl min-w-[50px] max-w-[100px]">
                                                {d.data}
                                            </div>
                                        </div>
                                    </Link>
                                </Paper>
                            </Grow>
                        })}
                    </div>
                    <div className="absolute top-0 right-[6px]">
                        <svg width="15" height="658" viewBox="0 0 16 658" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M-1.30085e-07 2.976L-4.93064e-08 1.128C-3.25213e-08 0.743999 0.168 0.615999 0.504 0.743999C1.816 1.256 4.216 2.168 7.704 3.48C11.192 4.792 13.6 5.704 14.928 6.216C15.264 6.36 15.432 6.576 15.432 6.864L15.432 8.712C15.432 9.096 15.264 9.224 14.928 9.096L0.504 3.624C0.168 3.496 -1.43373e-07 3.28 -1.30085e-07 2.976ZM-5.59345e-07 12.7963L-4.78566e-07 10.9483C-4.61781e-07 10.5643 0.168 10.4363 0.504 10.5643C1.816 11.0763 4.216 11.9883 7.704 13.3003C11.192 14.6123 13.6 15.5243 14.928 16.0363C15.264 16.1803 15.432 16.3963 15.432 16.6843L15.432 18.5323C15.432 18.9163 15.264 19.0443 14.928 18.9163L0.503999 13.4443C0.167999 13.3163 -5.72633e-07 13.1003 -5.59345e-07 12.7963ZM-9.88604e-07 22.6166L-9.07825e-07 20.7686C-8.9104e-07 20.3846 0.167999 20.2566 0.503999 20.3846C1.816 20.8966 4.216 21.8086 7.704 23.1206C11.192 24.4326 13.6 25.3446 14.928 25.8566C15.264 26.0006 15.432 26.2166 15.432 26.5046L15.432 28.3526C15.432 28.7366 15.264 28.8646 14.928 28.7366L0.503999 23.2646C0.167999 23.1366 -1.00189e-06 22.9206 -9.88604e-07 22.6166ZM-1.41786e-06 32.4369L-1.33708e-06 30.5889C-1.3203e-06 30.2049 0.167999 30.0769 0.503999 30.2049C1.816 30.7169 4.216 31.6289 7.704 32.9409C11.192 34.2529 13.6 35.1649 14.928 35.6769C15.264 35.8209 15.432 36.0369 15.432 36.3249L15.432 38.1729C15.432 38.5569 15.264 38.6849 14.928 38.5569L0.503999 33.0849C0.167999 32.9569 -1.43115e-06 32.7409 -1.41786e-06 32.4369ZM-1.84712e-06 42.2572L-1.76634e-06 40.4092C-1.74956e-06 40.0252 0.167998 39.8972 0.503998 40.0252C1.816 40.5372 4.216 41.4492 7.704 42.7612C11.192 44.0732 13.6 44.9852 14.928 45.4972C15.264 45.6412 15.432 45.8572 15.432 46.1452L15.432 47.9932C15.432 48.3773 15.264 48.5053 14.928 48.3772L0.503998 42.9052C0.167998 42.7772 -1.86041e-06 42.5612 -1.84712e-06 42.2572ZM-2.27638e-06 52.0776L-2.1956e-06 50.2296C-2.17882e-06 49.8456 0.167998 49.7176 0.503998 49.8456C1.816 50.3576 4.216 51.2696 7.704 52.5816C11.192 53.8936 13.6 54.8056 14.928 55.3176C15.264 55.4616 15.432 55.6776 15.432 55.9656L15.432 57.8136C15.432 58.1976 15.264 58.3256 14.928 58.1976L0.503998 52.7256C0.167998 52.5976 -2.28967e-06 52.3816 -2.27638e-06 52.0776ZM-2.70564e-06 61.8979L-2.62486e-06 60.0499C-2.60808e-06 59.6659 0.167997 59.5379 0.503997 59.6659C1.816 60.1779 4.216 61.0899 7.704 62.4019C11.192 63.7139 13.6 64.6259 14.928 65.1379C15.264 65.2819 15.432 65.4979 15.432 65.7859L15.432 67.6339C15.432 68.0179 15.264 68.1459 14.928 68.0179L0.503997 62.5459C0.167997 62.4179 -2.71893e-06 62.2019 -2.70564e-06 61.8979ZM-3.1349e-06 71.7182L-3.05412e-06 69.8702C-3.03734e-06 69.4862 0.167997 69.3582 0.503997 69.4862C1.816 69.9982 4.216 70.9102 7.704 72.2222C11.192 73.5342 13.6 74.4462 14.928 74.9582C15.264 75.1022 15.432 75.3182 15.432 75.6062L15.432 77.4542C15.432 77.8382 15.264 77.9662 14.928 77.8382L0.503997 72.3662C0.167997 72.2382 -3.14819e-06 72.0222 -3.1349e-06 71.7182ZM-3.53793e-06 80.9385L-3.50961e-06 80.2905C-3.49912e-06 80.0505 0.0959965 79.9705 0.287997 80.0505C0.479997 80.1305 2.92 81.0025 7.608 82.6665C12.296 84.3305 14.8 85.2265 15.12 85.3545C15.328 85.4185 15.432 85.5465 15.432 85.7385L15.432 86.3865C15.432 86.5945 15.312 86.6585 15.072 86.5785L0.311996 81.3225C0.103996 81.2425 -3.54563e-06 81.1145 -3.53793e-06 80.9385ZM-3.95388e-06 90.4541L-3.92555e-06 89.8061C-3.91506e-06 89.5661 0.0959961 89.4861 0.287996 89.5661C0.479996 89.6461 2.92 90.5181 7.608 92.1821C12.296 93.8461 14.8 94.7421 15.12 94.8701C15.328 94.9341 15.432 95.0621 15.432 95.2541L15.432 95.9021C15.432 96.1101 15.312 96.1741 15.072 96.0941L0.311996 90.8381C0.103996 90.7581 -3.96157e-06 90.6301 -3.95388e-06 90.4541ZM-4.36982e-06 99.9697L-4.34149e-06 99.3217C-4.331e-06 99.0817 0.0959957 99.0017 0.287996 99.0817C0.479996 99.1617 2.92 100.034 7.608 101.698C12.296 103.362 14.8 104.258 15.12 104.386C15.328 104.45 15.432 104.578 15.432 104.77L15.432 105.418C15.432 105.626 15.312 105.69 15.072 105.61L0.311996 100.354C0.103996 100.274 -4.37751e-06 100.146 -4.36982e-06 99.9697ZM-4.78576e-06 109.485L-4.75743e-06 108.837C-4.74694e-06 108.597 0.0959953 108.517 0.287995 108.597C0.479995 108.677 2.92 109.549 7.608 111.213C12.296 112.877 14.8 113.773 15.12 113.901C15.328 113.965 15.432 114.093 15.432 114.285L15.432 114.933C15.432 115.141 15.312 115.205 15.072 115.125L0.311995 109.869C0.103995 109.789 -4.79345e-06 109.661 -4.78576e-06 109.485ZM-5.2017e-06 119.001L-5.17337e-06 118.353C-5.16288e-06 118.113 0.0959948 118.033 0.287995 118.113C0.479995 118.193 2.91999 119.065 7.60799 120.729C12.296 122.393 14.8 123.289 15.12 123.417C15.328 123.481 15.432 123.609 15.432 123.801L15.432 124.449C15.432 124.657 15.312 124.721 15.072 124.641L0.311995 119.385C0.103995 119.305 -5.20939e-06 119.177 -5.2017e-06 119.001ZM-5.61764e-06 128.517L-5.58932e-06 127.869C-5.57882e-06 127.629 0.0959944 127.549 0.287994 127.629C0.479994 127.709 2.91999 128.581 7.60799 130.245C12.296 131.909 14.8 132.805 15.12 132.933C15.328 132.997 15.432 133.125 15.432 133.317L15.432 133.965C15.432 134.173 15.312 134.237 15.072 134.157L0.311994 128.901C0.103994 128.821 -5.62533e-06 128.693 -5.61764e-06 128.517ZM-6.03358e-06 138.032L-6.00526e-06 137.384C-5.99477e-06 137.144 0.095994 137.064 0.287994 137.144C0.479994 137.224 2.91999 138.096 7.60799 139.76C12.296 141.424 14.8 142.32 15.12 142.448C15.328 142.512 15.432 142.64 15.432 142.832L15.432 143.48C15.432 143.688 15.312 143.752 15.072 143.672L0.311994 138.416C0.103994 138.336 -6.04127e-06 138.208 -6.03358e-06 138.032ZM-6.44952e-06 147.548L-6.4212e-06 146.9C-6.41071e-06 146.66 0.0959936 146.58 0.287994 146.66C0.479994 146.74 2.91999 147.612 7.60799 149.276C12.296 150.94 14.8 151.836 15.12 151.964C15.328 152.028 15.432 152.156 15.432 152.348L15.432 152.996C15.432 153.204 15.312 153.268 15.072 153.188L0.311994 147.932C0.103994 147.852 -6.45722e-06 147.724 -6.44952e-06 147.548ZM-6.86546e-06 157.063L-6.83714e-06 156.415C-6.82665e-06 156.175 0.0959932 156.095 0.287993 156.175C0.479993 156.255 2.91999 157.127 7.60799 158.791C12.296 160.455 14.8 161.351 15.12 161.48C15.328 161.543 15.432 161.671 15.432 161.864L15.432 162.511C15.432 162.719 15.312 162.784 15.072 162.704L0.311993 157.447C0.103993 157.367 -6.87316e-06 157.239 -6.86546e-06 157.063ZM-7.2814e-06 166.579L-7.25308e-06 165.931C-7.24259e-06 165.691 0.0959928 165.611 0.287993 165.691C0.479993 165.771 2.91999 166.643 7.60799 168.307C12.296 169.971 14.8 170.867 15.12 170.995C15.328 171.059 15.432 171.187 15.432 171.379L15.432 172.027C15.432 172.235 15.312 172.299 15.072 172.219L0.311993 166.963C0.103993 166.883 -7.2891e-06 166.755 -7.2814e-06 166.579ZM-7.69735e-06 176.095L-7.66902e-06 175.447C-7.65853e-06 175.207 0.0959923 175.127 0.287992 175.207C0.479992 175.287 2.91999 176.159 7.60799 177.823C12.296 179.487 14.8 180.383 15.12 180.511C15.328 180.575 15.432 180.703 15.432 180.895L15.432 181.543C15.432 181.751 15.312 181.815 15.072 181.735L0.311992 176.479C0.103992 176.399 -7.70504e-06 176.271 -7.69735e-06 176.095ZM-8.11329e-06 185.61L-8.08496e-06 184.962C-8.07447e-06 184.722 0.0959919 184.642 0.287992 184.722C0.479992 184.802 2.91999 185.674 7.60799 187.338C12.296 189.002 14.8 189.898 15.12 190.026C15.328 190.09 15.432 190.218 15.432 190.41L15.432 191.058C15.432 191.266 15.312 191.33 15.072 191.25L0.311992 185.994C0.103992 185.914 -8.12098e-06 185.786 -8.11329e-06 185.61ZM-8.52923e-06 195.126L-8.5009e-06 194.478C-8.49041e-06 194.238 0.0959915 194.158 0.287992 194.238C0.479992 194.318 2.91999 195.19 7.60799 196.854C12.296 198.518 14.8 199.414 15.12 199.542C15.328 199.606 15.432 199.734 15.432 199.926L15.432 200.574C15.432 200.782 15.312 200.846 15.072 200.766L0.311991 195.51C0.103991 195.43 -8.53692e-06 195.302 -8.52923e-06 195.126ZM-8.94517e-06 204.642L-8.91684e-06 203.994C-8.90635e-06 203.754 0.0959911 203.674 0.287991 203.754C0.479991 203.834 2.91999 204.706 7.60799 206.37C12.296 208.034 14.8 208.93 15.12 209.058C15.328 209.122 15.432 209.25 15.432 209.442L15.432 210.09C15.432 210.298 15.312 210.362 15.072 210.282L0.311991 205.026C0.103991 204.946 -8.95286e-06 204.818 -8.94517e-06 204.642ZM-9.36111e-06 214.157L-9.33279e-06 213.509C-9.32229e-06 213.269 0.0959907 213.189 0.287991 213.269C0.479991 213.349 2.91999 214.221 7.60799 215.885C12.296 217.549 14.8 218.445 15.12 218.573C15.328 218.637 15.432 218.765 15.432 218.957L15.432 219.605C15.432 219.813 15.312 219.877 15.072 219.797L0.311991 214.541C0.103991 214.461 -9.3688e-06 214.333 -9.36111e-06 214.157ZM-9.77705e-06 223.673L-9.74873e-06 223.025C-9.73824e-06 222.785 0.0959903 222.705 0.28799 222.785C0.47999 222.865 2.91999 223.737 7.60799 225.401C12.296 227.065 14.8 227.961 15.12 228.089C15.328 228.153 15.432 228.281 15.432 228.473L15.432 229.121C15.432 229.329 15.312 229.393 15.072 229.313L0.31199 224.057C0.10399 223.977 -9.78475e-06 223.849 -9.77705e-06 223.673ZM-1.0193e-05 233.188L-1.01647e-05 232.54C-1.01542e-05 232.3 0.0959899 232.22 0.28799 232.3C0.47999 232.38 2.91999 233.252 7.60799 234.916C12.296 236.58 14.8 237.476 15.12 237.605C15.328 237.668 15.432 237.796 15.432 237.989L15.432 238.636C15.432 238.844 15.312 238.909 15.072 238.829L0.31199 233.572C0.10399 233.492 -1.02007e-05 233.364 -1.0193e-05 233.188ZM-1.06089e-05 242.704L-1.05806e-05 242.056C-1.05701e-05 241.816 0.0959894 241.736 0.287989 241.816C0.479989 241.896 2.91999 242.768 7.60799 244.432C12.296 246.096 14.8 246.992 15.12 247.12C15.328 247.184 15.432 247.312 15.432 247.504L15.432 248.152C15.432 248.36 15.312 248.424 15.072 248.344L0.311989 243.088C0.103989 243.008 -1.06166e-05 242.88 -1.06089e-05 242.704ZM-1.10249e-05 252.22L-1.09966e-05 251.572C-1.09861e-05 251.332 0.095989 251.252 0.287989 251.332C0.479989 251.412 2.91999 252.284 7.60799 253.948C12.296 255.612 14.8 256.508 15.12 256.636C15.328 256.7 15.432 256.828 15.432 257.02L15.432 257.668C15.432 257.876 15.312 257.94 15.072 257.86L0.311989 252.604C0.103989 252.524 -1.10326e-05 252.396 -1.10249e-05 252.22ZM-1.14408e-05 261.735L-1.14125e-05 261.087C-1.1402e-05 260.847 0.0959886 260.767 0.287989 260.847C0.479989 260.927 2.91999 261.799 7.60799 263.463C12.296 265.127 14.8 266.023 15.12 266.151C15.328 266.215 15.432 266.343 15.432 266.535L15.432 267.183C15.432 267.391 15.312 267.455 15.072 267.375L0.311989 262.119C0.103989 262.039 -1.14485e-05 261.911 -1.14408e-05 261.735ZM-1.18568e-05 271.251L-1.18284e-05 270.603C-1.18179e-05 270.363 0.0959882 270.283 0.287988 270.363C0.479988 270.443 2.91999 271.315 7.60799 272.979C12.296 274.643 14.8 275.539 15.12 275.667C15.328 275.731 15.432 275.859 15.432 276.051L15.432 276.699C15.432 276.907 15.312 276.971 15.072 276.891L0.311988 271.635C0.103988 271.555 -1.18645e-05 271.427 -1.18568e-05 271.251ZM-1.22727e-05 280.767L-1.22444e-05 280.119C-1.22339e-05 279.879 0.0959878 279.799 0.287988 279.879C0.479988 279.959 2.91999 280.831 7.60799 282.495C12.296 284.159 14.8 285.055 15.12 285.183C15.328 285.247 15.432 285.375 15.432 285.567L15.432 286.215C15.432 286.423 15.312 286.487 15.072 286.407L0.311988 281.151C0.103988 281.071 -1.22804e-05 280.943 -1.22727e-05 280.767ZM-1.26886e-05 290.282L-1.26603e-05 289.634C-1.26498e-05 289.394 0.0959874 289.314 0.287987 289.394C0.479987 289.474 2.91999 290.346 7.60799 292.01C12.296 293.674 14.8 294.57 15.12 294.698C15.328 294.762 15.432 294.89 15.432 295.082L15.432 295.73C15.432 295.938 15.312 296.002 15.072 295.922L0.311987 290.666C0.103987 290.586 -1.26963e-05 290.458 -1.26886e-05 290.282ZM-1.31046e-05 299.798L-1.30763e-05 299.15C-1.30658e-05 298.91 0.0959869 298.83 0.287987 298.91C0.479987 298.99 2.91999 299.862 7.60799 301.526C12.296 303.19 14.8 304.086 15.12 304.214C15.328 304.278 15.432 304.406 15.432 304.598L15.432 305.246C15.432 305.454 15.312 305.518 15.072 305.438L0.311987 300.182C0.103987 300.102 -1.31123e-05 299.974 -1.31046e-05 299.798ZM-1.35205e-05 309.313L-1.34922e-05 308.665C-1.34817e-05 308.425 0.0959865 308.345 0.287987 308.425C0.479987 308.505 2.91999 309.377 7.60799 311.041C12.296 312.705 14.8 313.601 15.12 313.73C15.328 313.793 15.432 313.921 15.432 314.114L15.432 314.761C15.432 314.969 15.312 315.034 15.072 314.954L0.311986 309.697C0.103986 309.617 -1.35282e-05 309.489 -1.35205e-05 309.313ZM-1.39365e-05 318.829L-1.39081e-05 318.181C-1.38976e-05 317.941 0.0959861 317.861 0.287986 317.941C0.479986 318.021 2.91999 318.893 7.60799 320.557C12.296 322.221 14.8 323.117 15.12 323.245C15.328 323.309 15.432 323.437 15.432 323.629L15.432 324.277C15.432 324.485 15.312 324.549 15.072 324.469L0.311986 319.213C0.103986 319.133 -1.39442e-05 319.005 -1.39365e-05 318.829ZM-1.43524e-05 328.345L-1.43241e-05 327.697C-1.43136e-05 327.457 0.0959857 327.377 0.287986 327.457C0.479986 327.537 2.91999 328.409 7.60799 330.073C12.296 331.737 14.8 332.633 15.12 332.761C15.328 332.825 15.432 332.953 15.432 333.145L15.432 333.793C15.432 334.001 15.312 334.065 15.072 333.985L0.311986 328.729C0.103986 328.649 -1.43601e-05 328.521 -1.43524e-05 328.345ZM-1.47683e-05 337.86L-1.474e-05 337.212C-1.47295e-05 336.972 0.0959853 336.892 0.287985 336.972C0.479985 337.052 2.91999 337.924 7.60799 339.588C12.296 341.252 14.8 342.148 15.12 342.276C15.328 342.34 15.432 342.468 15.432 342.66L15.432 343.308C15.432 343.516 15.312 343.58 15.072 343.5L0.311985 338.244C0.103985 338.164 -1.4776e-05 338.036 -1.47683e-05 337.86ZM-1.51843e-05 347.376L-1.5156e-05 346.728C-1.51455e-05 346.488 0.0959849 346.408 0.287985 346.488C0.479985 346.568 2.91998 347.44 7.60798 349.104C12.296 350.768 14.8 351.664 15.12 351.792C15.328 351.856 15.432 351.984 15.432 352.176L15.432 352.824C15.432 353.032 15.312 353.096 15.072 353.016L0.311985 347.76C0.103985 347.68 -1.5192e-05 347.552 -1.51843e-05 347.376ZM-1.56002e-05 356.892L-1.55719e-05 356.244C-1.55614e-05 356.004 0.0959844 355.924 0.287984 356.004C0.479984 356.084 2.91998 356.956 7.60798 358.62C12.296 360.284 14.8 361.18 15.12 361.308C15.328 361.372 15.432 361.5 15.432 361.692L15.432 362.34C15.432 362.548 15.312 362.612 15.072 362.532L0.311984 357.276C0.103984 357.196 -1.56079e-05 357.068 -1.56002e-05 356.892ZM-1.60162e-05 366.407L-1.59878e-05 365.759C-1.59774e-05 365.519 0.095984 365.439 0.287984 365.519C0.479984 365.599 2.91998 366.471 7.60798 368.135C12.296 369.799 14.8 370.695 15.12 370.823C15.328 370.887 15.432 371.015 15.432 371.207L15.432 371.855C15.432 372.063 15.312 372.127 15.072 372.047L0.311984 366.791C0.103984 366.711 -1.60239e-05 366.583 -1.60162e-05 366.407ZM-1.64321e-05 375.923L-1.64038e-05 375.275C-1.63933e-05 375.035 0.0959836 374.955 0.287984 375.035C0.479984 375.115 2.91998 375.987 7.60798 377.651C12.296 379.315 14.8 380.211 15.12 380.339C15.328 380.403 15.432 380.531 15.432 380.723L15.432 381.371C15.432 381.579 15.312 381.643 15.072 381.563L0.311984 376.307C0.103984 376.227 -1.64398e-05 376.099 -1.64321e-05 375.923ZM-1.68481e-05 385.438L-1.68197e-05 384.79C-1.68092e-05 384.55 0.0959832 384.47 0.287983 384.55C0.479983 384.63 2.91998 385.502 7.60798 387.166C12.296 388.83 14.8 389.726 15.12 389.855C15.328 389.918 15.432 390.046 15.432 390.239L15.432 390.886C15.432 391.094 15.312 391.159 15.072 391.079L0.311983 385.822C0.103983 385.742 -1.68557e-05 385.614 -1.68481e-05 385.438ZM-1.7264e-05 394.954L-1.72357e-05 394.306C-1.72252e-05 394.066 0.0959828 393.986 0.287983 394.066C0.479983 394.146 2.91998 395.018 7.60798 396.682C12.296 398.346 14.8 399.242 15.12 399.37C15.328 399.434 15.432 399.562 15.432 399.754L15.432 400.402C15.432 400.61 15.312 400.674 15.072 400.594L0.311983 395.338C0.103983 395.258 -1.72717e-05 395.13 -1.7264e-05 394.954ZM-1.76799e-05 404.47L-1.76516e-05 403.822C-1.76411e-05 403.582 0.0959824 403.502 0.287982 403.582C0.479982 403.662 2.91998 404.534 7.60798 406.198C12.296 407.862 14.8 408.758 15.12 408.886C15.328 408.95 15.432 409.078 15.432 409.27L15.432 409.918C15.432 410.126 15.312 410.19 15.072 410.11L0.311982 404.854C0.103982 404.774 -1.76876e-05 404.646 -1.76799e-05 404.47ZM-1.80959e-05 413.985L-1.80676e-05 413.337C-1.80571e-05 413.097 0.0959819 413.017 0.287982 413.097C0.479982 413.177 2.91998 414.049 7.60798 415.713C12.296 417.377 14.8 418.273 15.12 418.401C15.328 418.465 15.432 418.593 15.432 418.785L15.432 419.433C15.432 419.641 15.312 419.705 15.072 419.625L0.311982 414.369C0.103982 414.289 -1.81036e-05 414.161 -1.80959e-05 413.985ZM-1.85118e-05 423.501L-1.84835e-05 422.853C-1.8473e-05 422.613 0.0959815 422.533 0.287982 422.613C0.479982 422.693 2.91998 423.565 7.60798 425.229C12.296 426.893 14.8 427.789 15.12 427.917C15.328 427.981 15.432 428.109 15.432 428.301L15.432 428.949C15.432 429.157 15.312 429.221 15.072 429.141L0.311981 423.885C0.103981 423.805 -1.85195e-05 423.677 -1.85118e-05 423.501ZM-1.89278e-05 433.017L-1.88994e-05 432.369C-1.88889e-05 432.129 0.0959811 432.049 0.287981 432.129C0.479981 432.209 2.91998 433.081 7.60798 434.745C12.296 436.409 14.8 437.305 15.12 437.433C15.328 437.497 15.432 437.625 15.432 437.817L15.432 438.465C15.432 438.673 15.312 438.737 15.072 438.657L0.311981 433.401C0.103981 433.321 -1.89355e-05 433.193 -1.89278e-05 433.017ZM-1.93437e-05 442.532L-1.93154e-05 441.884C-1.93049e-05 441.644 0.0959807 441.564 0.287981 441.644C0.479981 441.724 2.91998 442.596 7.60798 444.26C12.296 445.924 14.8 446.82 15.12 446.948C15.328 447.012 15.432 447.14 15.432 447.332L15.432 447.98C15.432 448.188 15.312 448.252 15.072 448.172L0.311981 442.916C0.103981 442.836 -1.93514e-05 442.708 -1.93437e-05 442.532ZM-1.97596e-05 452.048L-1.97313e-05 451.4C-1.97208e-05 451.16 0.0959803 451.08 0.28798 451.16C0.47998 451.24 2.91998 452.112 7.60798 453.776C12.296 455.44 14.8 456.336 15.12 456.464C15.328 456.528 15.432 456.656 15.432 456.848L15.432 457.496C15.432 457.704 15.312 457.768 15.072 457.688L0.31198 452.432C0.10398 452.352 -1.97673e-05 452.224 -1.97596e-05 452.048ZM-2.01756e-05 461.563L-2.01473e-05 460.915C-2.01368e-05 460.675 0.0959799 460.595 0.28798 460.675C0.47998 460.755 2.91998 461.627 7.60798 463.291C12.296 464.955 14.8 465.851 15.12 465.98C15.328 466.043 15.432 466.171 15.432 466.364L15.432 467.011C15.432 467.219 15.312 467.284 15.072 467.204L0.31198 461.947C0.10398 461.867 -2.01833e-05 461.739 -2.01756e-05 461.563ZM-2.05915e-05 471.079L-2.05632e-05 470.431C-2.05527e-05 470.191 0.0959795 470.111 0.287979 470.191C0.479979 470.271 2.91998 471.143 7.60798 472.807C12.296 474.471 14.8 475.367 15.12 475.495C15.328 475.559 15.432 475.687 15.432 475.879L15.432 476.527C15.432 476.735 15.312 476.799 15.072 476.719L0.311979 471.463C0.103979 471.383 -2.05992e-05 471.255 -2.05915e-05 471.079ZM-2.10075e-05 480.595L-2.09791e-05 479.947C-2.09686e-05 479.707 0.095979 479.627 0.287979 479.707C0.479979 479.787 2.91998 480.659 7.60798 482.323C12.296 483.987 14.8 484.883 15.12 485.011C15.328 485.075 15.432 485.203 15.432 485.395L15.432 486.043C15.432 486.251 15.312 486.315 15.072 486.235L0.311979 480.979C0.103979 480.899 -2.10152e-05 480.771 -2.10075e-05 480.595ZM-2.14234e-05 490.11L-2.13951e-05 489.462C-2.13846e-05 489.222 0.0959786 489.142 0.287979 489.222C0.479979 489.302 2.91998 490.174 7.60798 491.838C12.296 493.502 14.8 494.398 15.12 494.526C15.328 494.59 15.432 494.718 15.432 494.91L15.432 495.558C15.432 495.766 15.312 495.83 15.072 495.75L0.311979 490.494C0.103979 490.414 -2.14311e-05 490.286 -2.14234e-05 490.11ZM-2.18393e-05 499.626L-2.1811e-05 498.978C-2.18005e-05 498.738 0.0959782 498.658 0.287978 498.738C0.479978 498.818 2.91998 499.69 7.60798 501.354C12.296 503.018 14.8 503.914 15.12 504.042C15.328 504.106 15.432 504.234 15.432 504.426L15.432 505.074C15.432 505.282 15.312 505.346 15.072 505.266L0.311978 500.01C0.103978 499.93 -2.1847e-05 499.802 -2.18393e-05 499.626ZM-2.22553e-05 509.142L-2.2227e-05 508.494C-2.22165e-05 508.254 0.0959778 508.174 0.287978 508.254C0.479978 508.334 2.91998 509.206 7.60798 510.87C12.296 512.534 14.8 513.43 15.12 513.558C15.328 513.622 15.432 513.75 15.432 513.942L15.432 514.59C15.432 514.798 15.312 514.862 15.072 514.782L0.311978 509.526C0.103978 509.446 -2.2263e-05 509.318 -2.22553e-05 509.142ZM-2.26712e-05 518.657L-2.26429e-05 518.009C-2.26324e-05 517.769 0.0959774 517.689 0.287977 517.769C0.479977 517.849 2.91998 518.721 7.60798 520.385C12.296 522.049 14.8 522.945 15.12 523.073C15.328 523.137 15.432 523.265 15.432 523.457L15.432 524.105C15.432 524.313 15.312 524.377 15.072 524.297L0.311977 519.041C0.103977 518.961 -2.26789e-05 518.833 -2.26712e-05 518.657ZM-2.30872e-05 528.173L-2.30588e-05 527.525C-2.30484e-05 527.285 0.095977 527.205 0.287977 527.285C0.479977 527.365 2.91998 528.237 7.60798 529.901C12.296 531.565 14.8 532.461 15.12 532.589C15.328 532.653 15.432 532.781 15.432 532.973L15.432 533.621C15.432 533.829 15.312 533.893 15.072 533.813L0.311977 528.557C0.103977 528.477 -2.30949e-05 528.349 -2.30872e-05 528.173ZM-2.35031e-05 537.688L-2.34748e-05 537.04C-2.34643e-05 536.8 0.0959765 536.72 0.287977 536.8C0.479977 536.88 2.91998 537.752 7.60798 539.416C12.296 541.08 14.8 541.976 15.12 542.105C15.328 542.168 15.432 542.296 15.432 542.489L15.432 543.136C15.432 543.344 15.312 543.409 15.072 543.329L0.311976 538.072C0.103976 537.992 -2.35108e-05 537.864 -2.35031e-05 537.688ZM-2.39191e-05 547.204L-2.38907e-05 546.556C-2.38802e-05 546.316 0.0959761 546.236 0.287976 546.316C0.479976 546.396 2.91998 547.268 7.60798 548.932C12.296 550.596 14.8 551.492 15.12 551.62C15.328 551.684 15.432 551.812 15.432 552.004L15.432 552.652C15.432 552.86 15.312 552.924 15.072 552.844L0.311976 547.588C0.103976 547.508 -2.39267e-05 547.38 -2.39191e-05 547.204ZM-2.4335e-05 556.72L-2.43067e-05 556.072C-2.42962e-05 555.832 0.0959757 555.752 0.287976 555.832C0.479976 555.912 2.91998 556.784 7.60798 558.448C12.296 560.112 14.8 561.008 15.12 561.136C15.328 561.2 15.432 561.328 15.432 561.52L15.432 562.168C15.432 562.376 15.312 562.44 15.072 562.36L0.311976 557.104C0.103976 557.024 -2.43427e-05 556.896 -2.4335e-05 556.72ZM-2.47509e-05 566.235L-2.47226e-05 565.587C-2.47121e-05 565.347 0.0959753 565.267 0.287975 565.347C0.479975 565.427 2.91998 566.299 7.60798 567.963C12.296 569.627 14.8 570.523 15.12 570.651C15.328 570.715 15.432 570.843 15.432 571.035L15.432 571.683C15.432 571.891 15.312 571.955 15.072 571.875L0.311975 566.619C0.103975 566.539 -2.47586e-05 566.411 -2.47509e-05 566.235ZM-2.51669e-05 575.751L-2.51386e-05 575.103C-2.51281e-05 574.863 0.0959749 574.783 0.287975 574.863C0.479975 574.943 2.91997 575.815 7.60797 577.479C12.296 579.143 14.8 580.039 15.12 580.167C15.328 580.231 15.432 580.359 15.432 580.551L15.432 581.199C15.432 581.407 15.312 581.471 15.072 581.391L0.311975 576.135C0.103975 576.055 -2.51746e-05 575.927 -2.51669e-05 575.751ZM-2.55828e-05 585.267L-2.55545e-05 584.619C-2.5544e-05 584.379 0.0959745 584.299 0.287974 584.379C0.479974 584.459 2.91997 585.331 7.60797 586.995C12.296 588.659 14.8 589.555 15.12 589.683C15.328 589.747 15.432 589.875 15.432 590.067L15.432 590.715C15.432 590.923 15.312 590.987 15.072 590.907L0.311974 585.651C0.103974 585.571 -2.55905e-05 585.443 -2.55828e-05 585.267ZM-2.59988e-05 594.782L-2.59704e-05 594.134C-2.59599e-05 593.894 0.095974 593.814 0.287974 593.894C0.479974 593.974 2.91997 594.846 7.60797 596.51C12.296 598.174 14.8 599.07 15.12 599.198C15.328 599.262 15.432 599.39 15.432 599.582L15.432 600.23C15.432 600.438 15.312 600.502 15.072 600.422L0.311974 595.166C0.103974 595.086 -2.60065e-05 594.958 -2.59988e-05 594.782ZM-2.64147e-05 604.298L-2.63864e-05 603.65C-2.63759e-05 603.41 0.0959736 603.33 0.287974 603.41C0.479974 603.49 2.91997 604.362 7.60797 606.026C12.296 607.69 14.8 608.586 15.12 608.714C15.328 608.778 15.432 608.906 15.432 609.098L15.432 609.746C15.432 609.954 15.312 610.018 15.072 609.938L0.311974 604.682C0.103974 604.602 -2.64224e-05 604.474 -2.64147e-05 604.298ZM-2.68306e-05 613.813L-2.68023e-05 613.165C-2.67918e-05 612.925 0.0959732 612.845 0.287973 612.925C0.479973 613.005 2.91997 613.877 7.60797 615.541C12.296 617.205 14.8 618.101 15.12 618.23C15.328 618.293 15.432 618.421 15.432 618.614L15.432 619.261C15.432 619.469 15.312 619.534 15.072 619.454L0.311973 614.197C0.103973 614.117 -2.68383e-05 613.989 -2.68306e-05 613.813ZM-2.72466e-05 623.329L-2.72183e-05 622.681C-2.72078e-05 622.441 0.0959728 622.361 0.287973 622.441C0.479973 622.521 2.91997 623.393 7.60797 625.057C12.296 626.721 14.8 627.617 15.12 627.745C15.328 627.809 15.432 627.937 15.432 628.129L15.432 628.777C15.432 628.985 15.312 629.049 15.072 628.969L0.311973 623.713C0.103973 623.633 -2.72543e-05 623.505 -2.72466e-05 623.329ZM-2.76625e-05 632.845L-2.76342e-05 632.197C-2.76237e-05 631.957 0.0959724 631.877 0.287972 631.957C0.479972 632.037 2.91997 632.909 7.60797 634.573C12.296 636.237 14.8 637.133 15.12 637.261C15.328 637.325 15.432 637.453 15.432 637.645L15.432 638.293C15.432 638.501 15.312 638.565 15.072 638.485L0.311972 633.229C0.103972 633.149 -2.76702e-05 633.021 -2.76625e-05 632.845ZM-2.80785e-05 642.36L-2.80501e-05 641.712C-2.80396e-05 641.472 0.095972 641.392 0.287972 641.472C0.479972 641.552 2.91997 642.424 7.60797 644.088C12.296 645.752 14.8 646.648 15.12 646.776C15.328 646.84 15.432 646.968 15.432 647.16L15.432 647.808C15.432 648.016 15.312 648.08 15.072 648L0.311972 642.744C0.103972 642.664 -2.80862e-05 642.536 -2.80785e-05 642.36ZM-2.84944e-05 651.876L-2.84661e-05 651.228C-2.84556e-05 650.988 0.0959715 650.908 0.287972 650.988C0.479972 651.068 2.91997 651.94 7.60797 653.604C12.296 655.268 14.8 656.164 15.12 656.292C15.328 656.356 15.432 656.484 15.432 656.676L15.432 657.324C15.432 657.532 15.312 657.596 15.072 657.516L0.311971 652.26C0.103971 652.18 -2.85021e-05 652.052 -2.84944e-05 651.876Z" fill="white" fill-opacity="0.5" />
                        </svg>
                    </div>
                </CardFrame>
            </CardBox>} />
    </ContainerPages>
}

export default DeckExplorer