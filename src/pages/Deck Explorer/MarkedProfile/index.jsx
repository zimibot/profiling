import { Button, Paper } from "@suid/material"
import ContainerPages from "../.."
import { CardBox } from "../../../component/cardBox"
import { Tags } from "../../../component/tags"
import { mode } from "../../../helper/_helper.theme"
import { createEffect } from "solid-js"
import { api } from "../../../helper/_helper.api"
import { useAppState } from "../../../helper/_helper.context"
import moment from "moment"
import { useLocation } from "@solidjs/router"
import avatar from "../../../assets/images/avatar.svg"




export const LayoutMarkedProfile = ({ children, title }) => {

    const [items, { update }] = useAppState()
    const location = useLocation()
    let id = location?.pathname?.split("/")[3] || null


    createEffect(() => {
        update(a => ({ ...a, loading: true }))

        api().get(`/deck-explorer/marked_profile?keyword=${id}`).then((d) => {
            const itemsData = d.data.items;
            const additional = d.data.additional
            const { type, family, family_member, alias, phone_list, kendaraan, data } = itemsData;
            const keyProfile = data.length !== 0 ? "personal_identitas" : null

            const keyFamily = family.length !== 0 ? "family-connection" : null;
            const keyMember = family_member.length !== 0 ? "family-member-detail" : null;
            const keyAlias = alias.length !== 0 ? "alias" : null;
            const keyPhone = phone_list.length !== 0 ? "phone-list" : null;
            const keyKendaraan = kendaraan.length !== 0 ? "vehicle" : null;

            const updatedTabs = [
                {
                    title: "PERSONAL IDENTIFICATION",
                    key: "personal_identitas",
                    display: !!keyProfile,
                    path: `/deck-explorer/marked-profile/${id}/identification`,
                },
                {
                    title: "FAMILY MEMBER",
                    key: "family-member",
                    display: !!keyFamily,
                    path: `/deck-explorer/marked-profile/${id}/family-member`,
                    dinamis: true
                },
                {
                    title: "FAMILY MEMBER DETAIL",
                    key: "family-member-detail",
                    display: !!keyMember,
                    path: `/deck-explorer/marked-profile/${id}/family-member-detail`,
                    dinamis: true
                },
                {
                    title: "ALIAS PROFILE",
                    key: "alias",
                    display: !!keyAlias,
                    path: `/deck-explorer/marked-profile/${id}/alias-profile`,
                    dinamis: true
                },
                {
                    title: "PHONE LIST",
                    key: "phone-list",
                    display: !!keyPhone,
                    path: `/deck-explorer/marked-profile/${id}/phone-list`,
                    dinamis: true
                },
                {
                    title: "VEHICLE",
                    key: "vehicle",
                    display: !!keyKendaraan,
                    path: `/deck-explorer/marked-profile/${id}/vehicle`,
                    dinamis: true
                },
                {
                    title: "MAP TRACKING",
                    key: "map_tracking",
                    display: true,
                    path: `/deck-explorer/marked-profile/${id}/map-tracking`,
                },
                {
                    title: "PICTURE",
                    key: "pict",
                    display: true,
                    path: `/deck-explorer/marked-profile/${id}/picture`,
                },
                {
                    title: "VIDEOS",
                    key: "videos",
                    display: true,
                    path: `/deck-explorer/marked-profile/${id}/videos`,
                },
                {
                    title: "DOCUMENTS",
                    key: "documents",
                    display: true,
                    path: `/deck-explorer/marked-profile/${id}/documents`,
                },
            ];

            const updatedTabsWithConditions = updatedTabs.map((tab) => {
                if (tab.key === "personal_identitas" && !keyProfile) {
                    tab.display = false;
                }
                if (tab.key === "family-member" && (type === "NKK" || !keyFamily)) {
                    tab.display = false;
                }
                if (tab.key === "family-member-detail" && !keyMember) {
                    tab.display = false;
                }
                if (tab.key === "vehicle" && !keyKendaraan) {
                    tab.display = false;
                }
                if (tab.key === "alias" && !keyAlias) {
                    tab.display = false;
                }
                if (tab.key === "phone-list" && !keyPhone) {
                    tab.display = false;
                }
                return tab;
            });

            update((a) => ({
                ...a,
                additional,
                getProfile: itemsData,

                getFamily: {
                    data: family,
                },
                getFamilyMemberDetail: {
                    data: family_member
                },

                getVehicle: {
                    data: kendaraan
                },

                getAlias: {
                    data: alias
                },

                getPhoneList: {
                    data: phone_list
                },

                tabs: updatedTabsWithConditions,
                loading: false,
            }));
        });

    })



    return <ContainerPages>
        <div className="py-6 flex-1 flex flex-col">
            <div className="flex-1 flex flex-col">
                {items()?.tabs && <CardBox title={title} isTabs className="relative xl:flex grid gap-4 flex-1 min-h-[600px]">
                    <div className={`min-w-[300px] col-span-1 xl:max-w-[280px] max-w-full border-r-2 ${mode() === "dark" ? "border-[#0A0A0A]" : ""}`}>
                        <div className="p-4 space-y-4">
                            <Paper square elevation={2} class="relative w-full xl:h-[280px] h-[400px]">
                                {<img className="xl:object-cover object-contain object-center w-full h-full" src={items()?.getProfile?.foto_url?.label ? items()?.getProfile?.foto_url.type === "file" ? items()?.getProfile?.foto_url?.label : items()?.getProfile?.foto_url?.label : avatar} />
                                }
                            </Paper>
                            <div className={`space-y-2 ${mode() === "dark" ? "text-white" : "text-[#444]"}`}>
                                <div>
                                    <Tags className={"!py-0"} label={"Profile Name"} />
                                    <p className="pl-4">{items()?.getProfile?.profile_name}</p>
                                </div>
                                <div>
                                    <Tags className={"!py-0"} label={"CASE GROUP"} />
                                    <p className="pl-[20px]">{items()?.getProfile?.case_group}</p>
                                </div>
                                <div>
                                    <Tags className={"!py-0"} label={"REMARKS"} />
                                    <p className="pl-4">{items()?.getProfile?.remarks}</p>
                                </div>
                                <div>
                                    <Tags className={"!py-0"} label={"DATE CREATED"}></Tags>
                                    <p className="pl-4">{moment(items()?.getProfile?.timestamp).format("D/M/Y || H:M")} WIB</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button color="secondary" variant="contained" fullWidth >
                                    EXPORT [.PDF]
                                </Button>
                            </div>
                        </div>
                    </div>
                    {children}
                </CardBox>}

            </div>
        </div>
    </ContainerPages>
}