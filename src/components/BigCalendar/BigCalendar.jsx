import React from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import '../styles/BigCalendar.css'

function BigCalendar() {
  const handleDateClick = (arg) => {
    alert(`You clicked on date: ${arg.dateStr}`);
    // You can also use arg.date (JS Date object) if you prefer
    // Perform your action here (e.g., open a modal, navigate, etc.)
  };

  return (
    <div className="bigCalendar">
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        dateClick={handleDateClick}
        // height="600px" // Fixed height
        height="auto" // Let it adjust to content
        // height="100%" // Fill parent container height

        headerToolbar={{
          right: "today prev,next", // will normally be on the left. if RTL, will be on the right
          center: "title",
          left: "dayGridMonth,timeGridWeek,timeGridDay" 
        //   end: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the right. if RTL, will be on the left
        }}
      />
    </div>
  );
}

export default BigCalendar;