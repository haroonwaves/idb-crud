import loadingSpinnerStyles from "./Style/loading-spinner.scss?inline";

const LoadingSpinner = () => {
  return (
    <>
      <style>{loadingSpinnerStyles}</style>
      <div className="idb-crud-loading-spinner-container">
        <div className="idb-crud-loading-spinner"></div>
      </div>
    </>
  );
};

export default LoadingSpinner;
