// constants/index.ts

// Cover images that really exist in public/covers/
export const interviewCovers = [
    "/covers/adobe.webp",
    "/covers/amazon.webp",
    "/covers/facebook.webp",
    "/covers/hostinger.webp",
    "/covers/pinterest.webp",
    "/covers/quora.webp",
    "/covers/reddit.webp",
    "/covers/skype.webp",
    "/covers/spotify.webp",
    "/covers/telegram.webp",
    "/covers/tiktok.webp",
    "/covers/yahoo.webp",
];

// Tech icon mappings for DisplayTechIcons
export const mappings: Record<string, string> = {
    react: "react",
    javascript: "javascript",
    typescript: "typescript",
    nodejs: "nodejs",
    express: "express",
    mongodb: "mongodb",
    nextjs: "nextjs",
    html: "html5",
    css: "css3",
};

// Main interview list used on homepage
export const interviewList = [
    {
        id: 1,
        title: "Frontend Developer Interview",
        date: "Nov 5 2025",
        score: "---/100",
        description:
            "You haven't taken the interview yet. Take it now to improve your skills.",
        tech: ["React", "TypeScript", "Next.js"],
        cover: "/covers/adobe.png", // ❗use real image from your folder
        type: "Technical",
    },
    {
        id: 2,
        title: "Full Stack Developer Interview",
        date: "Nov 4 2025",
        score: "---/100",
        description:
            "You haven't taken the interview yet. Take it now to improve your skills.",
        tech: ["Node.js", "Express", "MongoDB"],
        cover: "/covers/amazon.png", // ❗use real image
        type: "Mixed",
    },
];
