import Lottie from "lottie-react";
import Call from "../../../../public/animation/Headphone_with_blueberry_cartoon.json";


export default function Headphone() {
  return (
    <div className="flex items-center justify-center">
      <Lottie style={{ width: "300px", height: "300px" }} animationData={Call} loop={true} />
    </div>
  );
}
