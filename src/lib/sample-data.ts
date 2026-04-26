export type SampleEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  status: "Open" | "Closed";
};

export const sampleEvents: SampleEvent[] = [
  {
    id: "evt-001",
    title: "Innovation Hack Night",
    date: "Apr 12, 2026",
    time: "6:00 PM - 9:00 PM",
    location: "Engineering Hall, Lab 3",
    organizer: "Tech Club",
    status: "Open",
  },
  {
    id: "evt-002",
    title: "Sustainability Summit",
    date: "Apr 18, 2026",
    time: "10:00 AM - 2:00 PM",
    location: "Auditorium A",
    organizer: "Green Office",
    status: "Open",
  },
  {
    id: "evt-003",
    title: "Cultural Night Showcase",
    date: "Apr 21, 2026",
    time: "7:00 PM - 10:30 PM",
    location: "Student Center Plaza",
    organizer: "Global Society",
    status: "Closed",
  },
  {
    id: "evt-004",
    title: "Career Prep Workshop",
    date: "Apr 25, 2026",
    time: "3:00 PM - 5:00 PM",
    location: "Library Studio",
    organizer: "Career Services",
    status: "Open",
  },
];
