import { Upload } from "@suid/icons-material"
import ContainerPages from ".."
import { CardBox } from "../../component/cardBox"
import { Tags } from "../../component/tags"
import { Button, Divider } from "@suid/material"
import { api } from "../../helper/_helper.api"
import Swal from "sweetalert2"
import { createSignal } from "solid-js"
import { Loading } from "../../component/loading"

const FaceFinder = () => {
    const [image, setImage] = createSignal()
    const [isLoading, setisLoading] = createSignal()
    const [previewImg, setpreviewImg] = createSignal()

    const onChangeFiles = (a) => {

        const reader = new FileReader();


        reader.onload = function (e) {
            const base64Image = e.target.result;
            setpreviewImg(base64Image)
        }


        setisLoading(true)



        let files = a.target.files[0];

        reader.readAsDataURL(files);
        const form = new FormData();

        form.append("file", files);
        form.append("title", "files");

        // Menentukan headers untuk request
        const headers = {
            'Content-Type': 'multipart/form-data',
        };

        setImage()

        // Pastikan fungsi api() Anda dapat menerima parameter konfigurasi tambahan seperti headers
        api().post("/deck-explorer/cropt_image", form, { headers })
            .then(response => {
                let data = response.data.items

                setImage(data)

                // Jika berhasil, tampilkan notifikasi sukses
                Swal.fire({
                    title: 'Success!',
                    text: 'Your file has been successfully uploaded.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

                isLoading(false)

            })
            .catch(error => {
                // Jika gagal, tampilkan notifikasi error
                Swal.fire({
                    title: 'Failed!',
                    text: 'Your file failed to upload.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    };

    return <ContainerPages>
        <div className="flex flex-1 pt-4 gap-4">
            <div className="w-[500px] flex flex-col gap-4">
                <div className="h-72 relative p-4 w-full bg-primarry-1">
                    <Button class="w-full h-full !border-[2px] !border-dotted flex items-center justify-center relative">
                        {previewImg() ? <img className=" h-full w-full object-contain" src={previewImg()}></img> : <div className="flex gap-2">
                            <Upload></Upload>
                            <div> UPLOAD YOUR IMAGE</div>
                        </div>}

                        <input onChange={onChangeFiles} className="absolute w-full h-full opacity-0" type="file"></input>
                    </Button>

                </div>

                <div className="flex-1 overflow-auto relative">
                    <Divider sx={{ borderColor: "#333" }}></Divider>
                    <div className=" grid grid-cols-3 gap-3 absolute w-full h-full top-0 left-0 p-2">
                        {image() ? image().map(a => {
                            return <Button variant="contained" color="secondary" class=" h-[180px]  !p-2  w-full !border-b-2 !border-blue-500">
                                <img className="object-contain w-full h-full" src={a}></img>
                            </Button>
                        }) : isLoading() ? <Loading></Loading> : <div className="col-span-full flex justify-center items-center">
                            PLEASE UPLOAD YOUR IMAGE
                        </div>}

                        {/* <Button variant="contained" color="secondary" class=" h-[180px] bg-primarry-1 !p-2  w-full">
                            <img className="object-contain w-full h-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJORE4AsMDV2U8US_ZFGe6R7xh8biBqqk8erQTmu11lXcHz7Qq-zDVBprgUfvS7mq5k7U&usqp=CAU"></img>
                        </Button>
                        <Button variant="contained" color="secondary" class=" h-[180px] bg-primarry-1 !p-2  w-full">
                            <img className="object-contain w-full h-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJORE4AsMDV2U8US_ZFGe6R7xh8biBqqk8erQTmu11lXcHz7Qq-zDVBprgUfvS7mq5k7U&usqp=CAU"></img>
                        </Button> */}
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