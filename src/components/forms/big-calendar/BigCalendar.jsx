import React from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import './BigCalendar.css'

function BigCalendar( props ) {
  const { onCLickDate } = props

  return (
    <div className="bigCalendar">
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        dateClick={onCLickDate}
        height="100%"
        validRange={{
          start: new Date().toISOString().split("T")[0],
        }}

        headerToolbar={{
          right: "today prev,next", 
          center: "title",
          left: "dayGridMonth,timeGridWeek,timeGridDay" 
        }}
      />
    </div>
  );
}

export default BigCalendar;