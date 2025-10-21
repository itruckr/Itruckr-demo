import clsx from "clsx";
import { useState, useEffect, useRef } from "react";
import { FieldError } from "react-hook-form";

interface Props {
  label?: string;
  timeInit?: string;
  onChange?: (value: string) => void;
  error?: FieldError | undefined;
}

export default function TimeSelector({ label, timeInit, onChange, error }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(timeInit || "");
  const [filter, setFilter] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setFilter(""); // limpia filtro al cerrar
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generar opciones (cada 30 minutos)
  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = String(h).padStart(2, "0");
      const minute = String(m).padStart(2, "0");
      timeOptions.push(`${hour}:${minute}`);
    }
  }

  // Filtrar opciones según texto ingresado
  const filteredOptions = timeOptions.filter((t) =>
    t.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelect = (t: string) => {
    setSelected(t);
    onChange?.(t);
    setOpen(false);
    setFilter("");
  };

  return (
    <div className="flex flex-col gap-1 w-full" ref={ref}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

      <div
        className={
          clsx(
            "relative border rounded-md bg-gray-100 px-3 py-2 cursor-pointer transition-all",
            {
              "ring-2 ring-blue-400 border-blue-400": open,
              "border-red-600": error,
              "hover:border-gray-400": !open
            }
          )
        }
        onClick={() => setOpen(!open)}
      >
        <span className={`text-gray-900 ${!selected && "text-gray-400"}`}>
          {selected || "Select time"}
        </span>
        <span className="absolute right-3 top-2 text-gray-500 text-sm">🕒</span>

        {open && (
          <div
            className="absolute z-10 mt-2 w-full bg-white border rounded-md shadow-lg max-h-64 overflow-hidden"
            onClick={(e) => e.stopPropagation()} // evitar cerrar al escribir
          >
            <input
              type="text"
              placeholder="Search time..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full border-b px-3 py-2 text-sm outline-none focus:ring-0"
              autoFocus
            />

            <div className="max-h-52 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((t) => (
                  <div
                    key={t}
                    onClick={() => handleSelect(t)}
                    className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${
                      selected === t ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    {t}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-400 text-sm text-center">
                  No hay coincidencias
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
