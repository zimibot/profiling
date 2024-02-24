import { Add, ArrowLeft, Delete, FileUpload, Save } from "@suid/icons-material";
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
import { createEffect, createSignal } from "solid-js";
import { defaultPathRedirect } from "../../../../../helper/_helper.default.path";

const EditPicture = () => {
  const [preview, setPreview] = createSignal();
  const [items, setitems] = createSignal();
  let { currentHref } = defaultPathRedirect;

  const url = currentHref();
  const parts = url.split("/"); // Memisahkan URL berdasarkan '/'
  const idPost = parts.pop();
  const id_last = parts[3]; // Mengambil bagian yang berisi 'B23dsnd'
  const desiredParts = parts.length > 2 ? parts.slice(0, 5) : parts;

  // Menggabungkan kembali bagian yang diinginkan menjadi string dengan menyisipkan '/'
  const modifiedUrl = desiredParts.join("/").replace("#", "");

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
    formData.append("type", "picture");

    // Jika ada data tambahan yang perlu dikirim, tambahkan ke formData
    // Contoh: formData.append('key', 'value');

    try {
      // Menggunakan await untuk menunggu response dari API
      // Pastikan untuk mengirimkan 'formData' sebagai data
      const response = await api().put(
        `/deck-explorer/storage?id=${idPost}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Penting untuk upload file
          },
        }
      );

      // Jika API berhasil
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "data has been successfully update.",
        didClose: () => {
          redirect(modifiedUrl);
        },
      });

      console.log("Response:", response); // Opsi: Tampilkan response di console
    } catch (error) {
      // Jika API gagal
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "There was an error.",
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

      var reader = new FileReader();

      reader.onload = function (e) {
        var base64Image = e.target.result;
        setPreview(base64Image);
        // Atau mengirimnya ke server, dll.
      };

      // Membaca file sebagai Data URL, menjalankan callback onload setelah selesai
      reader.readAsDataURL(file);

      group.controls.files.setValue(file);
    }
  };

  createEffect(() => {
    console.log(idPost);
    api()
      .get(`/deck-explorer/storage?id=${idPost}`)
      .then((a) => {
        const items = a.data.items;
        console.log(items);

        group.controls.title.setValue(items.title);
        group.controls.description.setValue(items.description);
        setPreview(items.files.url);
      });
  });
  return (
    <LayoutMarkedProfile title={"EDIT"}>
      <div className="flex-1 flex flex-col min-h-[600px] space-y-3">
        <div className="flex justify-between w-full">
          <Tags label={"ADDITIONAL INFORMATION"}></Tags>
          <Button onClick={() => redirect(-1)} variant="outlined" color="error">
            CANCEL
          </Button>
        </div>
        <CardFrame className="relative flex-1" title={"Edit PICTURE"}>
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-7 absolute w-full h-full overflow-auto top-0 left-0"
          >
            <div className="col-span-5 relative border-r-2">
              <div className="h-full absolute  w-full overflow-hidden flex items-center justify-center p-4">
                <div className="absolute w-full h-full overflow-hidden p-4">
                  <img
                    className="w-full h-full object-contain"
                    src={preview()}
                  ></img>
                </div>
                <div className="flex flex-col items-center border p-4 cursor-pointer relative bg-primarry-1 bg-opacity-60 backdrop-blur">
                  <FileUpload sx={{ fontSize: 50 }}></FileUpload>
                  <span>CHANGE YOUR PICTURE</span>
                  <input
                    accept="image/*"
                    type="file"
                    onChange={onFiles}
                    className="opacity-0 w-full absolute top-0 left-0 h-full cursor-pointer"
                  />
                </div>
                <div className="absolute top-0 left-0 p-4 w-full">
                  <div
                    className={`shadow-md w-full flex flex-col ${
                      mode() === "dark" ? "bg-primarry-1" : "bg-slate-200"
                    }`}
                  >
                    <MultiTags
                      onChange={(d) => {
                        console.log(d);
                      }}
                    ></MultiTags>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2 p-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    type="submit"
                    startIcon={<Save></Save>}
                  >
                    SAVE
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    startIcon={<Delete></Delete>}
                  >
                    DELETE
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
                  <Tags label={"Description"}></Tags>
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

export default EditPicture;
