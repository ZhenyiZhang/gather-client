export default interface CalendarEvent {
    repeat: string,
    name: string,
    description: string,
    Organization: string,
    startDate: Date,
    endDate: Date,
    repeatEnds: Date,
    repeatNeverEnds: boolean,
    contacts: {
        email: string,
        link: string,
        phone: string,
        location: string
    },
    _id: string
}