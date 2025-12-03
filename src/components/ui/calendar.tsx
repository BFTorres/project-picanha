"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            weekStartsOn={1}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",

                head_cell:
                    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",

            }}

            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }