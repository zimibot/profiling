import { ArrowLeft, ArrowRight } from "@suid/icons-material";
import ContainerPages from "..";
import { CardBox } from "../../component/cardBox";
import { createSignal } from "solid-js";
import { IconButton } from "@suid/material";
import { useNavigate } from "@solidjs/router";

const AddConnection = () => {

    const navi = useNavigate()

    const [onMinimze, setMinimize] = createSignal(false)
    const onShow = () => {
        setMinimize(a => !a)
    }
    return (
        <ContainerPages>
            <div className="flex flex-1 pt-4">
                <div className={`w-72 ${onMinimze() && "!w-0"} bg-primarry-1 relative items-center flex flex-col justify-center z-10 transition-all`}>
                    <div className={`${onMinimze() && "opacity-0"} absolute w-full h-full overflow-auto p-2 left-0 top-0 grid gap-2`}>
                        {new Array(10).fill("").map((a) => {
                            return (
                                <div className="p-4 bg-[#0f0f0f] shadow border-b border-blue-400 flex flex-col gap-4 cursor-pointer">
                                    <div>
                                        <div>
                                            <p className="text-blue-300 font-bold">Lorem Ipsum</p>
                                        </div>
                                        <div className="text-xs">Content</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="text-sm">22:13</div>
                                        <div className="text-sm">01-02-2023</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="absolute right-[-50px]">
                        <IconButton onClick={onShow} color="primary">
                            {onMinimze() ? <ArrowRight></ArrowRight> : <ArrowLeft></ArrowLeft>}
                        </IconButton>
                    </div>
                </div>

                <CardBox className={`flex-1 flex flex-col relative`} title={"Connection"}>

                </CardBox>
            </div>
        </ContainerPages>
    );
};

export default AddConnection;
