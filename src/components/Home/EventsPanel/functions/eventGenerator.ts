import eventInterface from "../../../../store/interface/Event.interface";
import CalendarEvent from "../interface/calendarEvent.interface";

/*check if event is excluded from specific date*/
const confirmExceptions = (dateToConfirm: Date, exceptions: Date[]):boolean => {
    let result = false;
    exceptions.forEach(date => {
        if ((new Date(date).getDate() === new Date(dateToConfirm).getDate())
            &&(new Date(date).getFullYear() === new Date(dateToConfirm).getFullYear())
            &&(new Date(date).getMonth() === new Date(dateToConfirm).getMonth())) {
            result =  true;
        }
    });
    return result;
};

/*generate all events in a given time range*/
const EventsGenerator = (events: eventInterface[], rangeStart: Date, rangeEnd: Date): CalendarEvent[] => {
    let eventsFullList = [{} as CalendarEvent];
    /*iterate through each event*/
    events.forEach((event: eventInterface) => {
        /*event is not repeated */
        if(event.repeat === 'None') {
            eventsFullList.push({
                startDate: new Date(event.start),
                endDate: new Date(event.end),
                ...event
            });
        }
        /*events that are repeated but not permanently*/
        if (!event.repeatNeverEnds && event.repeat !== 'None'){
            let dateStartCount = new Date(event.start);
            let dateEndCount = new Date(event.end);
            /*generate specific events time for repeated events in the calendar time range*/
            while (dateStartCount < new Date(event.repeatEnds)) {
                if(event.repeatExceptions) {
                    /*push event to list if is not excluded*/
                    if(!(confirmExceptions(dateStartCount, event.repeatExceptions))) {
                        eventsFullList.push({
                            startDate: new Date(dateStartCount),
                            endDate: new Date(dateEndCount),
                            ...event
                        });
                    }
                }
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
        /*events never ends*/
        if (event.repeatNeverEnds){
            /*event start time is out of time range*/
            if(new Date(event.start) > rangeEnd) return;
            let eventStartCount = new Date(event.start);
            let eventEndCount = new Date(event.end);
            if(event.repeat === 'Monthly') {
                while (eventStartCount < rangeStart) {
                    eventStartCount.setMonth(eventStartCount.getMonth() + 1);
                    eventEndCount.setMonth(eventEndCount.getMonth() + 1);
                }
                while (eventEndCount < rangeEnd && eventStartCount > rangeStart) {
                    if(event.repeatExceptions) {
                        if(!confirmExceptions(eventStartCount, event.repeatExceptions)) {
                            eventsFullList.push({
                                startDate: new Date(eventStartCount),
                                endDate: new Date(eventEndCount),
                                ...event
                            });
                        }
                    }
                    eventStartCount.setMonth(eventStartCount.getMonth() + 1);
                    eventEndCount.setMonth(eventEndCount.getMonth() + 1);
                }
            }
            if(event.repeat === 'Weekly') {
                while (eventStartCount < rangeStart) {
                    eventStartCount.setDate(eventStartCount.getDate() + 7);
                    eventEndCount.setDate(eventEndCount.getDate() + 7);
                }
                while (eventEndCount < rangeEnd && eventStartCount > rangeStart) {
                    if(event.repeatExceptions) {
                        if(!confirmExceptions(eventStartCount, event.repeatExceptions)) {
                            eventsFullList.push({
                                startDate: new Date(eventStartCount),
                                endDate: new Date(eventEndCount),
                                ...event
                            });
                        }
                    }
                    eventStartCount.setDate(eventStartCount.getDate() + 7);
                    eventEndCount.setDate(eventEndCount.getDate() + 7);
                }
            }
            if(event.repeat === 'Yearly') {
                while (eventStartCount < rangeStart) {
                    eventStartCount.setFullYear(eventStartCount.getFullYear() + 1);
                    eventEndCount.setFullYear(eventEndCount.getFullYear() + 1);
                }
                while (eventEndCount < rangeEnd && eventStartCount > rangeStart) {
                    if(event.repeatExceptions) {
                        if(!confirmExceptions(eventStartCount, event.repeatExceptions)) {
                            eventsFullList.push({
                                startDate: new Date(eventStartCount),
                                endDate: new Date(eventEndCount),
                                ...event
                            });
                        }
                    }
                    eventStartCount.setFullYear(eventStartCount.getFullYear() + 1);
                    eventEndCount.setFullYear(eventEndCount.getFullYear() + 1);
                }
            }
            if(event.repeat === 'Biweekly') {
                while (eventStartCount < rangeStart) {
                    eventStartCount.setDate(eventStartCount.getDate() + 14);
                    eventEndCount.setDate(eventEndCount.getDate() + 14);
                }
                while (eventEndCount < rangeEnd && eventStartCount > rangeStart) {
                    if(event.repeatExceptions) {
                        if(!confirmExceptions(eventStartCount, event.repeatExceptions)) {
                            eventsFullList.push({
                                startDate: new Date(eventStartCount),
                                endDate: new Date(eventEndCount),
                                ...event
                            });
                        }
                    }
                    eventStartCount.setDate(eventStartCount.getDate() + 14);
                    eventEndCount.setDate(eventEndCount.getDate() + 14);
                }
            }
            if(event.repeat === 'Daily') {
                while (eventStartCount < rangeStart) {
                    eventStartCount.setDate(eventStartCount.getDate() + 1);
                    eventEndCount.setDate(eventEndCount.getDate() + 1);
                }
                while (eventEndCount < rangeEnd && eventStartCount > rangeStart) {
                    if(event.repeatExceptions) {
                        if(!confirmExceptions(eventStartCount, event.repeatExceptions)) {
                            eventsFullList.push({
                                startDate: new Date(eventStartCount),
                                endDate: new Date(eventEndCount),
                                ...event
                            });
                        }
                    }
                    eventStartCount.setDate(eventStartCount.getDate() + 1);
                    eventEndCount.setDate(eventEndCount.getDate() + 1);
                }
            }
        }
    });
    eventsFullList.shift();
    return eventsFullList;
};

export default EventsGenerator;