import { createSignal } from "solid-js"
import ContainerPages from ".."
import { CardBox } from "../../component/cardBox"
import { Tables } from "../../component/tables"
import { SearchForm } from "../Deck Explorer/searchFrom"

const FindName = () => {
    const [data, setData] = createSignal({
        items: [
            {
                category: "test"
            }
        ]
    })
    return <ContainerPages>
        <div className="py-4 flex gap-2 flex-1">
            <div className="flex flex-col gap-2">
                <SearchForm></SearchForm>
                <div className="flex-1 relative">
                    <div className="absolute w-full h-full top-0 left-0 flex flex-col">
                        <Tables data={data}></Tables>
                    </div>
                </div>
            </div>
            <CardBox title="Result">

            </CardBox>
        </div>
    </ContainerPages>
}

export default FindName