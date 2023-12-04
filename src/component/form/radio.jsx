import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@suid/material"
import { mode } from "../../helper/_helper.theme"

export const RadioField = ({
    data = [
        {
            value: "male",
            label: "Male"
        },
        {
            value: "female",
            label: "Female"
        },
    ],
    defaultValue = "female",
    name = "radio",
    id = "demo-radio-buttons-group-label",
    label = null,
    className,
    onChange,
    disabled
}) => {
    return <div className="relative px-4">
        <div className="absolute w-full h-full left-0 top-0 flex justify-between items-center">
            <div className="h-full w-[1px] bg-[#353535] relative flex justify-between flex-col">
                <div className="w-[15px] h-[1px] bg-[#353535]"></div>
                <div className="w-[15px] h-[1px] bg-[#353535]"></div>
            </div>
            <div className="h-full w-[1px] bg-[#353535] relative flex justify-between flex-col rotate-180">
                <div className="w-[15px] h-[1px] bg-[#353535]"></div>
                <div className="w-[15px] h-[1px] bg-[#353535]"></div>
            </div>
        </div>
        <FormControl>
            {label && <FormLabel id={id}>{label}</FormLabel>}
            <RadioGroup
                onChange={onChange}
                aria-labelledby={id}
                defaultValue={defaultValue}
                name={name}
                color="primary"
                class={`!d-flex !flex-row ${className || ""}`}

            >
                {data.map(d => {
                    return <FormControlLabel
                        disabled={d?.disabled || disabled}
                        value={d.value}
                        sx={{
                            color: mode() === "dark" ? '#eee' : '#222'
                        }}
                        control={() => <Radio
                            inputProps={{
                                "aria-label": d.label,
                                "aria-level": d.type,
                            }}
                           
                            icon={
                                <svg width="25" height="25" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="2" y="2" width="23" height="23" fill="white" fill-opacity="0.2" stroke="#757575" stroke-width="2" />
                                    <path d="M2 25L25 2" stroke="#757575" stroke-width="3" />
                                </svg>

                            }
                            checkedIcon={
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="25" height="25" fill={mode() === "dark" ? '#eee' : '#555'} />
                                </svg>
                            } color="primary" />}
                        label={d.label}
                    />
                })}

                {/* <FormControlLabel value="male" control={() => <Radio />} label="Male" />
            <FormControlLabel
                value="other"
                control={() => <Radio />}
                label="Other"
            /> */}
            </RadioGroup>
        </FormControl>
    </div>
}