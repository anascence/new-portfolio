// Everything the page says lives here, so copy edits never touch layout code.

export const person = {
  name: "Nay Htet Kyaw",
  handle: "Anascence",
  email: "nayhtetkyaw.dev@gmail.com",
  resume: "/nayhtetkyaw(resume).pdf",
};

export const links = [
  { label: "GitHub", href: "https://github.com/anascence" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nay-htet-kyaw-0363bb1a3/" },
  { label: "Telegram", href: "https://t.me/nayhtetkyaw" },
  { label: "X", href: "https://x.com/m0usuk0shidake" },
];

export type Excerpt = { file: string; start: number; lines: string[] };

export type Project = {
  name: string;
  kind: string;
  year: string;
  href: string;
  stack: string[];
  blurb: string;
  excerpt: Excerpt;
};

// Excerpts are copied verbatim from each public repository (tabs shown as two spaces).
export const projects: Project[] = [
  {
    name: "Style War",
    kind: "Live coding competition",
    year: "2024",
    href: "https://github.com/stamford-syntax-club/style-war",
    stack: ["Next.js", "TypeScript", "Go", "WebSocket", "Docker"],
    blurb: "Players race to rebuild a design in HTML and CSS while a Go backend streams the clock and saves their code over WebSockets.",
    excerpt: {
      file: "frontend/src/pages/competition.tsx",
      start: 73,
      lines: [
        "const { sendMessage } = useWebSocket(",
        "  `${backendURL.protocol === \"http:\" ? \"ws\" : \"wss\"}://${",
        "    backendURL.host",
        "  }/ws/competition?token=${token}`,",
        "  {",
        "    onMessage: (message) => {",
        "      try {",
        "        const msg = JSON.parse(message.data) as Message;",
        "        setRemainingTime(msg.remainingTime);",
        "      } catch (error) {",
        "        console.warn(\"Failed to parse message:\", error);",
        "      }",
        "    },",
        "    shouldReconnect: () => true,",
      ],
    },
  },
  {
    name: "My Spotify Taste",
    kind: "Listening stats",
    year: "2024",
    href: "https://github.com/anascence/mySpotifyTaste",
    stack: ["Go", "Next.js", "TypeScript", "Spotify API"],
    blurb: "Your top tracks, artists and what's playing right now, served by a small Gin API that speaks Spotify's OAuth so the frontend doesn't have to.",
    excerpt: {
      file: "backend/spotify/handler.go",
      start: 38,
      lines: [
        "// RegisterRoutes registers the Spotify routes",
        "func (h *Handler) RegisterRoutes(r *gin.RouterGroup) {",
        "  spotify := r.Group(\"/spotify\")",
        "  {",
        "    spotify.GET(\"/now-playing\", h.GetCurrentlyPlaying)",
        "    spotify.GET(\"/top-tracks\", h.GetTopTracks)",
        "    spotify.GET(\"/top-artists\", h.GetTopArtists)",
        "    spotify.GET(\"/recently-played\", h.GetRecentlyPlayed)",
        "    spotify.GET(\"/me\", h.GetUserProfile)",
        "  }",
        "}",
      ],
    },
  },
  {
    name: "Course Compose",
    kind: "Course reviews",
    year: "2023",
    href: "https://github.com/stamford-syntax-club/course-compose",
    stack: ["Next.js", "TypeScript", "Go", "PostgreSQL", "Redis", "Kafka", "Docker"],
    blurb: "Anonymous course reviews for Stamford students, moderated before they go live. Go services, a Kafka queue and a Next.js front.",
    excerpt: {
      file: "apps/web/components/ui/review-card.tsx",
      start: 45,
      lines: [
        "// in case the description has no space, break long words",
        "const breakLongWords = (text: string, maxLength = 18) => {",
        "  return text",
        "    .split(\" \")",
        "    .map((word) => {",
        "      if (word.length > maxLength) {",
        "        return word.match(",
        "          new RegExp(\".{1,\" + maxLength + \"}\", \"g\")",
        "        )?.join(\" \") ?? word;",
        "      }",
        "      return word;",
        "    })",
        "    .join(\" \");",
        "};",
      ],
    },
  },
  {
    name: "Stamford Center",
    kind: "Student resources hub",
    year: "2023",
    href: "https://github.com/stamford-syntax-club/stamfordcenter-frontend",
    stack: ["Next.js", "TypeScript", "Redis", "Docker"],
    blurb: "Study plans, documents and every campus contact in one place, so nobody has to dig through five university pages again.",
    excerpt: {
      file: "src/pages/contact_information.tsx",
      start: 88,
      lines: [
        "<Card.Section className=\"mt-4\">",
        "  <Button component=\"a\" href={`mailto:${email}`}>",
        "    Email",
        "  </Button>",
        "  <CopyButton value={email}>",
        "    {({ copied, copy }) => (",
        "      <Button",
        "        color={copied ? \"green\" : \"\"}",
        "        onClick={copy}",
        "      >",
        "        {copied ? \"Copied\" : \"Copy Email Address\"}",
        "      </Button>",
        "    )}",
        "  </CopyButton>",
      ],
    },
  },
  {
    name: "Redis Client",
    kind: "Developer tool",
    year: "2023",
    href: "https://github.com/anascence/redis-client-app",
    stack: ["Next.js", "TypeScript", "Redis"],
    blurb: "A tiny UI for poking at Redis: set a key, read it back, see what broke. Built to learn Redis, kept because it's handy.",
    excerpt: {
      file: "src/pages/api/postform.ts",
      start: 18,
      lines: [
        "export default async function handler(",
        "  req: NextApiRequest,",
        "  res: NextApiResponse<ResponseData>",
        "): Promise<void> {",
        "  await client.connect();",
        "  try {",
        "    const { inputKey, inputValue } = req.body;",
        "    await client.set(inputKey, JSON.stringify(inputValue));",
        "    res.status(200).json({ message: \"It was a success!\" });",
        "    client.quit();",
        "  } catch (error) {",
        "    res.status(500).json({ message: \"It was a failure!\" });",
        "  }",
        "}",
      ],
    },
  },
  {
    name: "CoffeeShop",
    kind: "Ordering site",
    year: "2023",
    href: "https://github.com/anascence/coffeeshop",
    stack: ["PHP", "MySQL", "JavaScript"],
    blurb: "Where it started: a full café site with a menu admin, reservations and orders, in plain PHP and MySQL for a university course.",
    excerpt: {
      file: "admin/menu/menu_insert.php",
      start: 23,
      lines: [
        "if(isset($_POST['submitd'])) {",
        "  // drinks",
        "  $drink_name = $_POST['drink_name'];",
        "  $drink_type = $_POST['drink_type'];",
        "  $speciality_d = $_POST['speciality'];",
        "  $dprice = $_POST['dprice'];",
        "  // file processing",
        "  $image = rand(10000,1000000).\"-\".$_FILES['img']['name'];",
        "  $file_loc = $_FILES['img']['tmp_name'];",
        "  $folder = \"../../home/media/\";",
        "  $final_image = str_replace(' ','-',strtolower($image));",
        "  move_uploaded_file($file_loc,$folder.$final_image);",
        "}",
      ],
    },
  },
];

export const filters = ["All", "Go", "TypeScript", "Redis", "PHP"];

export const journey = [
  { when: "2025 — now", role: "Software Developer", org: "Issa Compass", note: "Internal products, services and chatbots the whole company leans on. Plus the operations glue nobody sees." },
  { when: "Mar — Jun 2025", role: "Software Developer Intern", org: "Issa Compass", note: "Four months on-site. Microservices, real users, and learning how production actually breaks." },
  { when: "2022 — 2025", role: "BSc Information Technology", org: "Stamford International University", note: "Maintainer of the coding club's projects: Course Compose, Stamford Center, Style War." },
  { when: "2019 — 2022", role: "BTEC L5 Software Engineering", org: "Info Myanmar College", note: "Class president. Started by trying to change a wallpaper; ended up writing software." },
];

// The draggable cards: logo file in /public/logos, and one honest line each.
export const tools = [
  { name: "Go", logo: "golang.png", line: "Backends that stay up" },
  { name: "TypeScript", logo: "typescript.png", line: "Types or it didn't happen" },
  { name: "Next.js", logo: "nextjs-white.png", line: "Every frontend here" },
  { name: "PostgreSQL", logo: "postgresql.png", line: "Boring, in the good way" },
  { name: "Docker", logo: "docker.png", line: "Works on every machine" },
  { name: "Redis", logo: "redis.png", line: "Cache first, ask later" },
  { name: "Arch", logo: "arch.png", line: "I use it, by the way" },
  { name: "Vim", logo: "vim.png", line: ":wq is muscle memory" },
];

export const shippingWith = ["golang.png", "typescript.png", "nextjs-white.png", "postgresql.png", "docker.png", "redis.png", "kubernetes.png", "kafka.png"];
