import { createEffect, lazy, Suspense } from "solid-js";
import { Router, useRoutes, hashIntegration, Outlet, useNavigate, Navigate, } from "@solidjs/router";
import { Loading } from "../component/loading";
import { Menu } from "../component/headers/_menu";

import jQuery from "jquery";
import ContainerPages from "../pages";
import MenuTracking from "../pages/Direct Tracking/menuTracking";

const redirect = ({  location }) => {
  return location.pathname + "/single-target"
}
export const route = [
  {
    path: "/",
    component: lazy(() => import("../login")),
  },

  {
    path: "/other",
    children: [
      {
        path: "/pip",
        component: lazy(() => import("../pages/other/Picture in picture")),
      },
    ],
  },
  {
    path: "/deck-explorer",
    component: () => {
      return (
        <>
          <Menu></Menu>
          <Outlet></Outlet>
        </>
      );
    },
    children: [
      {
        path: "*",
        component: lazy(() => import("../notfound")),
      },
      {
        path: "/",
        component: lazy(() => import("../pages/Deck Explorer")),
      },
      {
        path: "/system-settings",
        component: lazy(() => import("../pages/System Settings")),
      },
      {
        path: "/direct-tracking",
        children: [
          {
            path: "/",
            component: () => <Navigate href={redirect}></Navigate>,
          },
          {
            path: "geofencing",
            children: [
              {
                path: "/",
                component: lazy(() => import("../pages/Direct Tracking/geofencing")),
              },
              {
                path: "/add/:id",
                component: lazy(() => import("../pages/Direct Tracking/geofencing/add")),
              }
            ]
          },
          {
            path: "single-target",
            children: [
              {
                path: "/",
                component: lazy(() => import("../pages/Direct Tracking/singleTarget")),
              },
              {
                path: "/add/:id",
                component: lazy(() => import("../pages/Direct Tracking/geofencing/add")),
              }
            ]
          },
        ]
      },
      {
        path: "/face-finder",
        component: lazy(() => import("../pages/Face Finder")),
      },
      {
        path: "/connection",

        children: [
          {
            path: "/",
            component: lazy(() => import("../pages/SNA")),
          },
          {
            path: "add",
            component: lazy(() =>
              import("../pages/SNA/__/add")
            ),
          },
          {
            path: "edit/:id",
            component: lazy(() =>
              import("../pages/SNA/__/edit")
            ),
          },
        ]
      },
      {
        path: "/search-result",
        children: [
          {
            path: "/:id",
            component: lazy(() =>
              import("../pages/Deck Explorer/SearchResult")
            ),
          },
          {
            path: "/database-information/:id",
            children: [
              {
                path: "/",
                component: lazy(() =>
                  import("../pages/Deck Explorer/DatabaseInformation")
                ),
              },
              {
                path: "/create-new-profile",
                component: lazy(() =>
                  import("../pages/Deck Explorer/CreateNewprofile")
                ),
              },
            ],
          },
        ],
      },
      {
        path: "/marked-profile/:id",
        children: [
          {
            path: "/",
            component: lazy(() => import("../notfound")),
          },
          {
            path: "/alias-profile",
            children: [
              {
                path: "/",
                component: lazy(() =>
                  import(
                    "../pages/Deck Explorer/MarkedProfile/dinamisData/alias"
                  )
                ),
              },
              {
                path: "/edit",
                component: lazy(() =>
                  import(
                    "../pages/Deck Explorer/MarkedProfile/dinamisData/edit"
                  )
                ),
              },
            ],
          },
          {
            path: "/family-member",
            children: [
              {
                path: "/",
                component: lazy(() =>
                  import(
                    "../pages/Deck Explorer/MarkedProfile/dinamisData/family"
                  )
                ),
              },
              {
                path: "/edit",
                component: lazy(() =>
                  import(
                    "../pages/Deck Explorer/MarkedProfile/dinamisData/edit"
                  )
                ),
              },
            ],
          },
          {
            path: "/family-member-detail",
            children: [
              {
                path: "/",
                component: lazy(() =>
                  import(
                    "../pages/Deck Explorer/MarkedProfile/dinamisData/family_detail"
                  )
                ),
              },
              {
                path: "/edit",
                component: lazy(() =>
                  import(
                    "../pages/Deck Explorer/MarkedProfile/dinamisData/edit"
                  )
                ),
              },
            ],
          },
          {
            path: "/msisdn",
            children: [
              {
                path: "/",
                component: lazy(() =>
                  import(
                    "../pages/Deck Explorer/MarkedProfile/dinamisData/phone_list"
                  )
                ),
              },
              {
                path: "/edit",
                component: lazy(() =>
                  import(
                    "../pages/Deck Explorer/MarkedProfile/dinamisData/edit"
                  )
                ),
              },
            ],
          },
          {
            path: "/vehicle",
            children: [
              {
                path: "/",
                component: lazy(() =>
                  import(
                    "../pages/Deck Explorer/MarkedProfile/dinamisData/vehicle"
                  )
                ),
              },
              {
                path: "/edit",
                component: lazy(() =>
                  import(
                    "../pages/Deck Explorer/MarkedProfile/dinamisData/edit"
                  )
                ),
              },
            ],
          },
          {
            path: "/identification",
            children: [
              {
                path: "/",
                component: lazy(() =>
                  import("../pages/Deck Explorer/MarkedProfile/identification")
                ),
              },
              {
                path: "/edit",
                component: lazy(() =>
                  import(
                    "../pages/Deck Explorer/MarkedProfile/identification/edit"
                  )
                ),
              },
            ],
          },
          {
            path: "/map-tracking",
            children: [
              {
                path: "/",
                component: lazy(() =>
                  import("../pages/Deck Explorer/MarkedProfile/map-tracking")
                ),
              },
            ],
          },
          {
            path: "/additional-info",
            children: [
              {
                path: "/",
                component: lazy(() =>
                  import("../pages/Deck Explorer/MarkedProfile/additionalInfo")
                ),
              },
              // {
              //     path: "/edit",
              //     component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/additionalInfo/")),
              // },
            ],
          },
          {
            path: "/picture",
            children: [
              {
                path: "/",
                component: lazy(() =>
                  import("../pages/Deck Explorer/MarkedProfile/picture")
                ),
              },
              {
                path: "/views/:id",
                component: lazy(() =>
                  import(
                    "../pages/Deck Explorer/MarkedProfile/picture/__/views"
                  )
                ),
              },
              {
                path: "/edit/:id",
                component: lazy(() =>
                  import("../pages/Deck Explorer/MarkedProfile/picture/__/edit")
                ),
              },
              {
                path: "/add",
                component: lazy(() =>
                  import("../pages/Deck Explorer/MarkedProfile/picture/__/add")
                ),
              },
            ],
          },
          {
            path: "/videos",
            children: [
              {
                path: "/",
                component: lazy(() =>
                  import("../pages/Deck Explorer/MarkedProfile/videos")
                ),
              },
              {
                path: "/views/:id",
                component: lazy(() =>
                  import("../pages/Deck Explorer/MarkedProfile/videos/__/views")
                ),
              },
              {
                path: "/edit/:id",
                component: lazy(() =>
                  import("../pages/Deck Explorer/MarkedProfile/videos/__/edit")
                ),
              },
              {
                path: "/add",
                component: lazy(() =>
                  import("../pages/Deck Explorer/MarkedProfile/videos/__/add")
                ),
              },
            ],
          },
          {
            path: "/documents",
            children: [
              {
                path: "/",
                component: lazy(() =>
                  import("../pages/Deck Explorer/MarkedProfile/documents")
                ),
              },
              {
                path: "/views/:id",
                component: lazy(() =>
                  import(
                    "../pages/Deck Explorer/MarkedProfile/documents/__/views"
                  )
                ),
              },
              {
                path: "/edit/:id",
                component: lazy(() =>
                  import(
                    "../pages/Deck Explorer/MarkedProfile/documents/__/edit"
                  )
                ),
              },
              {
                path: "/add",
                component: lazy(() =>
                  import(
                    "../pages/Deck Explorer/MarkedProfile/documents/__/add"
                  )
                ),
              },
            ],
          },
        ],
      },
    ],
  },
];

const RoutersComponent = () => {
  createEffect(() => {
    window.$ = window.jQuery = jQuery;
  });

  const Routes = useRoutes(route);

  return (
    <Suspense fallback={<Loading />}>
      <Router source={hashIntegration()}>
        <Routes />
      </Router>
    </Suspense>
  );
};

export default RoutersComponent;
