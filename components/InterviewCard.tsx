"use client";

import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { getCoverForId, getCompanyLogo } from "@/lib/utils";

interface Feedback {
    createdAt?: Date;
    totalScore?: number;
    finalAssessment?: string;
}

interface InterviewCardProps {
    interviewId: string;
    userId: string;
    role: string;
    type: string;
    techstack: string[];
    createdAt: string | Date;
    company?: string;
    feedback?: Feedback;
}

const InterviewCard = ({
                           interviewId,
                           role,
                           type,
                           techstack,
                           company = "default",
                           createdAt,
                           feedback,
                       }: InterviewCardProps) => {

    const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
    const formattedDate = dayjs(
        feedback?.createdAt || createdAt || Date.now()
    ).format("MMM D YYYY");

    const cover = getCoverForId(interviewId);
    const companyLogo = getCompanyLogo(company) || "/default-company.png";

    return (
        <div className="card-border w-[360px] max-sm:w-full min-h-96">
            <div className="card-interview p-6">

                {/* INTERVIEW TYPE BADGE */}
                <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
                    <p className="badge-text">{normalizedType}</p>
                </div>

                {/* COMPANY LOGO */}
                <Image
                    src={companyLogo}
                    alt="company logo"
                    width={70}
                    height={70}
                    className="rounded-full object-cover size-[70px] mb-2"
                />

                <h3 className="mt-5 capitalize">{role} Interview</h3>

                {/* DATE & SCORE */}
                <div className="flex flex-row gap-5 mt-3 items-center">
                    <div className="flex flex-row gap-2 items-center">
                        <Image src="/calendar.png" alt="calendar" width={22} height={22} unoptimized />
                        <p>{formattedDate}</p>
                    </div>

                    <div className="flex flex-row gap-2 items-center">
                        <Image src="/star.png" alt="star" width={22} height={22} unoptimized />
                        <p>{feedback?.totalScore || "---"}/100</p>
                    </div>
                </div>

                <p className="line-clamp-2 mt-5">
                    {feedback?.finalAssessment ||
                        "You haven't taken the interview yet. Take it now to improve your skills."}
                </p>
            </div>

            {/* TECH ICONS + BUTTON */}
            <div className="flex flex-row justify-between items-center p-4">
                <DisplayTechIcons techs={techstack || []} />

                <Button className="btn-primary">
                    <Link
                        href={`/interview?role=${encodeURIComponent(role)}
                            &type=${encodeURIComponent(type)}
                            &techstack=${encodeURIComponent(techstack.join(","))}
                            &amount=10
                            &easy=3
                            &medium=4
                            &hard=3
                        `}
                    >
                        Start Interview
                    </Link>

                </Button>
            </div>
        </div>
    );
};

export default InterviewCard;
