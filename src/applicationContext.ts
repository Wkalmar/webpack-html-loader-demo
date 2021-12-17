export class ApplicationContext {
    public static map: L.Map;
    public static displayWelcomeScreen: boolean = true;
    public static alwaysHideWelcomeScreen: boolean = false;
    public static routingLayer: L.GeoJSON<any>;
    public static currentLang: "en" | "ua" = "en";
}