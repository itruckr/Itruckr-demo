import Logo from "@/components/Logo";
import { useState } from "react";

import SignUpInformation from "./sign-up-information/SignUpInformation";
import SignUpData from "./sign-up-data/SignUpData";
import SignUpUploadDocuments from "./sign-up-upload-documents/SignUpUploadDocuments";
import SignUpUploadDocumentsTruck from "./sign-up-upload-documents-truck/SignUpUploadDocumentsTruck";
import SignUpConfirmationComponent from "./sign-up-confirmation/SignUpConfirmation";

export default function RegisterPage() {
  const [page, setPage] = useState(1);

  // Definimos los pasos en orden
  const steps = [
    <SignUpInformation key="step1" />,
    <SignUpData key="step2" />,
    <SignUpUploadDocuments key="step3" />,
    <SignUpUploadDocumentsTruck key="step4" />,
    <SignUpConfirmationComponent key="step5" />,
  ];

  const next = () => setPage((prev) => (prev < steps.length ? prev + 1 : prev));
  const prev = () => setPage((prev) => (prev > 1 ? prev - 1 : prev));

  return (
    <div className="min-h-screen bg-gradient-to-br from-absolute-black via-absolute-black to-green-accent flex items-center justify-center p-4">
      <div className="flex flex-col items-center w-full">
        {/* Logo lateral */}
        <div className="hidden lg:block bg-pattern overflow-hidden">
          <Logo height={25} width={250} isComplete />
        </div>

        <div className="w-full bg-pattern flex flex-col items-center">
          {/* Encabezado de progreso */}
          <div className="flex my-2 justify-end w-full max-w-md">
            <span className="text-white underline font-semibold">
              {page}/{steps.length}
            </span>
          </div>

          {/* Contenido dinámico */}
          <div className="flex flex-col items-center justify-center w-full">
            {steps[page - 1]}
          </div>

          {/* Botones navegación */}
          <div className="flex gap-4 mt-6">
            {page > 1 && (
              <button
                onClick={prev}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Atrás
              </button>
            )}
            {page < steps.length && (
              <button
                onClick={next}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Siguiente
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
