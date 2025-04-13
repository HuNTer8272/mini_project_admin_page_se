"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/tables/events/data-table";
import { createGenericColumns } from "@/components/tables/events/GenerateColumns";
import TranslateText from "@/components/TranslateText";

// Create columns for slider, events, and upcoming events.
// (If the schema is similar, you can reuse createGenericColumns with different paths)
const sliderColumns = createGenericColumns({
  editPathPrefix: "/dashboard/about/slider",
  deleteEndpoint: "/api/about-slider",
});
const eventsColumns = createGenericColumns({
  editPathPrefix: "/dashboard/about/events",
  deleteEndpoint: "/api/about-events",
});

export default function Page() {
  const [sliderData, setSliderData] = useState([]);
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    const fetchSliders = async () => {
      const res = await fetch("/api/about-slider");
      const data = await res.json();
      setSliderData(data);
    };

    const fetchEvents = async () => {
      const res = await fetch("/api/about-events");
      const data = await res.json();
      setEventsData(data);
    };

 
    fetchSliders();
    fetchEvents();
  }, []);

  return (
    <main className="p-5">
            {/* Events Section */}
            <section id="events" className="">
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
        <DataTable data={eventsData} columns={eventsColumns} href="/dashboard/about/events/" />
      </section>
      {/* Slider Section */}
      <section id="slider" className="mt-10">
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
        <DataTable data={sliderData} columns={sliderColumns} href="/dashboard/about/slider/" />
      </section>



    </main>
  );
}
