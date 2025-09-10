export default function SignUpConfirmationComponent() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full">
      {/* Bloque 1 */}
      <div
        className="overflow-hidden w-full max-w-xs"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="px-6 headline font-semibold text-white">Hi new</h1>
          <h1 className="px-6 pb-6 headline font-semibold text-white">
            iTruckr driver!
          </h1>
          <p className="px-6 title subheading-2 text-white">
            We are processing your documents.
          </p>
        </div>
      </div>

      {/* Bloque 2 */}
      <div
        className="pb-5 overflow-hidden w-full max-w-xs size-input"
      >
        <div className="flex flex-col justify-between text-center">
          <p className="subheading-2 font-semibold text-white flex items-center justify-center">
            Please allow 2 business days - We will contact you and notify when
            you’re ready to hit the road!
          </p>
          <p className="px-gutter my-5 subheading-2 text-green-500 flex justify-center">
            In the meantime, follow our journey on socials:
          </p>

          <div className="grid grid-cols-3 mt-5 gap-2">
            <a
              href="https://instagram.com/itruckr?igshid=MzRlODBiNWFlZA=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center text-white"
            >
              <img
                src="Icon_Instagram.svg"
                alt="Instagram"
              />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100092898783332&mibextid=LQQJ4d"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center"
            >
              <img
                src="Icon_Facebook.svg"
                alt="Facebook"
              />
            </a>
            <a
              href="https://www.linkedin.com/company/itruckr/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center"
            >
              <img
                src="Icon_Linkedin.svg"
                alt="LinkedIn"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
