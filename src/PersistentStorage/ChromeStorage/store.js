const defaultSettings = {
  joinedDate: Date.now(),
  lastReviewRequestDate: null,
  hasReviewed: false,
};

function set(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, function () {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError));
      } else {
        resolve();
      }
    });
  });
}

function get(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], function (result) {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError));
      } else {
        resolve(result[key]);
      }
    });
  });
}

async function update(key, value) {
  const existingSettings = await get(key);
  const updatedSettings = {
    ...existingSettings,
    ...value,
  };

  await set(key, updatedSettings);
}

async function registerUser() {
  const existingSettings = await get("appSettings");

  if (existingSettings) {
    const missingKeys = Object.keys(defaultSettings).filter(
      (setting) => setting in existingSettings === false
    );
    if (missingKeys.length > 0) {
      const missingSettings = missingKeys.reduce((acc, key) => {
        acc[key] = defaultSettings[key];
        return acc;
      }, {});

      await update("appSettings", missingSettings);
    }
    return;
  }

  await set("appSettings", defaultSettings);
}

const chromeStorage = {
  registerUser,
  set,
  get,
  update,
};

export default chromeStorage;
