import { useEffect, useState } from "react";
import TimePicker from "react-time-picker";

interface Props {
  timeInit: string;
  onChange?: (value: string | null) => void;
}

export default function Time({ timeInit, onChange }: Props) {
  const [time, setTime] = useState<string | null>(timeInit);

  useEffect(() => {
    setTime(timeInit);
  }, [timeInit]);

  const handleChange = (value: string | null) => {
    setTime(value);
    onChange?.(value);
  };

  return (
    <div className="p-2 border rounded-md bg-gray-200 w-full text-center">
        <TimePicker
            className="w-full"
            onChange={handleChange}
            value={time}
            disableClock={true}
            format="HH:mm"
            clearIcon={null}
            clockIcon={null}
        />
    </div>
  );
}

