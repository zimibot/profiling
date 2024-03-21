import { Upload } from "@suid/icons-material"
import ContainerPages from ".."
import { CardBox } from "../../component/cardBox"
import { Button, CircularProgress, Divider, LinearProgress } from "@suid/material"
import { api } from "../../helper/_helper.api"
import Swal from "sweetalert2"
import { createSignal, onCleanup, onMount } from "solid-js"
import { Loading } from "../../component/loading"

const FaceFinder = () => {
    const [image, setImage] = createSignal()
    const [isLoading, setisLoading] = createSignal()
    const [previewImg, setpreviewImg] = createSignal()
    const [previewImgConvert, setpreviewImgConvert] = createSignal()
    const [percentage, setPercentage] = createSignal(80); // Misalnya persentase awal
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
                    text: 'The image has been successfully cropped.',
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


    const onSelectimg = (id, url, linkCompare) => {

        setpreviewImgConvert(() => ({
            id,
            url,
            linkCompare
        }))
        setImage(d => d.map(s => ({
            ...s,
            active: id === s.currentDir
        })))
    }

    const onSearchTarget = () => {
        api().get(`/deck-explorer/result-face?file=${previewImgConvert().id}`)
    }

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
                                return <Button onClick={() => onSelectimg(a.currentDir, a.baseurl, a.destCompareLink)} variant="contained" color={a?.active ? "info" : "secondary"} class=" h-[100px]  !p-2  w-full border-solid !border-b !border-blue-500">
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
                            <div className="absolute w-full h-full left-0 top-0 space-y-4">
                                <img className="object-contain w-full" src={previewImgConvert().linkCompare}></img>
                                <Button onClick={onSearchTarget} variant="contained" color="info" fullWidth>SUBMIT TO FACE FINDER</Button>
                            </div>
                        </div>

                    </> : <div className="absolute w-full h-full flex items-center justify-center">
                        FACE NOT SELECTED, PLEASE UPLOAD YOUT IMAGE FIRST
                    </div>}
                </div>

            </CardBox>
            <div className="w-[450px] flex flex-col">
                <CardBox title={"RESULT "} className=" flex-col flex gap-4 flex-1">
                    <div className="relative flex-1">
                        <div className="absolute w-full h-full top-0 left-0 overflow-auto space-y-4">
                            <div className="flex justify-between gap-4 items-center bg-primarry-2 p-2 border-b-2 border-white">
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
                                                    stroke={calculateColor(percentage())}
                                                    stroke-width="10"
                                                    stroke-dasharray={circumference}
                                                    stroke-dashoffset={circumference - (percentage() / 100) * circumference}
                                                    transform={rotateCircle(-90)} // Memutar 90 derajat ke kiri
                                                />
                                            </svg>
                                            <span class="absolute text-xl font-semibold text-[15px]">{percentage()}%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div>Jaya Kusuma</div>
                                        <div>Laki laki</div>
                                    </div>
                                </div>
                                <div>
                                    <Button variant="contained" color="info">DETAIL</Button>
                                </div>
                            </div>
                            <div className="flex justify-between gap-4 items-center bg-primarry-2 p-2 border-b-2 border-white">
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
                                                    stroke={calculateColor(percentage())}
                                                    stroke-width="10"
                                                    stroke-dasharray={circumference}
                                                    stroke-dashoffset={circumference - (percentage() / 100) * circumference}
                                                    transform={rotateCircle(-90)} // Memutar 90 derajat ke kiri
                                                />
                                            </svg>
                                            <span class="absolute text-xl font-semibold text-[15px]">{percentage()}%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div>Jaya Kusuma</div>
                                        <div>Laki laki</div>
                                    </div>
                                </div>
                                <div>
                                    <Button variant="contained" color="info">DETAIL</Button>
                                </div>
                            </div>


                        </div>
                    </div>
                </CardBox>
            </div>
        </div>
    </ContainerPages>
}

export default FaceFinder