export const Tags = ({ label,  className, icon }) => {
    return <div className={`flex gap-3 items-center relative py-2 ${className || ""}`}>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="6" height="6" fill="#222222" />
        </svg>
        <div className="flex justify-between items-center w-full">
            <span className="text-[#757575] text-sm uppercase">{label}</span>
            {icon}
        </div>
    </div>
}