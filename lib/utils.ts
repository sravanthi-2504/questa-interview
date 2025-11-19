import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ----------------------------
// ✅ GET TECH LOGOS
// ----------------------------
export function getTechLogos(techs: string[] | string | undefined) {
    if (!techs) return [];

    const techArray = Array.isArray(techs)
        ? techs
        : techs.split(",").map(t => t.trim().toLowerCase());

    const logos: Record<string, string> = {
        react: "/logos/react.png",
        "next.js": "/logos/nextjs.png",
        nextjs: "/logos/nextjs.png",
        typescript: "/logos/typescript.png",
        javascript: "/logos/javascript.png",
        node: "/logos/node.png",
        "node.js": "/logos/node.png",
        express: "/logos/express.png",
        mongodb: "/logos/mongodb.png",
        tailwind: "/logos/tailwind.png",
        html: "/logos/html.png",
        css: "/logos/css.png",
        java: "/logos/java.png",
        python: "/logos/python.png",
    };

    return techArray.map((tech) => ({
        tech,
        url: logos[tech] || "/logos/default-tech.png",
    }));
}

// ----------------------------
// ✅ GET COVER IMAGES (companies)
// ----------------------------
export function getCoverForId(id: string | number) {
    const covers: Record<string, string> = {
        "1": "/covers/frontend.png",
        "2": "/covers/fullstack.png",
        "3": "/covers/backend.png",
        adobe: "/covers/adobe.png",
        amazon: "/covers/amazon.png",
        pinterest: "/covers/pinterest.png",
        facebook: "/covers/facebook.png",
    };

    return covers[id] || "/covers/default.png";
}
