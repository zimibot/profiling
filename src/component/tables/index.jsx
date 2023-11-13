import {
    Button,
    Grow,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,

} from "@suid/material";
import { createSignal } from 'solid-js'
import { DarkPaginationNav, paginate } from 'solid-paginate'
import 'solid-paginate/styles'
import './paggination.css'
import { mode } from "../../helper/_helper.theme";
import { Empty } from "../empty";
import { useAppState } from "../../helper/_helper.context";


export const Tables = (props) => {
    const columns = props.columns || [
        {
            label: "Category",
            name: "category",
        },
        {
            label: "Phone Number",
            name: "phone_number",
        },
        {
            label: "Time",
            name: "time",
        },
        {
            label: "Date",
            name: "date",
        },
        {
            label: "Save",
            name: "function",
        },
    ]
    const data = props.data


    const [items, { update }] = useAppState()


    const pageSize = 10

    return <div className="relative flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
            <TableContainer variant="elevation" class={`!border ${mode() === "dark" ? "border-[#444]" : "border-[#eee]"} shadow relative flex-1 flex flex-col`} color="primary" component={Paper}>
                <div className="relative flex-1 overflow-auto">
                    <Table class="absolute overflow-auto">
                        <TableHead classes="bg-gray-200" sx={{
                            // bgcolor: mode() === "dark"?  "#323232" : "",
                        }} class="sticky top-0 z-10">
                            <TableRow>
                                {columns?.map(d => {
                                    return <TableCell {...d?.propsColumn} class={` ${mode() === "dark" ? "!bg-[#323232] !text-white" : "bg-gray-200 !text-gray-900"} !border-0 !py-2 ${d.classColumn ? d.classColumn : ""}`}>
                                        <div className="px-2  whitespace-nowrap">
                                            {d.label}
                                        </div>
                                    </TableCell>
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!data() ? <div className="absolute w-full h-full top-0 p-4 flex items-center justify-center">LOADING</div> : data()?.items?.length === 0 ? <Empty /> : data()?.items?.map((d, k) => {

                                return <Grow in={true} timeout={100 * k} style={{ transformOrigin: "0 0 0" }}>
                                    <TableRow
                                        sx={{ "td,th": { borderTop: mode() === "dark" ? "3px solid #171717" : "3px solid #eee", borderBottom: mode() === "dark" ? "3px solid #171717" : "3px solid #eee" }, "td:last-child": { borderRight: mode() === "dark" ? "3px solid #171717" : "3px solid #eee" }, "td:first-child": { borderLeft: mode() === "dark" ? "3px solid #171717" : "3px solid #eee" } }}
                                    >
                                        {columns?.map((w, index) => {
                                            if (columns[index]['function']) {
                                                let obj = typeof d[w.name] === 'object' && d[w.name] !== null
                                                if (obj) {
                                                    return <TableCell key={index} class={`${mode() === "dark" ? "!bg-[#222] !text-white" : "bg-gray-200 !text-gray-900"} !px-6 !py-2 ${w.className ? w.className : ""}`} scope="row">
                                                        <div className="text-[14px]">
                                                            {columns[index]['function'](d, d[w.name])}
                                                        </div>
                                                    </TableCell>
                                                } else {
                                                    return <TableCell key={index} class={`${mode() === "dark" ? "!bg-[#222] !text-white" : "bg-gray-200 !text-gray-900"} !pl-6 !py-2 ${w.className ? w.className : ""}`} scope="row">
                                                        <div className="text-[14px]">
                                                            {columns[index]['function'](d, d[w.name])}
                                                        </div>
                                                    </TableCell>
                                                }
                                            }
                                            return <TableCell key={index} class={`${mode() === "dark" ? "!bg-[#222] !text-white" : "bg-gray-200 !text-gray-900"}  !px-6 !py-2 ${w.className ? w.className : ""}`} scope="row">
                                                <div className="text-[14px]">
                                                    {d[w.name]}
                                                </div>
                                            </TableCell>

                                        })}
                                    </TableRow>
                                </Grow>
                            })}

                        </TableBody>
                    </Table>
                </div>
                {
                    props.count && <div className="flex justify-end p-2">
                        <Button href="#/deck-explorer/search-result/history" color="secondary" variant="contained" size="small" endIcon={`[${props?.count()?.totalItems || 0}]`}>MORE HISTORY</Button>
                    </div>
                }

                {props.paggination ? <div className="px-2 py-4 flex justify-end">
                    <div className="space-x-3">

                        <DarkPaginationNav
                            currentPage={items()?.currentPage || 1}
                            setCurrentPage={(d) => {
                                update(a => ({ ...a, currentPage: d }))
                            }}
                            pageSize={pageSize}
                            totalItems={data().totalItems}
                            limit={1}
                            showStepOptions={true}

                        />

                    </div>
                </div> : ""}

            </TableContainer>
        </div>
    </div>
}