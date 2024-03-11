import ContainerPages from ".."
import { CardBox } from "../../component/cardBox"
import { createEffect, createSignal, onMount } from "solid-js";
import L from 'leaflet';
import 'leaflet-semicircle';
import 'leaflet-control-geocoder';
import 'leaflet.featuregroup.subgroup'
import 'leaflet.fullscreen'
import 'leaflet.locatecontrol'
import "leaflet/dist/leaflet.css";
import { Tags } from "../../component/tags";
import { CardFrame } from "../../component/cardFrame";
import { DefaultInput } from "../../component/form/input";
import { createFormControl, createFormGroup } from "solid-forms";
import { api } from "../../helper/_helper.api";
import moment from "moment";
import Swal from "sweetalert2";
import { Button, Chip, Divider, IconButton } from "@suid/material";
import axios from "axios";

import io from "socket.io-client"

let maps

const DirectTracking = () => {
    const [isLoad, setIsload] = createSignal(false)

    var LeafIcon = L.Icon.extend({
        options: {
            iconSize: [48, 48],
            iconAnchor: [15, 0],
            popupAnchor: [0, -0]
        }
    });

    let socket

    createEffect(() => {
        socket = io('http://192.168.1.123:8080');

        socket.on("connect", () => {
            console.log("Connected to the server");


        });

        socket.on("target-ping-response", async (ping) => {
            console.log(ping);
            if (ping === "TARGET ONLINE") {
                setload(false);
                Swal.fire({
                    icon: "success",
                    title: "Target Available!",
                    confirmButtonText: "Search for Target Location",
                    timer: 4000,
                    timerProgressBar: true,
                    didClose: async () => {
                        let swalProgress = Swal.fire({
                            title: 'Searching for target location...',
                            html: 'Please wait...',
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });
                        try {
                            const { search } = group.value;
                            const data = { keyword: search };
                            const response = await api().post("/checkpos/search", data);
                            const { keyword, response: [res] } = response.data.data;
                            swalProgress.close();

                            // Add marker to the map for the target
                            L.marker([res.lat, res.long], { icon: greenIcon }).addTo(maps)
                                .bindPopup(html(keyword, res))
                                .openPopup();

                            // Success notification
                            Swal.fire({
                                icon: "success",
                                title: "Success!",
                                text: "Target location successfully found.",
                                didClose: () => {
                                    setload(false);
                                    group.controls.search.setValue("");
                                }
                            });
                        } catch (error) {
                            swalProgress.close();
                            Swal.fire({
                                icon: "error",
                                title: "Error!",
                                text: "Target location could not be found."
                            });
                        }

                    }
                });
            } else {
                // Handle inactive target number
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "The target number is inactive or unavailable."
                });

                setload(false);
            }
        });

    })



    let greenIcon = new LeafIcon({ iconUrl: "./assets/marker.png" })

    const [items, setData] = createSignal(null)

    var gisarea = [
        [-6.289391, 106.996586], [-6.289204, 106.996714], [-6.287402, 106.997787],
        [-6.287164, 106.997948], [-6.286054, 106.998598], [-6.28531, 106.999045],
        [-6.285012, 106.999227], [-6.288454, 106.995801], [-6.288251, 106.995935],
        [-6.288003, 106.996086], [-6.287709, 106.996263], [-6.287414, 106.996441],
        [-6.287268, 106.996526], [-6.287056, 106.996676], [-6.286415, 106.997426],
        [-6.286669, 106.997859], [-6.28463, 106.998499], [-6.284908, 106.998338],
        [-6.285133, 106.998197], [-6.285369, 106.998051], [-6.285633, 106.997886],
        [-6.28585, 106.997755], [-6.286159, 106.997568], [-6.286344, 106.997459],
        [-6.286374, 106.99745], [-6.286415, 106.997426], [-6.287319, 106.995034],
        [-6.287171, 106.995103], [-6.287117, 106.995119], [-6.287064, 106.995135],
        [-6.286924, 106.995275], [-6.286837, 106.995364], [-6.286779, 106.99542],
        [-6.286694, 106.995474], [-6.286576, 106.99556], [-6.2865, 106.995607],
        [-6.286412, 106.995698], [-6.286353, 106.995769], [-6.286262, 106.995836],
        [-6.286225, 106.995854], [-6.286146, 106.995909], [-6.285972, 106.996036],
        [-6.28584, 106.996086], [-6.285735, 106.996131], [-6.285534, 106.99619],
        [-6.28524, 106.996258], [-6.285099, 106.996295], [-6.28501, 106.996303],
        [-6.284951, 106.996302], [-6.284851, 106.996307], [-6.284764, 106.996302],
        [-6.284659, 106.996281], [-6.284569, 106.996261], [-6.284474, 106.996213],
        [-6.284419, 106.996182], [-6.284393, 106.996175], [-6.284365, 106.996174],
        [-6.284214, 106.996204], [-6.284164, 106.996172], [-6.284117, 106.996088],
        [-6.284093, 106.996017], [-6.285972, 106.996036], [-6.286142, 106.996291],
        [-6.286259, 106.996554], [-6.286463, 106.996846], [-6.286682, 106.997208],
        [-6.286958, 106.997656], [-6.287164, 106.997948], [-6.286682, 106.997208],
        [-6.286985, 106.996999], [-6.287204, 106.996886], [-6.287528, 106.9967],
        [-6.287539, 106.99667], [-6.287531, 106.996638], [-6.287414, 106.996441],
        [-6.287075, 106.996202], [-6.287268, 106.996526], [-6.2865, 106.995607],
        [-6.286581, 106.99574], [-6.286614, 106.995854], [-6.286638, 106.996123],
        [-6.286689, 106.996381], [-6.286724, 106.996508], [-6.286776, 106.99667],
        [-6.286225, 106.995854], [-6.28641, 106.996202], [-6.286298, 106.997787],
        [-6.286073, 106.997926], [-6.286042, 106.997947], [-6.28604, 106.997955],
        [-6.286041, 106.997963], [-6.286053, 106.997985], [-6.286169, 106.998167],
        [-6.286159, 106.997568], [-6.286298, 106.997787], [-6.28643, 106.998003],
        [-6.286776, 106.99667], [-6.286817, 106.996752], [-6.286868, 106.996844],
        [-6.286985, 106.996999], [-6.286985, 106.996999], [-6.287237, 106.997505],
        [-6.287402, 106.997787], [-6.285904, 106.998313], [-6.286169, 106.998167],
        [-6.28643, 106.998003], [-6.286669, 106.997859], [-6.286958, 106.997656],
        [-6.285724, 106.99678], [-6.285854, 106.997033], [-6.285896, 106.997101],
        [-6.285959, 106.997221], [-6.286034, 106.997364], [-6.286689, 106.996381],
        [-6.286508, 106.996468], [-6.286371, 106.996526], [-6.286259, 106.996554],
        [-6.286463, 106.996846], [-6.286307, 106.996897], [-6.286216, 106.996936],
        [-6.286119, 106.996982], [-6.285896, 106.997101], [-6.286415, 106.997426],
        [-6.286304, 106.997243]
    ];


    function calculateCentroid(coords) {
        let centroid = { lat: 0, lng: 0 };
        coords.forEach(coord => {
            centroid.lat += coord[0];
            centroid.lng += coord[1];
        });
        centroid.lat /= coords.length;
        centroid.lng /= coords.length;
        return centroid;
    }

    function buildMap(div) {
        maps = L.map(div, {
            center: [-6.28599, 106.99646000000001],
            crs: L.CRS.EPSG3857,
            zoom: 14,
            zoomControl: true,
            preferCanvas: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
            attribution: '',

        }).addTo(maps);

        L.control.scale({ maxWidth: 100, metric: true, imperial: false }).addTo(maps);

        L.marker(
            [-6.28599, 106.99646000000001],
            { "color": "red" }
        ).addTo(maps);

        var feature_group_40508a1360d04dc38f1f261e22e36556 = L.featureGroup(
            {}
        ).addTo(maps);

        var feature_group_de1e890546584228a4117e22deba2c2d = L.featureGroup(
            {}
        ).addTo(maps);


        L.Control.geocoder(
            { "collapsed": false, "defaultMarkGeocode": true, "position": "topright" }
        ).on('markgeocode', function (e) {
            maps.setView(e.geocode.center, 11);
        }).addTo(maps);

        L.polygon(
            [[-6.286707, 106.994489], [-6.284802, 106.994877], [-6.28454, 106.995123], [-6.283934, 106.996103], [-6.284001, 106.996247], [-6.284357, 106.996901], [-6.286301, 106.998296], [-6.286689, 106.998566], [-6.287348, 106.998665], [-6.287669, 106.998501], [-6.287867, 106.997719], [-6.287668, 106.995077], [-6.287522, 106.994748], [-6.286707, 106.994489]],
            { "bubblingMouseEvents": true, "color": "green", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "green", "fillOpacity": 0.2, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "noClip": false, "opacity": 0.1, "smoothFactor": 1.0, "stroke": true, "weight": 19 }
        ).addTo(maps);

        L.polygon(
            [[-6.286932, 106.992227], [-6.283614, 106.992539], [-6.282329, 106.993517], [-6.281987, 106.996802], [-6.282058, 106.99725], [-6.28244, 106.998529], [-6.282447, 106.998545], [-6.282836, 106.998948], [-6.285189, 107.000363], [-6.286023, 107.000637], [-6.286106, 107.000662], [-6.288239, 107.001102], [-6.28891, 107.000911], [-6.289064, 107.000844], [-6.289513, 106.999871], [-6.290234, 106.997438], [-6.290518, 106.996113], [-6.290747, 106.994057], [-6.290742, 106.993697], [-6.290537, 106.993575], [-6.288716, 106.992587], [-6.286932, 106.992227]],
            { "bubblingMouseEvents": true, "color": "yellow", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "green", "fillOpacity": 0.2, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "noClip": false, "opacity": 0.1, "smoothFactor": 1.0, "stroke": true, "weight": 28 }
        ).addTo(maps);

        var semi_circle_48e552fb6a484a3fbbb2b1c9d39478ac = L.semiCircle(
            [-6.21643, 107.006],
            { "bubblingMouseEvents": true, "color": "black", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#00210f", "fillOpacity": 0.2, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 0.3, "radius": 1439.3503668524384, "startAngle": 0, "stopAngle": 186.6496331475617, "stroke": true, "weight": 0.1 }
        )
            .addTo(maps);


        semi_circle_48e552fb6a484a3fbbb2b1c9d39478ac.bindTooltip(
            `<div>
                 TELKOMSEL - GSM / 3G
             </div>`,
            { "sticky": true }
        );


        var circle_marker_947e23bd42994053bb68adb56f1a417e = L.circleMarker(
            [-6.21643, 107.006],
            { "bubblingMouseEvents": true, "color": "#d89b94", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#afd474", "fillOpacity": 1, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 1.0, "radius": 5, "stroke": true, "weight": 1 }
        ).addTo(maps);


        circle_marker_947e23bd42994053bb68adb56f1a417e.bindTooltip(
            `<div>
                 TELKOMSEL - GSM / 3G
             </div>`,
            { "sticky": true }
        );


        var semi_circle_a929b293d4c9400caf05b0f4a210bc58 = L.semiCircle(
            [-6.220249, 107.004895],
            { "bubblingMouseEvents": true, "color": "black", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#ae48c2", "fillOpacity": 0.2, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 0.3, "radius": 1728.2565928946033, "startAngle": 0, "stopAngle": 497.74340710539667, "stroke": true, "weight": 0.1 }
        )
            .addTo(maps);


        semi_circle_a929b293d4c9400caf05b0f4a210bc58.bindTooltip(
            `<div>
                 TELKOMSEL - 4G
             </div>`,
            { "sticky": true }
        );


        var circle_marker_d18345e15ddc46e2b0df3b8fa5d0858b = L.circleMarker(
            [-6.220249, 107.004895],
            { "bubblingMouseEvents": true, "color": "#64c223", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#638c91", "fillOpacity": 1, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 1.0, "radius": 5, "stroke": true, "weight": 1 }
        ).addTo(maps);


        circle_marker_d18345e15ddc46e2b0df3b8fa5d0858b.bindTooltip(
            `<div>
                 TELKOMSEL - 4G
             </div>`,
            { "sticky": true }
        );


        var semi_circle_0a6ea58233ea448c89b0f62111cd6239 = L.semiCircle(
            [-6.2175, 107.002777],
            { "bubblingMouseEvents": true, "color": "black", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#2f6179", "fillOpacity": 0.2, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 0.3, "radius": 1497.1320333059, "startAngle": 0, "stopAngle": 248.86796669410006, "stroke": true, "weight": 0.1 }
        )
            .addTo(maps);


        semi_circle_0a6ea58233ea448c89b0f62111cd6239.bindTooltip(
            `<div>
                 TELKOMSEL - 4G
             </div>`,
            { "sticky": true }
        );


        var circle_marker_2e8f364149d148179d54579ad0811ccc = L.circleMarker(
            [-6.2175, 107.002777],
            { "bubblingMouseEvents": true, "color": "#40abb7", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#d8acb1", "fillOpacity": 1, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 1.0, "radius": 5, "stroke": true, "weight": 1 }
        ).addTo(maps);


        circle_marker_2e8f364149d148179d54579ad0811ccc.bindTooltip(
            `<div>
                 TELKOMSEL - 4G
             </div>`,
            { "sticky": true }
        );

        var semi_circle_cb36dabc1c8c4a639296efcf7f4360f3 = L.semiCircle(
            [-6.217479, 107.002956],
            { "bubblingMouseEvents": true, "color": "black", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#a30ad8", "fillOpacity": 0.2, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 0.3, "radius": 1554.9150974903014, "startAngle": 0, "stopAngle": 311.0849025096985, "stroke": true, "weight": 0.1 }
        )
            .addTo(maps);


        semi_circle_cb36dabc1c8c4a639296efcf7f4360f3.bindTooltip(
            `<div>
                 TELKOMSEL - 4G
             </div>`,
            { "sticky": true }
        );



        var circle_marker_98493dcd0dfb47af8ebf6eb8a7fa29ae = L.circleMarker(
            [-6.217479, 107.002956],
            { "bubblingMouseEvents": true, "color": "#191781", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#2ec26b", "fillOpacity": 1, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 1.0, "radius": 5, "stroke": true, "weight": 1 }
        ).addTo(maps);


        circle_marker_98493dcd0dfb47af8ebf6eb8a7fa29ae.bindTooltip(
            `<div>
                 TELKOMSEL - 4G
             </div>`,
            { "sticky": true }
        );


        var feature_group_sub_group_573550af91854e0080ed55cf7fe06b23 = L.featureGroup.subGroup(
            feature_group_de1e890546584228a4117e22deba2c2d
        );
        feature_group_sub_group_573550af91854e0080ed55cf7fe06b23.addTo(maps);


        var polygon_c9f6be6dedc540368a9c2a2a49aeb5e2 = L.polygon(
            [[-6.286707, 106.994489], [-6.284802, 106.994877], [-6.28454, 106.995123], [-6.283934, 106.996103], [-6.284001, 106.996247], [-6.284357, 106.996901], [-6.286301, 106.998296], [-6.286689, 106.998566], [-6.287348, 106.998665], [-6.287669, 106.998501], [-6.287867, 106.997719], [-6.287668, 106.995077], [-6.287522, 106.994748], [-6.286707, 106.994489]],
            { "bubblingMouseEvents": true, "color": "green", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "green", "fillOpacity": 0.2, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "noClip": false, "opacity": 0.1, "smoothFactor": 1.0, "stroke": true, "weight": 19 }
        ).addTo(feature_group_sub_group_573550af91854e0080ed55cf7fe06b23);


        var feature_group_sub_group_f705240d203b431b9fcdf3da953750f0 = L.featureGroup.subGroup(
            feature_group_de1e890546584228a4117e22deba2c2d
        );
        feature_group_sub_group_f705240d203b431b9fcdf3da953750f0.addTo(maps);


        var polygon_4f9adc4b4fba4a20943e44bb61726b1a = L.polygon(
            [[-6.286932, 106.992227], [-6.283614, 106.992539], [-6.282329, 106.993517], [-6.281987, 106.996802], [-6.282058, 106.99725], [-6.28244, 106.998529], [-6.282447, 106.998545], [-6.282836, 106.998948], [-6.285189, 107.000363], [-6.286023, 107.000637], [-6.286106, 107.000662], [-6.288239, 107.001102], [-6.28891, 107.000911], [-6.289064, 107.000844], [-6.289513, 106.999871], [-6.290234, 106.997438], [-6.290518, 106.996113], [-6.290747, 106.994057], [-6.290742, 106.993697], [-6.290537, 106.993575], [-6.288716, 106.992587], [-6.286932, 106.992227]],
            { "bubblingMouseEvents": true, "color": "yellow", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "green", "fillOpacity": 0.2, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "noClip": false, "opacity": 0.1, "smoothFactor": 1.0, "stroke": true, "weight": 28 }
        ).addTo(feature_group_sub_group_f705240d203b431b9fcdf3da953750f0);


        var feature_group_sub_group_2e1ffe97ec9542fe9f48f7cae6ad4705 = L.featureGroup.subGroup(
            feature_group_de1e890546584228a4117e22deba2c2d
        );
        feature_group_sub_group_2e1ffe97ec9542fe9f48f7cae6ad4705.addTo(maps);


        var polygon_85117499c0224c42922f8a84558cef40 = L.polygon(
            [[-6.284961, 106.987267], [-6.28464, 106.987429], [-6.283741, 106.988899], [-6.282998, 106.99019], [-6.279722, 106.99364], [-6.278953, 106.994347], [-6.277449, 106.998445], [-6.277394, 106.998801], [-6.277376, 106.999211], [-6.277515, 106.999543], [-6.278696, 107.000905], [-6.28074, 107.002812], [-6.281783, 107.003655], [-6.28284, 107.004174], [-6.286873, 107.00492], [-6.287189, 107.004749], [-6.291271, 107.002082], [-6.291273, 107.00208], [-6.29406, 106.99885], [-6.294278, 106.998538], [-6.295323, 106.996923], [-6.295427, 106.996579], [-6.295706, 106.993926], [-6.29498, 106.992345], [-6.294335, 106.991287], [-6.294146, 106.990981], [-6.291265, 106.989026], [-6.290459, 106.988946], [-6.28545, 106.987417], [-6.284961, 106.987267]],
            { "bubblingMouseEvents": true, "color": "orange", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "green", "fillOpacity": 0.2, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "noClip": false, "opacity": 0.1, "smoothFactor": 1.0, "stroke": true, "weight": 41 }
        ).addTo(feature_group_sub_group_2e1ffe97ec9542fe9f48f7cae6ad4705);


        var semi_circle_27db8f6d9c254b11b141575b496f2e51 = L.semiCircle(
            [-6.28599, 106.99646],
            { "bubblingMouseEvents": true, "color": "black", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#06f92b", "fillOpacity": 0.2, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 0.5, "radius": 1554.79255171819, "startAngle": 0, "stopAngle": 311.20744828181006, "stroke": true, "weight": 0.3 }
        )
            .addTo(feature_group_sub_group_2e1ffe97ec9542fe9f48f7cae6ad4705);


        semi_circle_27db8f6d9c254b11b141575b496f2e51.bindTooltip(
            `<div>
                 Kalkulasi pancaran tower<br><br>Start: 311.20744828181006 derajat.<br>Stop: 600 derajat.<br><br>Koreksi: 288.79255171818994 derajat.
             </div>`,
            { "sticky": true }
        );


        var circle_marker_33cdbb72a4f74e8da3f0c32bd15ef213 = L.circleMarker(
            [-6.28599, 106.99646],
            { "bubblingMouseEvents": true, "color": "#91f0ca", "dashArray": null, "dashOffset": null, "fill": true, "fillColor": "#e5e8f9", "fillOpacity": 1, "fillRule": "evenodd", "lineCap": "round", "lineJoin": "round", "opacity": 1.0, "radius": 5, "stroke": true, "weight": 1 }
        ).addTo(feature_group_sub_group_2e1ffe97ec9542fe9f48f7cae6ad4705);


        L.control.fullscreen(
            { "forceSeparateButton": false, "position": "topleft", "title": "Full Screen", "titleCancel": "Exit Full Screen" }
        ).addTo(maps);


        var locate_control_f09521e8bbca42fb942acd68b0e6e0ba = L.control.locate(
            {}
        ).addTo(maps);



        var layer_control_3e5d6d33082a4322a75fde8b077c283f = {
            base_layers: {
            },
            overlays: {
                "FTAC-Follow": feature_group_de1e890546584228a4117e22deba2c2d,
                "[~65 DBM] - TELKOMSEL - 4G": feature_group_sub_group_573550af91854e0080ed55cf7fe06b23,
                "[~77 DBM] - TELKOMSEL - 4G": feature_group_sub_group_f705240d203b431b9fcdf3da953750f0,
                "[~98 DBM] - TELKOMSEL - 4G": feature_group_sub_group_2e1ffe97ec9542fe9f48f7cae6ad4705,
            },
        };
        L.control.layers(
            layer_control_3e5d6d33082a4322a75fde8b077c283f.base_layers,
            layer_control_3e5d6d33082a4322a75fde8b077c283f.overlays,
            { "autoZIndex": true, "collapsed": true, "position": "topright" }
        ).addTo(maps);


        maps.fitBounds(
            [[-6.295706, 106.987267], [-6.21643, 107.006]],
            {}
        );

        // L.polygon(gisarea, { color: 'red' }).addTo(maps);

        // var centroid = calculateCentroid(gisarea);


    }

    var circle;
    var drawingCircle = false;
    var moved = false;

    // Fungsi untuk menginisialisasi proses gambar lingkaran
    function activateCircleDraw() {
        if (circle) {
            maps.removeLayer(circle);
            circle = null
        }

        if (document.getElementById('dynamicTooltip')) {
            document.getElementById('dynamicTooltip').style.display = "none"
        }
        if (drawingCircle) return;
        drawingCircle = true;
        maps.dragging.disable();
        maps.scrollWheelZoom.disable();
        maps.doubleClickZoom.disable();
        moved = false; // Reset moved flag

        maps.on('mousedown', onMouseDown);
        maps.on('mouseup', onMouseUp);
    }

    // Fungsi yang dijalankan ketika mouse ditekan
    function onMouseDown(e) {
        moved = false; // Reset moved flag
        var startLatLng = e.latlng;
        maps.on('mousemove', onMouseMove);

        // Membuat elemen tooltip jika belum ada
        if (!document.getElementById('dynamicTooltip')) {
            var tooltip = document.createElement('div');
            tooltip.id = 'dynamicTooltip';
            tooltip.style.position = 'absolute';
            tooltip.style.color = "#444";
            tooltip.style.zIndex = "9999";
            tooltip.style.fontSize = "14px";
            tooltip.style.backgroundColor = 'white';
            tooltip.style.padding = '3px 6px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.border = '1px solid #ddd';
            tooltip.style.display = 'none'; // Sembunyikan dulu tooltipnya
            document.body.appendChild(tooltip);
        }

        // Fungsi yang dijalankan ketika mouse bergerak
        function onMouseMove(e) {
            moved = true;

            var radius = startLatLng.distanceTo(e.latlng);
            var radiusInKm = (radius / 1000).toFixed(2);
            if (circle) {
                maps.removeLayer(circle);
            }
            circle = L.circle(startLatLng, { radius: radius }).addTo(maps);

            // Perbarui dan tampilkan tooltip
            if (circle) {
                var tooltip = document.getElementById('dynamicTooltip');
                tooltip.style.display = 'block';
                tooltip.innerHTML = "Radius: " + radiusInKm + " km";
                tooltip.style.left = e.originalEvent.clientX + 15 + 'px'; // Menyesuaikan posisi tooltip
                tooltip.style.top = e.originalEvent.clientY + 15 + 'px';
            }
        }
    }

    function getAreaInfo(lat, lng) {
        var url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data); // Data berisi informasi lokasi, termasuk nama wilayah, kota, dll.
                alert(`Wilayah: ${data.address.suburb}, Kota: ${data.address.city}`);
            })
            .catch(error => console.error('Error:', error));
    }

    // Fungsi yang dijalankan ketika mouse dilepas
    function onMouseUp() {
        if (!moved && circle) {
            maps.removeLayer(circle);
        }
        maps.off('mousemove');
        maps.dragging.enable();
        maps.scrollWheelZoom.enable();
        maps.doubleClickZoom.enable();
        drawingCircle = false;
        // Sembunyikan tooltip
        var tooltip = document.getElementById('dynamicTooltip');
        if (tooltip) tooltip.style.display = 'none';

        if (circle && moved) {
            var radiusInKm = (circle.getRadius() / 1000).toFixed(2);
            circle.bindTooltip("Radius: " + radiusInKm + " km").openTooltip();
        }

        // if (circle && moved) {
        //     var center = circle.getLatLng();
        //     getAreaInfo(center.lat, center.lng);
        // }

        maps.off('mousedown', onMouseDown); // Cleanup
        maps.off('mouseup', onMouseUp); // Cleanup
    }

    createEffect(() => {
        document.addEventListener('mousemove', function (e) {
            if (circle && drawingCircle) {
                var tooltip = document.getElementById('dynamicTooltip');
                if (tooltip.style.display !== 'block') {
                    tooltip.style.display = 'block';
                }
                tooltip.style.left = e.clientX + 15 + 'px';
                tooltip.style.top = e.clientY + 15 + 'px';
            }
        });
    })

    let mapDiv

    onMount(() => buildMap(mapDiv));

    const group = createFormGroup({
        search: createFormControl("", {
            required: true,
        }),
    });


    const [load, setload] = createSignal(false)

    const html = (keyword, res) => {
        function myFunction() {
            // Put whatever code you want to run when the div is clicked here.
            window.api.invoke("new_browser", res.maps)
        }


        return <div class="grid gap-2 relative text-[14px] overflow-auto">
            <div class="flex gap-2">
                <div class="font-bold">MSIDN</div>
                <div>{keyword}</div>
            </div>
            <div class="flex gap-2">
                <div class="font-bold">ALAMAT</div>
                <div>{res.address}</div>
            </div>

            <div class="flex gap-2">
                <div class="font-bold">DEVICE:</div>
                <div>{res.device}</div>
            </div>
            <div class="flex gap-2">
                <div class="font-bold">PROVIDER:</div>
                <div>{res.provider}</div>
            </div>
            <div class="flex gap-2">
                <div class="font-bold">IMEI:</div>
                <div>{res.imei}</div>
            </div>
            <div class="flex gap-2">
                <div class="font-bold">IMSI:</div>
                <div>{res.imsi}</div>
            </div>
            <div class="flex gap-2 cursor-pointer" onClick={myFunction}>
                <div class="font-bold">MAPS:</div>
                <div class=" text-blue-400">{res.maps}</div>
            </div>
        </div>
    }




    const onSubmit = async (e) => {
        e.preventDefault();

        const { search } = group.value;
        setload(true);

        try {
            // Request to check if the target is online
            await axios.get(`http://localhost:8080/target/+${search}`);

            // Listen for a response once to avoid multiple triggers

        } catch (error) {
            if (/^62\d{10,15}$/.test(search)) {
                // Handle invalid number format
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "The number is not found or might be switched off."
                });
            } else {
                // Handle case when the input does not follow the Indonesian country code format
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Invalid number format. Please use the Indonesian country code format (e.g., 6287654321)."
                });
            }

            setload(false);
        }
    };

    createEffect(() => {
        setIsload(false)
        api().get("/checkpos/search").then(d => {
            setData(d.data.items)
            setIsload(true)
        })
        load()
    })

    function moveToLocation(latitude, longitude) {
        var newCenter = L.latLng(latitude, longitude);
        maps.panTo(newCenter);
        setTimeout(() => {
            maps.setView([latitude, longitude], 15);
        }, 500);
    }


    const marker = (data, keyword) => {
        let items = data[0]
        let res = items.response[0]


        L.marker([res.lat, res.long], { icon: greenIcon }).addTo(maps)
            .bindPopup(html(keyword, res))
            .openPopup();

        moveToLocation(res.lat, res.long)

        setTimeout(() => {
            if (items.active) {
                maps.eachLayer(function (layer) {
                    if (!!layer.toGeoJSON) {
                        maps.removeLayer(layer);
                    }
                });
            }
        }, 500);


    }


    return <ContainerPages>
        <div className="flex flex-1 flex-col py-4">
            <CardBox className="grid grid-cols-9 flex-1 gap-4">
                <form onSubmit={onSubmit} className="col-span-3 border-r-2 pr-4 border-primarry-2 flex flex-1 flex-col">
                    <Tags label="CHECK POS MSISDN"></Tags>
                    <DefaultInput loading={load} type={"number"} placeholder={"MSISDN"} control={group.controls.search}></DefaultInput>
                    <div className="relative flex flex-col flex-1">
                        <Tags label="HISTORY CHECK POST "></Tags>
                        <div className='flex flex-col relative flex-1'>
                            <div className="px-4 space-y-4 absolute w-full h-full left-0 top-0 overflow-auto">
                                {items() ? items().length === 0 ? "Data Not Found" : items()?.map((d, i) => {
                                    return <div>
                                        <div className="flex justify-between items-center border pr-2 border-primarry-2">
                                            <div className="flex gap-2">
                                                <Button onClick={() => {

                                                    let x = items().filter(s => d._id === s._id)

                                                    marker(x, d.keyword, d.active)


                                                    setData(a => a.map(s => ({
                                                        ...s,
                                                        active: d._id === s._id && !s.active
                                                    })
                                                    ))

                                                }}
                                                    // endIcon={d.active ? <KeyboardArrowUp></KeyboardArrowUp> : <KeyboardArrowDown fontSize="small"></KeyboardArrowDown>}
                                                    startIcon={<PinDrop></PinDrop>}
                                                >
                                                    {d.keyword}
                                                </Button>
                                            </div>
                                            <div> {moment(d.timestamp).format("D/M/YY | HH:MM:SS")}</div>
                                        </div>
                                        <div className={d.active ? "bg-[#1e1e1e] p-2" : ""}>
                                            <Collapse value={d.active} class="transition">
                                                {d.response.map((d, i) => {
                                                    return <div>
                                                        <Tags label={`CEK POS ${i + 1}x`}></Tags>
                                                        <div className="space-y-2">
                                                            <div className="text-xs grid grid-cols-5 items-center">
                                                                <div>
                                                                    ADDRESS
                                                                </div>
                                                                <div className="col-span-4" title={d.address}>
                                                                    <Chip title={d.address} icon={
                                                                        <IconButton onClick={() => {
                                                                            copyTextToClipboard(d.address)
                                                                        }} size="small"><ContentCopy fontSize="small"></ContentCopy></IconButton>
                                                                    } label={d.address} sx={{
                                                                        borderRadius: 0
                                                                    }} color="secondary"></Chip>
                                                                </div>
                                                            </div>
                                                            <Divider sx={{
                                                                borderColor: "#444"
                                                            }}></Divider>
                                                            <div className="text-xs grid grid-cols-5 items-center">
                                                                <div className="uppercase">
                                                                    network
                                                                </div>
                                                                <div className="col-span-4" title={d.network}>
                                                                    <Chip label={d.network} sx={{
                                                                        borderRadius: 0
                                                                    }} color="secondary"></Chip>
                                                                </div>
                                                            </div>
                                                            <Divider sx={{
                                                                borderColor: "#444"
                                                            }}></Divider>
                                                            <div className="text-xs grid grid-cols-5 items-center">
                                                                <div className="uppercase">
                                                                    lat
                                                                </div>
                                                                <div className="col-span-4" title={d.lat}>
                                                                    <Chip label={d.lat} sx={{
                                                                        borderRadius: 0
                                                                    }} color="secondary"></Chip>
                                                                </div>
                                                            </div>
                                                            <Divider sx={{
                                                                borderColor: "#444"
                                                            }}></Divider>
                                                            <div className="text-xs grid grid-cols-5 items-center">
                                                                <div className="uppercase">
                                                                    long
                                                                </div>
                                                                <div className="col-span-4" title={d.long}>
                                                                    <Chip label={d.long} sx={{
                                                                        borderRadius: 0
                                                                    }} color="secondary"></Chip>
                                                                </div>
                                                            </div>
                                                            <Divider sx={{
                                                                borderColor: "#444"
                                                            }}></Divider>
                                                            <div className="text-xs grid grid-cols-5 items-center">
                                                                <div className="uppercase">
                                                                    maps
                                                                </div>
                                                                <div className="col-span-4">
                                                                    <Chip title={d.maps} icon={
                                                                        <IconButton onClick={() => {
                                                                            copyTextToClipboard(d.maps)
                                                                        }} size="small"><ContentCopy fontSize="small"></ContentCopy></IconButton>
                                                                    } label={
                                                                        <div className="underline text-blue-300 cursor-pointer " onClick={() => {
                                                                            window.api.invoke("new_browser", d.maps)
                                                                        }}>{d.maps}</div>
                                                                    } sx={{
                                                                        borderRadius: 0
                                                                    }} color="secondary"></Chip>
                                                                </div>
                                                            </div>
                                                            <Divider sx={{
                                                                borderColor: "#444"
                                                            }}></Divider>
                                                            <div className="text-xs grid grid-cols-5 items-center">
                                                                <div className="uppercase">
                                                                    device
                                                                </div>
                                                                <div className="col-span-4" title={d.device}>
                                                                    <Chip label={d.device} sx={{
                                                                        borderRadius: 0
                                                                    }} color="secondary"></Chip>
                                                                </div>
                                                            </div>
                                                            <Divider sx={{
                                                                borderColor: "#444"
                                                            }}></Divider>
                                                            <div className="text-xs grid grid-cols-5 items-center">
                                                                <div className="uppercase">
                                                                    imei
                                                                </div>
                                                                <div className="col-span-4" title={d.imei}>
                                                                    <Chip label={d.imei} sx={{
                                                                        borderRadius: 0
                                                                    }} color="secondary"></Chip>
                                                                </div>
                                                            </div>
                                                            <Divider sx={{
                                                                borderColor: "#444"
                                                            }}></Divider>
                                                            <div className="text-xs grid grid-cols-5 items-center">
                                                                <div className="uppercase">
                                                                    imsi
                                                                </div>
                                                                <div className="col-span-4" title={d.imsi}>
                                                                    <Chip label={d.imsi} sx={{
                                                                        borderRadius: 0
                                                                    }} color="secondary"></Chip>
                                                                </div>
                                                            </div>


                                                        </div>
                                                    </div>
                                                })}
                                            </Collapse>
                                        </div>
                                    </div>
                                }) : "Loading..."}
                            </div>
                        </div>

                    </div>
                </form>
                <div className="flex flex-col flex-1 col-span-6">
                    <Tags label="LOCATION SOURCE"></Tags>
                    <CardFrame isLoading={isLoad} title={"MAPS"} className="flex-1 !p-0 flex flex-col">
                        <div className="flex-1">
                            <div className="w-full h-full relative">
                                <div ref={mapDiv} className="w-full h-full"></div>
                                {/* <div className="absolute right-0 top-0 p-4 z-[1000]">
                                    <div className="bg-white p-1">
                                        <Button variant="contained" color="secondary" onClick={activateCircleDraw}>
                                            <svg fill="white" stroke="white" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M760-600v-160H600v-80h240v240h-80ZM120-120v-240h80v160h160v80H120Zm0-320v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 640v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80v80h-80Zm160 0v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Z" /></svg>
                                        </Button>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </CardFrame>
                </div>
            </CardBox>
        </div>
    </ContainerPages>
}

export default DirectTracking