import { createEffect, createSignal, onCleanup } from "solid-js";
import { api } from "../../helper/_helper.api";
import { CardBox } from "../../component/cardBox";
import { Button, CircularProgress } from "@suid/material";

export const GalleryData = () => {
    const [data, setData] = createSignal({ items: [], page: 1, totalPages: 0 });
    const [isLoading, setIsLoading] = createSignal(false);
    const [isEndOfGallery, setIsEndOfGallery] = createSignal(false);
    let scrollContainer;

    const fetchGallery = (page) => {
        setIsLoading(true);
        api()
            .get(`/deck-explorer/gallery?page=${page}&limit=15`)
            .then((a) => {
                setData((prev) => ({
                    ...a.data,
                    items: [...prev.items, ...a.data.items],
                    page: a.data.page,
                }));
                setIsLoading(false);
                if (a.data.page === a.data.totalPages) {
                    setIsEndOfGallery(true);
                }
            });
    };

    createEffect(() => {
        fetchGallery(data().page);
    });

    createEffect(() => {
        const handleScroll = () => {
            if (scrollContainer) {
                const bottom =
                    scrollContainer.scrollHeight - scrollContainer.scrollTop ===
                    scrollContainer.clientHeight;
                if (bottom && !isLoading() && !isEndOfGallery()) {
                    fetchGallery(data().page + 1);
                }
            }
        };

        scrollContainer.addEventListener("scroll", handleScroll);

        onCleanup(() => {
            scrollContainer.removeEventListener("scroll", handleScroll);
        });
    });

    return (
        <CardBox title="GALLERY" className="flex flex-col flex-1">
            <div
                className="relative flex-1 overflow-auto"
                ref={scrollContainer}
            >
                <div className="w-full h-full absolute top-0">
                    <div className="grid grid-cols-4 gap-4 p-4">
                        {data().items.map((a) => (
                            <Button key={a.id}>
                                <img src={a.baseurl} alt="" />
                            </Button>
                        ))}
                    </div>
                    {isEndOfGallery() ? (
                        <div className="text-center p-2">No more galleries found.</div>
                    ) : isLoading() ? (
                        <div className="flex justify-center p-2">
                            <CircularProgress title="Loading" size="20px" />
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </CardBox>
    );
};
