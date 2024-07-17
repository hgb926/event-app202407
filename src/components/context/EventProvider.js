import React, {useState} from 'react';
import EventContext from './event-context';

const EventProvider = ({ children }) => {

    const [totalEventCount, setTotalEventCount] = useState(0);


    return (                // value가 핵심. 구체화를 여기서 진행
        <EventContext.Provider value={{
            totalEventCount: totalEventCount,
            changeTotalEventCount: (count) => setTotalEventCount(count)
        }}
        >
            {children}
        </EventContext.Provider>
    );
};

export default EventProvider;