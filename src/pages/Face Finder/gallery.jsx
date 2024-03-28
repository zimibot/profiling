import { createEffect, createSignal, onCleanup } from "solid-js";
import { api } from "../../helper/_helper.api";
import { CardBox } from "../../component/cardBox";
import { Button, CircularProgress } from "@suid/material";

export const GalleryData = () => {
    const [data, setData] = createSignal([]);
    const [uniq, setuniq] = createSignal([]);
    const [page, setPage] = createSignal(1);
    const [loading, setLoading] = createSignal(false);
    const [hasMore, setHasMore] = createSignal(true);
    const [isError, setIsError] = createSignal(false)

    let container = null; // Ref untuk container
    let sentinel = null; // Ref untuk sentinel

    const fetchData = async () => {
        try {
            if (!hasMore() || loading()) return;
            setLoading(true);
            const response = await api().get(`/deck-explorer/gallery?page=${page()}&limit=15`);
            const sortedData = [...response.data.items].sort((a, b) => a.baseTitle.localeCompare(b.baseTitle));
            setData(prevData => [...prevData, ...sortedData]);
            setPage(page => page + 1);
            setHasMore(response.data.nextPage !== null);
            setLoading(false);
        } catch (error) {
            setIsError(true)
        }

    };



    createEffect(() => {
        const unique = [...new Map(data().map(item => [item._id, item])).values()]
        setuniq(unique)
    })
    createEffect(() => {
        if (!container) return; // Pastikan container sudah di-ref sebelum membuat observer

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    fetchData();
                }
            },
            {
                root: container, // Gunakan container sebagai root
                threshold: 0.1
            }
        );

        if (sentinel) {
            observer.observe(sentinel);
        }

        onCleanup(() => observer.disconnect());
    });

    const onActive = (id) => {
        setData(w => w.map(s => ({
            ...s,
            active: s._id === id
        })))
    }
    return (
        <CardBox title="GALLERY" className="flex flex-col flex-1">
            <div className="relative flex-1">
                {!isError() ? <div ref={el => container = el} className="flex flex-1 flex-col absolute w-full h-full left-0 top-0 overflow-auto">
                    <div className="grid grid-cols-4 gap-4">
                        {uniq().map((item) => (
                            <Button variant={item.active ? "contained" : "text"} color="info" onClick={() => onActive(item._id)}>
                                <img src={item.baseurl} alt="" />
                            </Button>
                        ))}
                    </div>
                    {hasMore() && (
                        <div ref={el => sentinel = el} className="flex justify-center p-2">
                            {loading() && <CircularProgress title="Loading" size="20px" />}
                        </div>
                    )}
                </div> : <div className="flex items-center justify-center absolute w-full h-full">Data Not Found</div>}

            </div>
        </CardBox>
    );
};
