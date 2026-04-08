
export const spotifyEmbeds = {
  // Replace PLAYLIST_ID with the ID from your Spotify playlist URL:
  // e.g. open.spotify.com/playlist/37i9dQZF1DX... → "playlist/37i9dQZF1DX..."
  playlist: "playlist/0yYaUe9wrhaFz63L5N9Mce?trackId=1gICl2JIVB6gCaTycjYpjY",
};

export const spotifyProfile = "https://open.spotify.com/user/50qwocbtl68xkis5pyrbv9fg1";

export const profileLinks = {
  spotify:    { name: "Spotify",    url: "https://open.spotify.com/user/50qwocbtl68xkis5pyrbv9fg1", desc: "Playlists & top artists" },
  strava:     { name: "Strava",     url: "https://www.strava.com/athletes/brygarci",                 desc: "Activity log" },
  letterboxd: { name: "Letterboxd", url: "https://letterboxd.com/Joelb99",                          desc: "Film diary" },
  // Replace with your actual Bandcamp profile URL
  bandcamp:   { name: "Bandcamp",   url: "https://bandcamp.com/joelb123",                                    desc: "My music" },
};

export const soccerPhotos = [
  { src: "/images/interests/sports/usc-austin-soccer-sp26_01.jpg", title: "USC Marshall Soccer Club",       caption: "Austin Spring 2026 Tournament" },
  { src: "/images/interests/sports/usc-ucla-soccer-fall25_01.jpg", title: "USC Marshall Soccer Club",       caption: "UCLA Fall 2025 Tournament" },
  { src: "/images/interests/sports/spot-soccer-fall24_01.jpg",     title: "Spot Freight Recreational Team", caption: "CCA Indianapolis Recreational Fall 2024" },
];

export const hikingPhotos = [
  { src: "/images/interests/sports/2019-07-21_aspen_02.jpg",               title: "Aspen, Colorado",                   caption: "July 2021" },
  { src: "/images/interests/sports/2023-06-25_el-salvador_01.jpg",         title: "Gatlinburg, Tennessee",             caption: "September 2021" },
  { src: "/images/interests/sports/2024-09-22_cataract-falls_indiana.jpg", title: "Cataract Falls Indiana State Park", caption: "September 2024" },
  { src: "/images/interests/sports/2024-10-01_eagle-creek_indiana.jpg",    title: "Eagle Creek State Park",            caption: "October 2024" },
  { src: "/images/interests/sports/2025-08-10_arches.jpg",                 title: "Arches National Park",              caption: "August 2025" },
  { src: "/images/interests/sports/2025-08-11_bryce.jpg",                  title: "Bryce Canyon National Park",        caption: "August 2025" },
  { src: "/images/interests/sports/2025-08-12_zion-narrows.jpg",           title: "Zion National Park - The Narrows",  caption: "August 2025" },
  { src: "/images/interests/sports/2025-08-12_zion.jpg",                   title: "Zion National Park",                caption: "August 2025" },
  { src: "/images/interests/sports/2025-11-24_point-dune_sf.jpg",          title: "Point Dune",                        caption: "November 2024" },
  { src: "/images/interests/sports/2026-01-10_la.jpg",                     title: "Los Angeles",                       caption: "January 2026" },
  { src: "/images/interests/sports/2026-02-14_yosemite.jpg",               title: "Yosemite National Park",            caption: "February 2026" },
];

export const climbingPhotos = [
  { src: "/images/interests/sports/2026-02-02_rock-climbing.jpg", title: "Rock Climbing", caption: "February 2026" },
  { src: "/images/interests/sports/2026-03-19_rock-climbing.jpg", title: "Rock Climbing", caption: "March 2026" },
  { src: "/images/interests/sports/2026-03-20_rock-climbing.jpg", title: "Rock Climbing", caption: "March 2026" },
  { src: "/images/interests/sports/2026-03-21_rock_climbing.jpg", title: "Rock Climbing", caption: "March 2026" },
];

// ── Films ──────────────────────────────────────────────────────────────────
// Images live at public/images/interests/film/
export const filmPhotos = [
  { src: "/images/interests/film/monterey-pop.jpg",                           title: "Monterey Pop",                          year: 1968, director: "D.A. Pennebaker",   genre: "Documentary", stats: "Budget: $200K  ·  Box Office: $1.5K  ·  IMDb: 7.9" },
  { src: "/images/interests/film/la-haine.jpg",                               title: "La Haine",                              year: 1995, director: "Mathieu Kassovitz", genre: "Drama",       stats: "Budget: $2.6M  ·  Box Office: $500K  ·  IMDb: 8.1" },
  { src: "/images/interests/film/wall-e.jpg",                                 title: "Wall•E",                                year: 2008, director: "Andrew Stanton",    genre: "Animation",   stats: "Budget: $180M  ·  Box Office: $520M  ·  IMDb: 8.4"  },
  { src: "/images/interests/film/barbarian.jpg",                              title: "Barbarian",                             year: 2001, director: "Zach Cregger",      genre: "Horror",      stats: "Budget: $4.5M  ·  Box Office: $46M  ·  IMDb: 7.0"  },
  { src: "/images/interests/film/eternal-sunshine-of-the-spotless-mind.jpg",  title: "Eternal Sunshine of the Spotless Mind", year: 2004, director: "Michel Gondry",     genre: "Romance",     stats: "Budget: $20M  ·  Box Office: $73M  ·  IMDb: 8.3" },
];

