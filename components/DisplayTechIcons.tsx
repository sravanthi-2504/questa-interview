"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getTechLogos } from "@/lib/utils";

export default function DisplayTechIcons({ techs }: { techs: string[] | string | undefined }) {
    const [logos, setLogos] = useState<{ tech: string; url: string }[]>([]);

    // Normalize techs into an array safely
    const normalized = Array.isArray(techs)
        ? techs
        : typeof techs === "string"
            ? techs.split(",").map((t) => t.trim())
            : [];

    useEffect(() => {
        setLogos(getTechLogos(normalized));
    }, [normalized]);

    return (
        <div className="flex gap-2 items-center">
            {logos.map((logo) => (
                <Image
                    key={logo.tech}
                    src={logo.url}
                    alt={logo.tech}
                    width={30}
                    height={30}
                />
            ))}
        </div>
    );
}
