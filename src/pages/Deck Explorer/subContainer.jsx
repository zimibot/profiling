import { useAppState } from "../../helper/_helper.context"

export const SubContainer = (props) => {
    return <div className={`grid grid-cols-8 gap-5 pt-6 flex-1 `}>
        <div className={`${props.full ? "col-span-full" : "col-span-full lg:col-span-3 "} space-y-4 flex flex-1 flex-col`}>
            {props.contenLeft}
        </div>
        <div className={`col-span-full ${props.full ? "col-span-full" : "col-span-full lg:col-span-5 "}  flex flex-col flex-1`}>
            {props.contenRight}
        </div>
    </div>
}