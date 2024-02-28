import { Add, ArrowLeft, ArrowRight, Check, CheckBox, CheckBoxOutlineBlank, Close, Delete, Search, Settings, Upload } from "@suid/icons-material";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { Box, Button, Drawer, FormControl, IconButton, InputBase, InputLabel, MenuItem, OutlinedInput, Select } from "@suid/material";
import { useNavigate } from "@solidjs/router";
import ContainerPages from "../..";
import { CardBox } from "../../../component/cardBox";
import { createFormControl, createFormGroup } from "solid-forms";
import { Tags } from "../../../component/tags";
import Swal from "sweetalert2";

const AddConnection = () => {

    const navi = useNavigate()

    const [search, setsearch] = createSignal(null)
    const [onMinimze, setMinimize] = createSignal(false)
    const [display, setdisplay] = createSignal()
    const [onListFIles, setListFiles] = createSignal({
        mutipleFilesOriginal: [],
        mutipleFiles: [],
        dataJson: {
            title: null,
            data: [],
            allData: [],
            searchData: [],
        },
        column: [],
        page: {
            total: 0,
            current: 1,
        }
    })

    const onShow = () => {
        setMinimize(a => !a)
    }

    let mainPreview;


    const group = createFormGroup({

        title: createFormControl("", {
            required: true,
        }),
        description: createFormControl("", {
            required: true,
        }),
    });

    const onMultipleFiles = async (e) => {
        const files = e.target.files;
        setdisplay()
        if (files.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'No Files Selected',
                text: 'No files were selected. Please select at least one CSV or TXT file.',
            });
            return; // Exit the function early if no files are selected
        }



        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Check if the file is a CSV or TXT file
            if (file.type === "text/csv" || file.name.endsWith('.csv') || file.type === "text/plain" || file.name.endsWith('.txt')) {

                // Check for duplicate file names
                let isDuplicate = onListFIles().mutipleFiles.some(existingFile => existingFile.name === file.name);

                if (isDuplicate) {
                    // Alert user about the duplicate file name
                    Swal.fire({
                        icon: 'warning',
                        title: 'Duplicate File Name',
                        text: `A file named ${file.name} has already been selected. Duplicate file names are not allowed.`,
                    });
                } else {

                    if (i === (files.length - 1)) {
                        const dataReader = new FileReader();
                        dataReader.onload = async function (e) {
                            const base64 = e.target.result;
                            // Convert Base64 string to Blob URL for CSV and TXT files
                            const blobUrl = base64ToBlobUrl(base64, files[i].type);
                            setdisplay(blobUrl)
                        }

                        dataReader.readAsDataURL(files[i]);
                    }

                    const reader = new FileReader();
                    reader.onload = async function (e) {
                        const base64 = e.target.result;
                        // Convert Base64 string to Blob URL for CSV and TXT files
                        const blobUrl = base64ToBlobUrl(base64, file.type);

                        // Here you can set the base64 and blobUrl to your state
                        let fileDetails = {
                            name: file.name,
                            size: (file.size / 1024).toFixed(2), // Convert size to KB
                            url: blobUrl, // Store the Blob URL
                            active: false,
                        };


                        setListFiles(a => ({
                            ...a,

                            dataJson: {
                                ...a.dataJson,
                                title: file.name
                            },
                            mutipleFiles: [fileDetails, ...a.mutipleFiles].map(a => {
                                return ({
                                    ...a,
                                    active: a.url === blobUrl
                                })
                            }),
                            mutipleFilesOriginal: [...a.mutipleFilesOriginal, file] // Ensure you're adding the file itself correctly
                        }));

                        // setdisplay(blobUrl)

                    };
                    reader.readAsDataURL(file);
                }

            } else {
                // Use SweetAlert2 to show a notification for each invalid file
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid File',
                    text: `File ${file.name} is neither a CSV nor a TXT file and was not uploaded.`,
                });
            }
        }
    };

    // Function to convert Base64 string to Blob URL
    function base64ToBlobUrl(base64, contentType) {
        const byteCharacters = atob(base64.split(',')[1]);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return URL.createObjectURL(blob);
    }


    const handleDeleteFile = (fileName) => {
        // Filter out the file to delete
        let mutipleFiles = (a) => a.filter(file => file.name !== fileName)

        setListFiles((a) => ({
            ...a,
            dataJson: {
                ...a.dataJson,
                data: a.dataJson.title === fileName ? [] : a.dataJson.data
            },
            mutipleFiles: mutipleFiles(a.mutipleFiles),
            mutipleFilesOriginal: mutipleFiles(a.mutipleFilesOriginal)
        }))

        document.getElementById('input').value = '';

    };

    const onSubmit = (e) => {
        e.preventDefault()

        const { value } = group

        console.log(onListFIles())
    }



    function csvToJson(csv) {
        // Pisahkan string menjadi baris
        const lines = csv.split("\n");

        // Mengambil header
        const headers = lines[0].split(",");

        const result = [];

        // Loop melalui semua baris kecuali header
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i]) continue; // Skip baris kosong
            const obj = {};
            const currentline = lines[i].split(",");

            // Loop melalui semua kolom, dan buat objek dengan key dari header
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);
        }

        // Kembalikan array objek
        return result;
    }


    const onPreview = (url, name) => {



        mainPreview.scrollTop = 0

        setListFiles(a => ({
            ...a,
            dataJson: {
                ...a.dataJson,
                title: name
            },
            mutipleFiles: a.mutipleFiles.map((s) => {
                if (s.url === url) {
                    s.active = true;
                } else {
                    s.active = false;
                }

                return s;
            }),
        }));

        setdisplay(url)


    };
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }


    createEffect(() => {
        let debouncedScroll;
        if (display() && mainPreview) {
            let url = display();
            fetch(url).then(response => response.text()).then((content) => {
                const json = csvToJson(content);
                const totalData = json.length;

                let column = [];
                for (const key in json[0]) {
                    column.push(key);
                }

                let limit = 30; // Batas jumlah entri yang ditampilkan
                let buffer = 30; // Jumlah entri tambahan yang dimuat sebagai buffer
                let start = 0;
                let end = limit;

                setListFiles(a => ({
                    ...a,
                    dataJson: {
                        ...a.dataJson,
                        allData: json,
                        searchData: [],
                        data: json.slice(start, end)
                    },
                    column,
                    page: {
                        current: 1,
                        total: Math.ceil(totalData / limit),
                    }
                }));
                setsearch(null)
                const handleScroll = () => {
                    const scrollPosition = mainPreview.scrollTop;
                    const maxScrollPosition = mainPreview.scrollHeight - mainPreview.clientHeight;
                    const scrollPercentage = scrollPosition / maxScrollPosition;

                    if (scrollPercentage > 0.99 && end < totalData) {
                        start = Math.min(start + buffer, totalData - limit); // Perbarui start dengan memperhitungkan buffer
                        end = Math.min(start + limit, totalData); // Pastikan end tidak melebihi totalData

                        setListFiles(a => ({
                            ...a,
                            dataJson: {
                                ...a.dataJson,
                                data: json.slice(start, end)
                            },
                            page: {
                                ...a.page,
                                current: Math.ceil(start / limit) + 1,
                                total: Math.ceil(totalData / limit),
                            }
                        }));

                        requestAnimationFrame(() => {
                            mainPreview.scrollTop = (0.02 * mainPreview.scrollHeight);
                        });

                        setsearch(null)


                    } else if (scrollPercentage < 0.01 && start > 0) {
                        start = Math.max(start - buffer, 0); // Kembali ke posisi sebelumnya dengan memperhitungkan buffer
                        end = start + limit;

                        setListFiles(a => ({
                            ...a,
                            dataJson: {
                                ...a.dataJson,
                                data: json.slice(start, end)
                            },
                            page: {
                                ...a.page,
                                current: Math.ceil(start / limit) + 1,
                                total: Math.ceil(totalData / limit),
                            }
                        }));
                        requestAnimationFrame(() => {
                            const newMaxScroll = mainPreview.scrollHeight - mainPreview.clientHeight;
                            mainPreview.scrollTop = newMaxScroll - (0.02 * newMaxScroll);
                        });

                        setsearch(null)
                    }
                };

                debouncedScroll = debounce(handleScroll, 50);
                mainPreview.addEventListener('scroll', debouncedScroll);
            });
        }

        onCleanup(() => {
            if (mainPreview && debouncedScroll) {
                mainPreview.removeEventListener('scroll', debouncedScroll);
            }
            // Reset state data ke nilai default atau state awal jika diperlukan di sini
        });
    });

    const onSearch = (e) => {
        let value = e.target.value; // Mengambil nilai dari input
        setsearch(value)
        setListFiles(d => {
            // Filter `allData` untuk mencari entri yang mengandung substring `value` pada `BNUMBER`
            const filteredData = d.dataJson.allData.filter(item =>
                item.BNUMBER.includes(value)
            );

            return {
                ...d,
                dataJson: {
                    ...d.dataJson,
                    // Kita asumsikan Anda ingin mempertahankan 'data' seperti sebelumnya dan hanya mengupdate 'allData'
                    searchData: filteredData,
                }
            };
        });
    }



    createEffect(() => {
        console.log(onListFIles())
    })



    return (
        <ContainerPages>
            <div className="flex flex-1 pt-4 gap-1">
                <div className={`w-96 ${onMinimze() && "!w-0"} bg-primarry-1 relative items-center flex flex-col justify-center z-10 transition-all`}>
                    <div className={`${onMinimze() && "opacity-0"} absolute w-full h-full overflow-auto p-4 left-0 top-0 grid gap-2`}>
                        <div className="flex flex-col">
                            <form onSubmit={onSubmit} className="flex flex-col gap-2 flex-1">
                                <div className="w-full">
                                    <Button type="submit" fullWidth startIcon={<Add></Add>} variant="contained" color="secondary">
                                        SUBMIT
                                    </Button>
                                </div>
                                <div>
                                    <div>
                                        <Tags label="TITLE CONNECTION"></Tags>
                                    </div>
                                    <div className="bg-primarry-2 px-2 py-1">
                                        <InputBase
                                            size="small"
                                            class="w-full"
                                            value={group.controls.title.value}
                                            onChange={d => (
                                                group.controls.title.setValue(d.target.value)
                                            )}
                                            required={group.controls.title.isRequired}
                                            placeholder="INPUT TITLE"
                                            sx={{
                                                color: "white"
                                            }}></InputBase>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <Tags label="DESCRIPTION"></Tags>
                                    </div>
                                    <div className="bg-primarry-2 px-2 py-1">
                                        <textarea className="w-full bg-transparent min-h-[60px] outline-none"></textarea>
                                    </div>
                                </div>
                                <div className="relative flex justify-between items-center">
                                    <div>
                                        <Button color="secondary" variant="contained" startIcon={<Upload></Upload>}>
                                            <input id="input" accept=".csv,text/csv,.txt,text/plain" multiple onChange={onMultipleFiles} type="file" className="w-full h-full opacity-0 absolute"></input> Upload FIles .Csv or .txt
                                        </Button>
                                    </div>
                                    <div>
                                        <Button color="info" startIcon={<Settings></Settings>}>
                                            Config
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid gap-4 flex-1 relative">
                                    <div className="flex flex-col absolute h-full w-full left-0 top-0 overflow-auto gap-2">
                                        {onListFIles().mutipleFiles.length === 0 ? <div className="w-full h-full flex items-center justify-center">
                                            Files Empty
                                        </div> : onListFIles().mutipleFiles.map((d) => {
                                            return <div className="bg-primarry-2 p-2 flex justify-between items-center gap-2 border-b border-blue-400" title={d.name}>
                                                <div className=" overflow-hidden">
                                                    <div className="font-bold text-nowrap overflow-hidden text-ellipsis">{d.name}</div>
                                                    <div>
                                                        <div className="text-sm">
                                                            {d.size}KB
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <IconButton color="error" onClick={() => handleDeleteFile(d.name)}>
                                                        <Delete fontSize="small"></Delete>
                                                    </IconButton>
                                                </div>
                                            </div>
                                        })}
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="absolute right-[-50px]">
                        <IconButton onClick={onShow} color="primary" size="small">
                            {onMinimze() ? <ArrowRight></ArrowRight> : <ArrowLeft></ArrowLeft>}
                        </IconButton>
                    </div>
                </div>

                <CardBox className={`flex-1 flex flex-col relative gap-2`} title={"Table List Preview"}>
                    <div className="flex gap-2 overflow-auto flex-nowrap pb-2">
                        {onListFIles().mutipleFiles.map((a) => {
                            return <div>
                                <Button title={a.name} class="max-w-56" onClick={() => onPreview(a.url, a.name)} variant="contained" color="secondary" startIcon={a.active ? <CheckBox></CheckBox> : <CheckBoxOutlineBlank></CheckBoxOutlineBlank>}>
                                    <div className="whitespace-nowrap text-ellipsis overflow-hidden">
                                        {a.name}
                                    </div>
                                </Button>
                            </div>
                        })}
                    </div>
                    {onListFIles().dataJson.data.length > 0 && <div className="flex gap-2 justify-between">
                        <div className="py-1 px-3 bg-primarry-2 flex items-center gap-2">
                            <Search></Search>
                            <InputBase
                                value={search() || ''}
                                onChange={onSearch}
                                placeholder="Search"
                                sx={{
                                    color: "white"
                                }}
                            ></InputBase>
                        </div>
                        {!search() && <div className="flex justify-end">
                            <div className="bg-primarry-2 p-2">
                                {onListFIles().page.current}/{onListFIles().page.total} Total
                            </div>
                        </div>}
                    </div>}

                    <div className="flex flex-col flex-1 relative">
                        <div ref={mainPreview} class="absolute w-full h-full left-0 top-0 overflow-auto">
                            {onListFIles().dataJson.data.length === 0 ? <div className="absolute w-full h-full left-0 top-0 flex items-center justify-center">
                                DATA EMPTY PLEASE UPLOAD YOUR FILES
                            </div> : <>
                                <table class="w-full text-sm text-left rtl:text-right text-white ">
                                    <thead class="text-xs uppercase bg-primarry-2 dark:bg-gray-700 sticky top-0">
                                        <tr>
                                            {onListFIles().column.map(s => {
                                                return <th scope="col" class="px-6 py-3">
                                                    {s}
                                                </th>
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {onListFIles().dataJson[!search() ? "data" : "searchData"].map(a => {
                                            return <tr class="bg-white border-b text-black"> {
                                                onListFIles().column.map(w => {
                                                    return <th class="px-6 py-2">
                                                        {a[w]}
                                                    </th>
                                                })
                                            }
                                            </tr>
                                        })}


                                    </tbody>
                                </table>
                            </>}
                        </div>
                    </div>
                    <div className="absolute w-80 bg-[#1b1b1b] h-full left-0 top-0 z-10">
                        <div className="flex justify-end p-2">
                            <IconButton color="error">
                                <Close></Close>
                            </IconButton>
                        </div>
                        <div className="px-4 flex gap-2 flex-col">
                            <div>
                                <div>
                                    <Tags label="ROOT"></Tags>
                                </div>
                                <div className="bg-primarry-2 px-2 py-1">
                                    <select className="bg-primarry-2 outline-none w-full p-2">
                                        <option>Select Root</option>
                                        {onListFIles().column.map(a => {
                                            return <option value={a}>{a}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <Tags label="PARENT"></Tags>
                                </div>
                                <div className="bg-primarry-2 px-2 py-1">
                                    <select className="bg-primarry-2 outline-none w-full p-2">
                                        <option>Select Parent</option>
                                        {onListFIles().column.map(a => {
                                            return <option value={a}>{a}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <Tags label="DESCRIPTION"></Tags>
                                </div>
                                {/* <div className="bg-primarry-2 px-2 py-1">
                                    <FormControl
                                        sx={{
                                            m: 1,
                                            width: 300,
                                        }}
                                    >
                                        <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
                                        <Select
                                            labelId="demo-multiple-chip-label"
                                            id="demo-multiple-chip"
                                            multiple
                                            value={personName()}
                                            onChange={handleChange}
                                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                            renderValue={(selected) => (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: 0.5,
                                                    }}
                                                >
                                                    {selected.map((value) => (
                                                        <Chip label={value} />
                                                    ))}
                                                </Box>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            {names.map((name) => (
                                                <MenuItem value={name}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </CardBox>
            </div>
        </ContainerPages>
    );
};

export default AddConnection;
