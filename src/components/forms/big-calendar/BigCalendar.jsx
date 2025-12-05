import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import AxiosInstance from '../../API/AxiosInstance';

import './BigCalendar.css'

function BigCalendar({ onCLickDate }) {
  const [events, setEvents] = useState([]);
  const [currentStart, setCurrentStart] = useState(null);
  const [currentEnd, setCurrentEnd] = useState(null);

  const timeSlots = [
    { label: '7:00 - 8:30 AM', start: '07:00', end: '08:30' },
    { label: '8:30 - 10:00 AM', start: '08:30', end: '10:00' },
    { label: '10:00 - 11:30 AM', start: '10:00', end: '11:30' },
    { label: '1:00 - 2:30 PM', start: '13:00', end: '14:30' },
    { label: '2:30 - 4:00 PM', start: '14:30', end: '16:00' },
  ];

  // Fetch events for the visible month
  const fetchEvents = async (start, end) => {
    try {
      const response = await AxiosInstance.get('/availability/set_unavailability/', {
        params: { start_date: start, end_date: end }
      });

      const fetchedEvents = [];

      response.data.forEach(item => {
      timeSlots.forEach((slot, idx) => {
        // Map idx 0 → 'one', 1 → 'two', etc.
        const suffix = ['one', 'two', 'three', 'four', 'five'][idx];
        const reasonKey = `reason_${suffix}`;
        const slotKey = `slot_${suffix}`;

        if (item[slotKey]) {
          fetchedEvents.push({
            title: item[reasonKey],
            start: `${item.date}T${slot.start}`,
            end: `${item.date}T${slot.end}`,
            color:
              item[reasonKey] === 'Designer not available' ? '#FF9800' :
              item[reasonKey] === 'Scheduled Appointment' ? '#2196F3' :
              item[reasonKey] === 'Scheduled Fitting' ? '#E91E63' : '#999'
          });
        }
      });
    });

      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Failed to fetch unavailability:', error);
    }
  };

  // On initial mount, we fetch the current month
  useEffect(() => {
    if (currentStart && currentEnd) {
      fetchEvents(currentStart, currentEnd);
    }
  }, [currentStart, currentEnd]);

  return (
    <div className="bigCalendar">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={onCLickDate}
        height="100%"
        events={events}
        validRange={{
          start: new Date().toISOString().split("T")[0]
        }}
        headerToolbar={{
          right: "today prev,next",
          center: "title",
          left: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        // Called whenever the visible month/week changes
        datesSet={(arg) => {
          setCurrentStart(arg.startStr);
          setCurrentEnd(arg.endStr);
        }}
      />
    </div>
  );
}

export default BigCalendar;
