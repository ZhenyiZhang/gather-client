export default interface Event{
    repeat: string,
    name: string,
    description: string,
    Organization: string,
    start: Date,
    end: Date,
    repeatEnds: Date,
    repeatNeverEnds: boolean,
    repeatExceptions? : Date[],
     contacts: {
        email: string,
        link: string,
        phone: string,
        location: string
    },
    _id: string
};