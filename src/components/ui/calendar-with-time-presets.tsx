import { cn } from "@/lib/utils";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export interface CalendarWithTimePresetsProps {
  defaultDate?: Date;
  startHour?: number; // 24h
  endHour?: number; // 24h
  intervalMinutes?: number; // e.g., 15
  bookedDates?: Date[];
  onContinue?: (payload: { date: Date; time: string }) => void;
  className?: string;
}

export function CalendarWithTimePresets({
  defaultDate = new Date(),
  startHour = 9,
  endHour = 18,
  intervalMinutes = 15,
  bookedDates = [],
  onContinue,
  className,
}: CalendarWithTimePresetsProps) {
  const [date, setDate] = React.useState<Date | undefined>(defaultDate);
  const todayStart = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const timeSlots = React.useMemo(() => {
    const slots: string[] = [];
    const total = ((endHour - startHour) * 60) / intervalMinutes + 1;
    for (let i = 0; i < total; i++) {
      const totalMinutes = i * intervalMinutes;
      const hour = Math.floor(totalMinutes / 60) + startHour;
      const minute = totalMinutes % 60;
      slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
    }
    return slots;
  }, [startHour, endHour, intervalMinutes]);

  // Filter out past times for the selected day; keep all times for future days
  const filteredTimeSlots = React.useMemo(() => {
    if (!date) return [] as string[];
    const now = new Date();
    const d = new Date(date);
    const isSameDay = d.toDateString() === now.toDateString();
    if (!isSameDay) return timeSlots;
    return timeSlots.filter((t) => {
      const [h, m] = t.split(":").map((x) => parseInt(x, 10));
      const slot = new Date(d);
      slot.setHours(h, m, 0, 0);
      return slot.getTime() > now.getTime();
    });
  }, [date, timeSlots]);

  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

  // Ensure a valid selected time for the chosen day
  React.useEffect(() => {
    if (!filteredTimeSlots.length) {
      setSelectedTime(null);
      return;
    }
    if (!selectedTime || !filteredTimeSlots.includes(selectedTime)) {
      setSelectedTime(filteredTimeSlots[0]);
    }
  }, [filteredTimeSlots]);

  return (
    <Card className={cn("gap-0 p-0", className)}>
      <CardContent className="relative p-0 md:pr-48">
        <div className="p-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
            disabled={[{ before: todayStart }, ...bookedDates]}
            showOutsideDays={false}
            modifiers={{ booked: bookedDates, past: { before: todayStart } }}
            modifiersClassNames={{ booked: "line-through opacity-100", past: "line-through opacity-60" } as any}
            className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            formatters={{
              formatWeekdayName: (d) => d.toLocaleString("en-US", { weekday: "short" }),
            }}
          />
        </div>
        <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
          <div className="grid gap-2">
            {filteredTimeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => setSelectedTime(time)}
                className="w-full shadow-none"
              >
                {time}
              </Button>
            ))}
            {filteredTimeSlots.length === 0 && (
              <div className="text-xs text-muted-foreground text-center py-2">
                No slots available today. Choose another date.
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
        <div className="text-sm">
          {date && selectedTime ? (
            <>
              Your darshan is set for
              <span className="font-medium"> {date?.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })} </span>
              at <span className="font-medium">{selectedTime}</span>.
            </>
          ) : (
            <>Select a date and time for darshan.</>
          )}
        </div>
        <Button
          disabled={!date || !selectedTime}
          className="w-full md:ml-auto md:w-auto"
          variant="outline"
          onClick={() => {
            if (date && selectedTime) onContinue?.({ date, time: selectedTime });
          }}
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CalendarWithTimePresets;
