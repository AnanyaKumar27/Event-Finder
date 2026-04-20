import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Controls from "./components/Controls";
import EventGrid from "./components/EventGrid";
import Loading from "./components/Loading";

const LOCATIONS = [
  "Mumbai, India", "Delhi, India", "Bengaluru, India", "Chennai, India",
  "Hyderabad, India", "Kolkata, India", "Pune, India", "Ahmedabad, India",
];

const CATEGORIES = [
  "Education", "Environment", "Food", "Women"
];

// Titles + Descriptions mapped by category (STRICT MATCH)
const EVENT_CONTENT = {
  Education: [
    {
      title: "Free Education Drive",
      description: "Join us in providing learning opportunities to underprivileged children."
    },
    {
      title: "Youth Skill Development",
      description: "Help students build practical skills for a brighter future."
    }
  ],
  Environment: [
    {
      title: "Tree Plantation Campaign",
      description: "Be a part of making our planet greener and healthier."
    },
    {
      title: "Clean City Initiative",
      description: "Work together to keep our surroundings clean and sustainable."
    }
  ],
  Food: [
    {
      title: "Food Distribution Drive",
      description: "Volunteer to distribute meals to those in need."
    },
    {
      title: "Hunger Relief Program",
      description: "Support efforts to fight hunger in local communities."
    }
  ],
  Women: [
    {
      title: "Women Empowerment Workshop",
      description: "Empower women through education and skill-building programs."
    },
    {
      title: "Women Health & Awareness Camp",
      description: "Promote health awareness and wellness among women."
    }
  ]
};

// Shuffle helper
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [registered, setRegistered] = useState(() => {
    const saved = localStorage.getItem("registeredEvents");
    return saved ? JSON.parse(saved) : {};
  });

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(res => res.json())
      .then(data => {
        const posts = data.slice(0, 24);

        const shuffledLocations = shuffle(LOCATIONS);
        const shuffledCategories = shuffle(CATEGORIES);

        const usedPerLocation = {};

        const mapped = posts.map((post, index) => {
          const baseDate = new Date();
          baseDate.setDate(baseDate.getDate() + (index % 15));

          const formattedDate = baseDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          const location = shuffledLocations[index % shuffledLocations.length];
          const category = shuffledCategories[index % shuffledCategories.length];

          if (!usedPerLocation[location]) {
            usedPerLocation[location] = new Set();
          }

          const contentList = EVENT_CONTENT[category];

          let selected = null;
          for (let item of contentList) {
            if (!usedPerLocation[location].has(item.title)) {
              selected = item;
              usedPerLocation[location].add(item.title);
              break;
            }
          }

          if (!selected) {
            selected = contentList[index % contentList.length];
          }

          return {
            id: post.id,
            title: `${selected.title} ${index + 1}`,
            description: selected.description,
            date: formattedDate,
            rawDate: baseDate,
            location: location,
            category: category,
          };
        });

        setEvents(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem("registeredEvents", JSON.stringify(registered));
  }, [registered]);

  function handleRegister(id) {
    setRegistered((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  const today = new Date();

  const filtered = events.filter((e) => {
    const text = searchText.toLowerCase();

    return (
      (
        e.title.toLowerCase().includes(text) ||
        e.location.toLowerCase().includes(text) ||
        e.category.toLowerCase().includes(text)
      ) &&
      (
        activeCategory === "All" ||
        e.category === activeCategory
      ) &&
      (
        filter === "All" ||
        (filter === "Upcoming" && e.rawDate >= today) ||
        (filter === "Past" && e.rawDate < today) ||
        (filter === "Registered" && registered[e.id])
      )
    );
  });

  const totalRegistered = Object.values(registered).filter(Boolean).length;

  return (
    <>
      <Header totalRegistered={totalRegistered} />
      <Hero />

      <Controls
        searchText={searchText}
        setSearchText={setSearchText}
        filter={filter}
        setFilter={setFilter}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={CATEGORIES}
      />

      {loading ? (
        <Loading />
      ) : (
        <EventGrid
          events={filtered}
          registered={registered}
          handleRegister={handleRegister}
        />
      )}
    </>
  );
}
