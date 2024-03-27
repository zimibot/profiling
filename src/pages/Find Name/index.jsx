import ContainerPages from ".."
import { CardBox } from "../../component/cardBox"
import { SearchForm } from "../Deck Explorer/searchFrom"

const FindName = () => {
    return <ContainerPages>
        <div className="py-4 flex gap-2 flex-1">
            <SearchForm></SearchForm>
            <CardBox title="Result">

            </CardBox>
        </div>
    </ContainerPages>
}

export default FindName