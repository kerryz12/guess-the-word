import { Loader2 } from "lucide-react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader">
      <Loader2 className="loader__icon" />
      <span className="loader__text"> loading...</span>
    </div>
  );
};

export default Loader;
