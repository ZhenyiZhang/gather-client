import React from 'react';
import TopPanel from './topPanel/topPanel';


const Main = (props: any) => {
    return(
        <div>
            <TopPanel AccessToken={props.cookies.get('AccessToken')}/>
            <p>events</p>
        </div>
    )
}

export default Main;