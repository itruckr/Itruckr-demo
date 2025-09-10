import { useState } from "react";

export default function SignUpData() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Aquí puedes ir a la siguiente pantalla
  };

  return (
    <div className="flex flex-col items-center justify-center text-white w-full">
      {/* Encabezado */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Tell us more</h2>
        <h2 className="text-2xl font-semibold">about yourself</h2>
        <p className="text-sm text-gray-300 mt-2">
          Fill out the form below to be on the <br /> road in the next 36 hours!
        </p>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="mt-10 w-full max-w-lg space-y-6"
      >
        <div>
          <label className="block mb-2 text-sm">First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full text-black focus:outline-none border border-gray-200"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full text-black focus:outline-none border border-gray-200"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full text-black focus:outline-none border border-gray-200"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full text-black focus:outline-none border border-gray-200"
            required
          />
        </div>

        
      </form>
    </div>
  );
}
