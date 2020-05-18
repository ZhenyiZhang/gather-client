import eventInterface from "../../../../store/interface/Event.interface";
import CalendarEvent from "../interface/calendarEvent.interface";

const EventGenerator = (events: eventInterface[]): CalendarEvent[] => {
    let eventsFullList = [{
        name: '',
        startDate: new Date(),
        endDate: new Date(),
        description: '',
        repeat: '',
        repeatEnds: new Date(),
        repeatNeverEnds: false,
        _id: '',
        Organization: ''
    }];
    events.forEach((event: eventInterface) => {
        /*the case when event is not repeated */
        if(event.repeat === 'None') {
            eventsFullList.push({
                startDate: new Date(event.start),
                endDate: new Date(event.end),
                ...event
            });
        }
        else {
            /*cases when events have repeat end time */
            if(!event.repeatNeverEnds) {
                let dateStartCount = new Date(event.start);
                let dateEndCount = new Date(event.end);
                while (dateStartCount < new Date(event.repeatEnds)) {
                    eventsFullList.push({
                        startDate: new Date(dateStartCount),
                        endDate: new Date(dateEndCount),
                        ...event
                    });
                    switch (event.repeat) {
                        case 'Monthly':
                            dateStartCount.setMonth(dateStartCount.getMonth() + 1);
                            dateEndCount.setMonth(dateEndCount.getMonth() + 1);
                            break;
                        case 'Weekly':
                            dateStartCount.setDate(dateStartCount.getDate() + 7);
                            dateEndCount.setDate(dateEndCount.getDate() + 7);
                            break;
                        case 'Biweekly':
                            dateStartCount.setDate(dateStartCount.getDate() + 14);
                            dateEndCount.setDate(dateEndCount.getDate() + 14);
                            break;
                        case 'Yearly':
                            dateStartCount.setFullYear(dateStartCount.getFullYear() + 1);
                            dateEndCount.setFullYear(dateEndCount.getFullYear() + 1);
                            break;
                        case 'Daily':
                            dateStartCount.setDate(dateStartCount.getDate() + 1);
                            dateEndCount.setDate(dateEndCount.getDate() + 1);
                            break;
                    }
                }
            }
        }
    });
    return eventsFullList;
};

export default EventGenerator;