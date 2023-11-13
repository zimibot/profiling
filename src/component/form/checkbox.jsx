import { Checkbox } from "@suid/material"
import { mode } from "../../helper/_helper.theme"
import { CheckBox, CheckBoxOutlineBlank } from "@suid/icons-material"

export const CheckboxItems = (props) => {

    const sx = props.sx || {
        borderRadius: 0,
        padding: 0,
    }

    return <Checkbox
        {...props}
        icon={
           <CheckBoxOutlineBlank color="primary"></CheckBoxOutlineBlank>

        }
        checkedIcon={<CheckBox></CheckBox>}
        sx={sx}
    />
}