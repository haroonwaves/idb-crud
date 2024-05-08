let toastList = [];
let updateFunction = null;

export const showToast = ({ message, type = "info" }) => {
  const id = Math.random().toString(36).substr(2, 9);
  toastList.push({ id, message, type });
  updateFunction && updateFunction([...toastList]);

  if (type !== "loading") {
    setTimeout(() => {
      hideToast(id);
    }, 3000);
  }

  return id;
};

export const updateToast = ({ id, message, type = "success" }) => {
  toastList = toastList.map((t) => (t.id === id ? { id, message, type } : t));
  updateFunction && updateFunction([...toastList]);

  setTimeout(() => {
    hideToast(id);
  }, 3000);
};

export const hideToast = (id) => {
  toastList = toastList.filter((t) => t.id !== id);
  updateFunction && updateFunction([...toastList]);
};

export const setUpdateFunction = (func) => {
  updateFunction = func;
};
