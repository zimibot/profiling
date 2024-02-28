import { Add, ArrowBack, ArrowLeft, ArrowRight } from "@suid/icons-material";
import ContainerPages from "..";
import { CardBox } from "../../component/cardBox";
import { Diagram } from "./diagram";
import { createEffect, createSignal } from "solid-js";
import { Button, IconButton } from "@suid/material";
import { Link } from "@solidjs/router";
import { api } from "../../helper/_helper.api";

const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Mengubah zona waktu ke zona waktu pengguna lokal untuk mendapatkan waktu yang akurat
  const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
  const timeString = date.toLocaleTimeString('en-US', optionsTime);

  // Format tanggal ke bentuk yang diinginkan: DD-MM-YYYY
  const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const dateStringFormatted = date.toLocaleDateString('en-GB', optionsDate);

  return {
    timeString,
    dateStringFormatted
  }
}

const Connection = () => {

  const [onMinimze, setMinimize] = createSignal(false)
  const [data, setData] = createSignal()
  const onShow = () => {
    setMinimize(a => !a)
  }

  createEffect(() => {
    api().get("/deck-explorer/sna-data").then(a => {
      console.log(a)

      setData(a.data.items)
    })
  })
  return (
    <ContainerPages>
      <div className="flex flex-1 pt-4 gap-2">
        <div className={`w-72 ${onMinimze() && "!w-0"} bg-primarry-1 relative items-center flex flex-col justify-center z-10 transition-all`}>
          <div className={`${onMinimze() && "opacity-0"} absolute w-full h-full overflow-auto p-2 left-0 top-0 flex flex-col gap-2`}>
            {data() ? data().map((a) => {
              return (
                <div className="p-4 bg-[#0f0f0f] shadow border-b border-blue-400 flex flex-col gap-4 cursor-pointer">
                  <div>
                    <div>
                      <p className="text-blue-300 font-bold">{a.title}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm">{formatDate(a.timestamp).timeString}</div>
                    <div className="text-sm">{formatDate(a.timestamp).dateStringFormatted}</div>
                  </div>
                </div>
              );
            }) : <div>
              Loading
            </div>}

          </div>
          <div className="absolute right-[-50px]">
            <IconButton onClick={onShow} color="primary">
              {onMinimze() ? <ArrowRight></ArrowRight> : <ArrowLeft></ArrowLeft>}
            </IconButton>
          </div>
        </div>

        <CardBox className={`flex-1 flex flex-col relative`} title={"Connection"}>
          <div className="flex flex-col flex-1">
            <Diagram></Diagram>
          </div>
          <div className="absolute top-0 right-0 p-4 z-10">
            <div>
              <Link href="/deck-explorer/connection/add">
                <Button color="secondary" variant="contained" startIcon={<Add></Add>}>
                  Connection
                </Button>
              </Link>
            </div>
          </div>
        </CardBox>
      </div>
    </ContainerPages>
  );
};

export default Connection;
