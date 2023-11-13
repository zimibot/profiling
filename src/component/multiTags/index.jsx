import { createEffect, createSignal, onMount } from "solid-js";
import { Add, Close, People } from "@suid/icons-material"
import { Button, Chip, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Paper, Typography, } from "@suid/material"
import { mode } from "../../helper/_helper.theme";

export const MultiTags = ({ data = [
    {
        id: 1,
        name: "Bagas Harian",
        url: "/"
    },
    {
        id: 2,
        name: "Romlah",
        url: "/"
    },
    {
        id: 3,
        name: "Jayadi",
        url: "/"
    },
    {
        id: 4,
        name: "Kusuma",
        url: "/"
    },
    {
        id: 5,
        name: "Baja Kora",
        url: "/"
    },
    {
        id: 6,
        name: "Korian Kora",
        url: "/"
    },
    {
        id: 7,
        name: "bukaka Kora tatang",
        url: "/"
    },
    {
        id: 8,
        name: "bukaka Kora kola",
        url: "/"
    },
    {
        id: 9,
        name: "bukaka Kora sumber jaya",
        url: "/"
    },
], value = [
    {
        id: 7,
        name: "bukaka Kora tatang",
        url: "/"
    },
    {
        id: 8,
        name: "bukaka Kora kola",
        url: "/"
    },
    {
        id: 9,
        name: "bukaka Kora sumber jaya",
        url: "/"
    },
], onChange }) => {
    const [dataTags, setdataTags] = createSignal(data);

    const [addTags, setAddTags] = createSignal({
        data1: [],
        data2: []
    })
    const [moreTags, setmoreTags] = createSignal(null);
    const [anchorEl, setAnchorEl] = createSignal(null);
    const open = () => Boolean(anchorEl());
    const open2 = () => Boolean(moreTags());
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClose2 = () => {
        setmoreTags(null);
    };




    createEffect(() => {
        const data1 = value.slice(0, 3);
        const data2 = value.slice(3);

        setAddTags({
            data1: data1,
            data2: data2
        });

        const valueIds = value.map(item => item.id);
        const filteredData = data.filter(item => !valueIds.includes(item.id));


        setdataTags(filteredData)


    })

    let containerRef, itemsRef, totalWidth = 0

    const AddTags = (a) => {
        // Hitung total lebar dari semua children
        for (let index = 0; index < itemsRef.children.length; index++) {
            let children = itemsRef.children[index];
            totalWidth += children.offsetWidth;
        }

        const containerWidth = containerRef.offsetWidth;

        console.log(totalWidth, containerWidth)

        // Tambahkan tag ke data1 atau data2 berdasarkan total lebar
        if (totalWidth < containerWidth) {
            setAddTags(d => ({
                ...d,
                data1: [a, ...d.data1],
            }));
        } else {
            setAddTags(d => ({
                ...d,
                data2: [a, ...d.data2],
            }));
        }
    }


    const AddTagsList = (a) => {
        setdataTags(d => ([a, ...d]))
    }

    const dataList = () => {
        if (onChange) {
            let data = [...addTags().data1, ...addTags().data2]
            onChange(data)
        }
    }
    const handleRemoveTag = (id, custom) => {
        if (custom) {
            const addData = addTags().data2.filter(tag => tag.id === id)[0];
            const newDataTags = addTags().data2.filter(tag => tag.id !== id);

            setdataTags(d => ([...d, addData]));
            setAddTags(d => ({
                ...d,
                data2: newDataTags,
            }));

            if (addTags().data2.length === 0) {
                handleClose2()
            }
        } else {
            const newDataTags = dataTags().filter(tag => tag.id !== id);
            setdataTags(newDataTags);

            if (dataTags().length === 0) {
                handleClose()
            }
        }

        dataList()
    }

    const handleRemoveTagsList = (id) => {

        const newData1 = addTags().data1.filter(tag => tag.id !== id);
        const newData2 = [...addTags().data2];
        if (newData2.length > 0) {
            newData1.push(newData2.shift());  // Memindahkan item pertama dari data2 ke data1
        } else {
            totalWidth = 0
        }

        setAddTags({
            data1: newData1,
            data2: newData2
        });

        dataList()
    }
    return <div className="p-2 flex gap-2 items-center " ref={containerRef}>

        <div>
            <Button
                size="small"
                id="basic-button"
                aria-controls={open() ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open() ? "true" : undefined}
                onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                }}
                variant="contained"
                color="secondary"
                startIcon={<Add></Add>}
            >
                ADD TAGS
            </Button>

        </div>
        <div className="flex gap-2 overflow-auto flex-1" ref={itemsRef}>
            {addTags().data1.map(d => {
                return <Chip title={d.name} icon={<IconButton onClick={() => {
                    AddTagsList(d)
                    handleRemoveTagsList(d.id)
                }} size="small">
                    <Close fontSize="small"></Close>
                </IconButton>} color="info" sx={{ borderRadius: 0, width: "30%", justifyContent: "flex-start" }} label={d?.name} />
            })}
            {addTags().data2.length > 0 &&
                <Button onClick={(event) => {
                    setmoreTags(event.currentTarget)
                }} variant="contained" size="small" color="secondary" sx={{
                    fontSize: 14,
                    borderRadius: 0,
                }}>
                    {`[ +${addTags().data2.length} ]`}
                </Button>
            }

        </div>
        <MenuListAdd anchorEl={moreTags} dataTags={addTags} name="data2" open={open2} handleRemoveTag={handleRemoveTag} handleClose={handleClose2} custom />
        <MenuListAdd AddTags={AddTags} anchorEl={anchorEl} open={open} dataTags={dataTags} handleRemoveTag={handleRemoveTag} handleClose={handleClose} />
    </div>
}

const MenuListAdd = ({ anchorEl, open, dataTags, AddTags, handleRemoveTag, handleClose, name, custom }) => {
    return <Menu
        anchorEl={anchorEl()}
        open={open()}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "basic-button" }}
        variant="menu"
        sx={{
            ".MuiPaper-root": {
                bgcolor: mode() === "dark" ? "#171717" : "",
                color: mode() === "dark" ? "white" : ""
            }
        }}
    >
        <Paper
            sx={{
                width: 320,
                maxWidth: "100%",
                boxShadow: 0,
                maxHeight: 300
            }}
        >
            <MenuList>
                {name ? dataTags()[name].length === 0 ? <div className="flex items-center justify-center">
                    DATA NOT FOUND
                </div> : dataTags()[name].map(d => {
                    return <MenuItem onClick={() => {
                        if (AddTags) {
                            AddTags(d)
                        }
                        if (!custom) {
                            if (handleRemoveTag) {
                                handleRemoveTag(d.id)
                            }
                        }


                    }}>
                        <ListItemIcon>
                            <People color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{d.name}</ListItemText>
                        <Typography>
                            <IconButton onClick={() => handleRemoveTag(d.id, custom)} color="primary" size="small">
                                <Close fontSize="small"></Close>
                            </IconButton>
                        </Typography>
                    </MenuItem>
                }) : dataTags().length === 0 ? <div className="flex items-center justify-center">
                    DATA NOT FOUND
                </div> : dataTags().map(d => {
                    return <MenuItem onClick={() => {
                        if (AddTags) {
                            AddTags(d)
                        }
                        if (handleRemoveTag) {
                            handleRemoveTag(d.id)
                        }
                    }}>
                        <ListItemIcon>
                            <People color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{d.name}</ListItemText>
                    </MenuItem>
                })
                }

            </MenuList>
        </Paper>
    </Menu>
}