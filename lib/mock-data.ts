export type UserRole = "user" | "expert" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
  bio: string
  postsCount: number
  commentsCount: number
  joinedAt: string
}

export interface PostImage {
  id: string
  url: string
  alt: string
}

export interface Comment {
  id: string
  content: string
  user: User
  images: PostImage[]
  createdAt: string
  likes: number
  dislikes: number
}

export interface Post {
  id: string
  title: string
  content: string
  user: User
  images: PostImage[]
  comments: Comment[]
  likes: number
  dislikes: number
  commentsCount: number
  createdAt: string
}

export interface DiseaseResult {
  name: string
  confidence: number
  symptoms: string[]
  prevention: string[]
  cure: string[]
  description: string
}

export const currentUser: User = {
  id: "u1",
  name: "James Mwangi",
  email: "james@farm.co",
  role: "user",
  avatar: "",
  bio: "Tomato farmer from Central Kenya with 5 years of experience. Always looking to learn new disease management techniques.",
  postsCount: 12,
  commentsCount: 34,
  joinedAt: "2025-03-15",
}

export const expertUser: User = {
  id: "u2",
  name: "Dr. Sarah Otieno",
  email: "sarah@agri.edu",
  role: "expert",
  avatar: "",
  bio: "Plant pathologist specializing in solanaceous crop diseases. 10+ years of research in tomato disease management.",
  postsCount: 28,
  commentsCount: 89,
  joinedAt: "2024-11-20",
}

const farmer2: User = {
  id: "u3",
  name: "John Kamau",
  email: "john@farm.co",
  role: "user",
  avatar: "",
  bio: "Smallholder farmer growing tomatoes and peppers.",
  postsCount: 5,
  commentsCount: 18,
  joinedAt: "2025-06-01",
}

const expert2: User = {
  id: "u4",
  name: "Prof. Amina Hassan",
  email: "amina@agri.edu",
  role: "expert",
  avatar: "",
  bio: "Agricultural extension officer with expertise in pest management.",
  postsCount: 15,
  commentsCount: 42,
  joinedAt: "2025-01-10",
}

export const mockPosts: Post[] = [
  {
    id: "p1",
    title: "Yellow spots on my tomato leaves - help!",
    content:
      "I noticed yellow spots appearing on the lower leaves of my tomato plants. They started about a week ago and seem to be spreading to the upper leaves. The spots are circular and some have dark brown centers. Has anyone seen this before? I'm worried it might be some kind of disease.",
    user: farmer2,
    images: [
      { id: "img1", url: "/placeholder-leaf.jpg", alt: "Tomato leaf with yellow spots" },
    ],
    comments: [
      {
        id: "c1",
        content:
          "This looks like it could be Early Blight (Alternaria solani). The concentric ring pattern in the spots is characteristic. I recommend removing affected leaves immediately and applying a copper-based fungicide. Make sure to water at the base of the plant rather than overhead to reduce humidity.",
        user: expertUser,
        images: [],
        createdAt: "2026-02-28T14:30:00Z",
        likes: 12,
        dislikes: 0,
      },
      {
        id: "c2",
        content:
          "I had the same issue last season. Following Dr. Sarah's advice about copper fungicide really helped. Also try mulching around the plants to prevent soil splash.",
        user: currentUser,
        images: [],
        createdAt: "2026-02-28T16:00:00Z",
        likes: 5,
        dislikes: 0,
      },
    ],
    likes: 24,
    dislikes: 1,
    commentsCount: 2,
    createdAt: "2026-02-28T10:00:00Z",
  },
  {
    id: "p2",
    title: "Best practices for preventing Late Blight this season",
    content:
      "As the rainy season approaches, I wanted to share some evidence-based strategies for preventing Late Blight (Phytophthora infestans) in your tomato crops. This disease can devastate entire fields within days if not managed properly.\n\n1. Choose resistant varieties when available\n2. Space plants adequately for air circulation\n3. Apply preventive fungicides before symptoms appear\n4. Remove and destroy infected plant material\n5. Avoid overhead irrigation",
    user: expertUser,
    images: [],
    comments: [
      {
        id: "c3",
        content: "Thank you for sharing this! Very helpful as I'm preparing my field.",
        user: farmer2,
        images: [],
        createdAt: "2026-02-26T09:00:00Z",
        likes: 8,
        dislikes: 0,
      },
    ],
    likes: 45,
    dislikes: 0,
    commentsCount: 1,
    createdAt: "2026-02-25T08:00:00Z",
  },
  {
    id: "p3",
    title: "My tomatoes are curling and wilting",
    content:
      "The leaves on my tomato plants have started curling upward and the whole plant looks wilted even though I've been watering regularly. Some of the leaves have a purple tinge on the underside. Any ideas what might be causing this?",
    user: currentUser,
    images: [
      { id: "img2", url: "/placeholder-leaf.jpg", alt: "Curling tomato leaves" },
      { id: "img3", url: "/placeholder-leaf.jpg", alt: "Purple underside of leaf" },
    ],
    comments: [
      {
        id: "c4",
        content:
          "The curling combined with purple discoloration could indicate Tomato Yellow Leaf Curl Virus (TYLCV), which is transmitted by whiteflies. Check the undersides of leaves for small white insects. If confirmed, infected plants should be removed to prevent spread.",
        user: expert2,
        images: [],
        createdAt: "2026-03-01T11:00:00Z",
        likes: 15,
        dislikes: 0,
      },
    ],
    likes: 18,
    dislikes: 0,
    commentsCount: 1,
    createdAt: "2026-03-01T07:00:00Z",
  },
  {
    id: "p4",
    title: "Organic methods for managing Septoria Leaf Spot",
    content:
      "For farmers who prefer organic methods, here are some effective ways to manage Septoria Leaf Spot:\n\n- Neem oil spray (every 7-10 days)\n- Baking soda solution (1 tbsp per gallon of water)\n- Proper crop rotation (avoid planting tomatoes in the same spot for 2-3 years)\n- Companion planting with basil and marigolds\n- Mulching to prevent soil splash",
    user: expert2,
    images: [],
    comments: [],
    likes: 32,
    dislikes: 2,
    commentsCount: 0,
    createdAt: "2026-02-20T12:00:00Z",
  },
  {
    id: "p5",
    title: "Success story: Recovered my tomato crop from Fusarium Wilt",
    content:
      "I wanted to share my experience recovering from Fusarium Wilt. Last season I almost lost my entire crop, but with expert guidance from this community, I managed to save about 70% of my plants. Here's what I did: soil solarization, used resistant varieties for replanting, applied beneficial fungi (Trichoderma), and improved drainage in my field.",
    user: farmer2,
    images: [],
    comments: [
      {
        id: "c5",
        content: "Great to hear about your recovery! Soil solarization is indeed very effective against soil-borne pathogens.",
        user: expertUser,
        images: [],
        createdAt: "2026-02-22T15:00:00Z",
        likes: 9,
        dislikes: 0,
      },
    ],
    likes: 38,
    dislikes: 0,
    commentsCount: 1,
    createdAt: "2026-02-21T14:00:00Z",
  },
]

