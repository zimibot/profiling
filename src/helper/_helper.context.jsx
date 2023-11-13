import { createSignal, createContext, useContext, } from "solid-js";


const DefaultProps = {
    chois: {
        label: "NIK",
        type: "number",
        value: "id_data"
    },
    search: "",
    token: localStorage.getItem("token") || null,
    mode: false,
    open: false,
    dataSearch: JSON.parse(localStorage.getItem("dataSearch")),
}



const AppContextState = createContext();
export const useAppState = () => useContext(AppContextState);

export function StoreContext(props) {
    const [appStore, setAppStore] = createSignal(DefaultProps);


    const items = [appStore, {
        update: (data) => {
            setAppStore(data)
        }
    }]


    return (
        <AppContextState.Provider value={items} >
            {props.children}
        </AppContextState.Provider>
    );
}

