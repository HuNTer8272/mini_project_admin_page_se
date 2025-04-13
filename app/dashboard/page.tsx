"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/tables/events/data-table";
import { createGenericColumns } from "@/components/tables/events/GenerateColumns";
import TranslateText from "@/components/TranslateText";

// Create columns for slider, events, and upcoming events.
// (If the schema is similar, you can reuse createGenericColumns with different paths)
const sliderColumns = createGenericColumns({
  editPathPrefix: "/dashboard/home/slider",
  deleteEndpoint: "/api/home-slider",
});
const eventsColumns = createGenericColumns({
  editPathPrefix: "/dashboard/home/events",
  deleteEndpoint: "/api/home-events",
});
const upcomingColumns = createGenericColumns({
  editPathPrefix: "/dashboard/home/upcoming-events",
  deleteEndpoint: "/api/upcoming-events",
});

export default function Page() {
  const [sliderData, setSliderData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [upcomingData, setUpcomingData] = useState([]);

  useEffect(() => {
    const fetchSliders = async () => {
      const res = await fetch("/api/home-slider");
      const data = await res.json();
      setSliderData(data);
    };

    const fetchEvents = async () => {
      const res = await fetch("/api/home-events");
      const data = await res.json();
      setEventsData(data);
    };

    const fetchUpcoming = async () => {
      const res = await fetch("/api/upcoming-events");
      const data = await res.json();
      setUpcomingData(data);
    };

    fetchSliders();
    fetchEvents();
    fetchUpcoming();
  }, []);

  return (
    <main className="p-5">
      {/* Slider Section */}
      <section id="slider" className="">
        <h2 className="font-semibold ml-7 my-5 font-sans xl:text-xl">
          <TranslateText
            english_text="Slider"
            marathi_text="स्लायडर"
            hindi_text="स्लाइडर"
            isTitle
          >
            Slider
          </TranslateText>
        </h2>
        <DataTable data={sliderData} columns={sliderColumns} href="/dashboard/home/slider/" />
      </section>

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
        <DataTable data={eventsData} columns={eventsColumns} href="/dashboard/home/events/" />
      </section>

      {/* Upcoming Events Section */}
      <section id="upcoming-events" className="mt-10">
        <h2 className="font-semibold ml-7 my-5 font-sans xl:text-xl">
          <TranslateText
            english_text="Upcoming Events"
            marathi_text="आगामी कार्यक्रम"
            hindi_text="आगामी इवेंट्स"
            isTitle
          >
            Upcoming Events
          </TranslateText>
        </h2>
        <DataTable data={upcomingData} columns={upcomingColumns} href="/dashboard/home/upcoming-events/" />
      </section>
    </main>
  );
}