export const mockDiseaseResult: DiseaseResult = {
  name: "Early Blight (Alternaria solani)",
  confidence: 94.5,
  symptoms: [
    "Dark brown to black lesions with concentric rings on lower leaves",
    "Lesions often surrounded by yellow halo",
    "Leaves may yellow and drop prematurely",
    "Dark, sunken spots on stems near soil line",
    "Fruit may show dark, leathery spots near stem end",
  ],
  prevention: [
    "Use certified disease-free seed and transplants",
    "Practice crop rotation (3-year cycle)",
    "Maintain adequate plant spacing for air circulation",
    "Apply mulch to reduce soil splash",
    "Water at the base of plants, avoid overhead irrigation",
    "Remove and destroy infected plant debris",
  ],
  cure: [
    "Apply copper-based fungicide (e.g., Bordeaux mixture)",
    "Use chlorothalonil or mancozeb-based fungicides",
    "Remove and destroy severely affected leaves",
    "Apply fungicide every 7-10 days during wet conditions",
    "Consider biological control agents like Bacillus subtilis",
  ],
  description:
    "Early Blight is one of the most common fungal diseases affecting tomatoes worldwide. It is caused by the fungus Alternaria solani and thrives in warm, humid conditions. The disease typically starts on lower, older leaves and progresses upward. While it rarely kills the plant, it can significantly reduce yield and fruit quality if left untreated.",
}

export const diseaseList = [
  { name: "Early Blight", severity: "Moderate", cases: 45 },
  { name: "Late Blight", severity: "High", cases: 28 },
  { name: "Septoria Leaf Spot", severity: "Moderate", cases: 32 },
  { name: "Bacterial Spot", severity: "Low", cases: 15 },
  { name: "Tomato Yellow Leaf Curl", severity: "High", cases: 22 },
  { name: "Fusarium Wilt", severity: "High", cases: 18 },
  { name: "Mosaic Virus", severity: "Moderate", cases: 12 },
]

export const farmerTips = [
  "Water your tomato plants early in the morning to reduce disease risk.",
  "Rotate crops every 2-3 years to break disease cycles.",
  "Inspect leaves regularly for early signs of disease.",
  "Maintain proper spacing between plants for good air circulation.",
  "Use mulch to prevent soil-borne diseases from splashing onto leaves.",
]
