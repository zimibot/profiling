import { LayoutMarkedProfile } from "../";
import { CardFrame } from "../../../../component/cardFrame";
import { Button, Chip } from "@suid/material";
import { AddAPhoto, Delete, Edit, Tag, Visibility } from "@suid/icons-material";
import notFoundImage from "../../../../assets/images/image-not-found.jpg";
import { defaultPathRedirect } from "../../../../helper/_helper.default.path";
import { Link } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";
import { api } from "../../../../helper/_helper.api";
import { Loading } from "../../../../component/loading";
import { Tags } from "../../../../component/tags";

const Picture = () => {
  let { currentHref } = defaultPathRedirect;

  const url = currentHref();
  const parts = url.split("/"); // Split URL based on '/'
  const id = parts[parts.length - 2]; // Assuming the ID is the last part

  const [status, setStatus] = createSignal(null); // Initial state is null to indicate no error
  const [items, setItems] = createSignal([]);
  const [isLoading, setIsLoading] = createSignal(true); // Start with loading state

  createEffect(() => {
    setIsLoading(true); // Ensure loading state is true when starting to fetch

    api()
      .get(`/deck-explorer/storage?keyword=${id}&type=picture`)
      .then((response) => {
        console.log(response.data.data.items);
        setTimeout(() => {
          setItems(response.data.data.items);
          setStatus(null); // Reset status to indicate no error
        }, 200);
      })
      .catch((error) => {
        setStatus(error.response?.data?.message || "An error occurred"); // Set error message
      })
      .finally(() => {
        console.log("kan");
        setIsLoading(false); // Ensure loading state is false after fetch completes
      });
  });

  createEffect(() => {
    console.log(items());
  });

  // itemData function...

  return (
    <LayoutMarkedProfile title={"PICTURE"}>
      <div className="flex flex-col w-full gap-4">
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
          title={"PICTURE"}
          className="relative flex flex-1 flex-col group-item"
        >
          <div className="absolute w-full h-full overflow-auto top-0 left-0 flex-1 p-4 grid grid-cols-4">
            {isLoading() ? (
              <Loading></Loading>
            ) : items().length > 0 ? (
              items().map((item, index) => (
                <div key={index} className="relative">
                  {itemData({ item })}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center absolute w-full h-full">
                {status()}
              </div>
            )}
          </div>
        </CardFrame>
      </div>
    </LayoutMarkedProfile>
  );
};

const itemData = ({ item }) => {
  let { currentHref } = defaultPathRedirect;

  console.log(item);

  return (
    <div className="overflow-hidden p-1 relative">
      <div className="rounded" style={{ height: `400px` }}>
        <img
          className="h-full w-full object-cover"
          onError={(d) => (d.target.src = notFoundImage)}
          src={item.files.url}
        ></img>
      </div>

      <div className="absolute w-full h-full flex justify-between flex-col  top-0 left-0 p-2 space-y-2">
        <div className="bg-primarry-1 bg-opacity-60 backdrop-blur w-full p-2 font-bold uppercase text-center">
          {item.title}
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
            <Link href={`${currentHref()}/views/${item._id}`}>
              <Button
                color="secondary"
                fullWidth
                variant="contained"
                startIcon={<Visibility></Visibility>}
              >
                VIEWS
              </Button>
            </Link>
            <Link href={`${currentHref()}/edit/${item._id}`}>
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

// Remember to define your itemData function as needed

export default Picture;
