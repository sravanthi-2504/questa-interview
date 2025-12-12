"use client";

import Image from "next/image";

interface DisplayTechIconsProps {
    techs: string[];
}

export default function DisplayTechIcons({ techs }: DisplayTechIconsProps) {
    if (!techs || techs.length === 0) return null;

    const logos = techs.map((tech) => {
        const file = `/logos/${tech.toLowerCase()}.png`;

        return {
            tech,
            url: file,
        };
    });

    return (
        <div className="flex gap-2 items-center">
            {logos.map((logo) => (
                <Image
                    key={logo.tech}
                    src={logo.url || "/logos/default.png"}
                    alt={logo.tech}
                    width={24}
                    height={24}
                    className="rounded"
                    unoptimized
                />
            ))}
        </div>
    );
}
