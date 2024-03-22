import { Close, Upload } from "@suid/icons-material"
import ContainerPages from ".."
import { CardBox } from "../../component/cardBox"
import { Button, CircularProgress, Divider, LinearProgress } from "@suid/material"
import { api } from "../../helper/_helper.api"
import Swal from "sweetalert2"
import { createEffect, createSignal, onCleanup, onMount } from "solid-js"
import { Loading } from "../../component/loading"
import { notify } from "../../component/notify"
import { useAppState } from "../../helper/_helper.context"
import { OnSearch } from "../Deck Explorer/searchFrom"
import { useNavigate } from "@solidjs/router"
function _parse(nomorNIK) {
    nomorNIK = String(nomorNIK);

    if (nomorNIK.length == 16) {
        let thisYear = new Date().getFullYear().toString().substr(-2);
        let thisCode = nomorNIK.substr(-4);

        let thisRegion = {
            provinsi: nomorNIK.substr(0, 2),
            kota: nomorNIK.substr(2, 2),
            kabupaten: nomorNIK.substr(2, 2),
            kecamatan: nomorNIK.substr(4, 2)
        }
        let thisDate = {
            hari: (nomorNIK.substr(6, 2) > 40) ? nomorNIK.substr(6, 2) - 40 : nomorNIK.substr(6, 2),
            bulan: nomorNIK.substr(8, 2),
            tahun: (nomorNIK.substr(10, 2) > 1 && nomorNIK.substr(10, 2) < thisYear) ? "20" + nomorNIK.substr(10, 2) : "19" + nomorNIK.substr(10, 2)
        }

        thisDate.lahir = new Date(thisDate.hari + "/" + thisDate.bulan + "/" + thisDate.tahun).toLocaleDateString();
        
        return {
            nik: nomorNIK,
            wilayah: thisRegion,
            tanggal: thisDate,
            uniq: thisCode,
            _link: {
                _wilayah: 'http://www.kemendagri.go.id/pages/data-wilayah'
            }
        }   
    } else {
        throw new Error(`Nomor NIK harus 16 digit`);
    }
}



