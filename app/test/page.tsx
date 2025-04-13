import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { DataTable as Table } from "@/components/dashboard/data-table";
import { SectionCards } from "@/components/dashboard/section-cards";
import data from "@/app/dashboard/data.json";
import { Skeleton } from "@/components/ui/skeleton";
// import { DataTable } from "@/components/tables/events/data-table";
// import { columns } from "@/components/tables/events/columns";

export default function page() {
  // const sampleData = [
  //   {
  //     id: 1,
  //     marathi_title: "पहिले कार्यक्रम",
  //     english_title: "First Event",
  //     imageUrl: "https://i.redd.it/ym2hz44x7bie1.jpeg",
  //   },
  //   {
  //     id: 2,
  //     marathi_title: "दुसरे कार्यक्रम",
  //     english_title: "Second Event",
  //     imageUrl: "https://static.wikia.nocookie.net/marvel-rivals/images/5/55/Spider-Man_Spider-Man_No_Way_Home_LoC_Icon.png/revision/latest/scale-to-width-down/250?cb=20241230010359",
  //   },
  //   {
  //     id: 3,
  //     marathi_title: "तिसरे कार्यक्रम",
  //     english_title: "Third Event",
  //     imageUrl: "https://i.pinimg.com/736x/3d/0f/b3/3d0fb3253a55c723f95ad3261382b8ad.jpg",
  //   },
  //   // Add more sample events as needed
  // ];

  return (
   <main>
    <Skeleton className="w-32 h-2 bg-primary-foreground rounded-lg"/>
    <Skeleton className="w-64 h-2 bg-primary-foreground rounded-lg"/>
    <Skeleton className="w-60 h-2 bg-primary-foreground rounded-lg"/>
    <Skeleton className="w-6 h-2 bg-primary-foreground rounded-lg"/>
   <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <Table data={data} />
              {/* <DataTable data={sampleData} columns={columns} /> */}
            </div>
          </div>
        </div>
        <section id="slider" className="min-h-screen bg-violet-500">

        </section>
        <section id="content" className="min-h-screen bg-red-500">

        </section>
        <section id="upcoming_events" className="min-h-screen bg-blue-400">

        </section>
        <section id="events" className="min-h-screen bg-pink-400">

        </section>
   </main>
  )
}
