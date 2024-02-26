import ContainerPages from "../../../..";
import { createSignal, createEffect } from "solid-js";
import AlertDialog, { DialogPopup } from "../../../../../component/dialog";
import { useLocation, useNavigate } from "@solidjs/router";
import { mode } from "../../../../../helper/_helper.theme";
import { Tags } from "../../../../../component/tags";
import { CardFrame } from "../../../../../component/cardFrame";
import { CardBox } from "../../../../../component/cardBox";
import { Button, IconButton, Input, Paper } from "@suid/material";
import { DefaultInput } from "../../../../../component/form/input";
import { createFormControl, createFormGroup } from "solid-forms";
import { AddAPhoto, Close, Delete, Edit, Save } from "@suid/icons-material";
import { api } from "../../../../../helper/_helper.api";
import avatar from "../../../../../assets/images/avatar.svg";
import moment from "moment";
import { notify } from "../../../../../component/notify";

const EditIndentification = () => {
  const [checkData, setCheck] = createSignal([]);
  const [inputData, setInputData] = createSignal({});
  const [isEdit, setisEdit] = createSignal(false);
  const [cancelEdit, setcancelEdit] = createSignal(false);
  const [time, setTime] = createSignal();
  const [foto, setFoto] = createSignal(null);
  const [updateFoto, setupdateFoto] = createSignal();
  const group = createFormGroup({
    profile_name: createFormControl("", {
      required: true,
    }),
    case_group: createFormControl("", {
      required: true,
    }),
    remarks: createFormControl("", {
      required: true,
    }),
  });

  const location = useLocation();
  const navi = useNavigate();
  let parts = location.pathname.split("/");
  let path = parts[parts.length - 3];
  const query = location.pathname.split("/").pop();

  createEffect(() => {
    api()
      .get(`/deck-explorer/identification?keyword=${path}`)
      .then((d) => {
        console.log(d);
        group.controls.profile_name.setValue(d.data.items.profile_name);
        group.controls.case_group.setValue(d.data.items.case_group);
        group.controls.remarks.setValue(d.data.items.remarks);
        setFoto(d.data.items.foto_url);
        setTime(moment(d.data.items.timestamp).format("D MMMM YYYY"));
        let data = d.data.items.data.map((w) => {
          return {
            ...w,
            data: w.data.map((a) => {
              return {
                ...a,
                data: a.data.map((s) => {
                  s.field = false;
                  return s;
                }),
              };
            }),
          };
        });

        setCheck(data);
      });

    cancelEdit();
  });

  createEffect(() => {
    if (updateFoto()) {
      var reader = new FileReader();
      reader.readAsDataURL(updateFoto()[0]);
      reader.onloadend = function () {
        setFoto((d) => ({
          ...d,
          label: reader.result,
          type: "file",
        }));
      };
    }
  });


  // createEffect(() => {
  //     var regexp = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/
  //     var no = query;

  //     if (!regexp.test(no) && no.length < 0) {
  //         navi("/")
  //     }

  // })

  const onSubmit = (e) => {
    e.preventDefault();

    const { case_group, profile_name, remarks } = group.value;

    let keyword = path;

    let data = {
      case_group,
      profile_name,
      remarks,
      keyword,
      data: checkData(),
    };

    const profile = () => {
      DialogPopup({
        icon: "warning",
        title: "WARNING",
        text: "Your changes will be saved. Continue?",
        cancelButtonText: "KEEP EDITING",
        confirmButtonText: "SAVE",
        showCancelButton: true,
        classConfirm: "warning",
      }).then((a) => {
        if (a.isConfirmed) {
          api()
            .put("/deck-explorer/identification", data)
            .then((d) => {
              DialogPopup({
                icon: "success",
                title: "INFO",
                text: d.data.message,
                didClose: () => {
                  navi(-1);
                },
              });
            });
        }
      });
    };

    if (updateFoto()) {
      const formData = new FormData();

      formData.append("file", updateFoto()[0]);

      api()
        .post(`/deck-explorer/upload?keyword=${keyword}`, formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded,",
          },
        })
        .then((d) => {
          profile();
        });
    } else {
      profile();
    }
  };

  const onEdit = (id) => {
    setisEdit(true);
    setCheck((d) =>
      d.map((w) => {
        return {
          ...w,
          data: w.data.map((a) => {
            return {
              ...a,
              data: a.data.map((s) => {
                if (s.id === id) {
                  s.field = !s.field;
                }
                return s;
              }),
            };
          }),
        };
      })
    );
  };

  const onDiscard = () => {
    DialogPopup({
      icon: "warning",
      title: "WARNING",
      text: "Are you sure discard any unsaved changes. Are you sure you want to proceed",
      cancelButtonText: "KEEP EDITING",
      confirmButtonText: "OK",
      showCancelButton: true,
      classConfirm: "warning",
    }).then((a) => {
      if (a.isConfirmed) {
        setcancelEdit((d) => !d);
        setisEdit(false);
        notify({ title: "Success", text: `DISCARD CHANGES SUCCES` });
      }
    });
  };

  const onField = (id, value) => {
    notify({ title: "Success", text: `Success Update ${value}` });

    setCheck((d) =>
      d.map((w) => {
        return {
          ...w,
          data: w.data.map((a) => {
            return {
              ...a,
              data: a.data.map((s) => {
                if (s.id === id) {
                  s.label = value;
                }
                return s;
              }),
            };
          }),
        };
      })
    );
  };

  const removeId = (parentId, wIdToRemove, value) => {
    setisEdit(true);
    notify({ title: "Success", text: `Success Delete ${value}` });

    function removeElementById(array, idToRemove) {
      return array.filter((element) => element.id !== idToRemove);
    }

    setCheck((d) =>
      d.reduce((result, w) => {
        // Hapus elemen dengan parentId dari array 'data' w
        const newData = removeElementById(w.data, parentId);

        // Jika array 'data' menjadi kosong, periksa apakah w.id sesuai dengan wIdToRemove
        if (newData.length === 0 && w.id === wIdToRemove) {
          // Jangan tambahkan w ke array hasil
          return result;
        }

        // Tambahkan w dengan data yang telah di-update ke array hasil
        return [...result, { ...w, data: newData }];
      }, [])
    );
  };
  return (
    <ContainerPages>
      <form
        onSubmit={onSubmit}
        className="py-6 flex flex-col flex-1"
        enctype="multipart/form-data"
      >
        <CardBox
          headerComponent={
            <div className="flex gap-4">
              <div className="flex gap-4 items-center">
                <div className="space-x-4">
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    sx={{
                      "&.Mui-disabled": {
                        background: "#000",
                        color: "#c0c0c0",
                      },
                    }}
                  >
                    SAVE CHANGES
                  </Button>
                  {isEdit() && (
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => {
                        onDiscard();
                      }}
                    >
                      DISCARD CHANGES
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      if (isEdit()) {
                        DialogPopup({
                          icon: "warning",
                          title: "WARNING",
                          text: "Canceling will discard any unsaved changes. Are you sure you want to proceed",
                          cancelButtonText: "KEEP EDITING",
                          showCancelButton: true,
                          confirmButtonText: "OK",
                          classConfirm: "warning",
                        }).then((d) => {
                          if (d.isConfirmed) {
                            navi(-1);
                          }
                        });
                      } else [navi(-1)];
                    }}
                  >
                    CANCEL
                  </Button>
                </div>
              </div>
            </div>
          }
          className="!flex-1 flex !flex-col !p-4 min-h-[600px]"
          title={"EDIT"}
        >
          <div className=" flex flex-1 m-[-18px]">
            <div className="w-[350px] px-4 py-2 border-r-2 border-[#0A0A0A]  flex flex-col">
              <div className="p-4 space-y-4">
                <Paper square elevation={2} class="relative w-full h-[280px]">
                  <img
                    className="w-full h-full object-cover object-center "
                    src={
                      foto()?.label
                        ? foto()?.type === "file"
                          ? foto().label
                          : foto().label
                        : avatar
                    }
                  />
                  <div
                    className="absolute p-2 top-0 right-0"
                    title="Upload Your Picture"
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{
                        borderRadius: 0,
                      }}
                    >
                      <AddAPhoto></AddAPhoto>
                      <input
                        onChange={(d) => {
                          setupdateFoto(d.target.files);
                          group.controls.foto.setValue(d.target.files);
                        }}
                        className="opacity-0 w-full h-full absolute"
                        accept="image/*"
                        type="file"
                      ></input>
                    </Button>
                  </div>
                </Paper>
                <div className="space-y-2">
                  <div>
                    <Tags className={"!py-0"} label={"Original Name"} />
                    <div className="pl-[20px]">
                      <DefaultInput
                        placeholder={"FIELD ORIGINAL NAME"}
                        removebg
                        removeicon
                        control={group.controls.profile_name}
                      ></DefaultInput>
                    </div>
                  </div>
                  <div>
                    <Tags className={"!py-0"} label={"CASE NUMBER"} />
                    <div className="pl-[20px]">
                      <DefaultInput
                        placeholder={"FIELD CASE NUMBER"}
                        removebg
                        removeicon
                        control={group.controls.case_group}
                      ></DefaultInput>
                    </div>
                  </div>
                  <div>
                    <Tags className={"!py-0"} label={"REMARKS"} />
                    <div className="pl-[20px]">
                      <DefaultInput
                        placeholder={"FIELD REMARKS"}
                        removebg
                        removeicon
                        control={group.controls.remarks}
                      ></DefaultInput>
                    </div>{" "}
                  </div>
                  <div>
                    <Tags className={"!py-0"} label={"DATE CREATED"}></Tags>
                    <div className="pl-[20px]">{time()}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 px-4 py-2 flex flex-col">
              <Tags label={"MULTI SOURCE DATABASE INFORMATION"}></Tags>
              <CardFrame
                title={"16 INFORMATION"}
                className="flex flex-col flex-1 relative"
              >
                <div className="absolute top-0  h-full w-full left-0 px-4 overflow-auto py-4">
                  {checkData().map((b, k) => {
                    return (
                      <div
                        className={`bg-[#1e1e1e] p-2 ${
                          k === 0
                            ? " col-span-full"
                            : checkData()?.length < 2
                            ? "col-span-full"
                            : ""
                        }`}
                      >
                        <div className="border border-primarry-2 px-4 bg-primarry-1 sticky top-[5px] z-50 flex justify-between items-center">
                          <Tags
                            label={
                              <span>
                                DATA FROM <b>{b.label}</b>
                              </span>
                            }
                          ></Tags>
                          <div>{k + 1}</div>
                        </div>
                        {b.data.map((x) => {
                          return (
                            <div
                              className={`flex gap-4 relative border-b ${
                                mode() === "dark"
                                  ? "border-[#333]"
                                  : "border-[#aaa]"
                              }  py-2 `}
                            >
                              <div className="flex gap-4 items-start flex-1 relative">
                                <div
                                  className={`${
                                    mode() === "dark"
                                      ? "text-[#aaa]"
                                      : "text-[#444]"
                                  } sticky top-[10px] whitespace-nowrap w-[200px] z-10 px-4 pt-2`}
                                >
                                  {" "}
                                  {x.total_data === 1
                                    ? ""
                                    : `[${x.total_data}]`}{" "}
                                  {x.label}
                                </div>
                                <div className="flex-1">
                                  <div className="gap-2 flex flex-wrap px-4">
                                    {x.data.map((d) => {
                                      return (
                                        <div title={d.label}>
                                          <div className="pl-4 !m-0 border-[#454545] bg-[#2C2C2C] pr-2 py-1 flex gap-4 border-[0] max-w-sm">
                                            <div className="whitespace-nowrap max-w-xs relative">
                                              <div className="text-ellipsis overflow-hidden relative">
                                                {x.label !== "ID CARD PHOTO" ? (
                                                  <div className="gap-2 flex items-center">
                                                    {!d.field ? (
                                                      <>
                                                        <IconButton
                                                          color="info"
                                                          size="small"
                                                          onClick={() =>
                                                            onEdit(
                                                              d.id,
                                                              x.label
                                                            )
                                                          }
                                                        >
                                                          <Edit fontSize="small"></Edit>
                                                        </IconButton>
                                                        {d.label}
                                                      </>
                                                    ) : (
                                                      <div>
                                                        <Input
                                                          autoFocus
                                                          defaultValue={d.label}
                                                          sx={{
                                                            color: "white",
                                                          }}
                                                          onChange={(s) => {
                                                            setInputData(
                                                              (prev) => ({
                                                                ...prev,
                                                                [d.id]:
                                                                  s.target
                                                                    .value,
                                                              })
                                                            );
                                                          }}
                                                        ></Input>
                                                        <IconButton
                                                          size="small"
                                                          color="info"
                                                          onClick={() => {
                                                            onEdit(d.id);
                                                            let update =
                                                              inputData()[d.id];
                                                            if (update) {
                                                              onField(
                                                                d.id,
                                                                update
                                                              );
                                                            }
                                                          }}
                                                        >
                                                          <Save fontSize="small"></Save>
                                                        </IconButton>
                                                        <IconButton
                                                          size="small"
                                                          color="error"
                                                          onClick={() => {
                                                            onEdit(d.id);
                                                          }}
                                                        >
                                                          <Close fontSize="small"></Close>
                                                        </IconButton>
                                                      </div>
                                                    )}
                                                  </div>
                                                ) : (
                                                  <div>
                                                    <img
                                                      className="w-20"
                                                      src={d.label}
                                                    />
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div className="flex items-center justify-center h-full">
                                  <Button
                                    size="small"
                                    color="error"
                                    onClick={() => {
                                      removeId(x.id, b.id, x.label);
                                    }}
                                  >
                                    <Delete fontSize="small"></Delete>
                                  </Button>
                                </div>
                              </div>
                              <div className="w-full flex justify-between items-center absolute bottom-[-5px] left-0">
                                <div
                                  className={`h-2 w-2 ${
                                    mode() === "dark"
                                      ? "bg-[#222222]"
                                      : "bg-[#aaa]"
                                  } left-0`}
                                ></div>
                                <div
                                  className={`h-2 w-2 ${
                                    mode() === "dark"
                                      ? "bg-[#222222]"
                                      : "bg-[#aaa]"
                                  } right-0`}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </CardFrame>
            </div>
          </div>
        </CardBox>
      </form>
      <AlertDialog
        description={"Please ensure all required fields are filled out."}
        title="ALERT ERROR"
      />
    </ContainerPages>
  );
};

export default EditIndentification;
