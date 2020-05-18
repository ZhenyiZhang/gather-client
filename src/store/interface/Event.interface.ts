export default interface Event{
    repeat: string,
    name: string,
    description: string,
    Organization: string,
    start: Date,
    end: Date,
    repeatEnds: Date,
    repeatNeverEnds: boolean,
    _id: string
};