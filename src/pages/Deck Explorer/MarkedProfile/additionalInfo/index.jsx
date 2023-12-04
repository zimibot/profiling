import { Button, Divider, InputBase, Typography } from "@suid/material"
import { LayoutMarkedProfile } from ".."
import { CardFrame } from "../../../../component/cardFrame"
import { Tags } from "../../../../component/tags"
import { Add, Close, Delete, Edit, Save } from "@suid/icons-material"
import { createFormControl, createFormGroup } from "solid-forms"
import { createEffect, createSignal, on } from "solid-js"
import { useLocation } from "@solidjs/router"
import { api } from "../../../../helper/_helper.api"
import Swal from "sweetalert2"

const AdditionalInfo = () => {
    const [data, setData] = createSignal([
    ])



    const group = createFormGroup({
        category: createFormControl("", {
            required: true,
        }),
        value: createFormControl("", {
            required: true,
        }),
    });
    const groupEdit = createFormGroup({
        category: createFormControl("", {
            required: true,
        }),
        value: createFormControl("", {
            required: true,
        }),
    });


    const location = useLocation()
    let parts = location.pathname.split('/');
    let path = parts[parts.length - 2];

    const [loading, setLoading] = createSignal(false)


    const onSubmitAdd = (e) => {
        e.preventDefault()

        let { category, value } = group.value

        let data = {
            category,
            value,
            edit: false,
            keyword: path
        }

        api().post("deck-explorer/additional_info", data).then(d => {
            setLoading(true)

            Swal.fire({
                icon: "success",
                title: "INFO",
                text: d.data.message,
                didClose: () => {
                    group.controls.category.setValue("")
                    group.controls.value.setValue("")
                    setLoading(false)
                }
            })
        })
    }
    const onSubmitEdit = (e, id) => {
        e.preventDefault()

        let { category, value } = groupEdit.value

        let data = {
            category,
            value,
            keyword: path,
            id
        }


        api().put("deck-explorer/additional_info", data).then(d => {
            setLoading(true)

            Swal.fire({
                icon: "success",
                title: "INFO",
                text: d.data.message,
                didClose: () => {
                    group.controls.category.setValue("")
                    group.controls.value.setValue("")
                    setLoading(false)
                }
            })
        })
    }

    createEffect(() => {
        api().get(`/deck-explorer/addtional_info?keyword=${path}`).then(d => {
            setData(d.data.items)
        })

        loading()
    })



    return <LayoutMarkedProfile title={'ADDITIONAL INFORMATION'}>
        <div className="flex flex-col flex-1">
            <Tags label="ADDITIONAL INFORMATION"></Tags>
            <CardFrame className="relative flex-1 flex flex-col" title={<div className="grid grid-cols-7 gap-2 w-full">
                <div className="px-2">CATEGORY INFORMATION</div>
                <div className="col-span-6 px-2">IDENTIFIED</div>
            </div>}>
                <form onSubmit={onSubmitAdd} className=" flex flex-col">
                    <div className="grid grid-cols-7 gap-2">
                        <Divider class="col-span-full" sx={{
                            borderColor: "#444"
                        }} />
                        <div className="bg-primarry-2 p-2">
                            <InputBase
                                value={group.controls.category.value}
                                onChange={d => (
                                    group.controls.category.setValue(d.target.value)
                                )}
                                required={group.controls.category.isRequired}
                                placeholder="INPUT CATEGORY" sx={{
                                    color: "white"
                                }}></InputBase>
                        </div>
                        <div className="col-span-5 bg-primarry-2 p-2 flex gap-2">
                            <InputBase
                                value={group.controls.value.value}
                                onChange={d => (
                                    group.controls.value.setValue(d.target.value)
                                )}
                                required={group.controls.value.isRequired}
                                placeholder="INPUT INFORMATION"
                                fullWidth sx={{
                                    color: "white"
                                }}></InputBase>
                        </div>

                        <Button type="submit" fullWidth variant="contained" color="secondary" size="small" startIcon={<Add></Add>}>
                            ADD
                        </Button>

                        <Divider class="col-span-full" sx={{
                            borderColor: "#444"
                        }} />
                    </div>
                </form>
                <div className="relative w-full flex-1">
                    <div className="absolute overflow-auto w-full h-full">
                        {data().map(d => {
                            return <form onSubmit={a => onSubmitEdit(a, d._id)} className="grid grid-cols-7 gap-2  w-full col-span-full">
                                <Divider class="col-span-full" sx={{
                                    borderColor: "#444"
                                }} />
                                {d.edit ? <>
                                    <div className="bg-primarry-2 bg-opacity-50 p-2">
                                        <InputBase
                                            value={groupEdit.controls.category.value}
                                            onChange={d => (
                                                groupEdit.controls.category.setValue(d.target.value)
                                            )}
                                            required={groupEdit.controls.category.isRequired}
                                            placeholder="INPUT CATEGORY" sx={{
                                                color: "white"
                                            }}></InputBase>
                                    </div>
                                    <div className="col-span-5 bg-primarry-2 bg-opacity-50 p-2 flex gap-2">
                                        <InputBase
                                            value={groupEdit.controls.value.value}
                                            onChange={d => (
                                                groupEdit.controls.value.setValue(d.target.value)
                                            )}
                                            required={groupEdit.controls.value.isRequired}
                                            placeholder="INPUT INFORMATION"
                                            fullWidth sx={{
                                                color: "white"
                                            }}></InputBase>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button type="submit" fullWidth variant="contained" color="secondary" size="small" startIcon={<Save></Save>}>
                                            SAVE
                                        </Button>
                                        <Button onClick={() => {
                                            setData(a => a.map(f => {
                                                return ({
                                                    ...f,
                                                    edit: false
                                                })
                                            }))
                                        }} fullWidth variant="contained" color="secondary" size="small" startIcon={<Close></Close>}>
                                            CANCEL
                                        </Button>
                                    </div>
                                </> : <>
                                    <div className="bg-primarry-2 p-2">
                                        <Typography>
                                            {d.category}
                                        </Typography>
                                    </div>
                                    <div className="col-span-5 bg-primarry-2 p-2 flex gap-2">
                                        <Typography>
                                            {d.value}
                                        </Typography>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Button onClick={() => {

                                            setData(a => a.map(f => {
                                                if (f._id === d._id) {
                                                    groupEdit.controls.value.setValue(f.value)
                                                    groupEdit.controls.category.setValue(f.category)
                                                }

                                                return ({
                                                    ...f,
                                                    edit: f._id === d._id
                                                })
                                            }))


                                        }} fullWidth variant="contained" color="secondary" size="small" startIcon={<Edit></Edit>}>
                                            EDIT
                                        </Button>
                                        <Button onClick={() => {
                                            api().delete(`/deck-explorer/additional_info?id=${d._id}`).then(d => {
                                                setLoading(true)

                                                Swal.fire({
                                                    icon: "success",
                                                    title: "INFO",
                                                    text: d.data.message,
                                                    didClose: () => {
                                                        group.controls.category.setValue("")
                                                        group.controls.value.setValue("")
                                                        setLoading(false)
                                                    }
                                                })
                                            })
                                        }} fullWidth variant="contained" color="secondary" size="small" startIcon={<Delete></Delete>}>
                                            DELETE
                                        </Button>
                                    </div>
                                </>}


                                <Divider class="col-span-full" sx={{
                                    borderColor: "#444"
                                }} />
                            </form>
                        })}
                    </div>


                </div>

            </CardFrame>
        </div>
    </LayoutMarkedProfile>
}

export default AdditionalInfo