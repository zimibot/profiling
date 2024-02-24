import { Download, Edit, PictureInPicture, Tag } from "@suid/icons-material";
import { LayoutMarkedProfile } from "../..";
import { Button, Chip, Typography } from "@suid/material";
import { Tags } from "../../../../../component/tags";
import { CardFrame } from "../../../../../component/cardFrame";
import { useNavigate } from "@solidjs/router";
import { defaultPathRedirect } from "../../../../../helper/_helper.default.path";
import gambar from "../../../../../assets/images/dpo.jpeg";
import { mode } from "../../../../../helper/_helper.theme";
import { createEffect, createSignal } from "solid-js";
import { api } from "../../../../../helper/_helper.api";

const ViewsPicture = () => {
  const redirect = useNavigate();
  let { currentHref } = defaultPathRedirect;
  const id = currentHref().split("/").pop();
  const [items, setItems] = createSignal();

  let target;
  const pip = (title, url, type) => {
    localStorage.setItem(
      "data",
      JSON.stringify({
        src: url,
        type: type,
        title,
      })
    );

    window.api.invoke("pip");
  };

  createEffect(() => {
    api()
      .get(`/deck-explorer/storage?id=${id}`)
      .then((a) => {
        console.log(a);
        setItems(a.data.items);
      });
  });

  return (
    <LayoutMarkedProfile title={"VIEWS"}>
      <div className="flex-1 flex flex-col min-h-[600px] space-y-3">
        <div className="flex justify-between w-full">
          <Tags label={"ADDITIONAL INFORMATION"}></Tags>
          <Button onClick={() => redirect(-1)} variant="outlined" color="error">
            CANCEL
          </Button>
        </div>
        <CardFrame className="relative flex-1" title={"VIEWS PICTURE"}>
          <form className="grid grid-cols-7 absolute w-full h-full overflow-auto top-0 left-0">
            <div className="col-span-5 relative border-r-2">
              <div className="h-full absolute  w-full overflow-hidden flex items-center justify-center p-4">
                <div className="absolute w-full h-full overflow-hidden p-4 group">
                  <img
                    className="w-full h-full object-contain"
                    ref={target}
                    src={items()?.files?.url}
                  ></img>
                  <div className="absolute w-full top-0 left-0 flex flex-col group-hover:hidden">
                    <div className="p-4 bg-black bg-opacity-70 backdrop-blur">
                      <Typography
                        color={mode() === "dark" ? "" : "white"}
                        variant="h4"
                      >
                        {items()?.title}
                      </Typography>
                    </div>
                    <div className="p-4">
                      <div className="space-x-2">
                        <Chip
                          label="MICHAEL DANTON"
                          color="secondary"
                          icon={<Tag fontSize="11px"></Tag>}
                          size="small"
                          sx={{
                            borderRadius: 0,
                          }}
                        ></Chip>
                        <Chip
                          label="HIDAYAT"
                          color="secondary"
                          icon={<Tag fontSize="11px"></Tag>}
                          size="small"
                          sx={{
                            borderRadius: 0,
                          }}
                        ></Chip>
                        <Chip
                          label="HIDAYAT"
                          color="secondary"
                          icon={<Tag fontSize="11px"></Tag>}
                          size="small"
                          sx={{
                            borderRadius: 0,
                          }}
                        ></Chip>
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-0 bottom-0 p-4 flex gap-4">
                    <Button
                      href={gambar}
                      download="gambar_dpo"
                      variant="contained"
                      color="secondary"
                      startIcon={<Download></Download>}
                    >
                      DOWNLOAD PICTURE
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<PictureInPicture></PictureInPicture>}
                      onClick={() =>
                        pip(" FOTO KASUS NARKOBA", gambar, "image")
                      }
                    >
                      PICTURE IN PICTURE
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2 p-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3 flex flex-col flex-1">
                <div className="grid ">
                  <Button
                    href={`#${currentHref().replace("views", "edit")}`}
                    variant="contained"
                    color="secondary"
                    fullWidth
                    startIcon={<Edit></Edit>}
                  >
                    EDIT
                  </Button>
                </div>
                <div className="flex-1 flex flex-col pb-4">
                  <Tags label={"Description"}></Tags>
                  <div className="relative flex-1">
                    <div className="absolute w-full h-full left-0 top-0 overflow-auto">
                      <Typography
                        whiteSpace="break-spaces"
                        sx={{
                          color: mode() === "dark" ? "white" : "#444",
                        }}
                      >
                        {items()?.description}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardFrame>
      </div>
    </LayoutMarkedProfile>
  );
};

export default ViewsPicture;
