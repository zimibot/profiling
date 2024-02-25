import { LayoutMarkedProfile } from "../";
import { CardFrame } from "../../../../component/cardFrame";
import { Button, Chip } from "@suid/material";
import {
  Delete,
  Edit,
  FileOpen,
  Tag,
  VideoFile,
  Visibility,
} from "@suid/icons-material";
import notFoundImage from "../../../../assets/images/image-not-found.jpg";
import { defaultPathRedirect } from "../../../../helper/_helper.default.path";
import { Link } from "@solidjs/router";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { api } from "../../../../helper/_helper.api";
import { Loading } from "../../../../component/loading";
import { Tags } from "../../../../component/tags";
import Swal from "sweetalert2";

const Documents = () => {
  let { currentHref } = defaultPathRedirect;

  const url = currentHref();
  const parts = url.split("/"); // Split URL based on '/'
  const id = parts[parts.length - 2]; // Assuming the ID is the last part

  const [status, setStatus] = createSignal(null); // Initial state is null to indicate no error
  const [items, setItems] = createSignal([]);
  const [isLoading, setIsLoading] = createSignal(true); // Start with loading state
  const [isLoadItems, setisLoadItems] = createSignal(true); // Start with loading state

  createEffect(() => {
    setIsLoading(true); // Ensure loading state is true when starting to fetch

    api()
      .get(`/deck-explorer/storage?keyword=${id}&type=document`)
      .then((response) => {
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

    isLoadItems();
    onCleanup(() => {
      setItems([]);
      setIsLoading(false);
      setStatus(null);
    });
  });

  return (
    <LayoutMarkedProfile title={"VIDEO"}>
      <div className="flex flex-col w-full gap-4">
        <div className="flex justify-between w-full">
          <Tags label={"ADDITIONAL INFORMATION"}></Tags>
          <Link href={`${currentHref()}/add`}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<FileOpen></FileOpen>}
            >
              ADD YOUR DOCUMENT
            </Button>
          </Link>
        </div>
        <CardFrame
          title={"VIDEO"}
          className="relative flex flex-1 flex-col group-item"
        >
          <div className="absolute w-full h-full overflow-auto top-0 left-0 flex-1 p-4 grid grid-cols-4">
            {isLoading() ? (
              <Loading></Loading>
            ) : items().length > 0 ? (
              items().map((item, index) => (
                <div key={index} className="relative">
                  {itemData({ item, setisLoadItems })}
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

const itemData = ({ item, setisLoadItems }) => {
  let { currentHref } = defaultPathRedirect;

  const onDelete = (id, name) => {
    // Warning message asking for confirmation before deletion
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deletion if confirmed

        api()
          .delete(`/deck-explorer/storage?id=${id}`)
          .then(() => {
            // Success message
            Swal.fire({
              title: "Deleted!",
              text: `Your ${name} has been deleted.`,
              icon: "success",
            });
          })
          .catch((error) => {
            // Error handling
            Swal.fire(
              "Error!",
              "Something went wrong: " + error.message,
              "error"
            );
          })
          .finally(() => {
            setisLoadItems((a) => !a);
          });
      }
    });
  };

  return (
    <div className="overflow-hidden p-1 relative">
      <div className="rounded" style={{ height: `400px` }}>
        <img
          className="h-full w-full object-cover"
          onError={(d) => (d.target.src = notFoundImage)}
          src={item.files.thumbnail}
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
              onClick={() => {
                onDelete(item._id, item.title);
              }}
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

export default Documents;
