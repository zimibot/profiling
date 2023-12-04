import { Button, FormControlLabel } from "@suid/material"
import { mode } from "../../../../helper/_helper.theme";
import { LayoutMarkedProfile } from "..";
import { Tags } from "../../../../component/tags";
import { useAppState } from "../../../../helper/_helper.context";
import { Edit } from "@suid/icons-material";
import lightbox from "lightbox2";
import { createEffect } from "solid-js";
import "lightbox2/dist/css/lightbox.min.css"


const DinamisPage = ({ key, name }) => {
  const [dataItems] = useAppState()

  createEffect(() => {
    lightbox.option({
      'resizeDuration': 200,
      'wrapAround': true
    })
  })


  return <LayoutMarkedProfile title={"IDENTIFICATION"}>
    <div className="flex-1 flex flex-col min-h-[600px] gap-4">
      <div className="w-full gap-2 h-8">
        <Button href={`#/deck-explorer/marked-profile/${dataItems()?.getProfile?.keyword}/${name}/edit?id=${key}`} fullWidth variant="contained" color="secondary" startIcon={<Edit></Edit>}>EDIT {name}</Button>
      </div>
      <div className="relative flex-1">
        <div className="absolute left-0 w-full top-0 overflow-auto h-full flex flex-col pr-2">
          {dataItems()[key]?.data?.map((b) => {
            return <div className="py-2">
              <div className="border border-primarry-2 px-4 bg-primarry-1 sticky top-[5px] z-50">
                <Tags label={<span>DATA DARI <b>{b.label}</b></span>}></Tags>
              </div>
              {b.data.map(x => {
                return <div className={`flex gap-4 relative border-b ${mode() === "dark" ? "border-[#333]" : "border-[#aaa]"}  py-2 `}>
                  <div className="flex gap-4 items-start flex-1 relative">
                    <div className={`${mode() === "dark" ? "text-[#aaa]" : "text-[#444]"} sticky top-[10px] whitespace-nowrap w-[200px] z-10 px-4 pt-2`}> {x.total_data === 1 ? "" : `[${x.total_data}]`} {x.label}</div>
                    <div className="flex-1 ">
                      <div className="gap-2 flex flex-wrap px-4">
                        {x.data.map((d) => {
                          return <div title={d.label}>
                            <FormControlLabel
                              class={`pl-4 !m-0 border-[#454545] bg-[#2C2C2C] pr-2 py-1 flex gap-4 border-[0] max-w-sm`}
                              label={<div className="whitespace-nowrap max-w-xs relative">
                                <div className="text-ellipsis overflow-hidden relative">
                                  {x.label !== "ID CARD PHOTO" ? d.label : <a href={d.label} data-lightbox="image-1" >
                                    <img className="w-20" src={d.label} />
                                  </a>}
                                </div>
                              </div>} />
                          </div>
                        })}
                      </div>
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
      </div>

    </div>
  </LayoutMarkedProfile>
}

export default DinamisPage


