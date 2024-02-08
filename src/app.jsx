import { useState } from "preact/hooks";
import "./styles/app.scss";

export const App = () => {
  const [showBar, setShowBar] = useState(true);

  const hideBar = () => {
    setShowBar(false);
  };

  return showBar ? (
    <div className="supersorted-cta">
      <a href="https://mail.supersorted.app" target="_blank" rel="noreferrer">
        Go to Supersorted ↗
      </a>
      <button onClick={hideBar}>✕</button>
    </div>
  ) : null;
};
