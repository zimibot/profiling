import { LayoutMarkedProfile } from "../";
import { Tags } from '../../../../component/tags';
import { Mason, createMasonryBreakpoints } from 'solid-mason';
import { CardFrame } from '../../../../component/cardFrame';
import { Button, Chip, IconButton } from "@suid/material";
import { AddAPhoto, Delete, Edit, Tag, VideoFile, Visibility } from '@suid/icons-material';
import notFoundImage from '../../../../assets/images/image-not-found.jpg'
import { defaultPathRedirect } from '../../../../helper/_helper.default.path'
import { Link } from "@solidjs/router";


const Videos = () => {
    let { currentHref } = defaultPathRedirect

    const breakpoints = createMasonryBreakpoints(() => [
        { query: '(min-width: 1660px)', columns: 4 },
        { query: '(min-width: 1280px) and (max-width: 1660px)', columns: 3 },
        { query: '(min-width: 1024px) and (max-width: 1280px)', columns: 3 },
        { query: '(min-width: 768px) and (max-width: 1024px)', columns: 2 },
        { query: '(max-width: 768px)', columns: 2 },
    ]);

    const someArray = new Array(8).fill({})
    let refsData;

    someArray.unshift({
        type: "add"
    })



    const itemData = ({ index }) => {


        return <div className="overflow-hidden p-1 relative">
            <div className="rounded" style={{ height: `400px` }}>
                <img className="h-full w-full object-cover" onError={(d) => d.target.src = notFoundImage} src={`/assets/barang_bukti/image/${index()}.jpeg`}></img>
            </div>

            <div className="absolute w-full h-full flex justify-between flex-col  top-0 left-0 p-2 space-y-2">
                <div className="bg-primarry-1 bg-opacity-60 backdrop-blur w-full p-2 font-bold uppercase text-center">
                    Video Kasus Narkoba
                </div>
                <div className="space-y-2 bg-primarry-2 p-2 bg-opacity-50 backdrop-blur">
                    <div className="space-x-2">
                        <Chip label="MICHAEL DANTON" color="secondary" icon={<Tag fontSize="11px"></Tag>} size="small" sx={{
                            borderRadius: 0
                        }}></Chip>
                        <Chip label="HIDAYAT" color="secondary" icon={<Tag fontSize="11px"></Tag>} size="small" sx={{
                            borderRadius: 0
                        }}></Chip>
                        <Chip label="+3" color="secondary" size="small" sx={{
                            borderRadius: 0
                        }}></Chip>
                    </div>
                    <div className="grid gap-2 grid-cols-4">
                        <Button color="secondary" fullWidth variant="outlined" size="small">
                            01:23
                        </Button>
                        <Link href={`${currentHref()}/views`}>
                            <Button color="secondary" fullWidth variant="contained">
                                <Visibility fontSize="small"></Visibility>
                            </Button>
                        </Link>
                        <Link href={`${currentHref()}/edit`}>
                            <Button color="secondary" fullWidth variant="contained"><Edit fontSize="small"></Edit></Button>
                        </Link>
                        <Button color="secondary" variant="contained"><Delete fontSize="small"></Delete></Button>

                    </div>
                </div>
            </div>
        </div>
    }


    return <LayoutMarkedProfile title={'VIDEOS'}>
        <div className="flex-1 flex flex-col min-h-[600px] space-y-3">
            <div className="flex justify-between w-full">
                <Tags label={"ADDITIONAL INFORMATION"}></Tags>
                <Link href={`${currentHref()}/add`}>
                    <Button variant="contained" color="secondary" startIcon={<VideoFile></VideoFile>} >ADD YOUR VIDEOS</Button>
                </Link>
            </div>
            <CardFrame title={"VIDEOS"} className="relative flex flex-1 flex-col group-item">
                <div className="absolute w-full h-full overflow-auto top-0 left-0 flex-1 p-4" ref={refsData}>
                    <Mason
                        as="div"
                        items={someArray}
                        columns={breakpoints()}
                    >
                        {(item, index) => {
                            return itemData({ index, item })
                        }}
                    </Mason>
                </div>
            </CardFrame>
        </div>
    </LayoutMarkedProfile>
}

export default Videos