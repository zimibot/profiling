import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { useAppState } from "../../helper/_helper.context";
import { createFormControl, createFormGroup } from "solid-forms";
import { CardBox } from "../../component/cardBox";
import { DefaultInput } from "../../component/form/input";
import { RadioField } from "../../component/form/radio";
import { api } from "../../helper/_helper.api";
import Swal from "sweetalert2";
import { notify } from "../../component/notify";


let dataSearch = [

    {
        label: "NIK",
        type: "number",
        value: "id_data"
    },
    {
        label: "PHONE",
        type: "number",
        value: "person"
    },
    {
        label: "NKK",
        type: "number",
        value: "family_data"
    },
    {
        label: "NO POL",
        type: "teks",
        value: "vehicle"
    },
    {
        label: "NAME",
        type: "teks",
        value: "marked_profile",
        disabled: true
    },
    {
        label: "PROFILE",
        type: "teks",
        value: "marked_profile",
        disabled: true
    },

]


export const SearchForm = () => {
    const navi = useNavigate()

    const [items, { update }] = useAppState()

    const group = createFormGroup({
        search: createFormControl(items().search, {
            required: true,
        }),
    });


    const [loading, setLoading] = createSignal()

    function convertToInternationalFormat(number) {
        if (number.startsWith(0)) {
            return 62 + number.substring(1);
        } else if (number.startsWith(62)) {
            return number;
        } else {
            console.error('Invalid phone number format');
            return null;
        }
    }


    const onSubmit = async (d) => {
        d.preventDefault();
        if (group.errors?.isMissing) {
            return false
        }
        setLoading(true)
        group.markSubmitted(true);
        let { search } = group.value;

        search = convertToInternationalFormat(search) ? convertToInternationalFormat(search) : search

        update(d => ({ ...d, search }))
        try {
            let type = items().chois.value
            let data = { search, type, path: `/deck-explorer/search-result/database-information/${search}` }
            let postLogin = await OnSearch(data)
            let dataSearch = postLogin.data.items
            update(d => ({ ...d, dataSearch, terkait: dataSearch.terkait }))
            localStorage.setItem("dataSearch", JSON.stringify(dataSearch))
            localStorage.setItem("typeSearch", items().chois.label)
            notify({ title: "Search", text: `${search} Success` })
            setTimeout(() => {
                setLoading(false)
                navi(`/deck-explorer/search-result/database-information/${search}`)
            }, 300);

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error?.response?.data?.message,
            })

            setLoading(false)

        }


    }



    return <form onSubmit={onSubmit}>
        <CardBox className="space-y-4" title={"PROFILE EXPLORER"}>
            <DefaultInput loading={loading} type={items} update={update} defaultSearch={items()?.search} control={group.controls.search} placeholder={`SEARCH WITH `} chois={items} />
            <RadioField onChange={(d) => {
                let type = d.target.ariaLevel
                let label = d.target.ariaLabel
                update(a => ({
                    ...a,
                    chois: {
                        label,
                        type,
                        value: d.target.value
                    }
                }))

            }} defaultValue={items().chois.value} data={dataSearch} />
        </CardBox>
    </form>
}



export const OnSearch = async ({ search, type, path, ...props }) => {
    let data = { ...props, number: search, type, path }
    const postLogin = await api().post("/deck-explorer/search", data)

    return postLogin
}