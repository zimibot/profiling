import { LibraryBooks } from "@suid/icons-material";

export const Empty = (props) => {
    return <div className={`absolute w-full px-4 py-6 flex justify-center ${props.className ? props.className : ""}`}>
        <div className="flex flex-col items-center gap-2">
            <LibraryBooks sx={{
                fontSize: 55
            }}></LibraryBooks>
            <span> Empty Data</span>
        </div>
    </div>
}