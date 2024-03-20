import { Navigate, useLocation } from "@solidjs/router";
import BreadcrumbsPages from "../component/breadcrumbs";
import { useAppState } from "../helper/_helper.context";
import { createEffect } from "solid-js";

const ContainerPages = (props) => {
  const [appStore, { update }] = useAppState();

  let location = useLocation();


  createEffect(() => {
    if (location.pathname.split("/")[3] !== "database-information") {
      update((d) => ({ ...d, dataSearch: [], terkait: null }));
    }
  });

  if (!appStore().token) {
    return <Navigate href={"/"}></Navigate>;
  }

  return (
    <div className="p-4 flex flex-1 flex-col">
      <BreadcrumbsPages></BreadcrumbsPages>
      {props.children}
      {/* <div className="flex fixed w-full h-full z-30 top-0  justify-center items-center left-0 backdrop-blur">
            <div className="flex items-center gap-2 bg-primarry-1 p-2">
                Loading Data... <CircularProgress size={21}></CircularProgress>
            </div>
        </div> */}
    </div>
  );
};

export default ContainerPages;
