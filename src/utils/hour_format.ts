import { DateTime } from "luxon";

export default function toInputTime(value: string): string {
    if (!value) return "";

    // Caso 1: formato con fecha completa ISO
    if (value.includes("T")) {
        return DateTime.fromISO(value).toFormat("HH:mm");
    }

    // Caso 2: formato 24h ya válido ("07:00" o "7:00")
    if (/^\d{1,2}:\d{2}$/.test(value)) {
        const [h, m] = value.split(":");
        return `${h?.padStart(2, "0")}:${m}`;
    }


    // Caso 3: formato con MM/dd hh:mma (ej: "10/01 11:59PM")
    if (value.includes("/")) {
    return DateTime.fromFormat(value, "MM/dd hh:mma").toFormat("HH:mm");
    }

    // Caso 4: solo hora con AM/PM (ej: "07:00AM")
    return DateTime.fromFormat(value, "hh:mma").toFormat("HH:mm");
}
