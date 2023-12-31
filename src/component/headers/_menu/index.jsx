import { getToken } from "../../../helper/_helper.auth"
import { useAppState } from "../../../helper/_helper.context"
import { mode } from "../../../helper/_helper.theme"
import MenuTabs from "./menu"
import logo from "../../../assets/images/logo_light.svg"

export const Menu = () => {
    const [appStore] = useAppState()

    return (
        <div className={`p-3 sticky top-0 z-10 ${mode() === "dark" ? "bg-[#0D0D0D]" : ""}`}>
            <div className={`border-b py-2 ${mode() === "dark" ? "border-b-[#222222]" : "border-b-[#aaa]"}  relative z-50`}>
                <div className="flex  flex-wrap lg:gap-[25px]  items-center sm:flex-col lg:flex-row">
                    <div className="mb-4 lg:mb-0 text-[40px] w-32">
                      <img src={logo}></img>
                    </div>
                    {appStore().token ? <>
                        <MenuTabs></MenuTabs>
                        <div className="flex-1 relative h-[53px] hidden lg:block">
                            <div className={`${mode() === "dark" ? "bg-primarry-1" : "bg-gray-200"} h-full w-full absolute top-0 flex items-center justify-end px-4`}>
                               
                            </div>
                        </div>
                    </> : ""}

                </div>
                <div className="w-full flex justify-between items-center absolute bottom-[-5px] left-0">
                    <div className={`h-2 w-2 ${mode() === "dark" ? "bg-[#222222]" : "bg-[#aaa]"} left-0`}></div>
                    <div className={`h-2 w-2 ${mode() === "dark" ? "bg-[#222222]" : "bg-[#aaa]"} right-0`}></div>
                </div>
            </div>
        </div>
    )
}