'use client';

import { Button } from '@/components/ui/button';
import
{
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import
{
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format, isValid, parse } from "date-fns";
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { DayPicker, DropdownProps } from 'react-day-picker';
import { Input } from '../input';
import "./custom-date-picker.css";

type CalendarSystem = 'gregory' | 'hebrew' | 'islamic' | 'iso8601';
type DateFormat = 'yyyy/MM/dd' | 'dd/MM/yyyy' | 'MM/dd/yyyy';

export function CustomSelectDropdown(props: DropdownProps)
{
    const { options = [], value, onChange } = props;

    const handleValueChange = (newValue: string) =>
    {
        if (onChange)
        {
            const syntheticEvent = {
                target: {
                    value: newValue,
                },
            } as React.ChangeEvent<HTMLSelectElement>;

            onChange(syntheticEvent);
        }
    };

    return (
        <Select value={value?.toString()} onValueChange={handleValueChange}>
            <SelectTrigger>
                <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#171717] border-[#575757] max-h-[250px]">
                <SelectGroup>
                    {options?.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                            className="text-[#EDECF8] hover:bg-[#202020]"
                            disabled={option.disabled}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}


interface DatePickerProps
{
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    className?: string;
    disabled?: boolean;
    calendarSystem?: CalendarSystem;
    fromMonth?: Date;
    toMonth?: Date;
    input_date_format?: DateFormat; // Format for date display and parsing
}

export function CustomDatePicker({
    date,
    setDate,
    className,
    disabled = false,
    calendarSystem = 'gregory',
    fromMonth,
    toMonth,
    input_date_format = "MM/dd/yyyy", // Default format
}: DatePickerProps)
{
    const [isOpen, setIsOpen] = React.useState(false);
    const [inputValue, setInputValue] = useState(date ? format(date, input_date_format) : "");

    // Memoize format parts and separators to avoid recalculating on every render
    const { formatParts, separators }: { formatParts: string[], separators: string[] } = React.useMemo(() =>
    {
        const parts = input_date_format.split(/[^A-Za-z]/);
        const seps = input_date_format.match(/[^A-Za-z]/g) || [];
        return { formatParts: parts, separators: seps };
    }, [input_date_format]);

    // Parse the format string to understand structure - at component level
    const formatInfo = React.useMemo(() =>
    {
        const dayPosition = input_date_format.toLowerCase().indexOf('d');
        const monthPosition = input_date_format.toLowerCase().indexOf('m');
        const yearPosition = input_date_format.toLowerCase().indexOf('y');

        // Determine the order of components (day, month, year)
        const positions = [
            { type: 'day', pos: dayPosition, length: (input_date_format.match(/d+/i) || [''])[0].length },
            { type: 'month', pos: monthPosition, length: (input_date_format.match(/m+/i) || [''])[0].length },
            { type: 'year', pos: yearPosition, length: (input_date_format.match(/y+/i) || [''])[0].length }
        ].filter(item => item.pos !== -1)
            .sort((a, b) => a.pos - b.pos);

        // Calculate total expected digits
        const totalExpectedDigits = positions.reduce((sum, part) => sum + part.length, 0);

        return { positions, separators, totalExpectedDigits };
    }, [input_date_format, separators]);


    // Calculate minimum date (13 years ago from today)
    const today = new Date();

    // Set default from/to months if not provided
    const effectiveFromMonth = fromMonth || new Date(today.getFullYear() - 100, 0, 1);
    const effectiveToMonth = toMonth || today;

    // Get current month and year for navigation
    const [currentMonth, setCurrentMonth] = React.useState<number>(
        date ? date.getMonth() : toMonth ? toMonth.getMonth() : today.getMonth()
    );
    const [currentYear, setCurrentYear] = React.useState<number>(
        date ? date.getFullYear() : toMonth ? toMonth.getFullYear() : today.getFullYear()
    );

    // Keep month and year in sync with selected date
    React.useEffect(() =>
    {
        if (date)
        {
            setCurrentMonth(date.getMonth());
            setCurrentYear(date.getFullYear());
            setInputValue(format(date, input_date_format));
        }
    }, [date, input_date_format]);

    const handleSelect = (selectedDate: Date | undefined) =>
    {
        if (selectedDate)
        {
            setDate(selectedDate);
            setInputValue(format(selectedDate, input_date_format));
            setIsOpen(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        let value = e.target.value;

        // Only apply auto-formatting if the format has parts and separators
        if (formatParts.length > 1 && separators.length > 0)
        {
            const cleanValue = value.replace(/[^0-9]/g, ''); // Remove all non-numeric characters
            let formattedValue = '';
            let digitIndex = 0;

            // Build formatted string based on the format parts
            for (let i = 0; i < formatParts.length; i++)
            {
                const part = formatParts[i];
                const partLength = part.length;

                // Add the digits for this part
                for (let j = 0; j < partLength && digitIndex < cleanValue.length; j++)
                {
                    formattedValue += cleanValue[digitIndex++];
                }

                // Add separator if not the last part and we have enough digits
                if (i < separators.length && digitIndex > 0 &&
                    (digitIndex >= partLength || // We've filled this part
                        (i === 0 && cleanValue.length > 1 && formattedValue.length === 2) || // Month part is complete (2 digits)
                        (i === 1 && cleanValue.length > 3 && formattedValue.length === 5)))
                { // Day part is complete (2 digits)
                    formattedValue += separators[i];
                }

                // Stop if we've used all digits
                if (digitIndex >= cleanValue.length) break;
            }

            // If the user's last character was a separator, keep it
            if (value.length > 0 && separators.includes(value[value.length - 1]) &&
                formattedValue.length > 0 && !separators.includes(formattedValue[formattedValue.length - 1]))
            {
                formattedValue += value[value.length - 1];
            }

            // Update the value with our formatted version
            value = formattedValue;
        }

        setInputValue(value);

        if (value === "")
        {
            setDate(undefined);
            return;
        }

        // Extract just the digits from input
        const digits = value.replace(/[^0-9]/g, '');

        // Don't parse if we're in the middle of typing a year
        if (digits.length < formatInfo.totalExpectedDigits)
        {
            setDate(undefined);
            return;
        }

        try
        {
            // If the date looks complete, try to parse it
            const parsedDate = parse(value, input_date_format, new Date());
            if (isValid(parsedDate))
            {
                setDate(parsedDate);
            }
            else
            {
                setInputValue("");
                setDate(undefined);
            }
        }
        catch (error)
        {
            // Invalid format, just keep the input value
            if (value === "")
            {
                setInputValue("");
                setDate(undefined);
            }
        }
    };

    return (
        <div className="w-full relative">
            <div className="flex w-full items-center gap-2">
                <Input
                    id="date-input"
                    name="date-input"
                    type="text"
                    placeholder={input_date_format.toUpperCase()}
                    value={inputValue || ''}
                    onChange={handleInputChange}
                    className="bg-[#202020] border-[#575757] text-sm text-[#EDECF8] placeholder:text-[var(--color-gray-2)] focus:border-[#D78E59] h-10 flex-1"
                />

                <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="bg-[#202020] border-[#575757] h-10 w-10 p-0 flex items-center justify-center min-h-[2.5rem]"
                        >
                        <CalendarIcon className="h-4 w-4 text-[var(--color-gray-2)]" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-primary border-accent" align="end">
                        <DayPicker
                            captionLayout="dropdown"
                            showOutsideDays={true}
                            weekStartsOn={1}
                            autoFocus={true}
                            firstWeekContainsDate={1}
                            mode="single"
                            selected={date}
                            onSelect={handleSelect}
                            month={new Date(currentYear, currentMonth)}
                            onMonthChange={(date) =>
                            {
                                setCurrentMonth(date.getMonth());
                                setCurrentYear(date.getFullYear());
                            }}
                            defaultMonth={date ?? toMonth}
                            startMonth={effectiveFromMonth}
                            endMonth={effectiveToMonth}
                            components={{
                                Dropdown: CustomSelectDropdown,
                            }}
                            classNames={{
                                month: "border-2 border-[var(--color-gray-2)] rounded-md",
                            }}
                            fixedWeeks={true}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}