const FaceFinder = () => {
    const navi = useNavigate()

    const [items, { update }] = useAppState()

    const [image, setImage] = createSignal()
    const [isLoading, setisLoading] = createSignal()
    const [previewImg, setpreviewImg] = createSignal()
    const [previewImgConvert, setpreviewImgConvert] = createSignal()
    const [resultData, setResultData] = createSignal()
    const [resultLoading, setresultLoading] = createSignal()
    const [resultDetail, setResultDetail] = createSignal()
    const radius = 70;
    const circumference = 2 * Math.PI * radius;

    const calculateColor = (percentage) => {
        const hue = percentage * 1.4;
        return `hsl(${hue}, 100%, 50%)`;
    };

    // Fungsi untuk memutar lingkaran
    const rotateCircle = (degrees) => `rotate(${degrees}, 80, 80)`;



    const onChangeFiles = (a) => {
        let files = a.target.files[0];

        setResultData()

        if (!files) {
            // Menampilkan notifikasi jika tidak ada file yang dipilih
            Swal.fire({
                title: 'No File Selected',
                text: 'Please select a file to proceed with the cropping process.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return; // Menghentikan eksekusi lebih lanjut
        }

        const reader = new FileReader();

        reader.onload = function (e) {
            const base64Image = e.target.result;
            setpreviewImg(base64Image);
        };

        setisLoading(true);

        reader.readAsDataURL(files);
        const form = new FormData();

        form.append("file", files);

        // Menentukan headers untuk request
        const headers = {
            'Content-Type': 'multipart/form-data',
        };
        setpreviewImgConvert()

        setImage()
        // Reset state image pada awal proses
        // Pastikan fungsi api() Anda dapat menerima parameter konfigurasi tambahan seperti headers
        api().post("/deck-explorer/cropt_image?dir=image-ori&dircropt=result-cropt", form, { headers })
            .then(response => {
                let data = response.data.items;

                setImage(data);
                // Jika berhasil, tampilkan notifikasi sukses
                Swal.fire({
                    title: 'Success!',
                    text: 'The image has been successfully find face.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

                document.getElementById('myFileInput').value = "";


                setisLoading(false);
            })
            .catch(error => {
                // Jika gagal, tampilkan notifikasi error
                Swal.fire({
                    title: 'Processing Failed',
                    text: 'We could not find a face in the selected file. Please try with a different image.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });

                document.getElementById('myFileInput').value = "";

                setisLoading(false);
                // Reset state image jika terjadi error
                setImage();
            });
    };


    const onSelectimg = (id, url, linkCompare, baseTitle) => {

        setpreviewImgConvert(() => ({
            id,
            url,
            linkCompare,
            baseTitle
        }))
        setImage(d => d.map(s => ({
            ...s,
            active: id === s.currentDir
        })))
    }

    const onSearchTarget = () => {
        // Menampilkan notifikasi loading
        Swal.fire({
            title: 'Please wait...',
            html: 'We are fetching the data.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },
        });

        setresultLoading(true)



        api().get(`/deck-explorer/result-face?file=${previewImgConvert().id}`)
            .then(s => {
                // Data berhasil diambil, menutup notifikasi loading
                Swal.close();

                // Menampilkan notifikasi sukses
                Swal.fire({
                    icon: 'success',
                    title: 'Data Retrieved Successfully',
                    text: 'Your data has been successfully fetched.',
                });

                let data = s.data.items

                let result = data.result.map((a) => {

                    const hasil = parseNIK(a.nik);
                    const umur = hitungUmur(hasil.tanggalLahir);
                    const jenisKelamin = hasil.jenisKelamin
                    const tgl = hasil.tanggalLahir

                    return ({
                        ...a,
                        umur,
                        tgl,
                        jenisKelamin
                    })
                })

                data = {
                    ...data,
                    result
                }

                console.log(data)



                setResultData(a => ({ ...a, [previewImgConvert().baseTitle]: data }));

                setresultLoading(false)
            })
            .catch(error => {
                // Terjadi error, menutup notifikasi loading
                Swal.close();

                setResultData()
                setresultLoading(false)
                // Menampilkan notifikasi error
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Unable to fetch the data.',
                });
            });
    }


    const onDetail = async (id) => {

        api().get(`/deck-explorer/sna-data-more?type=id_data&keyword=${id}`).then(s => {
            console.log(s.data.items?.id_data)

            let data = s.data.items?.id_data
            const column = []
            if (data) {
                for (const key in data) {
                    console.log(key)
                    column.push(key)
                }
                setResultDetail({
                    data,
                    column,
                    id
                })
            }

        })



    }

    const onAddMarkedProfile = async () => {
        try {
            let id = resultData().id
            let data = { search: id, type: "id_data", path: `/deck-explorer/search-result/database-information/${id}` }
            let postLogin = await OnSearch(data)
            let dataSearch = postLogin.data.items
            notify({ title: "Search Keyword", text: `${id} Success` })
            update(d => ({ ...d, dataSearch, terkait: dataSearch.terkait }))
            localStorage.setItem("dataSearch", JSON.stringify(dataSearch))
            localStorage.setItem("typeSearch", "PERSONAL ID")
            navi(`/deck-explorer/search-result/database-information/${id}`)

        } catch (error) {
            console.log(error)
        }
    }

    const onClose = () => {
        setResultDetail()
    }

    createEffect(() => {
        console.log(resultData())
    })



    return <ContainerPages>
        <div className="flex flex-1 pt-4 gap-4">
            <div className="w-[500px] flex flex-col gap-4">
                <div className="h-72 relative p-4 w-full bg-primarry-1">
                    <Button disabled={isLoading()} class="w-full h-full !border-[2px] !border-dotted flex items-center justify-center relative">
                        {previewImg() ? <img className=" h-full w-full object-contain" src={previewImg()}></img> : <div className="flex gap-2">
                            <Upload></Upload>
                            <div> UPLOAD YOUR IMAGE</div>
                        </div>}

                        {isLoading() && <div className="w-full h-full absolute bg-primarry-1 bg-opacity-75 flex items-center justify-center gap-2">
                            <div className="flex gap-2 items-center flex-col">
                                <span>Processing faces in the image</span>
                                <div className="w-full"><LinearProgress color="warning" size={20}></LinearProgress></div>
                            </div>
                        </div>}

                        <input disabled={isLoading()} id="myFileInput" onChange={onChangeFiles} className="absolute w-full h-full opacity-0" type="file"></input>
                    </Button>

                </div>

                <div className="flex-1 overflow-auto relative flex flex-col">
                    <div className="px-2">
                        <div className="flex justify-between"><span>FACE{'(S)'} DETECTED</span> <span> {image() && `Total ${image()?.length || 0}`}</span></div>
                        <Divider sx={{ borderColor: "#333" }}></Divider>
                    </div>
                    <div className="relative flex-1">
                        <div className=" grid grid-cols-4 gap-3 absolute w-full h-full top-0 left-0 p-2 auto-rows-min"  >
                            {image() ? image()?.length === 0 ? <div className="absolute w-full h-full flex items-center justify-center">We could not find a face!</div> : image().map(a => {
                                return <Button onClick={() => onSelectimg(a.currentDir, a.baseurl, a.destCompareLink, a.baseTitle)} variant="contained" color={a?.active ? "info" : "secondary"} class=" h-[100px]  !p-2  w-full border-solid !border-b !border-blue-500">
                                    <img className="object-contain w-full h-full" src={a.baseurl}></img>
                                </Button>
                            }) : isLoading() ? <Loading></Loading> : <div className="col-span-full flex justify-center items-center absolute w-full h-full">
                                PLEASE UPLOAD YOUR IMAGE
                            </div>}

                        </div>

                    </div>
                </div>
            </div>
            <CardBox title={"SELECTED FACE"} className=" flex-col relative flex gap-4 flex-1">
                <div className="absolute w-full h-full left-0 top-0 p-4 flex gap-4 flex-1 flex-col">
                    {previewImgConvert() ? <>
                        <div className="flex-1 relative">
                            <div className="absolute w-full h-full left-0 top-0 space-y-4 flex flex-col items-center justify-center">
                                <img className="object-contain w-full" src={previewImgConvert().linkCompare}></img>
                                <Button onClick={onSearchTarget} variant="contained" color="info" fullWidth>SUBMIT TO FACE FINDER</Button>
                            </div>
                        </div>

                    </> : <div className="absolute w-full h-full flex items-center justify-center">
                        FACE NOT SELECTED, PLEASE UPLOAD YOUT IMAGE FIRST
                    </div>}
                </div>
                {resultDetail() && <div className="absolute w-full h-full bg-black top-0 left-0 bg-opacity-20  flex justify-end">
                    <div className="w-[450px] h-full bg-primarry-1 relative flex flex-col">
                        <div className="flex p-4 justify-between items-center">
                            <div className="text-lg">
                                <Button onClick={onClose} size="small" startIcon={<Close color="error"></Close>}>
                                    <span className="text-lg">  DETAIL RESULT</span>
                                </Button>

                            </div>
                            <div>
                                <Button onClick={onAddMarkedProfile} size="small" color="info" variant="contained">
                                    ADD MARKED PROFILE
                                </Button>
                            </div>
                        </div>
                        <Divider sx={{ borderColor: "#222" }}></Divider>

                        <div className="flex flex-col gap-2 p-4 relative flex-1">
                            <div className="absolute w-full h-full left-0 p-2 flex flex-col gap-2 overflow-auto top-0">
                                {resultDetail().column.map(s => {
                                    return <div className="bg-primarry-2 w-full p-2 grid gap-2 justify-between border-b-2 border-white">
                                        <div>
                                            {s}
                                        </div>
                                        <div className="text-blue-400">
                                            {s === "FOTO" ? <img className=" h-20 object-contain" src={"data:image/png;base64," + resultDetail().data[s]}></img> : resultDetail().data[s]}
                                        </div>
                                    </div>
                                })}
                            </div>


                        </div>

                    </div>
                </div>}

            </CardBox>
            <div className="w-[450px] flex flex-col">
                <CardBox title={"RESULT "} className=" flex-col flex gap-4 flex-1">
                    <div className="relative flex-1">
                        <div className="absolute w-full h-full top-0 left-0 overflow-auto space-y-4">
                            {resultData() ? resultData()[previewImgConvert().baseTitle] ? resultData()[previewImgConvert().baseTitle].result.map(a => {
                                return <div className="flex justify-between gap-4 items-center bg-primarry-2 p-2 border-b-2 border-white">
                                    <div className="flex gap-2 items-center">
                                        <div>
                                            <div class="flex items-center justify-center">
                                                <svg width="55" height="55" viewBox="0 0 160 160">
                                                    <circle
                                                        cx="80"
                                                        cy="80"
                                                        r={radius}
                                                        fill="none"
                                                        stroke="#222"
                                                        stroke-width="10"
                                                        stroke-dasharray={circumference}
                                                        transform={rotateCircle(-90)} // Memutar 90 derajat ke kiri
                                                    />
                                                    <circle
                                                        cx="80"
                                                        cy="80"
                                                        r={radius}
                                                        fill="none"
                                                        stroke={calculateColor(a.score)}
                                                        stroke-width="10"
                                                        stroke-dasharray={circumference}
                                                        stroke-dashoffset={circumference - (a.score / 100) * circumference}
                                                        transform={rotateCircle(-90)} // Memutar 90 derajat ke kiri
                                                    />
                                                </svg>
                                                <span class="absolute  font-semibold text-[15px]">{a.score}%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div>Jaya Kusuma</div>
                                            <div>{a.jenisKelamin}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <Button onClick={() => onDetail(a.nik)} variant="contained" color="info">DETAIL</Button>
                                    </div>
                                </div>
                            }) : <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center">
                                NO RESULT</div> : resultLoading() ? <Loading></Loading> : <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center">
                                    NO RESULT</div>}

                        </div>
                    </div>
                </CardBox>
            </div>
        </div>
    </ContainerPages>
}

export default FaceFinder