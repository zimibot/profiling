import { Upload } from "@suid/icons-material"
import ContainerPages from ".."
import { CardBox } from "../../component/cardBox"
import { Button, CircularProgress, Divider, LinearProgress } from "@suid/material"
import { api } from "../../helper/_helper.api"
import Swal from "sweetalert2"
import { createSignal, onCleanup } from "solid-js"
import { Loading } from "../../component/loading"

const FaceFinder = () => {
    const [image, setImage] = createSignal()
    const [isLoading, setisLoading] = createSignal()
    const [previewImg, setpreviewImg] = createSignal()

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


    const onSelectimg = (id) => {

        console.log(id)

        setImage(d => d.map(s => ({
            ...s,
            active: id === s.currentDir
        })))
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

                <div className="flex-1 overflow-auto relative">
                    <Divider sx={{ borderColor: "#333" }}></Divider>
                    <div className=" grid grid-cols-3 gap-3 absolute w-full h-full top-0 left-0 p-2">
                        {image() ? image().length === 0 ? <div className="absolute w-full h-full flex items-center justify-center">We could not find a face!</div> : image().map(a => {
                            return <Button onClick={() => onSelectimg(a.currentDir)} variant="contained" color={a?.active ? "info" : "secondary"} class=" h-[180px]  !p-2  w-full border-solid !border-b !border-blue-500">
                                <img className="object-contain w-full h-full" src={a.baseurl}></img>
                            </Button>
                        }) : isLoading() ? <Loading></Loading> : <div className="col-span-full flex justify-center items-center">
                            PLEASE UPLOAD YOUR IMAGE
                        </div>}

                    </div>

                </div>
            </div>
            <div className="flex flex-col flex-1 relative">
                <div className="grid  grid-cols-2 lg:grid-cols-2  xl:grid-cols-3  flex-1 gap-4 absolute w-full h-full left-0 top-0 overflow-auto">
                    <div>
                        <CardBox title={"JAYANTO"} className=" flex-col flex gap-4">
                            <div className="h-[250px] w-full">
                                <img className="object-contain w-full h-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJORE4AsMDV2U8US_ZFGe6R7xh8biBqqk8erQTmu11lXcHz7Qq-zDVBprgUfvS7mq5k7U&usqp=CAU"></img>
                            </div>
                            <Button variant="contained" color="secondary" fullWidth>DETAIL</Button>
                        </CardBox>
                    </div>
                    <div>
                        <CardBox title={"JAYANTO"} className=" flex-col flex gap-4">
                            <div className="h-[250px] w-full">
                                <img className="object-contain w-full h-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJORE4AsMDV2U8US_ZFGe6R7xh8biBqqk8erQTmu11lXcHz7Qq-zDVBprgUfvS7mq5k7U&usqp=CAU"></img>
                            </div>
                            <Button variant="contained" color="secondary" fullWidth>DETAIL</Button>
                        </CardBox>
                    </div>
                    <div>
                        <CardBox title={"JAYANTO"} className=" flex-col flex gap-4">
                            <div className="h-[250px] w-full">
                                <img className="object-contain w-full h-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJORE4AsMDV2U8US_ZFGe6R7xh8biBqqk8erQTmu11lXcHz7Qq-zDVBprgUfvS7mq5k7U&usqp=CAU"></img>
                            </div>
                            <Button variant="contained" color="secondary" fullWidth>DETAIL</Button>
                        </CardBox>
                    </div>
                    <div>
                        <CardBox title={"JAYANTO"} className=" flex-col flex gap-4">
                            <div className="h-[250px] w-full">
                                <img className="object-contain w-full h-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJORE4AsMDV2U8US_ZFGe6R7xh8biBqqk8erQTmu11lXcHz7Qq-zDVBprgUfvS7mq5k7U&usqp=CAU"></img>
                            </div>
                            <Button variant="contained" color="secondary" fullWidth>DETAIL</Button>
                        </CardBox>
                    </div>
                    <div>
                        <CardBox title={"JAYANTO"} className=" flex-col flex gap-4">
                            <div className="h-[250px] w-full">
                                <img className="object-contain w-full h-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJORE4AsMDV2U8US_ZFGe6R7xh8biBqqk8erQTmu11lXcHz7Qq-zDVBprgUfvS7mq5k7U&usqp=CAU"></img>
                            </div>
                            <Button variant="contained" color="secondary" fullWidth>DETAIL</Button>
                        </CardBox>
                    </div>

                </div>
            </div>
        </div>
    </ContainerPages>
}

export default FaceFinder