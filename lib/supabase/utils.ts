import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility to merge classnames
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/* ---------------------------
   TECH LOGO UTILS
---------------------------- */

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
    const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
    return mappings[key as keyof typeof mappings];
};

const checkIconExists = async (url: string) => {
    try {
        const response = await fetch(url, { method: "HEAD" });
        return response.ok;
    } catch {
        return false;
    }
};

export const getTechLogos = async (techArray: string[] = []) => {
    const logoURLs = techArray.map((tech) => {
        const normalized = normalizeTechName(tech);
        return {
            tech,
            url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
        };
    });

    const results = await Promise.all(
        logoURLs.map(async ({ tech, url }) => ({
            tech,
            url: (await checkIconExists(url)) ? url : "/tech.svg",
        }))
    );

    return results;
};

/* ---------------------------
   INTERVIEW COVER UTILS
---------------------------- */

// Deterministic hash function (same on server + client)
function hashString(str: string) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return Math.abs(hash);
}

// Returns a stable cover for any interview ID
export function getCoverForId(id: string | number | undefined) {
    if (!id) return interviewCovers[0];
    const hash = hashString(String(id));
    const index = hash % interviewCovers.length;
    return interviewCovers[index];
}
