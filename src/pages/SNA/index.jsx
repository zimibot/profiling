import ContainerPages from "..";
import { CardBox } from "../../component/cardBox";
import { Diagram } from "./diagram";

const Connection = () => {
  return (
    <ContainerPages>
      <div className="flex  flex-1 pt-4">
        <div className="w-72 bg-primarry-1 relative">
          <div className="absolute w-full h-full overflow-auto p-2 left-0 top-0 grid gap-2">
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
        </div>
        <CardBox className="flex-1 flex flex-col">
          <div className="flex flex-col flex-1">
            <Diagram></Diagram>
          </div>
        </CardBox>
      </div>
    </ContainerPages>
  );
};

export default Connection;
