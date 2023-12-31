import { Button, Chip, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup } from "@suid/material"
import ContainerPages from "../.."
import { CardBox } from "../../../component/cardBox"
import { CardFrame } from "../../../component/cardFrame"
import { Tags } from "../../../component/tags"
import { mode } from "../../../helper/_helper.theme"
import { createSignal, createEffect } from "solid-js"
import { CheckboxItems } from "../../../component/form/checkbox"
import AlertDialog, { DialogPopup } from "../../../component/dialog"
import { useAppState } from "../../../helper/_helper.context"
import { useLocation, useNavigate } from "@solidjs/router"
import { Check, Close, CoPresent } from "@suid/icons-material"
import { Drawer } from "@suid/material"
import { api } from "../../../helper/_helper.api"



const DatabaseInformation = () => {
    const [items, { update }] = useAppState()
    const [checkData, setCheck] = createSignal(items()?.dataSearch?.data || items()?.dataSearch || [])
    const location = useLocation()


    const navi = useNavigate()
    const query = location.pathname.split("/").pop()
    const [ischeck, setisCheck] = createSignal(null);
    const [pilihan, setpilihan] = createSignal(null);
    const [isExisting, setisExisting] = createSignal(false);
    const [existingValue, setexistingValue] = createSignal({
        name: null,
        value: ""
    });
    let typeSearch = localStorage.getItem("typeSearch")
    let typePath = typeSearch === "MSISDN" ? "phone-list" : typeSearch === "FAMILY ID" ? 'family-member' : typeSearch === "VEHICLE" ? "vehicle" : "identification"

    const [dataExisting, setdataExisting] = createSignal(null);
    const [saved, setSaved] = createSignal({
        isError: true,
        isErrorMsg: false
    });
    const countActiveStatus = (status) => {
        return checkData().reduce((acc, curr) => {
            const count = curr.data.filter(item => item.active === status).length;
            return acc + count;
        }, 0);
    }

    createEffect(() => {
        if (checkData().length > 0) {
            localStorage.setItem("dataSearch", JSON.stringify(checkData()))
            update(d => ({ ...d, dataSearch: checkData() }))
        }
    })


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


            if (totalCounts.true >= 0 && totalCounts.total !== totalCounts.true) {
                setisCheck(false)

            } else {
                setisCheck(true)
            }

        })
    })

    const onSubmit = () => {

        let count = countActiveStatus(true)

        const check = checkData().map(d => {
            return ({
                ...d,
                data: d.data.filter(d => d.active !== false).map(s => ({
                    ...s,
                    data: s.data.filter(d => d.active !== false)
                }))
            })
        })

        let a = check.filter(d => d.data.length > 0)

        update(d => ({ ...d, hasilSearch: a }))

        if (!existingValue().name) {

            if (count === 0) {
                update(d => ({ ...d, open: true }))
                setSaved(d => ({
                    ...d,
                    isErrorMsg: true
                }))
            } else {
                setSaved(d => ({
                    ...d,
                    isErrorMsg: false
                }))
                navi(`${location.pathname}/create-new-profile`, {
                    state: {
                        keyword: query
                    }
                })

            }


        } else {

            update(d => ({ ...d, open: true }))
        }



    }

    createEffect(() => {
        if (isExisting()) {
            api().get("/deck-explorer/marked_profile").then(d => {
                setdataExisting(d.data.items)
            })

        }
    })

    const onAdd = () => {


        const check = checkData().map(d => {
            return ({
                ...d,
                data: d.data.filter(d => d.active !== false).map(s => ({
                    ...s,
                    data: s.data.filter(d => d.active !== false)
                }))
            })
        })

        let a = check.filter(d => d.data.length > 0)

        update(d => ({ ...d, hasilSearch: a }))

        let data = {
            data: a,
            keyword: query,
            terkait: existingValue().value,
            type: localStorage.getItem("typeSearch").toUpperCase(),
            typeTerkait: pilihan()

        }

        api().post("/deck-explorer/marked-profile", data).then(sa => {
            update(d => ({ ...d, hasilSearch: a, open: false }))

          
            DialogPopup({
                icon: "success",
                title: "INFO",
                text: "Data Has Been Added",
                confirmButtonText: "OK",
                didClose: () => {
                    
                    navi(`/deck-explorer/marked-profile/${sa.data.items.terkait}/${typePath}`)
                }
            })

        }).catch((d) => {
            DialogPopup({
                icon: "error",
                title: "OOPS",
                text: d.response.data.message,
            })
        })
    }



    function setCheckAll(parentId, checked) {
        setCheck(prevData => {
            return prevData.map(parent => {
                if (parent.id === parentId) {
                    // Update all children's active state to true
                    const updatedChildren = parent.data.map(child => ({
                        ...child,
                        active: checked,
                        data: child.data.map(subChild => ({
                            ...subChild,
                            active: checked // Set all sub-children's active state to true
                        }))
                    }));

                    return {
                        ...parent,
                        checkAll: checked, // Set checkAll to true for the parent
                        data: updatedChildren
                    };
                }
                return parent;
            });
        });
    }


    function checkItems(bId, dId, isChecked) {
        setCheck(prevItems => (
            prevItems.map(item => {
                // Check if this is the group we're updating
                if (item.id === bId) {
                    let allItemsActive = true; // Assume initially that all items are active

                    // Map through the groups to update their items
                    const updatedGroups = item.data.map(group => {
                        // Map through the items in the group
                        const updatedItems = group.data.map(subItem => {
                            // Check if this is the item we're updating
                            if (subItem.id === dId) {
                                return { ...subItem, active: !isChecked }; // Update the active state based on isChecked
                            }
                            return subItem;
                        });

                        // Check if all sub-items are now active
                        const allSubItemsActive = updatedItems.every(subItem => subItem.active);
                        if (!allSubItemsActive) {
                            allItemsActive = false; // Set to false if any sub-item is not active
                        }

                        // Return the updated group with new items and updated active status
                        return { ...group, active: allSubItemsActive, data: updatedItems };
                    });

                    // Return the updated parent item with new groups and updated checkAll status
                    return { ...item, checkAll: allItemsActive, data: updatedGroups };
                }
                // Return items that are not being updated as they are
                return item;
            })
        ));
    }


    return <ContainerPages>
        <div className="py-6 flex flex-col flex-1">
            <CardBox headerComponent={<div className="flex gap-4">
                <FormControlLabel
                    label="ADD ALL"
                    onChange={(d) => {
                        let checked = d.target.checked
                        setisCheck(!checked)

                        setCheck(d => (d.map(a => ({
                            ...a,
                            checkAll: !checked,
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
                    {/* {!existingValue().name && <>
                        <TypographyItems>SAVE LOCATION:</TypographyItems>
                        <FormControlLabel
                            disabled={saved().isError}
                            label="NEW PROFILE"
                            value={"New Profile"}
                            sx={{
                                color: mode() === "dark" ? "#eee" : "#444",
                                "&.Mui-disabled,.MuiFormControlLabel-label.Mui-disabled": {
                                    color: "#444"
                                }
                            }}
                            onChange={d => setisNewProfile(d.target.checked)}
                            control={<CheckboxItems sx={{
                                borderRadius: 0
                            }} />}
                        />
                    </>} */}

                    <div>
                        <Button
                            id="basic-button"
                            startIcon={<CoPresent></CoPresent>}
                            sx={{
                                color: mode() === "dark" ? "#eee" : "#444",
                                "&.Mui-disabled,.MuiFormControlLabel-label.Mui-disabled": {
                                    color: "#444"
                                }
                            }}
                            onClick={(event) => {
                                setisExisting(true)
                                // update(d => ({ ...d, open: true }))
                            }}
                        >
                            {existingValue().name ? existingValue().name : "EXISTING MARKED PROFILE"}
                        </Button>

                        <Drawer
                            anchor={"right"}
                            open={isExisting()}
                            sx={{ zIndex: 9999 }}
                        >
                            <div className="w-96 h-full bg-primarry-1 text-white p-4 flex flex-col gap-4">
                                <div className="flex justify-between items-center border-b border-primarry-2">
                                    <h4>EXISTING MARKED PROFILE</h4>
                                    {existingValue().name ? <IconButton color="success" onClick={() => setisExisting(false)}>
                                        <Check></Check>
                                    </IconButton> : <IconButton color="error" onClick={() => setisExisting(false)}>
                                        <Close></Close>
                                    </IconButton>}

                                </div>
                                <div className="flex items-center gap-2 justify-end">
                                    {existingValue().name && <div>
                                        <Button size="small" color="error" onClick={() => {
                                            setexistingValue({
                                                name: "",
                                                value: ""
                                            })
                                        }}>CANCEL</Button>
                                    </div>}

                                </div>
                                <div className="flex-1 flex flex-col px-4 relative">
                                    <div className="absolute w-full h-full overflow-auto left-0">
                                        <FormControl class="w-full">
                                            <RadioGroup
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                name="radio-buttons-group"
                                                value={existingValue()?.value || ""}
                                                onClick={(d) => {

                                                    let id = d?.target?.value

                                                    if (id) {
                                                        setexistingValue(s => ({
                                                            ...s,
                                                            name: d?.target?.attributes?.name?.value || "-",
                                                            value: id
                                                        }))

                                                        api().get(`/deck-explorer/marked_profile?keyword=${id}`).then(a => {
                                                            let data2 = a.data.items.data

                                                            setCheck(data1 =>
                                                                data1.map((item1) => {
                                                                    const item2 = data2.find((item) => {
                                                                        return item.id === item1.id
                                                                    });
                                                                    if (item2) {
                                                                        item1.checkAll = item2.checkAll;
                                                                        item1.marked = item2.marked;
                                                                        item1.relate = item2.relate;

                                                                        item1.data = item1.data.map((subItem1) => {
                                                                            const subItem2 = item2.data.find((subItem) => subItem.id === subItem1.id);

                                                                            if (subItem2) {
                                                                                subItem1.active = subItem2.active;
                                                                                subItem1.type = subItem2.type;
                                                                                subItem1.data = subItem1.data.map(subItem3 => {
                                                                                    const subItem4 = subItem2.data.find((subItem) => subItem.id === subItem3.id);
                                                                                    if (subItem4) {
                                                                                        subItem3.active = subItem4.active
                                                                                    }

                                                                                    return subItem3
                                                                                })
                                                                                // Anda dapat menambahkan pembaruan lain yang diperlukan di sini
                                                                            }

                                                                            return subItem1;
                                                                        });
                                                                    }

                                                                    return item1;
                                                                })
                                                            )
                                                        })
                                                    }

                                                }}

                                                class="w-full space-y-2 flex flex-col"
                                            >
                                                {dataExisting()?.length === 0 ? "NO DATA" : dataExisting()?.map(d => {
                                                    return <div className="border border-primarry-2 flex justify-between flex-1"
                                                        onClick={() => {
                                                            setexistingValue(a => ({
                                                                ...a,
                                                                type: d.type
                                                            }))
                                                        }}>
                                                        <FormControlLabel
                                                            value={d.keyword}
                                                            name={d?.profile_name || "-"}
                                                            class="w-full flex-1 !m-0"
                                                            sx={{
                                                                ".MuiFormControlLabel-label": {
                                                                    flex: 1,
                                                                },
                                                            }}
                                                            control={() => <Radio class="tester" />}
                                                            label={<div className="w-full px-2 py-2 flex gap-2 flex-col ">
                                                                <div className="flex gap-2 items-center justify-between border-b border-primarry-2 py-2">
                                                                    <div className="w-12">
                                                                        <img className="w-full" src={d?.foto_url?.label}></img>
                                                                    </div>
                                                                    <div>
                                                                        <div>
                                                                            <Chip color="secondary" sx={{
                                                                                borderRadius: 0
                                                                            }} label={d.profile_name}></Chip>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between text-xs">
                                                                    <div>
                                                                        REMARKS :
                                                                        <Chip color="secondary" sx={{
                                                                            borderRadius: 0
                                                                        }} label={d.remarks}></Chip>
                                                                    </div>
                                                                    <div>
                                                                        TYPE :
                                                                        <Chip color="secondary" sx={{
                                                                            borderRadius: 0
                                                                        }} label={d.type}></Chip>
                                                                    </div>
                                                                </div>
                                                            </div>}
                                                        />
                                                    </div>
                                                })}

                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                </div>
                            </div>
                        </Drawer>
                    </div>
                    <div className="space-x-4">
                        {existingValue().name ? <Button disabled={saved().isError} variant="contained" onClick={onSubmit} color="success"
                            sx={{
                                "&.Mui-disabled": {
                                    background: "#000",
                                    color: "#c0c0c0"
                                }
                            }}>
                            Add Database
                        </Button> : <Button disabled={saved().isError} variant="contained" onClick={onSubmit} color="secondary"
                            sx={{
                                "&.Mui-disabled": {
                                    background: "#000",
                                    color: "#c0c0c0"
                                }
                            }}>
                            SAVE to New Profile
                        </Button>}
                        <Button variant="outlined" color="error" onClick={() => navi(-1)}>
                            CANCEL
                        </Button>
                    </div>
                </div>
            </div>} className="!flex-1 flex !flex-col !p-4 min-h-[600px]" title={`DATABASE INFORMATION`}>
                <div className="grid  flex-1 m-[-18px]">
                    <div className="xl:col-span-6 flex-1 px-4 py-2 flex flex-col">
                        <Tags label={"MULTI SOURCE DATABASE INFORMATION"}></Tags>
                        <CardFrame count={checkData} title={`INFORMATION category`} className="flex flex-col flex-1 relative">
                            <div className="absolute top-0  h-full w-full left-0 px-4 overflow-auto grid grid-cols-2 py-4 gap-2">
                                {checkData()?.map((b, k) => {
                                    return <div className={`bg-[#1e1e1e] p-2 ${k === 0 ? " col-span-full" : checkData().length === 2 ? "col-span-full" : ""}`}>
                                        <div className="border border-primarry-2 px-4 bg-primarry-1 sticky top-[5px] z-50 flex justify-between items-center">
                                            <Tags label={<span>DATA FROM <b>{b.label}</b></span>}></Tags>
                                            <div>
                                                <CheckboxItems
                                                    title="Checked All ITEMS"
                                                    checked={b.checkAll} onChange={(a) => {
                                                        setCheckAll(b.id, !a.target.checked)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {b.data.map((x) => {
                                            return <div className={`flex gap-4 relative border-b  ${mode() === "dark" ? "border-[#333]" : "border-[#aaa]"}  py-2 `}>
                                                <div className="flex gap-4 items-start flex-1 relative">
                                                    <div className={`${mode() === "dark" ? "text-[#aaa]" : "text-[#444]"} sticky top-[10px] whitespace-nowrap w-[200px] z-10 px-4 pt-2`}> {x.total_data === 1 ? "" : `[${x.total_data}]`} {x.label}</div>
                                                    <div className="flex-1 ">
                                                        <div className="gap-2 flex flex-wrap px-4">
                                                            {x.data.map((d) => {
                                                                return <div title={d.label}>
                                                                    <FormControlLabel
                                                                        class={`pl-4 !m-0 ${mode() === "dark" ? ` ${saved().isErrorMsg ? "border-red-500 text-red-500" : "border-[#454545] bg-[#2C2C2C]"}` : saved().isErrorMsg ? "border-red-500 text-red-500" : "bg-gray-200 text-[#444] border-[#aaa]"} pr-2 py-1 flex gap-4 border-[0] max-w-sm`}
                                                                        checked={d.active}
                                                                        onChange={(c) => checkItems(b.id, d.id, c.target.checked)}

                                                                        label={<div className={`whitespace-nowrap max-w-xs relative ${x.label === "ID CARD PHOTO" ? "hover:z-50  hover:scale-[2.5] transition-all" : ""}`}>
                                                                            <div className={x.label !== "ID CARD PHOTO" ? "text-ellipsis overflow-hidden relative" : "z-50"}>
                                                                                {x.label !== "ID CARD PHOTO" ? d.label : <div>
                                                                                    <img className="w-20" src={d.label} />
                                                                                </div>}
                                                                            </div>
                                                                        </div>} labelPlacement="end" control={<CheckboxItems />} />
                                                                </div>
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="sticky top-[10px] pr-4">
                                                        {x.data.length !== 1 && <CheckboxItems
                                                            title="Checked All"
                                                            checked={x.active} onChange={() => {
                                                                setCheck(prev => prev.map(z => {
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
                                                        />}

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
        </div>
        <AlertDialog handleClick={onAdd} description={<div>
            <div className="w-[300px]">
                <FormControl>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                        value={pilihan() || ""}
                        onClick={(d) => {
                            if (d.target.value) {
                                setpilihan(d.target.value)
                            }
                        }}
                    >


                        {typeSearch === "PERSONAL ID" && <>
                            <FormControlLabel
                                value="family_member"
                                control={() => <Radio />}
                                label="Family Member Detail (NIK)"
                            />
                            <FormControlLabel
                                value="alias_profile"
                                control={() => <Radio />}
                                label="Alias Profile (NIK)"
                            />
                            <FormControlLabel
                                value="replace_personal"
                                control={() => <Radio />}
                                label="Update Marked Data"
                            />
                        </>}
                        {typeSearch === "FAMILY ID" && <FormControlLabel
                            value="family"
                            control={() => <Radio />}
                            checked
                            label="Family Member (NKK)"
                        />}
                        {typeSearch === "VEHICLE" && <FormControlLabel
                            value="no_pol"
                            control={() => <Radio />}
                            checked
                            label="Vehicle"
                        />}

                        {typeSearch === "MSISDN" && <FormControlLabel
                            value="phone_number_list"
                            control={() => <Radio />}
                            checked
                            label="MSISDN List"
                        />}


                    </RadioGroup>
                </FormControl>
            </div>
        </div>} title={<div className="flex justify-between items-center">
            <div>
                SAVE TO
            </div>
            {pilihan() && <Button color="error" onClick={() => { setpilihan() }}>CLEAR</Button>}
        </div>} />
    </ContainerPages>
}




export default DatabaseInformation