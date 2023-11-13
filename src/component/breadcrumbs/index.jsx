import { Link, useLocation, useNavigate } from "@solidjs/router";
import { IconButton } from "@suid/material";
import { mode } from "../../helper/_helper.theme";
import { ChevronLeft, ChevronRight, Home } from "@suid/icons-material";
import { useAppState } from "../../helper/_helper.context";

export default function BreadcrumbsPages() {
    const [__, { update }] = useAppState();
    const location = useLocation();
    const navigate = useNavigate();

    const path = location.pathname.split("/");

    // Fungsi pembantu untuk IconButton
    const renderIconButton = (IconComponent, action) => (
        <IconButton
            sx={{
                marginRight: "10px",
                borderRadius: 0,
            }}
            color="primary"
            onClick={() => {
                update(d => ({ ...d, search: "" }));
                action();
            }}
        >
            <IconComponent />
        </IconButton>
    );

    // Fungsi pembantu untuk breadcrumbs
    const renderBreadcrumb = (segment, key) => {
        const breadcrumbPath = location.pathname.split("/").slice(0, path.indexOf(segment) + 1);
        const href = breadcrumbPath.join('/').replace("//", "/");

        if (segment === "") return;

        const breadcrumbClass = (key + 1) === path.length ? "font-bold" : "text-gray-400";
        return (
            <Link href={href} className={`py-2 gap-2 px-1 flex ${breadcrumbClass}`}>
                <div>{segment.replace(/-/g, " ").toUpperCase()}</div>
                {(key + 1) !== path.length && <div>{"/"}</div>}
            </Link>
        );
    };

    return (
        <div role="presentation" className="flex items-center">
            {renderIconButton(ChevronLeft, () => navigate(-1))}
            {renderIconButton(Home, () => navigate("/"))}
            {renderIconButton(ChevronRight, () => window.history.forward())}
            <div className={`flex w-full overflow-auto whitespace-nowrap items-center ${mode() === "dark" ? "bg-[#171717]" : "bg-gray-200"} flex-1 px-4`}>
                {path.map(renderBreadcrumb)}
            </div>
        </div>
    );
}
