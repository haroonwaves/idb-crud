type Toast = {
  id: string;
  message: string;
  type: "success" | "failure" | "message";
}

type ToastUpdateFn = ((toastList: Toast[]) => void) 

let toastList: Toast[] = [];
let updateFunction: ToastUpdateFn | null = null;

export const showToast = ({ message, type = "message" }: Omit<Toast, "id">) => {
  const id = Math.random().toString(36).substr(2, 9);
  toastList.push({ id, message, type });
  updateFunction && updateFunction([...toastList]);
};

export const hideToast = (id: string) => {
  toastList = toastList.filter((t) => t.id !== id);
  updateFunction && updateFunction([...toastList]);
};

export const setUpdateFunction = (func: ToastUpdateFn) => {
  updateFunction = func;
};
