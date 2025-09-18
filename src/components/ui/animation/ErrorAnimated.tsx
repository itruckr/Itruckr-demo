import Lottie from "lottie-react";
import ErrorAnimatedIcon from "../../../../public/animation/Error animation.json";

export const ErrorAnimated = () => {
  return (
    <div className="flex items-center justify-center">
      <Lottie style={{ width: "300px", height: "300px" }} animationData={ErrorAnimatedIcon} loop={true} />
    </div>
  )
}
