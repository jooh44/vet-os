'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function CalendarView() {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [selectedDate, setSelectedDate] = React.useState(new Date());

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
        <div className="p-4 bg-white rounded-xl shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-gray-700 capitalize">
                    {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                </span>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 hover:bg-muted">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 hover:bg-muted">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 mb-2">
                {weekDays.map(d => (
                    <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-sm">
                {days.map((day, dayIdx) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isTodayDate = isToday(day);

                    // Deterministic mock for appointments to avoid hydration mismatch
                    // e.g., show dots on even days of the current month
                    const hasAppointments = (day.getDate() % 2 === 0 || day.getDate() % 5 === 0) && isCurrentMonth;

                    return (
                        <div key={day.toString()} className="flex flex-col items-center justify-center p-1 relative">
                            <button
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center transition-colors relative z-10 text-xs",
                                    !isCurrentMonth && "text-gray-300",
                                    isSelected && "bg-primary text-white shadow-md font-bold",
                                    !isSelected && isTodayDate && "text-primary font-bold border border-primary/20",
                                    !isSelected && !isTodayDate && "hover:bg-accent hover:text-accent-foreground",
                                )}
                            >
                                {format(day, dateFormat)}
                            </button>
                            {hasAppointments && !isSelected && (
                                <span className={cn(
                                    "absolute bottom-1 h-1 w-1 rounded-full",
                                    day.getDate() % 5 === 0 ? "bg-red-400" : "bg-primary/60"
                                )} />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-4 border-t border-dashed">
                <p className="text-xs text-muted-foreground text-center">
                    Selecionado: <span className="font-medium text-foreground">{format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}</span>
                </p>
                <Button className="w-full mt-3 text-xs h-8" variant="outline">
                    Ver Agenda Completa
                </Button>
            </div>
        </div>
    );
}
