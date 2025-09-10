export default function SignUpInformation() {
  return (
    <div className="flex flex-col items-center justify-center text-white p-6">
      {/* Título */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">
          Please prepare the <br /> following documents
        </h2>
        <p className="text-sm text-gray-300">
          Make sure you have all the below <br /> in order to sign up.
        </p>
      </div>

      {/* Lista de documentos */}
      <ul className="mt-8 space-y-2 text-sm">
        <li>- Driver License</li>
        <li>- Medical Card</li>
        <li>- Social Security</li>
        <li>- Profile Picture</li>
        <li>- Truck Cab Card</li>
        <li>- Truck Inspection</li>
      </ul>

      
    </div>
  );
}