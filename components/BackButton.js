import { button } from "aws-amplify";
import ArrowLeft from "./svg-components/ArrowLeft";

export default function BackButton({ action }) {
  return (
    <button onClick={action} className="p-4">
      <ArrowLeft width="35px" height="35px" fill="#737373" />
    </button>
  );
}
