import { createFormControl, createFormGroup } from "solid-forms";
import { DefaultInput } from "../../../component/form/input"
import { Tags } from "../../../component/tags";
import { Button, Chip } from "@suid/material";
import { Mason, createMasonryBreakpoints } from 'solid-mason';
import { createSignal } from "solid-js";
import { Navigate, useLocation, useNavigate } from "@solidjs/router";
import ContainerPages from "../..";
import { CardBox } from "../../../component/cardBox";
import { useAppState } from "../../../helper/_helper.context";
import { api } from "../../../helper/_helper.api";
import Swal from "sweetalert2";
const breakpoints = createMasonryBreakpoints(() => [
    { query: '(min-width: 1080px)', columns: 4 },
    { query: '(min-width: 768px) and (max-width: 1080px)', columns: 3 },
]);
const CreateNewProfile = () => {
    const location = useLocation()
    const [items] = useAppState()
    const [setLoading] = createSignal(false)
    const group = createFormGroup({
        profile_name: createFormControl("", {
            required: true,
        }),
        case_group: createFormControl("", {
            required: true,
        }),
        remarks: createFormControl("", {
            required: true,
        }),
    });


    const [someArray] = createSignal(items()?.hasilSearch || [])

    const navi = useNavigate()

    const onSubmit = (e) => {
        e.preventDefault()
        let type = localStorage.getItem("typeSearch")
        let keyword = location.state?.keyword
        let redirectPath = `/deck-explorer/marked-profile/${keyword}/identification`
        let data = {
            ...group.value,
            keyword,
            data: someArray(),
            type,
            path: redirectPath
        }

        setLoading(true)

        api().post("deck-explorer/marked-profile", data).then(d => {
            Swal.fire({
                icon: "success",
                text: d.data.message,
                title: "INFO",
                didClose: () => {
                    navi(redirectPath)

                }
            })
            setLoading(false)
        }).catch((d) => {
            // Swal.fire({
            //     icon: "error",
            //     text: d.response.data.message,
            //     title: "oops"
            // })
            // setLoading(false)
        })



    }

    return <ContainerPages>
        <div className="py-6 grid lg:grid-cols-3  gap-4">
            <div className="flex-1 flex flex-col">
                <CardBox title={"CREATE NEW PROFILE"}>
                    <div className="grid">
                        <div className="col-span-2 px-4 flex flex-col justify-center">
                            <form onSubmit={onSubmit} className="space-y-1 py-2">
                                <div>
                                    <Tags label="NEW PROFILE NAME"></Tags>
                                    <DefaultInput placeholder="input field" removeicon={true} control={group.controls.profile_name}></DefaultInput>
                                </div>
                                <div>
                                    <Tags label="CASE"></Tags>
                                    <DefaultInput placeholder="input field" removeicon={true} control={group.controls.case_group}></DefaultInput>
                                </div>
                                <div>
                                    <Tags label="REMARKS"></Tags>
                                    <DefaultInput placeholder="input field" removeicon={true} control={group.controls.remarks}></DefaultInput>
                                </div>
                                <div className="!mt-3 flex justify-end gap-4">
                                    <Button color="error" variant="outlined" size="large">
                                        CANCEL
                                    </Button>
                                    <Button type="submit" color="secondary" variant="contained" size="large">
                                        SUBMIT
                                    </Button>
                                </div>
                            </form>
                            <div>
                                <Tags label={"ATTENTION"}></Tags>
                                <div>
                                    <svg width="188" height="41" viewBox="0 0 188 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.70834 35.875H39.2917L20.5 3.41663L1.70834 35.875ZM22.2083 30.75H18.7917V27.3333H22.2083V30.75ZM22.2083 23.9166H18.7917V17.0833H22.2083V23.9166Z" fill="white" />
                                        <path d="M69.5 14.5208C67.9454 14.5208 64.8021 15.3066 64.8021 16.8783V24.7708H67.3646V32.4583H71.6354V24.7708H74.1979V16.8783C74.1979 15.3237 71.0546 14.5208 69.5 14.5208ZM69.5 3.41663C60.0529 3.41663 52.4167 11.0529 52.4167 20.5C52.4167 29.947 60.0529 37.5833 69.5 37.5833C78.9471 37.5833 86.5833 29.93 86.5833 20.5C86.5833 11.07 78.93 3.41663 69.5 3.41663ZM69.5 34.1666C61.9492 34.1666 55.8333 28.0508 55.8333 20.5C55.8333 12.9491 61.9492 6.83329 69.5 6.83329C77.0508 6.83329 83.1667 12.9491 83.1667 20.5C83.1667 28.0508 77.0508 34.1666 69.5 34.1666Z" fill="white" />
                                        <path d="M69.5 13.6666C70.9152 13.6666 72.0625 12.5194 72.0625 11.1041C72.0625 9.6889 70.9152 8.54163 69.5 8.54163C68.0848 8.54163 66.9375 9.6889 66.9375 11.1041C66.9375 12.5194 68.0848 13.6666 69.5 13.6666Z" fill="white" />
                                        <path d="M118.5 3.41663C109.07 3.41663 101.417 11.07 101.417 20.5C101.417 29.93 109.07 37.5833 118.5 37.5833C127.93 37.5833 135.583 29.93 135.583 20.5C135.583 11.07 127.93 3.41663 118.5 3.41663ZM104.833 20.5C104.833 12.9491 110.949 6.83329 118.5 6.83329C121.66 6.83329 124.565 7.90954 126.871 9.72038L107.72 28.8708C105.844 26.4845 104.827 23.5355 104.833 20.5ZM118.5 34.1666C115.34 34.1666 112.435 33.0904 110.129 31.2795L129.28 12.1291C131.156 14.5154 132.173 17.4644 132.167 20.5C132.167 28.0508 126.051 34.1666 118.5 34.1666Z" fill="white" />
                                        <path d="M168.077 16.8137C163.592 16.8137 159.534 20.245 159.534 25.5698C159.534 29.115 162.382 33.315 168.077 38.17C173.772 33.315 176.619 29.115 176.619 25.5698C176.619 20.245 172.562 16.8137 168.077 16.8137ZM168.077 27.4919C166.895 27.4919 165.941 26.538 165.941 25.3562C165.941 24.1745 166.895 23.2206 168.077 23.2206C169.258 23.2206 170.212 24.1745 170.212 25.3562C170.212 26.538 169.258 27.4919 168.077 27.4919ZM168.077 9.695C170.825 9.695 173.316 10.8055 175.124 12.6137L173.117 14.6212C171.777 13.2899 169.965 12.5427 168.077 12.5427C166.188 12.5427 164.376 13.2899 163.037 14.6212L161.029 12.6137C161.954 11.6867 163.052 10.9517 164.262 10.4508C165.471 9.94989 166.768 9.69304 168.077 9.695ZM179.154 8.59871L177.146 10.6062C174.825 8.28549 171.622 6.8475 168.091 6.8475C164.56 6.8475 161.342 8.28549 159.022 10.592L157 8.58448C159.848 5.75121 163.763 4 168.091 4C172.419 4 176.32 5.75121 179.154 8.59871Z" fill="white" />
                                    </svg>

                                </div>
                                <div className="text-[13px] text-[#757575]  py-2 space-y-2">
                                    When creating a new profile on the platform and proceeding to save it, it is vital to thoroughly validate the accuracy of the provided information. The profiles you save should exclusively pertain to legitimate operational targets, clearly excluding innocent civilians or non-involved individuals. In the event of an inadvertent selection error, it's crucial to understand that the application operates within the framework of relevant laws and regulations.
                                    <br></br>
                                    <br></br>
                                    Any misdirection or misidentification that exceeds the specified operational boundaries will be subject to the established legal procedures. By steadfastly adhering to these explicit guidelines, you actively contribute to maintaining the application's purpose and upholding its utmost integrity.

                                    <br></br>
                                    <br></br>
                                    This approach fosters an environment that unequivocally encourages fair and responsible application usage, while seamlessly aligning with the core mission objectives and unwavering ethical principles."
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBox>
            </div>
            <div className="col-span-2 flex-1 flex flex-col">
                <CardBox className="flex-1 relative min-h-[600px]" title={"SELECTED INFORMATION"}>
                    <div className="absolute left-0 top-0 p-3 overflow-auto h-full w-full space-y-4">

                        {someArray()?.map(datas => {
                            return <div className="space-y-3">
                                <div className="border border-primarry-2 px-4">
                                    <Tags label={<span>DATA DARI : <b>{datas.label}</b></span>} />
                                </div>
                                <Mason
                                    as="div"
                                    items={datas.data}
                                    columns={breakpoints()}
                                >
                                    {(item) => {
                                        return <div className="p-1">
                                            <div className="flex flex-col border border-primarry-2 pl-3 pr-5 pb-2 break-words max-w-xs gap-4">
                                                <Tags className="font-bold" label={item.label}></Tags>
                                                <div className="max-h-80 overflow-auto flex flex-wrap gap-2">
                                                    {item.data.map(d => {
                                                        return <div>
                                                            {d.label.length < 300 ? <Chip color="secondary" sx={{
                                                                borderRadius: 0,
                                                            }} label={d.label} ></Chip> : <div>
                                                                <img className="w-20" src={d.label} />
                                                            </div>}

                                                        </div>
                                                    })}
                                                </div>

                                            </div>
                                        </div>
                                    }}
                                </Mason>
                            </div>
                        })}

                        {/* <Tags label="INFORMATION SYSTEM" />
                        <div className="flex flex-wrap gap-2">
                            <div className="flex flex-col border border-primarry-2 pl-3 pr-5 pb-2 max-w-xs">
                                <Tags className="font-bold" label={"ID NUMBER"}></Tags>
                                <Chip color="secondary" sx={{
                                    borderRadius: 0
                                }} label="83878192" />
                            </div>
                            <div className="flex flex-col border border-primarry-2 pl-3 pr-5 pb-2 max-w-xs">
                                <Tags className="font-bold" label={"IMSI"}></Tags>
                                <Chip color="secondary" sx={{
                                    borderRadius: 0
                                }} label="773623920283929"></Chip>
                            </div>
                            <div className="flex flex-col border border-primarry-2 pl-3 pr-5 pb-2 max-w-xs">
                                <Tags className="font-bold" label={"IMEI"}></Tags>
                                <Chip color="secondary" sx={{
                                    borderRadius: 0
                                }} label="773623920283929"></Chip>
                            </div>
                            <div className="flex flex-col border border-primarry-2 pl-3 pr-5 pb-2 max-w-xs">
                                <Tags className="font-bold" label={"NETWORK STATUS"}></Tags>
                                <Chip color="secondary" sx={{
                                    borderRadius: 0
                                }} label="IDLE (0 Min)"></Chip>
                            </div>
                            <div className="flex flex-col border border-primarry-2 pl-3 pr-5 pb-2 max-w-xs">
                                <Tags className="font-bold" label={"CELL NETWORK"}></Tags>
                                <Chip color="secondary" sx={{
                                    borderRadius: 0
                                }} label="TELSTRA NETWORK"></Chip>
                            </div>
                            <div className="flex flex-col border border-primarry-2 pl-3 pr-5 pb-2 max-w-xs">
                                <Tags className="font-bold" label={"FREQUENCY"}></Tags>
                                <Chip color="secondary" sx={{
                                    borderRadius: 0
                                }} label="5G"></Chip>
                            </div>
                            <div className="flex flex-col border border-primarry-2 pl-3 pr-5 pb-2 max-w-xs">
                                <Tags className="font-bold" label={"TIME POSITION"}></Tags>
                                <Chip color="secondary" sx={{
                                    borderRadius: 0
                                }} label="01/30/2023. 03:08 AM, 6 MONTH AGO"></Chip>
                            </div>
                            <div className="flex flex-col border border-primarry-2 pl-3 pr-5 pb-2 max-w-xs">
                                <Tags className="font-bold" label={"TAC"}></Tags>
                                <Chip color="secondary" sx={{
                                    borderRadius: 0
                                }} label="66872922"></Chip>
                            </div>
                            <div className="flex flex-col border border-primarry-2 pl-3 pr-5 pb-2 max-w-xs">
                                <Tags className="font-bold" label={"MFG"}></Tags>
                                <Chip color="secondary" sx={{
                                    borderRadius: 0
                                }} label="Samsung Electronics  Co., Ltd."></Chip>
                            </div>
                            <div className="flex flex-col border border-primarry-2 pl-3 pr-5 pb-2 max-w-xs">
                                <Tags className="font-bold" label={"MODEL"}></Tags>
                                <Chip color="secondary" sx={{
                                    borderRadius: 0
                                }} label="SAMSUNG A52"></Chip>
                            </div>
                            <div className="flex flex-col border border-primarry-2 pl-3 pr-5 pb-2 max-w-xs">
                                <Tags className="font-bold" label={"CELL ID ADDRESS"}></Tags>
                                <Chip color="secondary" sx={{
                                    borderRadius: 0
                                }} label="-33.8688, 151.2093"></Chip>
                            </div>
                            <div className="flex flex-col border border-primarry-2 pl-3 pr-5 pb-2 max-w-xs">
                                <Tags className="font-bold" label={"TYPE"}></Tags>
                                <Chip color="secondary" sx={{
                                    borderRadius: 0
                                }} label="1904"></Chip>
                            </div>
                        </div> */}
                    </div>
                </CardBox>
            </div>
        </div>
    </ContainerPages>
}

export default CreateNewProfile