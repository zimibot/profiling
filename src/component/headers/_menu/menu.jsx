import { createEffect } from "solid-js";
import { mode } from "../../../helper/_helper.theme";
import { Link, useNavigate } from "@solidjs/router";
import { api } from "../../../helper/_helper.api";
import { useAppState } from "../../../helper/_helper.context";

export default function MenuTabs() {
  const [appStore] = useAppState();

  const navi = useNavigate();

  // createEffect(() => {

  //     setInterval(() => {
  //         if (appStore().token) {
  //             api().get("/deck-explorer/refreshToken").then(d => {
  //                 localStorage.setItem("token", d.data.token_user)
  //             })
  //         } else {
  //             navi("/")
  //         }
  //     }, 900 * 1000);

  // })

  return (
    <div className="text-sm font-medium text-center sm:flex sm:justify-end lg:justify-start">
      <ul className="flex">
        <li
          className={`${mode() === "dark" ? " bg-primarry-1" : "bg-gray-200"
            } flex items-center`}
        >
          <a
            href="#"
            className="inline-block px-8 py-5 my-[-8px] border-b-2 border-transparent rounded-t-lg text-gray-400 "
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="4" height="4" fill="#757575" />
              <rect y="8" width="4" height="4" fill="#757575" />
              <rect x="8" width="4" height="4" fill="#757575" />
              <rect x="8" y="8" width="4" height="4" fill="#757575" />
            </svg>
          </a>
        </li>
        <ul className="flex flex-1 whitespace-nowrap ">
          <li
            className={`${mode() === "dark" ? " bg-primarry-1" : "bg-gray-200"
              } flex items-center`}
          >
            <Link
              href="/deck-explorer"
              className="inline-block px-8 no-underline py-5 my-[-8px]  rounded-t-lg text-gray-400 hover:text-white "
            >
              DECK EXPLORER
            </Link>
          </li>
          <li
            className={`${mode() === "dark" ? " bg-primarry-1" : "bg-gray-200"
              } flex items-center`}
          >
            <Link
              href="/deck-explorer/direct-tracking"
              activeClass="border-b-2 border-gray-300 text-white"
              className="inline-block px-8 no-underline py-5 my-[-8px]  rounded-t-lg text-gray-400 hover:text-white "
            >
              DIRECT TRACKING
            </Link>
            <Link
              href="/deck-explorer/connection"
              activeClass="border-b-2 border-gray-300 text-white"
              className="inline-block px-8 no-underline py-5 my-[-8px]  rounded-t-lg text-gray-400 hover:text-white "
            >
              CONNECTION
            </Link>
            <Link
              href="/deck-explorer/face-finder"
              activeClass="border-b-2 border-gray-300 text-white"
              className="inline-block px-8 no-underline py-5 my-[-8px]  rounded-t-lg text-gray-400 hover:text-white "
            >
              FACE FINDER
            </Link>
          </li>
          <li
            className={`${mode() === "dark" ? " bg-primarry-1" : "bg-gray-200"
              } flex items-center`}
          >
            <Link
              href="/deck-explorer/system-settings"
              activeClass="border-b-2 border-gray-300 text-white"
              className="inline-block px-8 no-underline py-5 my-[-8px]  rounded-t-lg text-gray-400 hover:text-white "
            >
              SYSTEM SETTINGS
            </Link>
          </li>
        </ul>
      </ul>
    </div>
  );
}
