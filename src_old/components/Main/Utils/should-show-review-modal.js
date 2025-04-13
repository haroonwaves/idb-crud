import chromeStorage from "../../../PersistentStorage/ChromeStorage/store";

export async function shouldShowReviewModal(callback) {
  const appSettings = await chromeStorage.get("appSettings");
  let shouldShowReviewModal = false;

  if (appSettings) {
    if (appSettings.hasReviewed) {
      // Do nothing if user has already reviewed
    } else {
      const lastReviewRequestDate = appSettings.lastReviewRequestDate;

      if (!lastReviewRequestDate) {
        // Scenario 1: User just joined the app
        const userJoinedDate = new Date(appSettings.joinedDate); // 28
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2); // 31

        if (userJoinedDate <= twoDaysAgo) {
          shouldShowReviewModal = true;
        }
      } else {
        // Scenario 2: User closed a reviewModal
        const lastReviewRequestDateInDays = Math.floor(
          (Date.now() - new Date(lastReviewRequestDate)) / (1000 * 60 * 60 * 24)
        );

        if (lastReviewRequestDateInDays >= 14) {
          shouldShowReviewModal = true;
        }
      }
    }
  }

  callback(shouldShowReviewModal);
}