// ── Shows ───────────────────────────────────────────────────────────────────
// Replace these with your actual top 5. Add `src` for a real poster image.
// Replace these with your actual top 5 shows. Add `src` for real poster images.
export const showPhotos = [
  { src: "/images/interests/film/master-of-none.jpg",             title: "Master of None",              year: "2015–2021", network: "Netflix",   genre: "Comedy", stats: "3 Seasons  ·  IMDb: 8.2  ·  25 Episodes" },
  { src: "/images/interests/film/fleabag.jpg",                    title: "Fleabag",                     year: "2016–2019", network: "BBC Three", genre: "Comedy", stats: "2 Seasons  ·  IMDb: 8.7  ·  12 Episodes" },
  { src: "/images/interests/film/severance.jpg",                  title: "Severance",                   year: "2022–",     network: "Apple TV+", genre: "Sci-Fi", stats: "2 Seasons  ·  IMDb: 8.0  ·  25 Episodes" },
  { src: "/images/interests/film/the-haunting-of-hill-house.jpg", title: "The Haunting of Hill House",  year: "2018",      network: "Netflix",   genre: "Horror", stats: "1 Season  ·  IMDb: 8.5  ·  10 Episodes" },
  { src: "/images/interests/film/black-mirror.jpg",               title: "Black Mirror",                year: "2011–",     network: "Netflix",   genre: "Sci-Fi", stats: "7 Seasons  ·  IMDb: 8.7  ·  34 Episodes" },
];

// ── Food & Travel categories ─────────────────────────────────────────────────
// Travel images: drop files into public/images/interests/travel/ and add entries below.
export const foodCategories = [
  {
    name: "Food",
    emoji: "🍜",
    photos: [
      { src: "/images/interests/food/clam-pesto-linguine.JPG",    title: "Clam Pesto Linguine",      caption: "Benso Ristorante Roma" },
      { src: "/images/interests/food/layla_bagels.jpg",           title: "The Pre-Jam",              caption: "Layla Bagels" },
      { src: "/images/interests/food/peach-burrata.JPG",          title: "Peach Burrata",            caption: "Ubuntu Cafe" },
      { src: "/images/interests/food/pistachio_croissant.jpg",    title: "Pistachio Croissant",      caption: "The Joseph" },
      { src: "/images/interests/food/spicy-wonton.JPG",           title: "Spicy Wonton",             caption: "Mr Dragon Noodle House" },
      { src: "/images/interests/food/squid-ink_tonnarelli.JPG",   title: "Squid Ink Tonnarelli",     caption: "North Italia" },
      { src: "/images/interests/food/tteokbokki_pork-buns.JPG",   title: "Tteokbokki & Pork Buns",   caption: "Koreatown, CA" },
      { src: "/images/interests/food/uni.JPG",                    title: "Uni",                      caption: "Long Beach, CA" },
    ],
    kpis: [
      { label: "Go-To Cuisine",   value: "Dumplings" },
      { label: "Go-To Dessert",   value: "Chocolate Chip Cookie" },
      { label: "Morning Ritual",  value: "Iced Americano or Flat White" },
    ],
    note: "I love exploring new restaurants and cuisines - especially when shared with friends and family. I'll always be the one trying something on the menu that i've never had before.",
  },
  {
    name: "Travel",
    emoji: "✈️",
    photos: [
      { src: "/images/interests/travel/colosseum_rome-italy.jpg",                title: "The Colosseum",              caption: "Rome, Italy" },
      { src: "/images/interests/travel/duomo_florence-italy.jpg",                title: "Duomo",                      caption: "Florence, Italy" },
      { src: "/images/interests/travel/venice-italy.jpg",                        title: "Venice",                     caption: "Venice, Italy" },
      { src: "/images/interests/travel/eiffel-tower_paris-france.jpg",           title: "The Eiffel Tower",           caption: "Paris, France" },
      { src: "/images/interests/travel/notre-dame_paris-france.jpg",             title: "Notre-Dame Cathedral",       caption: "Paris, France" },
      { src: "/images/interests/travel/gallery-of-the-maps_vatican-city.jpg",    title: "Gallery of the Maps",        caption: "Vatican City" },
      { src: "/images/interests/travel/st-peters-basilica_vatican-city.jpg",     title: "St. Peter's Basilica",       caption: "Vatican City" },
      { src: "/images/interests/travel/el-sunzal_la-libertad_el_salvador.jpg",   title: "El Sunzal",                  caption: "La Libertad, El Salvador" },
      { src: "/images/interests/travel/golden-gate-bridge_san-francisco-ca.jpg", title: "Golden Gate Bridge",         caption: "San Francisco, CA" },
      { src: "/images/interests/travel/chicago-illinois.jpg",                    title: "Magnificent Mile",           caption: "Chicago, Illinois" },
      { src: "/images/interests/travel/nashville-tn.jpg",                        title: "Broadway",                   caption: "Nashville, Tennessee" },
      { src: "/images/interests/travel/las-vegas_nv.jpg",                        title: "The Strip",                  caption: "Las Vegas, Nevada" },
      { src: "/images/interests/travel/statue-of-abraham_washington-dc.jpg",     title: "Statue of Abraham Lincoln",  caption: "Washington, D.C." },
      { src: "/images/interests/travel/bloomington_in.jpg",                      title: "Kirkwood",                   caption: "Bloomington, Indiana" },
    ],
    kpis: [
      { label: "Countries",      value: "5+" },
      { label: "U.S. States",    value: "15+" },
      { label: "National Parks", value: "6" },
    ],
    note: "I've been fortunate to travel to many incredible places, both domestically and internationally. I love immersing myself in new cultures, trying local foods, exploring the natural landmarks of each destination.",
  },
];

export const musicTags = ["Paul McCartney", "Fender Guitars", "Classic Rock", "Indie", "Vinyl"];
export const sportsTags = ["Liverpool F.C.", "Bouldering", "Hiking", "Trail Running"];

