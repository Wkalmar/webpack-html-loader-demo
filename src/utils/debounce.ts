export class Debounce {
    static do = (f: any, ms: number, scope: any) => {

        let isCooldown = false;

        return function () {
            if (isCooldown)
                return;
            f.apply(scope, arguments);
            isCooldown = true;
            setTimeout(() => isCooldown = false, ms);
        };

    }
}
