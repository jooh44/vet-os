'use client';

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ClockWidget() {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!time) {
        return (
            <Card className="h-[160px] flex items-center justify-center shadow-sm">
                <div className="animate-pulse bg-muted h-24 w-24 rounded-full"></div>
            </Card>
        );
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    };

    // Calculate angles
    const secondsRatio = time.getSeconds() / 60;
    const minutesRatio = (secondsRatio + time.getMinutes()) / 60;
    const hoursRatio = (minutesRatio + time.getHours()) / 12;

    const secondHandRotation = secondsRatio * 360;
    const minuteHandRotation = minutesRatio * 360;
    const hourHandRotation = hoursRatio * 360;

    return (
        <Card className="border shadow-sm hover:shadow-md transition-shadow bg-card h-[160px] overflow-hidden relative">
            <CardContent className="flex flex-row items-center justify-between h-full p-6">

                {/* Date / Greeting Area */}
                <div className="flex flex-col max-w-[50%]">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">
                        Hoje
                    </div>
                    <div className="text-lg font-medium font-serif leading-tight text-foreground capitalize">
                        {formatDate(time)}
                    </div>
                </div>

                {/* Minimalist Analog Clock Face */}
                {/* Removed clutter, thin lines */}
                <div className="relative w-28 h-28 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-white/50 dark:bg-zinc-950/50">

                    {/* Dial Markers (12, 3, 6, 9) - Very subtle and thin */}
                    <div className="absolute w-[1px] h-2 bg-zinc-300 top-1 left-1/2 -translate-x-1/2"></div>
                    <div className="absolute w-[1px] h-2 bg-zinc-300 bottom-1 left-1/2 -translate-x-1/2"></div>
                    <div className="absolute w-2 h-[1px] bg-zinc-300 left-1 top-1/2 -translate-y-1/2"></div>
                    <div className="absolute w-2 h-[1px] bg-zinc-300 right-1 top-1/2 -translate-y-1/2"></div>

                    {/* Center Dot */}
                    <div className="absolute w-1.5 h-1.5 bg-zinc-800 dark:bg-zinc-100 rounded-full z-20"></div>

                    {/* Hour Hand */}
                    <div
                        className="absolute w-[2px] h-7 bg-zinc-800 dark:bg-zinc-100 rounded-full origin-bottom z-10"
                        style={{
                            bottom: '50%',
                            left: 'calc(50% - 1px)',
                            transform: `rotate(${hourHandRotation}deg)`
                        }}
                    ></div>

                    {/* Minute Hand */}
                    <div
                        className="absolute w-[1.5px] h-10 bg-zinc-600 dark:bg-zinc-300 rounded-full origin-bottom z-10"
                        style={{
                            bottom: '50%',
                            left: 'calc(50% - 0.75px)',
                            transform: `rotate(${minuteHandRotation}deg)`
                        }}
                    ></div>

                    {/* Second Hand */}
                    <div
                        className="absolute w-[1px] h-11 bg-red-400 rounded-full origin-bottom z-10"
                        style={{
                            bottom: '50%',
                            left: 'calc(50% - 0.5px)',
                            transform: `rotate(${secondHandRotation}deg)`
                        }}
                    ></div>
                </div>

            </CardContent>
        </Card>
    );
}
