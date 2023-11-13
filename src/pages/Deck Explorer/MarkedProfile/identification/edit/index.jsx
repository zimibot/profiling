import ContainerPages from "../../../.."
import { createSignal, createEffect } from "solid-js"
import AlertDialog from "../../../../../component/dialog"
import { useAppState } from "../../../../../helper/_helper.context"
import { useLocation, useNavigate } from "@solidjs/router"
import { CheckboxItems } from "../../../../../component/form/checkbox"
import { mode } from "../../../../../helper/_helper.theme"
import { Tags } from "../../../../../component/tags"
import { CardFrame } from "../../../../../component/cardFrame"
import { CardBox } from "../../../../../component/cardBox"
import { Button, FormControlLabel, IconButton, Paper } from "@suid/material"
import { DefaultInput } from "../../../../../component/form/input"
import { createFormControl, createFormGroup } from "solid-forms"
import { AddAPhoto } from "@suid/icons-material"
import { api } from "../../../../../helper/_helper.api"
import avatar from "../../../../../assets/images/avatar.svg"
import moment from "moment"
import Swal from "sweetalert2"

const EditIndentification = () => {

    const [checkData, setCheck] = createSignal([])
    const [time, setTime] = createSignal()
    const [foto, setFoto] = createSignal(null)
    const [updateFoto, setupdateFoto] = createSignal()
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

    const location = useLocation()
    const navi = useNavigate()
    let parts = location.pathname.split('/');
    let path = parts[parts.length - 3];
    const query = location.pathname.split("/").pop()
    const [ischeck, setisCheck] = createSignal(false);
    const [saved, setSaved] = createSignal({
        isError: true,
        isErrorMsg: false
    });

    createEffect(() => {
        api().get(`/deck-explorer/identification?keyword=${path}`).then(d => {
            console.log(d)
            group.controls.profile_name.setValue(d.data.items.profile_name)
            group.controls.case_group.setValue(d.data.items.case_group)
            group.controls.remarks.setValue(d.data.items.remarks)
            setFoto(d.data.items.foto_url)
            setTime(moment(d.data.items.timestamp).format("D MMMM YYYY"))
            setCheck(d.data.items.data)
        })
    })

    createEffect(() => {
        if (updateFoto()) {
            var reader = new FileReader();
            reader.readAsDataURL(updateFoto()[0]);
            reader.onloadend = function () {
                setFoto(d => ({
                    ...d,
                    label: reader.result,
                    type: "file"
                }))
            }

        }
    })

    createEffect(() => {
        console.log(foto())
    })



    const countActiveStatus = (status) => {
        return checkData()?.reduce((acc, curr) => {
            const count = curr.data.filter(item => item.active === status).length;
            return acc + count;
        }, 0);
    }


    createEffect(() => {


        var regexp = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/
        var no = query;

        if (!regexp.test(no) && no.length < 0) {
            navi("/")
        }

        let count = countActiveStatus(true)

        if (count > 0) {
            setSaved(d => ({ ...d, isError: false }))
            setSaved(d => ({
                ...d,
                isErrorMsg: false
            }))
        } else {
            setSaved(d => ({ ...d, isError: true }))
        }

        checkData().forEach((items) => {
            let totalCounts = items.data.reduce((acc, current) => {
                // Menghitung jumlah true dan false dalam current.data
                let counts = current.data.reduce(
                    (countAcc, item) => {
                        countAcc.true += item.active ? 1 : 0;
                        countAcc.false += item.active ? 0 : 1;
                        countAcc.total += item.id && 1
                        return countAcc;
                    },
                    { true: 0, false: 0, total: 0 }
                );

                // Menambahkan ke akumulator
                acc.true += counts.true;
                acc.false += counts.false;
                acc.total += counts.total

                return acc;
            }, { true: 0, false: 0, total: 0 });

            console.log(totalCounts)

            if (totalCounts.true >= 0 && totalCounts.total !== totalCounts.true) {
                setisCheck(false)
            } else {
                setisCheck(true)
            }

        })
    })

    const onSubmit = (e) => {

        e.preventDefault()

        const check = checkData().map(d => {
            return ({
                ...d,
                data: d.data.filter(d => d.active !== false)
            })
        })

        let a = check.filter(d => d.data.length > 0)


        const { case_group, profile_name, remarks } = group.value


        let keyword = path

        let data = {
            case_group, profile_name, remarks, keyword, data: a
        }

        const profile = () => {
            api().put("/deck-explorer/identification", data).then(d => {
                Swal.fire({
                    icon: "success",
                    title: "INFO",
                    text: d.data.message
                })
            })
        }


        if (updateFoto()) {
            const formData = new FormData();

            formData.append("file", updateFoto()[0])

            api().post(`/deck-explorer/upload?keyword=${keyword}`, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded,"
                }
            }).then(d => {
                profile()
            })
        } else {
            profile()
        }

    }

    return <ContainerPages>
        <form onSubmit={onSubmit} className="py-6 flex flex-col flex-1" enctype="multipart/form-data">
            <CardBox headerComponent={<div className="flex gap-4">
                <FormControlLabel
                    label="ADD ALL"
                    onChange={(d) => {
                        let checked = d.target.checked
                        setisCheck(!checked)


                        setCheck(d => (d.map(a => ({
                            ...a,
                            data: a.data.map(d => ({
                                ...d,
                                active: !checked,
                                data: d.data.map(a => ({
                                    ...a,
                                    active: !checked,
                                }))
                            }))
                        }))))
                    }}
                    checked={ischeck()}
                    sx={{
                        color: mode() === "dark" ? "#eee" : "#444"
                    }}
                    control={<CheckboxItems sx={{
                        borderRadius: 0
                    }} />}
                />
                <div className="flex gap-4 items-center">
                    <div className="space-x-4">
                        <Button type="submit" variant="contained" color="secondary"
                            sx={{
                                "&.Mui-disabled": {
                                    background: "#000",
                                    color: "#c0c0c0"
                                }
                            }}>
                            SAVE
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => navi(-1)}>
                            CANCEL
                        </Button>
                    </div>
                </div>
            </div>} className="!flex-1 flex !flex-col !p-4 min-h-[600px]" title={"EDIT"}>
                <div className=" flex flex-1 m-[-18px]">
                    <div className="w-[350px] px-4 py-2 border-r-2 border-[#0A0A0A]  flex flex-col">
                        <div className="p-4 space-y-4">
                            <Paper square elevation={2} class="relative w-full h-[280px]">
                                <img className="w-full h-full object-cover object-center " src={foto()?.label ? foto()?.type === "file" ? foto().label : foto().label : avatar} />
                                <div className="absolute p-2 top-0 right-0" title="Upload Your Picture">
                                    <Button variant="contained" color="secondary" sx={{
                                        borderRadius: 0,
                                    }}>
                                        <AddAPhoto></AddAPhoto>
                                        <input onChange={d => {
                                            setupdateFoto(d.target.files)
                                            group.controls.foto.setValue(d.target.files)
                                        }} className="opacity-0 w-full h-full absolute" accept="image/*" type="file"></input>
                                    </Button>
                                </div>
                            </Paper>
                            <div className="space-y-2">
                                <div>
                                    <Tags className={"!py-0"} label={"Original Name"} />
                                    <div className="pl-[20px]">
                                        <DefaultInput placeholder={"FIELD ORIGINAL NAME"} removebg removeicon control={group.controls.profile_name}></DefaultInput>
                                    </div>
                                </div>
                                <div>
                                    <Tags className={"!py-0"} label={"CASE NUMBER"} />
                                    <div className="pl-[20px]">
                                        <DefaultInput placeholder={"FIELD CASE NUMBER"} removebg removeicon control={group.controls.case_group}></DefaultInput>
                                    </div>

                                </div>
                                <div>
                                    <Tags className={"!py-0"} label={"REMARKS"} />
                                    <div className="pl-[20px]">
                                        <DefaultInput placeholder={"FIELD REMARKS"} removebg removeicon control={group.controls.remarks}></DefaultInput>
                                    </div>                                </div>
                                <div>
                                    <Tags className={"!py-0"} label={"DATE CREATED"}></Tags>
                                    <div className="pl-[20px]">
                                        {time()}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="flex-1 px-4 py-2 flex flex-col">
                        <Tags label={"MULTI SOURCE DATABASE INFORMATION"}></Tags>
                        <CardFrame title={"16 INFORMATION"} className="flex flex-col flex-1 relative">
                            <div className="absolute top-0  h-full w-full left-0 px-4 overflow-auto">
                                {checkData().map((b) => {
                                    return <div className="py-2">
                                        <div className="border border-primarry-2 px-4 bg-primarry-1 sticky top-[5px] z-50">
                                            <Tags label={<span>DATA DARI <b>{b.label}</b></span>}></Tags>
                                        </div>
                                        {b.data.map(x => {
                                            return  <div className={`flex gap-4 relative border-b ${mode() === "dark" ? "border-[#333]" : "border-[#aaa]"}  py-2 `}>
                                                <div className="flex gap-4 items-start flex-1 relative">
                                                    <div className={`${mode() === "dark" ? "text-[#aaa]" : "text-[#444]"} sticky top-[10px] whitespace-nowrap w-[200px] z-10 px-4 pt-2`}> {x.total_data === 1 ? "" : `[${x.total_data}]`} {x.label}</div>
                                                    <div className="flex-1 ">
                                                        <div className="gap-2 flex flex-wrap px-4">
                                                            {x.data.map((d) => {
                                                                return <div title={d.label}>
                                                                    <FormControlLabel
                                                                        class={`pl-4 !m-0 ${mode() === "dark" ? ` ${saved().isErrorMsg ? "border-red-500 text-red-500" : "border-[#454545] bg-[#2C2C2C]"}` : saved().isErrorMsg ? "border-red-500 text-red-500" : "bg-gray-200 text-[#444] border-[#aaa]"} pr-2 py-1 flex gap-4 border-[0] max-w-sm`}
                                                                        checked={d.active}
                                                                        onChange={() => {
                                                                            setCheck(prevItems => (
                                                                                prevItems.map(item => {
                                                                                    // Check if this is the group we're updating
                                                                                    if (item.id === b.id) {
                                                                                        // Map through the groups to update their items
                                                                                        const updatedGroups = item.data.map(group => {
                                                                                            // Map through the items in the group
                                                                                            const updatedItems = group.data.map(subItem => {
                                                                                                // Check if this is the item we're updating
                                                                                                if (subItem.id === d.id) {
                                                                                                    return { ...subItem, active: !subItem.active }; // Toggle the active state
                                                                                                }
                                                                                                return subItem;
                                                                                            });

                                                                                            // Check if all sub-items are now active
                                                                                            const allActive = updatedItems.every(subItem => subItem.active);

                                                                                            // Return the updated group with new items and allActive status
                                                                                            return { ...group, active: allActive, data: updatedItems };
                                                                                        });

                                                                                        // Return the updated item with new groups
                                                                                        return { ...item, data: updatedGroups };
                                                                                    }
                                                                                    // Return items that are not being updated as they are
                                                                                    return item;
                                                                                })
                                                                            ));
                                                                        }}


                                                                        label={<div className="whitespace-nowrap max-w-xs relative">
                                                                            <div className="text-ellipsis overflow-hidden relative">
                                                                                {b.label !== "FOTO" ? d.label : <div>
                                                                                    <img className="w-20" src={d.label} />
                                                                                </div>}
                                                                            </div>
                                                                        </div>} labelPlacement="start" control={<CheckboxItems />} />
                                                                </div>
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="sticky top-[10px]">
                                                        <CheckboxItems
                                                            title="Checked All"
                                                            checked={x.active} onChange={() => {
                                                                setCheck(prev => prev.map(z => {
                                                                    console.log(z)
                                                                    return {
                                                                        ...z,
                                                                        data: z.data.map(s => {
                                                                            if (x.id === s.id) {
                                                                                const shouldBeActive = !x.active;
                                                                                return {
                                                                                    ...s,
                                                                                    active: shouldBeActive,
                                                                                    data: s.data.map(o => ({
                                                                                        ...o,
                                                                                        active: shouldBeActive
                                                                                    }))
                                                                                }
                                                                            }

                                                                            return s
                                                                        })
                                                                    }
                                                                }))


                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="w-full flex justify-between items-center absolute bottom-[-5px] left-0">
                                                    <div className={`h-2 w-2 ${mode() === "dark" ? "bg-[#222222]" : "bg-[#aaa]"} left-0`}></div>
                                                    <div className={`h-2 w-2 ${mode() === "dark" ? "bg-[#222222]" : "bg-[#aaa]"} right-0`}></div>
                                                </div>
                                            </div>
                                        })}

                                    </div>
                                })}
                            </div>
                        </CardFrame>
                    </div>
                </div>
            </CardBox>
        </form>
        <AlertDialog description={"Please ensure all required fields are filled out."} title="ALERT ERROR" />
    </ContainerPages>
}

export default EditIndentification