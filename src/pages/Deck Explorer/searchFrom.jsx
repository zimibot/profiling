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
        label: "PERSONAL ID",
        type: "number",
        value: "id_data"
    },
    {
        label: "MSISDN",
        type: "number",
        value: "person"
    },
    {
        label: "FAMILY ID",
        type: "number",
        value: "family_data"
    },
    {
        label: "VEHICLE",
        type: "teks",
        value: "vehicle"
    },
    {
        label: "NAME",
        type: "teks",
        value: "nama",
    },
    // {
    //     label: "PROFILE",
    //     type: "teks",
    //     value: "marked_profile",
    //     disabled: true
    // },

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
        if (number.startsWith('0')) {
            return '62' + number.substring(1);
        } else if (number.startsWith('62')) {
            return number;
        } else {
            return null;
        }
    }

    const onSubmit = async (d) => {
        d.preventDefault();
        if (group.errors?.isMissing) {
            Swal.fire('Error', 'Please fill in the required fields.', 'error');
            return false;
        }
        setLoading(true);
        group.markSubmitted(true);
        let { search } = group.value;

        search = convertToInternationalFormat(search) || search;

        try {
            let type = items().chois.value;

            console.log(type)

            if (type === "nama") {
                navi(`/deck-explorer/find-name/`)
                navi(`/deck-explorer/find-name/${search}`, { replace: true, resolve: true })
                setLoading(false);
                return
            }

            let data = { search, type, path: `/deck-explorer/search-result/database-information/${search}` };
            let postLogin = await OnSearch(data);
            let dataSearch = postLogin.data.items;

            if (!dataSearch) {
                throw new Error('No data found');
            }

            update(d => ({ ...d, dataSearch, terkait: dataSearch.terkait }));
            localStorage.setItem("dataSearch", JSON.stringify(dataSearch));
            localStorage.setItem("typeSearch", items().chois.label);
            Swal.fire('Success', `${search} search was successful.`, 'success');

            setTimeout(() => {
                setLoading(false);
                navi(`/deck-explorer/search-result/database-information/${search}`);
            }, 300);

        } catch (error) {
            Swal.fire('Error', error?.response?.data?.message || 'An unexpected error occurred.', 'error');
            setLoading(false);
        }
    };



    return <form onSubmit={onSubmit}>
        <CardBox className="space-y-4" title={"PROFILE EXPLORER"}>
            <DefaultInput loading={loading} type={items} update={update} control={group.controls.search} placeholder={`SEARCH WITH `} chois={items} />
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