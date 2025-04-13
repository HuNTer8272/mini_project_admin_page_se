"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/tables/events/data-table";
import { createGenericColumns } from "@/components/tables/events/GenerateColumns";
import TranslateText from "@/components/TranslateText";

// Create columns for slider, events, and upcoming events.
// (If the schema is similar, you can reuse createGenericColumns with different paths)

const eventsColumns = createGenericColumns({
  editPathPrefix: "/dashboard/events/event",
  deleteEndpoint: "/api/event-page-events",
});


export default function Page() {
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch("/api/event-page-events");
      const data = await res.json();
      setEventsData(data);
    };

    fetchEvents();
  }, []);

  return (
    <main className="p-5">
      {/* Events Section */}
      <section id="events" className="mt-10">
        <h2 className="font-semibold ml-7 my-5 font-sans xl:text-xl">
          <TranslateText
            english_text="Events"
            marathi_text="कार्यक्रम"
            hindi_text="इवेंट्स"
            isTitle
          >
            Events
          </TranslateText>
        </h2>
        <DataTable data={eventsData} columns={eventsColumns} href="/dashboard/events/event/" />
      </section>

    </main>
  );
}
