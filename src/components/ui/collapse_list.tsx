import { ReactNode, useState } from "react";

interface CollapseListProps {
  title: string;
  isOpenInit?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  children?: ReactNode; // contenido opcional
}

export const CollapseList = ({ title, children, isOpenInit = false, isOpen, onToggle }: CollapseListProps) => {
    const [internalOpen, setInternalOpen] = useState(isOpenInit);

    const isControlled = typeof isOpen === "boolean";
    const open = isControlled ? isOpen : internalOpen;

    const handleToggle = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalOpen(!internalOpen);
    }
  };

    return (
        <div className="w-full mx-auto">
        {/* Botón que abre/cierra */}
        <div
          onClick={ handleToggle }
          aria-expanded={open}
          aria-controls="collapseContent"
          className="cursor-pointer flex items-center justify-between min-w-[15rem] py-2 px-4 rounded-md bg-white shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          { title }
          <svg
            width="1.5em"
            height="1.5em"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 stroke-gray-700 dark:stroke-gray-300 transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Contenido */}
        <div
          id="collapseContent"
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            open ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          { children }
        </div>
      </div>
    )
}