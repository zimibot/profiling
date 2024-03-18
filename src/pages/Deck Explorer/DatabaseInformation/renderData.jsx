import { ImageAspectRatio, ZoomIn, ZoomInMap, ZoomOutMap } from '@suid/icons-material';
import { For } from 'solid-js';

// Definisikan fungsi komponen di luar fungsi utama
const RenderData = ({ refData, checkData, checkItems, setCheckAll, setCheck, onCopy, mode, saved, CheckboxItems, FormControlLabel, ContentCopy, IconButton, Tags, b, k }) => {
  // Kembalikan hasil pemetaan data ke elemen yang diperlukan

  const onZoom = (src) => {
    // Membuat elemen <div> baru

    let existingElement = document.getElementById("zoomDiv");
    if (existingElement) {
      // Hapus elemen <div> yang sudah ada
      existingElement.remove();
    }

    let element = document.createElement("div");
    let element_2 = document.createElement("div");
    let closeButton = document.createElement("button");
    let img = document.createElement("img");

    element.setAttribute("id", "zoomDiv"); // Menetapkan id untuk referensi
    element.classList = "fixed w-full h-full top-0 left-0 z-50 bg-primarry-1 bg-opacity-80 flex justify-center items-center"
    element.appendChild(element_2);

    element_2.classList = "relative";
    element_2.appendChild(closeButton);

    closeButton.classList = "absolute bg-red-500 right-0 top-0 p-2";
    closeButton.textContent = "CLOSE";
    closeButton.setAttribute("id", "closeBtn");

    // Menambahkan event listener ke tombol close
    closeButton.addEventListener('click', () => {
      element.remove(); // Menghapus elemen zoomDiv dari dokumen ketika tombol close diklik
    });

    img.setAttribute("src", src);
    img.setAttribute("alt", "Deskripsi gambar");
    element_2.appendChild(img);
    document.body.appendChild(element);
  }

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
          <div className={`flex  gap-4 relative border-b ${mode() === "dark" ? "border-[#333]" : "border-[#aaa]"} py-2 `}>
            <div className="flex gap-4 items-start flex-1 relative">
              <div className={`${mode() === "dark" ? "text-[#aaa]" : "text-[#444]"} sticky top-[10px] whitespace-nowrap w-[200px] z-10 px-4 pt-2`}> {x.total_data === 1 ? "" : `[${x.total_data}]`} {x.label}</div>
              <div className="flex-1 ">
                <div className="gap-2 flex px-4 items-center flex-wrap">
                  {x.data.map((d) => {
                    return (
                      <div className="flex items-center gap-2">
                        <FormControlLabel
                          class={`pl-4 !m-0 ${mode() === "dark" ? ` ${saved().isErrorMsg ? "border-red-500 text-red-500" : "border-[#454545] bg-[#2C2C2C]"}` : saved().isErrorMsg ? "border-red-500 text-red-500" : "bg-gray-200 text-[#444] border-[#aaa]"} pr-2 py-1 flex gap-4 border-[0] max-w-sm`}
                          checked={d.active}
                          onChange={(c) => checkItems(b.id, d.id, c.target.checked)}
                          label={
                            <div title={d.label} className={` relative ${x.label === "ID CARD PHOTO" ? "" : ""}`}>
                              <div className={x.label !== "ID CARD PHOTO" ? "" : "z-50"}>
                                {x.label !== "ID CARD PHOTO" ? d.label : <div><img className="w-20" src={d.label} /></div>}
                              </div>
                            </div>
                          }
                          labelPlacement="end"
                          control={<CheckboxItems />}
                        />
                        {x.label !== "ID CARD PHOTO" ?
                          <IconButton title={"COPY CONTENT"} onClick={() => onCopy(d.label)} color="primary" size="small">
                            <ContentCopy fontSize="small"></ContentCopy>
                          </IconButton> : <IconButton onClick={() => onZoom(d.label)} color="primary" size="small">
                            <ZoomOutMap fontSize="small"></ZoomOutMap>
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
