import { useNavigate } from "@solidjs/router"
import { ButtonForm } from "../component/form/button"
import ContainerPages from "../pages"

const NotFound = () => {
    const nav =useNavigate()
    return <ContainerPages>
        <div class="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
            <div class="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
                <div class="relative">
                    <div class="absolute">
                        <div class="">
                            <h1 class="my-2 font-bold text-2xl">
                                Looks like you've found the
                                doorway to the great nothing
                            </h1>
                            <p class="my-2">Sorry about that! Please visit our hompage to get where you need to go.</p>
                        </div>
                        <ButtonForm onClick= {() => nav("/")} w={"100px"} teks={"GO HOME"} />
                    </div>
                </div>
            </div>

        </div>
    </ContainerPages>
}

export default NotFound