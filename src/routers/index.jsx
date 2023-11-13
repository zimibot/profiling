import { createEffect, lazy, Suspense } from "solid-js";
import { Router, useRoutes, hashIntegration, Outlet } from "@solidjs/router";
import { Loading } from "../component/loading";
import { Menu } from "../component/headers/_menu";

export const route = [

    {
        path: "/",
        component: lazy(() => import("../login"))
    },

    {
        path: "/other",
        children: [
            {
                path: "/pip",
                component: lazy(() => import("../pages/other/Picture in picture"))
            },
        ]
    },
    {
        path: "/deck-explorer",
        component: () => {
            return <>
                <Menu></Menu>
                <Outlet></Outlet>
            </>
        },
        children: [
            {
                path: "*",
                component: lazy(() => import("../notfound"))
            },
            {
                path: "/",
                component: lazy(() => import("../pages/Deck Explorer"))
            },
            {
                path: "/system-settings",
                component: lazy(() => import("../pages/System Settings"))
            },
            {
                path: "/direct-tracking",
                component: lazy(() => import("../pages/Direct Tracking"))
            },
            {
                path: "/search-result",
                children: [
                    {
                        path: "/:id",
                        component: lazy(() => import("../pages/Deck Explorer/SearchResult"))
                    },
                    {
                        path: "/database-information/:id",
                        children: [
                            {
                                path: "/",
                                component: lazy(() => import("../pages/Deck Explorer/DatabaseInformation"))
                            },
                            {
                                path: "/create-new-profile",
                                component: lazy(() => import("../pages/Deck Explorer/CreateNewprofile"))
                            }
                        ]
                    }
                ]
            },
            {
                path: "/marked-profile/:id",
                children: [
                    {
                        path: "/",
                        component: lazy(() => import("../notfound"))
                    },
                    {
                        path: "/alias-profile",
                        component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/dinamisData/alias"))
                    },
                    {
                        path: "/family-member",
                        component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/dinamisData/family"))
                    },
                    {
                        path: "/family-member-detail",
                        component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/dinamisData/family_detail"))
                    },
                    {
                        path: "/phone-list",
                        component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/dinamisData/phone_list"))
                    },
                    {
                        path: "/vehicle",
                        component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/dinamisData/vehicle"))
                    },
                    {
                        path: "/identification",
                        children: [
                            {
                                path: "/",
                                component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/identification"))
                            },
                            {
                                path: "/edit",
                                component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/identification/edit"))
                            },
                        ]
                    },
                    {
                        path: "/map-tracking",
                        children: [
                            {
                                path: "/",
                                component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/map-tracking"))
                            },
                        ]
                    },
                    {
                        path: "/additional-info",
                        children: [
                            {
                                path: "/",
                                component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/additionalInfo"))
                            },
                            // {
                            //     path: "/edit",
                            //     component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/additionalInfo/")),
                            // },
                        ]
                    },
                    {
                        path: "/picture",
                        children: [
                            {
                                path: "/",
                                component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/picture")),
                            },
                            {
                                path: "/views",
                                component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/picture/__/views")),
                            },
                            {
                                path: "/edit",
                                component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/picture/__/edit")),
                            },
                            {
                                path: "/add",
                                component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/picture/__/add")),
                            },
                        ]
                    },
                    {
                        path: "/videos",
                        children: [
                            {
                                path: "/",
                                component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/videos")),
                            },
                            {
                                path: "/views",
                                component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/videos/__/views")),
                            },
                            {
                                path: "/edit",
                                component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/videos/__/edit")),
                            },
                            {
                                path: "/add",
                                component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/videos/__/add")),
                            },
                        ]
                    },
                    {
                        path: "/documents",
                        children: [
                            {
                                path: "/",
                                component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/documents")),
                            },
                            {
                                path: "/views",
                                component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/documents/__/views")),
                            },
                            {
                                path: "/edit",
                                component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/documents/__/edit")),
                            },
                            {
                                path: "/add",
                                component: lazy(() => import("../pages/Deck Explorer/MarkedProfile/documents/__/add")),
                            },
                        ]
                    },


                ]
            }
        ]
    }
];


const RoutersComponent = () => {



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
