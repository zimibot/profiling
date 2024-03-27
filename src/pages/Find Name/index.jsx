import ContainerPages from ".."
import { SearchForm } from "../Deck Explorer/searchFrom"

const FindName = () => {
    return <ContainerPages>
        <div className="py-4">
            <SearchForm></SearchForm>
        </div>
    </ContainerPages>
}

export default FindName