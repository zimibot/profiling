import { LayoutMarkedProfile } from "../";
import { Tags } from "../../../../component/tags";
import { Mason, createMasonryBreakpoints } from "solid-mason";
import { CardFrame } from "../../../../component/cardFrame";
import { Button, Chip } from "@suid/material";
import { AddAPhoto, Delete, Edit, Tag, Visibility } from "@suid/icons-material";
import notFoundImage from "../../../../assets/images/image-not-found.jpg";
import { defaultPathRedirect } from "../../../../helper/_helper.default.path";
import { Link } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";
import { api } from "../../../../helper/_helper.api";

const Picture = () => {
  let { currentHref } = defaultPathRedirect;

  const url = window.location.hash;
  const parts = url.split("/"); // Memisahkan URL berdasarkan '/'
  const desiredParts = parts.length > 2 ? parts.slice(0, 4) : parts;
  const modifiedUrl = desiredParts.join("/").replace("#", "");
  const [isloading, setisloading] = createSignal(false);
  const [items, setitems] = createSignal(false);

  const id = modifiedUrl.split("/").pop();
  const breakpoints = createMasonryBreakpoints(() => [
    { query: "(min-width: 1660px)", columns: 4 },
    { query: "(min-width: 1280px) and (max-width: 1660px)", columns: 3 },
    { query: "(min-width: 1024px) and (max-width: 1280px)", columns: 3 },
    { query: "(min-width: 768px) and (max-width: 1024px)", columns: 2 },
    { query: "(max-width: 768px)", columns: 2 },
  ]);

  const someArray = new Array(8).fill({});
  let refsData;

  someArray.unshift({
    type: "add",
  });

  createEffect(() => {
    setisloading(false);
    api()
      .get(`/deck-explorer/storage?keyword=${id}&type=picture`)
      .then((a) => {
        console.log(a.data);
        setitems(a.data);
        setisloading(true);
      });
  });

  const itemData = ({ index, item }) => {
    console.log(item);
    return (
      <div className="overflow-hidden p-1 relative">
        <div className="rounded" style={{ height: `400px` }}>
          <img
            className="h-full w-full object-cover"
            onError={(d) => (d.target.src = notFoundImage)}
            src={`/assets/barang_bukti/image/${index()}.jpeg`}
          ></img>
        </div>

        <div className="absolute w-full h-full flex justify-between flex-col  top-0 left-0 p-2 space-y-2">
          <div className="bg-primarry-1 bg-opacity-60 backdrop-blur w-full p-2 font-bold uppercase text-center">
            Foto Kasus Narkoba
          </div>
          <div className="space-y-2 bg-primarry-2 p-2 bg-opacity-50 backdrop-blur">
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
                label="+3"
                color="secondary"
                size="small"
                sx={{
                  borderRadius: 0,
                }}
              ></Chip>
            </div>
            <div className="grid gap-2 grid-cols-3">
              <Link href={`${currentHref()}/views`}>
                <Button
                  color="secondary"
                  fullWidth
                  variant="contained"
                  startIcon={<Visibility></Visibility>}
                >
                  VIEWS
                </Button>
              </Link>
              <Link href={`${currentHref()}/edit`}>
                <Button
                  color="secondary"
                  fullWidth
                  variant="contained"
                  startIcon={<Edit></Edit>}
                >
                  EDIT
                </Button>
              </Link>
              <Button
                color="secondary"
                variant="contained"
                startIcon={<Delete></Delete>}
              >
                DELETE
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <LayoutMarkedProfile title={"PICTURE"}>
      <div className="flex-1 flex flex-col min-h-[600px] space-y-3">
        <div className="flex justify-between w-full">
          <Tags label={"ADDITIONAL INFORMATION"}></Tags>
          <Link href={`${currentHref()}/add`}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddAPhoto></AddAPhoto>}
            >
              ADD YOUR PICTURE
            </Button>
          </Link>
        </div>
        <CardFrame
          isLoading={isloading}
          title={"PICTURE"}
          className="relative flex flex-1 flex-col group-item"
        >
          <div
            className="absolute w-full h-full overflow-auto top-0 left-0 flex-1 p-4"
            ref={refsData}
          >
            {isloading() && (
              <Mason
                as="div"
                items={items().data.items}
                columns={breakpoints()}
              >
                {(item, index) => {
                  return itemData({ index, item });
                }}
              </Mason>
            )}
          </div>
        </CardFrame>
      </div>
    </LayoutMarkedProfile>
  );
};

export default Picture;
