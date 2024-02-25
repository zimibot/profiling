import {
  Add,
  ArrowLeft,
  FileUpload,
  Image,
  Save,
  Upload,
} from "@suid/icons-material";
import { LayoutMarkedProfile } from "../..";
import { Button, IconButton } from "@suid/material";
import { Tags } from "../../../../../component/tags";
import { CardFrame } from "../../../../../component/cardFrame";
import { useNavigate } from "@solidjs/router";
import { DefaultInput } from "../../../../../component/form/input";
import { createFormControl, createFormGroup } from "solid-forms";
import { MultiTags } from "../../../../../component/multiTags";
import exampleVideo from "../../../../../assets/video/mov_bbb.mp4";
import { mode } from "../../../../../helper/_helper.theme";
import { createSignal } from "solid-js";
import Swal from "sweetalert2";

const AddVideos = () => {
  const [preview, setPreview] = createSignal();
  const url = window.location.hash;
  const parts = url.split("/"); // Memisahkan URL berdasarkan '/'
  const id_last = parts[3]; // Mengambil bagian yang berisi 'B23dsnd'
  const desiredParts = parts.length > 2 ? parts.slice(0, 5) : parts;

  // Menggabungkan kembali bagian yang diinginkan menjadi string dengan menyisipkan '/'
  const modifiedUrl = desiredParts.join("/").replace("#", "");

  console.log(modifiedUrl);
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
    formData.append("type", "video");

    // Jika ada data tambahan yang perlu dikirim, tambahkan ke formData
    // Contoh: formData.append('key', 'value');

    try {
      // Menggunakan await untuk menunggu response dari API
      // Pastikan untuk mengirimkan 'formData' sebagai data
      const response = await api().post(
        `/deck-explorer/storage?keyword=${id_last}`,
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
        text: "data has been successfully add.",
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

    if (files.length === 0) {
      // No file was selected
      Swal.fire({
        icon: "warning",
        title: "No files selected",
        text: "Please select a file to upload.",
      });
    } else {
      const file = files[0]; // Assuming only one file is processed

      // Check the file type (accepting only video files)
      if (!file.type.startsWith("video/")) {
        // File is not a video
        Swal.fire({
          icon: "error",
          title: "Invalid File Type",
          text: "Only video files are allowed.",
        });
        return; // Exit the function if the file is not a video
      }

      if (file.size > 100 * 1024 * 1024) {
        // 100MB limit
        // File size exceeds 100MB
        Swal.fire({
          icon: "error",
          title: "File Too Large",
          text: "File size cannot exceed 100MB.",
        });
        return; // Exit the function if the file is too large
      }

      var reader = new FileReader();

      reader.onload = function (e) {
        var base64Video = e.target.result;
        // Here you can set the preview of the video or do other actions with the base64Video
        setPreview(base64Video); // Assuming setPreview is defined elsewhere
        // Or send it to the server, etc.
      };

      // Read the file as a Data URL, executing the onload callback when done
      reader.readAsDataURL(file);

      // Assuming 'group.controls.files.setValue(file);' is part of a form control system like Angular's Reactive Forms
      // You might need to adapt this line according to your project's state management for forms
      group.controls.files.setValue(file); // Ensure this is applicable in your context or adjust accordingly
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
        <CardFrame className="relative flex-1" title={"Add Videos"}>
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-7 absolute w-full h-full overflow-auto top-0 left-0"
          >
            <div className="col-span-5 relative border-r-2 border-[#333]">
              <div className="h-full absolute  w-full overflow-hidden flex items-center justify-center p-4">
                <div className="absolute w-full h-full overflow-hidden p-4 flex items-center justify-center">
                  {preview() ? (
                    <video className="w-full h-full " controls>
                      <source src={preview()} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div>Please upload a video first.</div>
                  )}
                </div>
                <div className="absolute top-0 left-0 w-full p-5">
                  <div
                    className={`shadow-md ${
                      mode() === "dark" ? "bg-primarry-1" : "bg-slate-100"
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
              <div className="space-y-2">
                <div className="grid">
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Add></Add>}
                  >
                    ADD
                  </Button>
                </div>
                <div>
                  <Tags label={"TITLE "}></Tags>
                  <DefaultInput
                    placeholder={"INPUT VIDEO NAME "}
                    removeicon
                    control={group.controls.title}
                  />
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    class="relative"
                    startIcon={<Upload></Upload>}
                  >
                    <input
                      onChange={onFiles}
                      type="file"
                      accept="video/*"
                      className="absolute left-0 cursor-pointer opacity-0"
                    />
                    UPLOAD YOUR VIDEO
                  </Button>
                </div>
                <div>
                  <Tags label={"About"}></Tags>
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

export default AddVideos;
