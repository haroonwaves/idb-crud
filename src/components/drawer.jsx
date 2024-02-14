import "./styles/drawer.scss";

const Drawer = ({ open }) => {
  return (
    <div className={`idb-crud-drawer ${open ? "open" : ""}`}>I am a drawer</div>
  );
};

export default Drawer;
