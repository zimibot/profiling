import { ArrowLeft, ArrowRight, Upload } from "@suid/icons-material";
import { createSignal } from "solid-js";
import { Button, IconButton, InputBase } from "@suid/material";
import { useNavigate } from "@solidjs/router";
import ContainerPages from "../..";
import { CardBox } from "../../../component/cardBox";
import { createFormControl, createFormGroup } from "solid-forms";
import { Tags } from "../../../component/tags";
import Swal from "sweetalert2";

const AddConnection = () => {

    const navi = useNavigate()

    const [onMinimze, setMinimize] = createSignal(false)

    const onShow = () => {
        setMinimize(a => !a)
    }

    const group = createFormGroup({
        mutipleFiles: createFormControl([], {
            required: true,
        }),
        category: createFormControl("", {
            required: true,
        }),
        value: createFormControl("", {
            required: true,
        }),
    });


    const onMultipleFiles = (e) => {
        const files = e.target.files;
        const validFiles = [];

        // Check if no files were selected
        if (files.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'No Files Selected',
                text: 'No files were selected. Please select at least one CSV file.',
            });
            return; // Exit the function early as there are no files to process
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (file.type === "text/csv" || file.name.endsWith('.csv')) {
                validFiles.push(file);
            } else {
                // Use SweetAlert2 to show a notification for each invalid file
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid File',
                    text: `File ${file.name} is not a CSV file and was not uploaded.`,
                });
            }
        }

        // Update the state with valid files
        // Ensure to correct the typo in 'mutipleFiles' to 'multipleFiles' if it's a typo in your original code
        group.controls.multipleFiles.setValue(validFiles);
    };


    const onSubmit = (e) => {
        e.preventDefault()

        const { value } = group

        console.log(value)
    }

    return (
        <ContainerPages>
            <div className="flex flex-1 pt-4 gap-1">
                <div className={`w-96 ${onMinimze() && "!w-0"} bg-primarry-1 relative items-center flex flex-col justify-center z-10 transition-all`}>
                    <div className={`${onMinimze() && "opacity-0"} absolute w-full h-full overflow-auto p-4 left-0 top-0 grid gap-2`}>
                        <div>
                            <form onSubmit={onSubmit} className="grid gap-2">

                                <div>
                                    <div>
                                        <Tags label="TITLE CONNECTION"></Tags>
                                    </div>
                                    <div className="bg-primarry-2 px-2 py-1">
                                        <InputBase
                                            size="small"
                                            class="w-full"
                                            value={group.controls.category.value}
                                            onChange={d => (
                                                group.controls.category.setValue(d.target.value)
                                            )}
                                            required={group.controls.category.isRequired}
                                            placeholder="INPUT TITLE" sx={{
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
                                <div className="relative">
                                    <Button color="secondary" variant="contained" startIcon={<Upload></Upload>}>
                                        <input accept=".csv,text/csv" multiple onChange={onMultipleFiles} type="file" className="w-full h-full opacity-0 absolute"></input> Upload FIles .Csv
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="absolute right-[-50px]">
                        <IconButton onClick={onShow} color="primary">
                            {onMinimze() ? <ArrowRight></ArrowRight> : <ArrowLeft></ArrowLeft>}
                        </IconButton>
                    </div>
                </div>

                <CardBox className={`flex-1 flex flex-col relative`} title={"Connection"}>
                </CardBox>
            </div>
        </ContainerPages>
    );
};

export default AddConnection;
