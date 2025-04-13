import { useRef, useState } from "preact/hooks";
import LoadingSpinner from "./loading-spinner";

let overLays = {};

export const disableUserInteraction = (type, showLoader = false) => {
  const ref = overLays[type];
  ref && ref.setState({ show: true, loader: showLoader });
};

export const enableUserInteraction = (type) => {
  const ref = overLays[type];
  ref && ref.setState({ show: false });
};

const Overlay = ({ type }) => {
  const [state, setState] = useState({ show: false });

  const { current: ref } = useRef({
    setState,
  });

  overLays[type] = ref;

  return (
    state.show && (
      <div className="fixed bg-white bg-opacity-30 w-full h-full z-50 flex justify-center items-center">
        {state.loader && <LoadingSpinner />}
      </div>
    )
  );
};

export default Overlay;
