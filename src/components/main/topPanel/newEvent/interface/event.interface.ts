export default interface newEventInterface {
    readonly name: string,
    readonly description: string,
    readonly start: Date,
    readonly end: Date,
    readonly repeatEnds: Date,
    repeatNeverEnds: boolean,
    readonly repeat: string
}