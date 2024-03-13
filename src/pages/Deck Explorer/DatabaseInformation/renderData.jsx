import { createSignal, createEffect, For, onCleanup } from 'solid-js';

// Definisikan fungsi komponen di luar fungsi utama
const RenderData = ({ refData, checkData, checkItems, setCheckAll, setCheck, onCopy, mode, saved, CheckboxItems, FormControlLabel, ContentCopy, IconButton, Tags, b, k }) => {
  // Kembalikan hasil pemetaan data ke elemen yang diperlukan


  return <div ref={refData} className={`bg-[#1e1e1e] p-2 ${k === 0 ? " col-span-full" : checkData().length === 2 ? "col-span-full" : ""}`}>
    <div className="border border-primarry-2 px-4 bg-primarry-1  z-50 flex justify-between items-center">
      <Tags label={<span>DATA FROM <b>{b.label}</b></span>}></Tags>
      <div>
        <CheckboxItems
          title="Checked All ITEMS"
          checked={b.checkAll}
          onChange={(a) => {
            setCheckAll(b.id, !a.target.checked)
          }}
        />
      </div>
    </div>
    <For each={b.data}>
      {(x) => {
        return (
          <div className={`flex gap-4 relative border-b ${mode() === "dark" ? "border-[#333]" : "border-[#aaa]"} py-2 `}>
            <div className="flex gap-4 items-start flex-1 relative">
              <div className={`${mode() === "dark" ? "text-[#aaa]" : "text-[#444]"} sticky top-[10px] whitespace-nowrap w-[200px] z-10 px-4 pt-2`}> {x.total_data === 1 ? "" : `[${x.total_data}]`} {x.label}</div>
              <div className="flex-1 ">
                <div className="gap-2 flex px-4 items-center flex-wrap">
                  {x.data.map((d) => {
                    return (
                      <div title={d.label} className="flex items-center gap-2">
                        <FormControlLabel
                          class={`pl-4 !m-0 ${mode() === "dark" ? ` ${saved().isErrorMsg ? "border-red-500 text-red-500" : "border-[#454545] bg-[#2C2C2C]"}` : saved().isErrorMsg ? "border-red-500 text-red-500" : "bg-gray-200 text-[#444] border-[#aaa]"} pr-2 py-1 flex gap-4 border-[0] max-w-sm`}
                          checked={d.active}
                          onChange={(c) => checkItems(b.id, d.id, c.target.checked)}
                          label={
                            <div className={` relative ${x.label === "ID CARD PHOTO" ? "hover:z-50  hover:scale-[2.5] transition-all" : ""}`}>
                              <div className={x.label !== "ID CARD PHOTO" ? "" : "z-50"}>
                                {x.label !== "ID CARD PHOTO" ? d.label : <div><img className="w-20" src={d.label} /></div>}
                              </div>
                            </div>
                          }
                          labelPlacement="end"
                          control={<CheckboxItems />}
                        />
                        {x.label !== "ID CARD PHOTO" &&
                          <IconButton onClick={() => onCopy(d.label)} color="primary" size="small">
                            <ContentCopy fontSize="small"></ContentCopy>
                          </IconButton>
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="sticky top-[10px] pr-4">
                {x.data.length !== 1 &&
                  <CheckboxItems
                    title="Checked All"
                    checked={x.active}
                    onChange={() => {
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
                              };
                            }
                            return s;
                          })
                        };
                      }));
                    }}
                  />
                }
              </div>
            </div>
            <div className="w-full flex justify-between items-center absolute bottom-[-5px] left-0">
              <div className={`h-2 w-2 ${mode() === "dark" ? "bg-[#222222]" : "bg-[#aaa]"} left-0`}></div>
              <div className={`h-2 w-2 ${mode() === "dark" ? "bg-[#222222]" : "bg-[#aaa]"} right-0`}></div>
            </div>
          </div>
        );
      }
      }
    </For>

  </div>
};

// Export fungsi agar dapat diakses dari luar
export default RenderData;
