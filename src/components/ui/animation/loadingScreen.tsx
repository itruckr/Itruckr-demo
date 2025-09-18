import Lottie from "lottie-react";
import LoadingScreenIcon from "../../../../public/animation/LoadingScreen.json";

export const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center">
      <Lottie style={{ width: "300px", height: "300px" }} animationData={LoadingScreenIcon} loop={true} />
    </div>
  )
}
