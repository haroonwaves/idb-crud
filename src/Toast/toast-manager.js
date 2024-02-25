let toastList = [];
let updateFunction = null;

export const showToast = ({ message, type = "message" }) => {
  const id = Math.random().toString(36).substr(2, 9);
  toastList.push({ id, message, type });
  updateFunction && updateFunction([...toastList]);
};

export const hideToast = (id) => {
  toastList = toastList.filter((t) => t.id !== id);
  updateFunction && updateFunction([...toastList]);
};

export const setUpdateFunction = (func) => {
  updateFunction = func;
};
