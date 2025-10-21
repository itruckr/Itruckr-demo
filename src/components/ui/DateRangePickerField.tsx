import { useState, useRef, useEffect } from "react";
import { Controller, FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { DateRangePicker } from "react-date-range";
import { es } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import clsx from "clsx";

interface DateRangePickerFieldProps {
  control: any;
  name: string;
  label?: string;
  error?: Merge<FieldError, FieldErrorsImpl<{
      startDate: Date;
      endDate: Date;
      key: string;
  }>> | undefined;
}

export const DateRangePickerField: React.FC<DateRangePickerFieldProps> = ({
  control,
  name,
  label = "Select date range",
  error
}) => {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Detectar clic fuera (con click, no mousedown)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative w-full" ref={pickerRef}>
      {label && (
        <label className={
          clsx(
            "text-left text-sm mb-1 block",
            {
              "text-red-600": error,
              "text-gray-700": !error
            }
          )
        }>
          {label}
        </label>
      )}

      <Controller
        control={control}
        name={name}
        defaultValue={null}
        rules={{required: true}}
        render={({ field: { onChange, value } }) => {
          const range = value ?? null;

          const displayValue =
            range?.startDate && range?.endDate
              ? `${range.startDate.toLocaleDateString()} → ${range.endDate.toLocaleDateString()}`
              : "select a range";

          return (
            <>
              <div
                onClick={() => setOpen(!open)}
                className={clsx(
                  "w-full border rounded-lg p-2 cursor-pointer focus:ring-2 focus:outline-none text-left",
                  {
                    "border-red-500": error,
                    "border-gray-300 bg-gray-100": !error,
                  }
                )}
              >
                {displayValue}
              </div>

              {open && (
                <div className="absolute z-20 mt-2">
                  <DateRangePicker
                    ranges={
                      range
                        ? [range]
                        : [
                            {
                              startDate: new Date(),
                              endDate: new Date(),
                              key: "selection",
                            },
                          ]
                    }
                    onChange={(range) => onChange(range["selection"])}
                    moveRangeOnFirstSelection={false}
                    months={1}
                    direction="horizontal"
                    locale={es}
                    rangeColors={["#2563eb"]}
                  />
                </div>
              )}
            </>
          )
        }}
      />
    </div>
  );
};
