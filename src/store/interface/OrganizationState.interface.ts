import Event from './Event.interface'

export default interface OrganizationStateInterface {
    readonly name: string,
    readonly description: string,
    readonly organizationName: string,
    readonly share: boolean,
    readonly events: Event[],
    readonly _id: string,
}