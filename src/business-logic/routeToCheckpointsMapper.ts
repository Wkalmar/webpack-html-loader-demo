import { Route } from "../models/route";

declare const window: any;
declare const process: any;

export class RouteToCheckPointsMapper {
    constructor(private route : Route) {}

    public static host: string = process.env.STATIONWALK_GRAPHHOPPER_HOST;
    public static defaultKey: string = process.env.STATIONWALK_GRAPHHOPPER_KEY;

    map = async () => {
        let url = `${RouteToCheckPointsMapper.host}/route?`;
        this.route.checkpoints.forEach(p =>
            url += `point=${p.lattitude},${p.longitude}&`);
        url += `vehicle=foot&debug=false&locale=en&points_encoded=false&instructions=true&elevation=false&optimize=false&key=${RouteToCheckPointsMapper.defaultKey}`
        const resp = await fetch(url);
        if (resp.ok) {
            const json = await resp.json();
            const path = json.paths[0];
            return path.points;
        } else {
            throw new Error('failed to fetch from graphhopper');
        }
    }
}

