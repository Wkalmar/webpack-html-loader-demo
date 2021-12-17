import { Station } from "../models/station";
import { StationsContainer } from "./stationsContainer";
import { ApplicationContext } from "../applicationContext";

declare const window: any;
const L = window.L;

export class StationMarkerDrawer {
    draw = () => {
        const markers: L.LatLngExpression[] = [];
        StationsContainer.stations.forEach((station: Station) => {
            const latLngExpression: L.LatLngExpression = [station.location.lattitude, station.location.longitude]
            new L.Marker(latLngExpression, {
                icon: L.icon({
                    iconUrl: `../assets/${station.branch.toLowerCase()}.png`
                }),
                title: station.name
            }).addTo(ApplicationContext.map);
            markers.push(latLngExpression);
        })
        const bounds = L.latLngBounds(markers);
        ApplicationContext.map.fitBounds(bounds)
    }
}