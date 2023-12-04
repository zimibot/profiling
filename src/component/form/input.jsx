import { VisibilityOff, Visibility, Search, Clear } from "@suid/icons-material";
import { CircularProgress, IconButton, InputAdornment, TextField } from "@suid/material";

import { createSignal } from "solid-js";
import { mode } from "../../helper/_helper.theme";
    
function uppercaseFirst(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}


export const InputField = ({ control, label, ...props }) => {
  const [showPassword, setShowPassword] = createSignal(false)
  return <div className="relative z-10">
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-3">
        <span>
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="6" height="6" fill="white" />
          </svg>
        </span>
        <div>{label}</div>
      </label>
      <div className="relative">
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
        <div className="p-3 px-4">
          <TextField
            id="outlined-start-adornment"
            color="primary"
            variant="standard"
            value={control.value}
            error={control.errors}
            onChange={(d) => control.setValue(d.target.value)}
            required={control.isRequired}
            disabled={control.isDisabled}

            sx={{
              m: 0,
              // minWidth: "40ch",
              width: "100%"
            }}
            autoComplete={false}
            InputLabelProps={{
              style: mode() === "dark" ? { color: '#fff', } : { color: '#444', },
            }}
            type={props.type === "password" ? showPassword() ? "text" : "password" : props.type}
            InputProps={{
              endAdornment: (<InputAdornment position="start">
                {props.type === "password" && <IconButton onClick={() => { setShowPassword(d => !d) }} size="small" color="primary" edge="end">
                  {!showPassword() ? <Visibility /> : <VisibilityOff />}
                </IconButton>}

              </InputAdornment>),
              style: mode() === "dark" ? { color: '#fff', } : { color: '#444', },
            }}
            {...props}
          />
        </div>
      </div>

    </div>
  </div>
}




export const DefaultInput = ({ placeholder, control, defaultSearch, update, removeicon, removebg, chois, loading, type, ...props }) => {
  return <div className={!removebg ? `${mode() === "dark" ? "bg-primarry-2" : "bg-gray-200"} px-2 py-1` : ""}>

    <TextField
      {...props}
      type={typeof type === "string" ? type : type ? type()?.chois?.type : ""}
      color="primary"
      placeholder={chois ? placeholder + chois()?.chois?.label : placeholder}
      required={control.isRequired}
      disabled={loading && loading()}
      value={control.value}
      error={control.errors}
      onChange={(d) => {
        if (update) {
          if (d.target.value.length === 0) {
            update(d => ({ ...d, search: "" }))
          }
        }
        control.setValue(uppercaseFirst(d.target.value))


      }}
      InputLabelProps={{
        style: mode() === "dark" ? { color: '#fff', } : { color: '#444', },
      }}
      InputProps={
        {
          startAdornment: removeicon ? "" : <InputAdornment>
            <button type="submit">
              <IconButton>
                <Search color="primary"></Search>
              </IconButton>
            </button>
          </InputAdornment>,
          endAdornment: (d) => {
            let value = control.value.length


            return value > 0 && <InputAdornment >

              {loading && loading() ? <CircularProgress size={20}></CircularProgress> : <IconButton color="primary" onClick={() => {
                control.setValue("")
                update(d => ({ ...d, search: "" }))
              }}>
                <Clear></Clear>

              </IconButton>}

            </InputAdornment>
          },
          style: mode() === "dark" ? { color: '#fff', } : { color: '#444', },
        }
      }
      sx={{
        m: 0,
        width: "100%",
        border: 0,
      }}
      variant="standard"></TextField>
  </div>
}