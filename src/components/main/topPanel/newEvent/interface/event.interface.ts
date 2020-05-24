export default interface newEventInterface {
    readonly name: string,
    readonly description: string,
    readonly start: Date,
    readonly end: Date,
    readonly repeatEnds: Date,
    readonly repeatNeverEnds: boolean,
    readonly contacts: {
        email: string,
        link: string,
        phone: string,
        location: string
    }
    readonly repeat: string
}