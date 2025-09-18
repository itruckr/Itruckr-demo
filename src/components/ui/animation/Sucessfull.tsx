import Lottie from "lottie-react";
import Sucess from "../../../../public/animation/Success.json";


export default function SucessFull() {
  return (
    <div className="flex items-center justify-center">
      <Lottie style={{ width: "300px", height: "300px" }} animationData={Sucess} loop={true} />
    </div>
  );
}

