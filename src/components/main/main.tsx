import React from 'react';
import TopPanel from './topPanel/topPanel';
import EventsPanel from './eventsPanel/eventsPanel';

const Main = (props: any) => {
    return(
        <div>
            <TopPanel AccessToken={props.cookies.get('AccessToken')}/>
            <EventsPanel AccessToken={props.cookies.get('AccessToken')}/>
        </div>
    )
}

export default Main;