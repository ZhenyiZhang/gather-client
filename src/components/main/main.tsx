import React from 'react';
import TopPanel from './topPanel/topPanel';
import EventsPanel from './eventsPanel/eventsPanel';


const Main = (props: any) => {
    return(
        props.shared ?
            <div>
                <TopPanel cookies={props.cookies}/>
                <EventsPanel AccessToken={props.cookies.get('AccessToken')}/>
            </div>:
        (<div>
            <TopPanel cookies={props.cookies}/>
            <EventsPanel AccessToken={props.cookies.get('AccessToken')}/>
        </div>)
    )
};

export default Main;