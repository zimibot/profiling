import { Add, ArrowLeft, FileUpload, Save } from "@suid/icons-material";
import { LayoutMarkedProfile } from "../..";
import { Button } from "@suid/material";
import { Tags } from "../../../../../component/tags";
import { CardFrame } from "../../../../../component/cardFrame";
import { useNavigate } from "@solidjs/router";
import { DefaultInput } from "../../../../../component/form/input";
import { createFormControl, createFormGroup } from "solid-forms";
import { MultiTags } from "../../../../../component/multiTags";
import { mode } from "../../../../../helper/_helper.theme";
import Swal from "sweetalert2";
import { api } from "../../../../../helper/_helper.api";

const AddPicture = () => {
  const redirect = useNavigate();
  const group = createFormGroup({
    title: createFormControl("", {
      required: true,
    }),
    description: createFormControl("", {
      required: true,
    }),
    tags: createFormControl([]),
    files: createFormControl(),
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    // Membuat instance dari FormData
    let formData = new FormData();
    const data = group.value;

    // Misalnya 'group' adalah input untuk file, tambahkan file ke dalam formData
    // Asumsi 'group' adalah referensi ke input file dan hanya memproses file pertama
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("file", data.files);
    formData.append("tags", data.tags);

    // Jika ada data tambahan yang perlu dikirim, tambahkan ke formData
    // Contoh: formData.append('key', 'value');

    try {
      // Menggunakan await untuk menunggu response dari API
      // Pastikan untuk mengirimkan 'formData' sebagai data
      const response = await api().post("/deck-explorer/storage", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Penting untuk upload file
        },
      });

      // Jika API berhasil
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "File has been successfully uploaded.",
      });

      console.log("Response:", response); // Opsi: Tampilkan response di console
    } catch (error) {
      // Jika API gagal
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "There was an error uploading your file.",
      });

      console.error("Error:", error); // Opsi: Tampilkan error di console
    }
  };

  const onFiles = (e) => {
    const files = e.target.files;

    // Cek tipe file (hanya menerima gambar)

    if (files.length === 0) {
      // Tidak ada file yang diupload
      Swal.fire({
        icon: "warning",
        title: "No files selected",
        text: "Please select a file to upload.",
      });
    } else {
      const file = files[0]; // Mengasumsikan hanya memproses satu file

      // Cek ukuran file
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon: "error",
          title: "Invalid File Type",
          text: "Only image files are allowed.",
        });
        return; // Keluar dari fungsi jika file bukan gambar
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        Swal.fire({
          icon: "error",
          title: "File Too Large",
          text: "File size cannot exceed 5MB.",
        });
        return; // Keluar dari fungsi jika file terlalu besar
      }

      group.controls.files.setValue(file);
    }
  };

  return (
    <LayoutMarkedProfile title={"ADD"}>
      <div className="flex-1 flex flex-col min-h-[600px] space-y-3">
        <div className="flex justify-between w-full">
          <Tags label={"ADDITIONAL INFORMATION"}></Tags>
          <Button onClick={() => redirect(-1)} variant="outlined" color="error">
            CANCEL
          </Button>
        </div>
        <CardFrame className="relative flex-1" title={"ADD PICTURE"}>
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-7 absolute w-full h-full overflow-auto top-0 left-0"
          >
            <div className="col-span-5 relative border-r-2 border-primarry-2 ">
              <div className="h-full absolute  w-full overflow-hidden flex items-center justify-center p-4">
                <div className="flex flex-col items-center border p-4 border-[#333] cursor-pointer relative">
                  <FileUpload sx={{ fontSize: 50 }}></FileUpload>
                  <span>UPLOAD YOUR PICTURE</span>
                  <input
                    onChange={onFiles}
                    type="file"
                    accept="image/*"
                    className="opacity-0 w-full absolute top-0 left-0 h-full cursor-pointer"
                  />
                </div>
                <div className="absolute top-0 left-0 p-4">
                  <MultiTags
                    onChange={(d) => {
                      console.log(d);
                    }}
                  ></MultiTags>
                </div>
              </div>
            </div>
            <div className="col-span-2 p-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    fullWidth
                    startIcon={<Add></Add>}
                  >
                    ADD
                  </Button>
                </div>
                <div>
                  <Tags label={"TITLE "}></Tags>
                  <DefaultInput
                    placeholder={"INPUT PICTURE NAME "}
                    removeicon
                    control={group.controls.title}
                  />
                </div>
                <div>
                  <Tags label={"ABOUT PICTURE"}></Tags>
                  <textarea
                    onChange={(e) => {
                      group.controls.description.setValue(e.target.value);
                    }}
                    value={group.controls.description.value}
                    className={`p-2 w-full outline-none min-h-[200px] text-[20px] ${
                      mode() === "dark"
                        ? "bg-primarry-2 "
                        : " bg-gray-200 text-[#444]"
                    }`}
                    spellCheck={false}
                    placeholder="INPUT DESCRIPTION"
                  />
                </div>
              </div>
            </div>
          </form>
        </CardFrame>
      </div>
    </LayoutMarkedProfile>
  );
};

export default AddPicture;
