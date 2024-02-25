import { Add, Upload } from "@suid/icons-material";
import { LayoutMarkedProfile } from "../..";
import { Button } from "@suid/material";
import { Tags } from "../../../../../component/tags";
import { CardFrame } from "../../../../../component/cardFrame";
import { useNavigate } from "@solidjs/router";
import { DefaultInput } from "../../../../../component/form/input";
import { createFormControl, createFormGroup } from "solid-forms";
import { MultiTags } from "../../../../../component/multiTags";
import { createSignal } from "solid-js";
import Swal from "sweetalert2";
import { api } from "../../../../../helper/_helper.api";

function base64ToBlob(base64, type = "application/octet-stream") {
  // Check for and remove Data URL prefix if present
  const base64Data = base64.split(",")[1] || base64;

  try {
    const binStr = atob(base64Data);
    const len = binStr.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }
    return new Blob([arr], { type: type });
  } catch (e) {
    console.error("Error decoding base64 string: ", e);
    return null;
  }
}

const AddPDF = () => {
  const [preview, setPreview] = createSignal();
  const url = window.location.hash;
  const parts = url.split("/"); // Memisahkan URL berdasarkan '/'
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

    // Tambahkan data ke dalam formData
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("file", data.files); // Asumsi mengambil file pertama
    formData.append("tags", data.tags);
    formData.append("type", "document");

    // Menampilkan Swal loading
    let timerInterval;
    Swal.fire({
      title: "Uploading...",
      html: "Please wait while the file is being uploaded.<br><b></b>", // Tempat untuk timer
      allowOutsideClick: false,
      timerProgressBar: true,
      onBeforeOpen: () => {
        Swal.showLoading();
        const content = Swal.getContent();
        const b = content.querySelector("b"); // Selector untuk elemen timer
        if (b) {
          // Waktu mulai
          const startTime = Date.now();
          // Update timer setiap detik
          timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime; // Hitung waktu yang telah berlalu
            const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000); // Konversi ke detik
            b.textContent = `${seconds} seconds`; // Tampilkan waktu yang telah berlalu dalam detik
          }, 1000);
        }
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });

    try {
      // Menggunakan await untuk menunggu response dari API
      const response = await api().post(
        `/deck-explorer/storage?keyword=${id_last}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Penting untuk upload file
          },
        }
      );

      // Menutup Swal loading
      Swal.close();

      // Jika API berhasil
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data has been successfully added.",
        didClose: () => {
          redirect(modifiedUrl);
        },
      });

      console.log("Response:", response); // Opsi: Tampilkan response di console
    } catch (error) {
      // Menutup Swal loading jika terjadi error
      Swal.close();

      // Mengakses pesan error dari response API, jika tersedia
      let errorMessage = "There was an error."; // Pesan default jika detail error tidak tersedia
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Jika API gagal
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: errorMessage,
      });
    }
  };

  const onFiles = (e) => {
    const files = e.target.files;

    if (files.length === 0) {
      // Tidak ada file yang dipilih
      Swal.fire({
        icon: "warning",
        title: "No files selected",
        text: "Please select a file to upload.",
      });
    } else {
      const file = files[0]; // Mengasumsikan hanya satu file yang diproses

      // Memeriksa tipe file (hanya menerima file PDF)
      if (file.type !== "application/pdf") {
        // File bukan PDF
        Swal.fire({
          icon: "error",
          title: "Invalid File Type",
          text: "Only PDF files are allowed.",
        });
        return; // Keluar dari fungsi jika file bukan PDF
      }

      if (file.size > 5 * 1024 * 1024) {
        // Batas ukuran file 5MB
        Swal.fire({
          icon: "error",
          title: "File Too Large",
          text: "File size cannot exceed 5MB.",
        });
        return; // Keluar dari fungsi jika ukuran file terlalu besar
      }

      var reader = new FileReader();

      reader.onload = function (e) {
        var base64PDF = e.target.result;
        // Di sini Anda dapat menangani data PDF, seperti menampilkan pratinjau, jika berlaku
        let blob = base64ToBlob(base64PDF, "application/pdf");
        const url = URL.createObjectURL(blob);
        console.log(blob);
        setPreview(url); // Hilangkan komentar atau modifikasi baris ini sesuai kebutuhan Anda
        // Atau kirim ke server, dll.
      };

      // Membaca file sebagai Data URL, mengeksekusi callback onload saat selesai
      reader.readAsDataURL(file);

      // Mengasumsikan 'group.controls.files.setValue(file);' adalah bagian dari sistem kontrol formulir
      // Anda mungkin perlu menyesuaikan baris ini sesuai dengan manajemen state formulir proyek Anda
      group.controls.files.setValue(file); // Pastikan ini berlaku dalam konteks Anda atau sesuaikan sesuai kebutuhan
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
        <CardFrame className="relative flex-1" title={"Add Document"}>
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-7 absolute w-full h-full overflow-auto top-0 left-0"
          >
            <div className="col-span-5 relative border-r-2 border-[#333]">
              <div className="h-full absolute w-full overflow-hidden flex items-center justify-center p-4 group">
                <div className="absolute w-full h-full overflow-hidden p-4">
                  {preview() && (
                    <object className="w-full h-full" data={preview()}></object>
                  )}
                </div>

                <div className="p-5 absolute bottom-0 left-0 w-full  justify-between flex items-center">
                  <div className="shadow-md bg-primarry-1">
                    {/* <MultiTags
                      onChange={(d) => {
                        console.log(d);
                      }}
                    ></MultiTags> */}
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
                        className="absolute w-full h-full opacity-0"
                        type="file"
                        accept="application/pdf"
                      ></input>
                      UPLOAD DOCUMENT
                    </Button>
                  </div>
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
                  <Tags label={"Description"}></Tags>
                  <textarea
                    onChange={(e) => {
                      group.controls.description.setValue(e.target.value);
                    }}
                    className="bg-primarry-2 p-2 w-full outline-none min-h-[200px] text-[20px]"
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

export default AddPDF;
