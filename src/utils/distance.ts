export class Distance {
    constructor(private point1: [number, number], private point2: [number, number]) {}

    euclidean = () : number => {
        return Math.sqrt(
            Math.pow(this.point1[0] - this.point2[0], 2) + 
            Math.pow(this.point1[1] - this.point2[1] ,2))
    }
}
