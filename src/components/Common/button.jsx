export default function Button({ text, onClick, isDisabled, type }) {
  const colors = isDisabled
    ? "text-gray-400 bg-gray-200 border border-gray-200 cursor-not-allowed"
    : type === "secondary"
    ? "text-gray-500 bg-white hover:bg-secondary-lighter border border-secondary-medium hover:text-gray-900 hover:border-secondary-dark"
    : "bg-primary-lighter hover:bg-primary-light border border-primary-dark";

  return (
    <button
      className={`${colors} inline-block rounded px-4 py-1 focus:outline-none focus:ring active:text-stone-500`}
      type="button"
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
}
