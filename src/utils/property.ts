export class Property {
    public static get = <T, K extends keyof T>(instance: T, propertyName: K): T[K] => {
        return instance[propertyName]
    }

    public static set = <T, K extends keyof T>(instance: T, propertyName: K, value: T[K]) : T => {
        if (!instance) {
            instance = {} as T;
        }
        instance[propertyName] = value
        return instance;
    }
}
