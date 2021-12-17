import { Route } from '../models/route';
import { Station } from '../models/station';
import { Location } from '../models/location';
import { StationsContainer } from './stationsContainer';
import { Distance } from "../utils/distance";
import { ApplicationContext } from '../applicationContext';

declare const window: any;
const L = window.L;
export class RouteDrawer {
    private neglectibleDistance: number = 0.0003;
    private zoom: number = 16;
    private startStation : Station;
    private endStation: Station;

    private isDrawingInProgress : boolean = false;
    private points: [number, number][] = [];
    private hypotheticalRoute: L.Polyline = L.polyline([]);

    private initDrawingIfNeeded = (map: L.Map, point: [number, number]) => {
        if (!this.isDrawingInProgress) {
            this.isDrawingInProgress = true;
            map.setView(point, this.zoom);
        }
    }
    private mapLatLngToExpression = (lat: number, lng: number) : [number, number] => {
        return [lat, lng];
    }

    private submitDrawingIfNeeded = (point : [number, number]) => {
        if (this.points.length > 0) {
            const head = this.points[this.points.length - 1];
            this.isDrawingInProgress =
                new Distance(point, head).euclidean() > this.neglectibleDistance;
        }
    }

    private getClosestStation = (latLngPoint : [number, number]) => {
        return StationsContainer.stations.sort((a,b) => {
            const distanceA = new Distance([a.location.lattitude, a.location.longitude], latLngPoint).euclidean();
            const distanceB = new Distance([b.location.lattitude, b.location.longitude], latLngPoint).euclidean();
            return distanceA - distanceB;
        })[0];
    }

    private transformStateToRoute = () : Route => {
        const route = new Route()
        route.stationStartId = this.startStation.id;
        route.stationEndId = this.endStation.id;
        route.checkpoints = this.points.map(p => {
            const location = new Location();
            location.lattitude = p[0];
            location.longitude = p[1];
            return location;
        });
        return route;
    }

    private drawPointIfNeeded = (map : L.Map, latLngPoint : [number, number]) => {
        if (this.isDrawingInProgress) {
            if (this.points.length === 0) {
                this.startStation = this.getClosestStation(latLngPoint);
            }
            this.points.push(latLngPoint);
            L.polyline(this.points).addTo(map);
            return;
        }
        this.endStation = this.getClosestStation(latLngPoint);
        latLngPoint = [this.endStation.location.lattitude, this.endStation.location.longitude];
        document.dispatchEvent(new CustomEvent('drawingSubmitted', {
            detail: this.transformStateToRoute()
        }));
        this.points = [];
    }

    addPoint = (lat: number, lng: number) => {
        const latLngPoint = this.mapLatLngToExpression(lat, lng);
        this.initDrawingIfNeeded(ApplicationContext.map, latLngPoint);
        this.submitDrawingIfNeeded(latLngPoint);
        this.drawPointIfNeeded(ApplicationContext.map, latLngPoint);
        this.hypotheticalRoute.removeFrom(ApplicationContext.map);
    }

    addHypotheticalPoint = (lat: number, lng: number) => {
        if (this.isDrawingInProgress) {
            const head = this.points[this.points.length - 1];
            const tail = this.mapLatLngToExpression(lat, lng);
            this.hypotheticalRoute.removeFrom(ApplicationContext.map);
            this.hypotheticalRoute = L.polyline([head, tail], {color: 'red'});
            this.hypotheticalRoute.addTo(ApplicationContext.map);
        }
    }

    static drawer = new RouteDrawer();
}