import { Discovery } from "aws-sdk";
import Loading from "./svg-components/Loading";

export default function Loader() {
  return (
    <div className="h-screen flex fixed top-0 z-[99]">
      <div className="m-[auto] ml-[50%]">
        <Loading />
      </div>
    </div>
  );
}
