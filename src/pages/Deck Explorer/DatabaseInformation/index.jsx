import {
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "@suid/material";
import ContainerPages from "../..";
import { CardBox } from "../../../component/cardBox";
import { CardFrame } from "../../../component/cardFrame";
import { Tags } from "../../../component/tags";
import { mode } from "../../../helper/_helper.theme";
import { createSignal, createEffect, onCleanup } from "solid-js";
import { CheckboxItems } from "../../../component/form/checkbox";
import AlertDialog, { DialogPopup } from "../../../component/dialog";
import { useAppState } from "../../../helper/_helper.context";
import { useLocation, useNavigate } from "@solidjs/router";
import {
  Check,
  Close,
  CoPresent,
  ContentCopy,
  CopyAll,
} from "@suid/icons-material";
import { Drawer } from "@suid/material";
import { api } from "../../../helper/_helper.api";
import RenderData from "./renderData";
import { Loading } from "../../../component/loading";

const DatabaseInformation = () => {
  const [__, { update }] = useAppState();
  const [checkData, setCheck] = createSignal([]);
  const location = useLocation();

  const navi = useNavigate();
  const query = location.pathname.split("/").pop();
  const [ischeck, setisCheck] = createSignal(null);
  const [isLoading, setisLoading] = createSignal(false);
  const [pilihan, setpilihan] = createSignal(null);
  const [isExisting, setisExisting] = createSignal(false);
  const [existingValue, setexistingValue] = createSignal({
    name: null,
    value: "",
  });
  let typeSearch = localStorage.getItem("typeSearch");
  let typePath =
    typeSearch === "MSISDN"
      ? "msisdn"
      : typeSearch === "FAMILY ID"
      ? "family-member"
      : typeSearch === "VEHICLE"
      ? "vehicle"
      : "identification";

  const [dataExisting, setdataExisting] = createSignal(null);
  const [saved, setSaved] = createSignal({
    isError: true,
    isErrorMsg: false,
  });
  const countActiveStatus = (status) => {
    return checkData().reduce((acc, curr) => {
      const count = curr.data.filter((item) => item.active === status).length;
      return acc + count;
    }, 0);
  };

  createEffect(() => {
    if (checkData()?.length > 0) {
      localStorage.setItem("dataSearch", JSON.stringify(checkData()));
      update((d) => ({ ...d, dataSearch: checkData() }));
    }
  });

  createEffect(() => {
    // var regexp = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
    // var no = query;

    // if (!regexp.test(no) && no.length < 0) {
    //   navi("/");
    // }

    let count = countActiveStatus(true);

    if (count > 0) {
      setSaved((d) => ({ ...d, isError: false }));
      setSaved((d) => ({
        ...d,
        isErrorMsg: false,
      }));
    } else {
      setSaved((d) => ({ ...d, isError: true }));
    }

    checkData()?.forEach((items) => {
      let totalCounts = items.data.reduce(
        (acc, current) => {
          // Menghitung jumlah true dan false dalam current.data
          let counts = current.data.reduce(
            (countAcc, item) => {
              countAcc.true += item.active ? 1 : 0;
              countAcc.false += item.active ? 0 : 1;
              countAcc.total += item.id && 1;
              return countAcc;
            },
            { true: 0, false: 0, total: 0 }
          );

          // Menambahkan ke akumulator
          acc.true += counts.true;
          acc.false += counts.false;
          acc.total += counts.total;

          return acc;
        },
        { true: 0, false: 0, total: 0 }
      );

      if (totalCounts.true >= 0 && totalCounts.total !== totalCounts.true) {
        setisCheck(false);
      } else {
        setisCheck(true);
      }
    });
  });

  const onSubmit = () => {
    let count = countActiveStatus(true);

    const check = checkData().map((d) => {
      return {
        ...d,
        data: d.data
          .filter((d) => d.active !== false)
          .map((s) => ({
            ...s,
            data: s.data.filter((d) => d.active !== false),
          })),
      };
    });

    let a = check.filter((d) => d.data.length > 0);

    update((d) => ({ ...d, hasilSearch: a }));

    if (!existingValue().name) {
      if (count === 0) {
        update((d) => ({ ...d, open: true }));
        setSaved((d) => ({
          ...d,
          isErrorMsg: true,
        }));
      } else {
        setSaved((d) => ({
          ...d,
          isErrorMsg: false,
        }));
        navi(`${location.pathname}/create-new-profile`, {
          state: {
            keyword: query,
          },
        });
      }
    } else {
      update((d) => ({ ...d, open: true }));
    }
  };

  createEffect(() => {
    if (isExisting()) {
      api()
        .get("/deck-explorer/marked_profile")
        .then((d) => {
          setdataExisting(d.data.items);
        });
    }
  });

  createEffect(() => {
    api()
      .get(`/deck-explorer/database_result?keyword=${query}`)
      .then((a) => {
        console.log(a.data.items.data);
        setCheck(a.data.items.data);
        setisLoading(true);
      });
  });

  onCleanup(() => {
    setisLoading(false);
    setCheck();
    setdataExisting();
    setisCheck(false);
    setpilihan();
    setSaved({
      isError: true,
      isErrorMsg: false,
    });
  });

  const onCopy = (text) => {
    // Buat sebuah area teks sementara
    const tempElement = document.createElement("div");
    tempElement.textContent = text;
    document.body.appendChild(tempElement);

    // Seleksi teks dalam area teks sementara
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(tempElement);
    selection.removeAllRanges();
    selection.addRange(range);

    // Salin teks ke clipboard
    document.execCommand("copy");

    // Hapus area teks sementara
    document.body.removeChild(tempElement);

    // Beri pesan pemberitahuan
    alert("The text has been copied successfully");
  };

  const onAdd = () => {
    const check = checkData().map((d) => {
      return {
        ...d,
        data: d.data
          .filter((d) => d.active !== false)
          .map((s) => ({
            ...s,
            data: s.data.filter((d) => d.active !== false),
          })),
      };
    });

    let a = check.filter((d) => d.data.length > 0);

    update((d) => ({ ...d, hasilSearch: a }));

    let data = {
      data: a,
      keyword: query,
      terkait: existingValue().value,
      type: localStorage.getItem("typeSearch").toUpperCase(),
      typeTerkait: pilihan(),
    };

    api()
      .post("/deck-explorer/marked-profile", data)
      .then((sa) => {
        update((d) => ({ ...d, hasilSearch: a, open: false }));

        DialogPopup({
          icon: "success",
          title: "INFO",
          text: "Data Has Been Added",
          confirmButtonText: "OK",
          didClose: () => {
            navi(
              `/deck-explorer/marked-profile/${sa.data.items.terkait}/${typePath}`
            );
          },
        });
      })
      .catch((d) => {
        DialogPopup({
          icon: "error",
          title: "OOPS",
          text: d.response.data.message,
        });
      });
  };

  function setCheckAll(parentId, checked) {
    setCheck((prevData) => {
      return prevData.map((parent) => {
        if (parent.id === parentId) {
          // Update all children's active state to true
          const updatedChildren = parent.data.map((child) => ({
            ...child,
            active: checked,
            data: child.data.map((subChild) => ({
              ...subChild,
              active: checked, // Set all sub-children's active state to true
            })),
          }));

          return {
            ...parent,
            checkAll: checked, // Set checkAll to true for the parent
            data: updatedChildren,
          };
        }
        return parent;
      });
    });
  }

  function checkItems(bId, dId, isChecked) {
    setCheck((prevItems) =>
      prevItems.map((item) => {
        // Check if this is the group we're updating
        if (item.id === bId) {
          let allItemsActive = true; // Assume initially that all items are active

          // Map through the groups to update their items
          const updatedGroups = item.data.map((group) => {
            // Map through the items in the group
            const updatedItems = group.data.map((subItem) => {
              // Check if this is the item we're updating
              if (subItem.id === dId) {
                return { ...subItem, active: !isChecked }; // Update the active state based on isChecked
              }
              return subItem;
            });

            // Check if all sub-items are now active
            const allSubItemsActive = updatedItems.every(
              (subItem) => subItem.active
            );
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
    );
  }
  const CardFrameData = () => {
    const [mainData, setMainData] = createSignal(checkData());

    const displayCount = 3; // Jumlah item yang ditampilkan dalam viewport
    const [startLimit, setStartLimit] = createSignal(0);
    let containerRef = null;

    const itemWidth = 700; // Lebar setiap item
    const buffer = 2; // Menambahkan buffer untuk memperhalus pengalaman scroll
    const totalItems = mainData().length; // Jumlah total item

    const containerWidth = totalItems * itemWidth; // Total lebar container berdasarkan jumlah item
    let animationFrameId = null; // Untuk menyimpan ID dari requestAnimationFrame

    const updateDisplayedItemsOnScroll = () => {
      const container = containerRef;
      const scrollLeft = container.scrollLeft;

      // Membatalkan frame animasi sebelumnya jika ada
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      // Memperbarui state dalam requestAnimationFrame untuk memastikan smooth scrolling
      animationFrameId = requestAnimationFrame(() => {
        // Hitung indeks baru berdasarkan posisi scroll
        const newStartLimit = Math.floor(scrollLeft / itemWidth) - buffer;
        setStartLimit(Math.max(0, newStartLimit));

        const newActivePage =
          Math.floor(scrollLeft / (itemWidth * itemsPerPage)) + 1;

        // Pastikan halaman aktif tidak melebihi total halaman
        if (newActivePage !== activePage() && newActivePage <= totalPages) {
          setActivePage(newActivePage);

          // Hitung dan perbarui grup halaman aktif
          const newActivePageGroup = Math.ceil(newActivePage / maxPageButtons);
          if (newActivePageGroup !== activePageGroup()) {
            setActivePageGroup(newActivePageGroup);
          }
        }
      });
    };

    createEffect(() => {
      const container = containerRef;
      if (container) {
        container.addEventListener("scroll", updateDisplayedItemsOnScroll);
      }
    });

    onCleanup(() => {
      if (containerRef) {
        containerRef.removeEventListener(
          "scroll",
          updateDisplayedItemsOnScroll
        );
      }
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    });

    // Menghitung translateX untuk menyesuaikan posisi item berdasarkan startLimit
    const translateX = () => startLimit() * itemWidth;

    // State untuk halaman aktif
    const itemsPerPage = 3; // Jumlah item per halaman
    const totalPages = Math.ceil(totalItems / itemsPerPage); // Hitung total halaman
    const maxPageButtons = 3; // Maksimal jumlah tombol halaman yang ditampilkan

    // State untuk halaman aktif dan grup halaman aktif
    const [activePage, setActivePage] = createSignal(1);
    const [activePageGroup, setActivePageGroup] = createSignal(1);

    // Hitung jumlah grup halaman
    const totalPageGroups = Math.ceil(totalPages / maxPageButtons);

    // Mengubah halaman aktif
    const changePage = (page) => {
      const pageNumber = parseInt(page, 10);

      // Hitung startLimit berdasarkan halaman yang dipilih
      let newStartLimit = (pageNumber - 1) * displayCount;

      // Sesuaikan startLimit untuk memastikan bahwa ia valid
      newStartLimit = Math.max(0, newStartLimit); // Pastikan tidak negatif
      newStartLimit = Math.min(newStartLimit, totalItems - displayCount); // Pastikan tidak melebihi batas

      setStartLimit(newStartLimit);
      setActivePage(pageNumber);

      // Tunggu update UI, lalu sesuaikan posisi scroll
      requestAnimationFrame(() => {
        if (containerRef) {
          let scrollTo;

          // Cek apakah ini halaman terakhir
          if (pageNumber === Math.ceil(totalItems / displayCount)) {
            // Untuk halaman terakhir, mentokkan scroll ke kanan
            // containerWidth adalah total lebar semua item, dan containerRef.offsetWidth adalah lebar viewport
            scrollTo = containerWidth - containerRef.offsetWidth;
          } else {
            // Untuk halaman lain, hitung posisi scroll seperti biasa
            scrollTo =
              (newStartLimit / displayCount) * itemWidth * displayCount;
          }

          containerRef.scrollLeft = scrollTo + 5; // Menyesuaikan dengan buffer jika ada
        }
      });
    };

    // Menghitung halaman yang ditampilkan berdasarkan grup halaman aktif
    const displayedPages = () => {
      const startPage = (activePageGroup() - 1) * maxPageButtons + 1;
      const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);
      return Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      );
    };

    // Menavigasi grup halaman
    const navigatePageGroup = (direction) => {
      let newGroup = activePageGroup() + direction;
      newGroup = Math.max(1, Math.min(newGroup, totalPageGroups));
      setActivePageGroup(newGroup);
      // Ubah halaman aktif ke halaman pertama di grup baru
      changePage((newGroup - 1) * maxPageButtons + 1);
    };

    createEffect(() => {
      setMainData((d) =>
        checkData().slice(
          Math.max(0, startLimit() - buffer),
          startLimit() + displayCount + buffer
        )
      );
    });

    // Menambahkan fungsi untuk menangani klik "NEXT"

    createEffect(() => {
      let typePath =
        typeSearch === "MSISDN"
          ? "phone_number_list"
          : typeSearch === "FAMILY ID"
          ? "family"
          : typeSearch === "VEHICLE"
          ? "no_pol"
          : "replace_personal";

      setpilihan(typePath);
    });

    return (
      <CardFrame
        isLoading={isLoading}
        count={checkData}
        title={`INFORMATION category`}
        className="flex flex-col flex-1 relative"
      >
        <div
          ref={(container) => (containerRef = container)}
          className="absolute left-0 top-0 h-full w-full overflow-auto flex flex-col"
        >
          <div
            id="container"
            className="top-0 flex flex-1 w-full left-0 px-4 py-4"
            style={{ width: `${containerWidth}px` }}
          >
            <div
              className="flex gap-4"
              style={{ transform: `translateX(${translateX()}px)` }}
            >
              {/* Menyesuaikan slice untuk memperhitungkan buffer */}
              {mainData().map((d, i) => (
                <div
                  className={`grid `}
                  key={i + startLimit()}
                  style={{ width: `${itemWidth}px` }}
                >
                  <RenderData
                    b={d}
                    k={i + startLimit()}
                    checkItems={checkItems}
                    Tags={Tags}
                    IconButton={IconButton}
                    ContentCopy={ContentCopy}
                    CheckboxItems={CheckboxItems}
                    FormControlLabel={FormControlLabel}
                    checkData={checkData}
                    setCheck={setCheck}
                    setCheckAll={setCheckAll}
                    onCopy={onCopy}
                    mode={mode}
                    saved={saved}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute right-[20px] bottom-[20px] flex items-center justify-center">
          <div className="relative flex items-center gap-2 justify-center px-4 py-2 bg-primarry-1">
            <div className="flex gap-2 items-center">
              <Button
                onClick={() => navigatePageGroup(-1)}
                disabled={activePageGroup() === 1}
              >
                PREV
              </Button>
              {displayedPages().map((page) => (
                <IconButton
                  key={page}
                  onClick={() => changePage(page)}
                  color={activePage() === page ? "secondary" : "primary"}
                  size="small"
                  sx={{ padding: "0 10px" }}
                >
                  {page}
                </IconButton>
              ))}
              <Button
                onClick={() => navigatePageGroup(1)}
                disabled={activePageGroup() === totalPageGroups}
              >
                NEXT
              </Button>
            </div>
            <span>
              {Math.min(checkData().length, startLimit() + displayCount)} /{" "}
              {totalItems} TOTAL
            </span>
          </div>
        </div>
      </CardFrame>
    );
  };

  return (
    <ContainerPages>
      <div className="py-6 flex flex-col flex-1">
        <CardBox
          headerComponent={
            <div className="flex gap-4">
              <FormControlLabel
                label="ADD ALL"
                onChange={(d) => {
                  let checked = d.target.checked;
                  setisCheck(!checked);

                  setCheck((d) =>
                    d.map((a) => ({
                      ...a,
                      checkAll: !checked,
                      data: a.data.map((d) => ({
                        ...d,
                        active: !checked,
                        data: d.data.map((a) => ({
                          ...a,
                          active: !checked,
                        })),
                      })),
                    }))
                  );
                }}
                checked={ischeck()}
                sx={{
                  color: mode() === "dark" ? "#eee" : "#444",
                }}
                control={
                  <CheckboxItems
                    sx={{
                      borderRadius: 0,
                    }}
                  />
                }
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
                      "&.Mui-disabled,.MuiFormControlLabel-label.Mui-disabled":
                        {
                          color: "#444",
                        },
                    }}
                    onClick={(event) => {
                      setisExisting(true);
                      // update(d => ({ ...d, open: true }))
                    }}
                  >
                    {existingValue().name
                      ? existingValue().name
                      : "EXISTING MARKED PROFILE"}
                  </Button>

                  <Drawer
                    anchor={"right"}
                    open={isExisting()}
                    sx={{ zIndex: 9999 }}
                  >
                    <div className="w-96 h-full bg-primarry-1 text-white p-4 flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-primarry-2">
                        <h4>EXISTING MARKED PROFILE</h4>
                        {existingValue().name ? (
                          <IconButton
                            color="success"
                            onClick={() => setisExisting(false)}
                          >
                            <Check></Check>
                          </IconButton>
                        ) : (
                          <IconButton
                            color="error"
                            onClick={() => setisExisting(false)}
                          >
                            <Close></Close>
                          </IconButton>
                        )}
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        {existingValue().name && (
                          <div>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => {
                                setexistingValue({
                                  name: "",
                                  value: "",
                                });
                              }}
                            >
                              CANCEL
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col px-4 relative">
                        <div className="absolute w-full h-full overflow-auto left-0">
                          <FormControl class="w-full">
                            <RadioGroup
                              aria-labelledby="demo-radio-buttons-group-label"
                              name="radio-buttons-group"
                              value={existingValue()?.value || ""}
                              onClick={(d) => {
                                let id = d?.target?.value;

                                if (id) {
                                  setexistingValue((s) => ({
                                    ...s,
                                    name:
                                      d?.target?.attributes?.name?.value || "-",
                                    value: id,
                                  }));

                                  api()
                                    .get(
                                      `/deck-explorer/marked_profile?keyword=${id}`
                                    )
                                    .then((a) => {
                                      let data2 = a.data.items.data;

                                      setCheck((data1) =>
                                        data1.map((item1) => {
                                          const item2 = data2.find((item) => {
                                            return item.id === item1.id;
                                          });
                                          if (item2) {
                                            item1.checkAll = item2.checkAll;
                                            item1.marked = item2.marked;
                                            item1.relate = item2.relate;

                                            item1.data = item1.data.map(
                                              (subItem1) => {
                                                const subItem2 =
                                                  item2.data.find(
                                                    (subItem) =>
                                                      subItem.id === subItem1.id
                                                  );

                                                if (subItem2) {
                                                  subItem1.active =
                                                    subItem2.active;
                                                  subItem1.type = subItem2.type;
                                                  subItem1.data =
                                                    subItem1.data.map(
                                                      (subItem3) => {
                                                        const subItem4 =
                                                          subItem2.data.find(
                                                            (subItem) =>
                                                              subItem.id ===
                                                              subItem3.id
                                                          );
                                                        if (subItem4) {
                                                          subItem3.active =
                                                            subItem4.active;
                                                        }

                                                        return subItem3;
                                                      }
                                                    );
                                                  // Anda dapat menambahkan pembaruan lain yang diperlukan di sini
                                                }

                                                return subItem1;
                                              }
                                            );
                                          }

                                          return item1;
                                        })
                                      );
                                    });
                                }
                              }}
                              class="w-full space-y-2 flex flex-col"
                            >
                              {dataExisting()?.length === 0
                                ? "NO DATA"
                                : dataExisting()?.map((d) => {
                                    return (
                                      <div
                                        className="border border-primarry-2 flex justify-between flex-1"
                                        onClick={() => {
                                          setexistingValue((a) => ({
                                            ...a,
                                            type: d.type,
                                          }));
                                        }}
                                      >
                                        <FormControlLabel
                                          value={d.keyword}
                                          name={d?.profile_name || "-"}
                                          class="w-full flex-1 !m-0"
                                          sx={{
                                            ".MuiFormControlLabel-label": {
                                              flex: 1,
                                            },
                                          }}
                                          control={() => (
                                            <Radio class="tester" />
                                          )}
                                          label={
                                            <div className="w-full px-2 py-2 flex gap-2 flex-col ">
                                              <div className="flex gap-2 items-center justify-between border-b border-primarry-2 py-2">
                                                <div className="w-12">
                                                  <img
                                                    className="w-full"
                                                    src={d?.foto_url?.label}
                                                  ></img>
                                                </div>
                                                <div>
                                                  <div>
                                                    <Chip
                                                      color="secondary"
                                                      sx={{
                                                        borderRadius: 0,
                                                      }}
                                                      label={d.profile_name}
                                                    ></Chip>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex justify-between text-xs">
                                                <div>
                                                  REMARKS :
                                                  <Chip
                                                    color="secondary"
                                                    sx={{
                                                      borderRadius: 0,
                                                    }}
                                                    label={d.remarks}
                                                  ></Chip>
                                                </div>
                                                <div>
                                                  TYPE :
                                                  <Chip
                                                    color="secondary"
                                                    sx={{
                                                      borderRadius: 0,
                                                    }}
                                                    label={d.type}
                                                  ></Chip>
                                                </div>
                                              </div>
                                            </div>
                                          }
                                        />
                                      </div>
                                    );
                                  })}
                            </RadioGroup>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  </Drawer>
                </div>
                <div className="space-x-4">
                  {existingValue().name ? (
                    <Button
                      disabled={saved().isError}
                      variant="contained"
                      onClick={onSubmit}
                      color="success"
                      sx={{
                        "&.Mui-disabled": {
                          background: "#000",
                          color: "#c0c0c0",
                        },
                      }}
                    >
                      Add Database
                    </Button>
                  ) : (
                    <Button
                      disabled={saved().isError}
                      variant="contained"
                      onClick={onSubmit}
                      color="secondary"
                      sx={{
                        "&.Mui-disabled": {
                          background: "#000",
                          color: "#c0c0c0",
                        },
                      }}
                    >
                      SAVE to New Profile
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => navi(-1)}
                  >
                    CANCEL
                  </Button>
                </div>
              </div>
            </div>
          }
          className="!flex-1 flex !flex-col !p-4 min-h-[600px]"
          title={`DATABASE INFORMATION`}
        >
          <div className="grid  flex-1 m-[-18px]">
            <div className="xl:col-span-6 flex-1 px-4 py-2 flex flex-col">
              <Tags label={"MULTI SOURCE DATABASE INFORMATION"}></Tags>

              {isLoading() && <CardFrameData></CardFrameData>}
            </div>
          </div>
        </CardBox>
      </div>
      <AlertDialog
        handleClick={onAdd}
        description={
          <div>
            <div className="w-[300px]">
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  value={pilihan() || ""}
                  onClick={(d) => {
                    if (d.target.value) {
                      setpilihan(d.target.value);
                    }
                  }}
                >
                  {typeSearch === "PERSONAL ID" && (
                    <>
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
                    </>
                  )}
                  {typeSearch === "FAMILY ID" && (
                    <FormControlLabel
                      value="family"
                      control={() => <Radio />}
                      checked
                      label="Family Member (NKK)"
                    />
                  )}
                  {typeSearch === "VEHICLE" && (
                    <FormControlLabel
                      value="no_pol"
                      control={() => <Radio />}
                      checked
                      label="Vehicle"
                    />
                  )}

                  {typeSearch === "MSISDN" && (
                    <FormControlLabel
                      value="phone_number_list"
                      control={() => <Radio />}
                      checked
                      label="MSISDN LIST"
                    />
                  )}
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        }
        title={
          <div className="flex justify-between items-center">
            <div>SAVE TO</div>
            {pilihan() && (
              <Button
                color="error"
                onClick={() => {
                  setpilihan();
                }}
              >
                CLEAR
              </Button>
            )}
          </div>
        }
      />
    </ContainerPages>
  );
};

export default DatabaseInformation;
