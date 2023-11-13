import { LinearProgress } from "@suid/material"
import { CardBox } from "../../component/cardBox"
import { Tables } from "../../component/tables"
import { Tags } from "../../component/tags"



export const CardTables = ({ title, count, subTitle, data, columns, loading, paggination }) => {




    return <CardBox className="flex flex-1 flex-col min-h-[500px] " title={<div className="flex gap-2">{title}</div>}>
        {loading && loading() && <LinearProgress color="secondary" />}


        <div className="flex justify-between items-center">
            <Tags label={subTitle}></Tags>
        </div>
        {data && <Tables data={data} columns={columns} paggination={paggination} count={count} />
        }
    </CardBox>
}