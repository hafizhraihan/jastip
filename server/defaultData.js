export const defaultSiteData = {
  hero: {
    appIconUrl: "/assets/jastip-icon.svg",
    appName: "JASTIP",
    tagline: "Pack Smart. Hustle Friends. Make Your Flight.",
    description:
      "The chaotic tabletop-meets-iOS party board game where you race across overseas shops, fulfill absurd friend requests, and squeeze impossible souvenirs into one tiny carry-on grid.",
    availabilityBadge: "Available on Playtest",
    ctaText: "Playtest Now",
    ctaUrl: ""
  },
  hybrid: {
    eyebrow: "Tabletop + iOS Companion",
    title: "Combining Tabletop Chaos & Smart iOS Play",
    description:
      "Keep all the table-talk, bluffing, and card snatching on your physical board—while the iOS companion app powers spatial suitcase physics, live Jastip order markets, and boarding timers.",
    tabletopTitle: "On the Tabletop",
    tabletopPoints: [
      "Tactile destination cards, boarding passes, and custom dice",
      "Real-time haggling, luggage swaps, and friendly sabotage",
      "Fast 25-minute rounds made for game nights & hangouts"
    ],
    iosTitle: "On Your iPhone",
    iosPoints: [
      "Interactive polyomino Packing Grid checks every item's fit",
      "Dynamic Jastip Orders feed with shifting tip bonuses",
      "Shared flight countdown & instant customs score tally"
    ]
  },
  features: [
    {
      id: "feat-packing-grid",
      title: "Packing Grid",
      badge: "Spatial Puzzle",
      description:
        "Rotate, squeeze, and Tetris-pack odd-shaped souvenirs—from fragile ramen bowls to bulky sneaker boxes—into your suitcase grid without breaking weight limits.",
      visualType: "packing-grid",
      imageUrl: ""
    },
    {
      id: "feat-multiplayer",
      title: "Multiplayer",
      badge: "2–6 Players",
      description:
        "Pass-and-play around one iPhone or sync phones at the table. Outbid rival travelers for limited drops and race the boarding gate bell together.",
      visualType: "multiplayer",
      imageUrl: ""
    },
    {
      id: "feat-jastip-orders",
      title: "Jastip Orders",
      badge: "High-Stakes Hustle",
      description:
        "Your group chat never sleeps! Accept wild 'titipan' requests from picky friends—deliver on time for huge tips, or pay heavy embarrassment penalties.",
      visualType: "jastip-orders",
      imageUrl: ""
    }
  ],
  howToPlay: [
    {
      id: "step-1",
      stepNumber: 1,
      title: "Claim Jastip Orders",
      description:
        "Draw friend request cards and inspect live demand on the iOS app. Pick risky high-tip orders or safe pocket-sized snacks.",
      mode: "Tabletop + iOS"
    },
    {
      id: "step-2",
      stepNumber: 2,
      title: "Roll, Shop & Sabotage",
      description:
        "Roll dice across city districts on the physical board to grab souvenirs before rival players snatch the last limited drop.",
      mode: "Tabletop"
    },
    {
      id: "step-3",
      stepNumber: 3,
      title: "Pack Your Grid Fast",
      description:
        "Flip to your iPhone and fit every physical item tile into your 6×6 suitcase grid before the boarding gate timer hits zero.",
      mode: "iOS App"
    },
    {
      id: "step-4",
      stepNumber: 4,
      title: "Clear Customs & Cash In",
      description:
        "Survive random customs inspections, deliver completed Jastip orders, and crown the sharpest traveler at the table!",
      mode: "Tabletop + iOS"
    }
  ],
  previews: [
    {
      id: "prev-packing",
      title: "Suitcase Packing Grid",
      subtitle: "Drag, rotate & snap souvenirs",
      caption:
        "Test your spatial puzzle skills in real time. Tap items to rotate 90° and balance fragile souvenirs before boarding.",
      screenPreset: "packing",
      imageUrl: ""
    },
    {
      id: "prev-orders",
      title: "Live Jastip Orders",
      subtitle: "Urgent friend requests",
      caption:
        "Prioritize viral matcha snacks, limited sneakers, and skincare drops—each with unique grid shapes and tip multipliers.",
      screenPreset: "orders",
      imageUrl: ""
    },
    {
      id: "prev-multiplayer",
      title: "Tabletop Match Sync",
      subtitle: "Seamless party scoring",
      caption:
        "Keep everyone at the physical table synced on turns, boarding gate countdowns, and end-of-trip payouts.",
      screenPreset: "multiplayer",
      imageUrl: ""
    }
  ],
  team: [
    {
      id: "team-1",
      name: "Raka Pratama",
      role: "Game Designer & Co-Creator",
      avatarUrl: "/assets/team-1.svg",
      linkedinUrl: "https://www.linkedin.com"
    },
    {
      id: "team-2",
      name: "Nadia Kusuma",
      role: "Illustrator & Visual Artist",
      avatarUrl: "/assets/team-2.svg",
      linkedinUrl: "https://www.linkedin.com"
    },
    {
      id: "team-3",
      name: "Dimas Wijaya",
      role: "iOS Engineer",
      avatarUrl: "/assets/team-3.svg",
      linkedinUrl: "https://www.linkedin.com"
    },
    {
      id: "team-4",
      name: "Salsa Putri",
      role: "Tabletop Producer & Playtest Lead",
      avatarUrl: "/assets/team-4.svg",
      linkedinUrl: "https://www.linkedin.com"
    }
  ],
  footer: {
    description:
      "A flat, hand-crafted hybrid tabletop and iOS party board game inspired by the chaos of buying souvenirs for everyone back home.",
    exploreLinks: [
      { id: "exp-1", label: "Tabletop + iOS", href: "#hybrid" },
      { id: "exp-2", label: "Game Features", href: "#features" },
      { id: "exp-3", label: "How to Play", href: "#how-to-play" },
      { id: "exp-4", label: "App Preview", href: "#preview" },
      { id: "exp-5", label: "People Behind JASTIP", href: "#team" }
    ],
    contactEmail: "hello@jastipgame.com",
    socialLinks: [
      { id: "soc-1", label: "TestFlight Playtest", url: "#playtest" },
      { id: "soc-2", label: "Instagram @jastipgame", url: "https://instagram.com" },
      { id: "soc-3", label: "Discord Community", url: "https://discord.com" }
    ],
    copyright: "© 2026 JASTIP Board Game. All rights reserved."
  }
};

