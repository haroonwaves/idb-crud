import { useCallback, useEffect, useState } from "preact/hooks";
import Modal from "../Common/modal";
import Button from "../Common/button";
import chromeStorage from "../../PersistentStorage/ChromeStorage/store";
import { shouldShowReviewModal } from "./Utils/should-show-review-modal";

const ReviewModal = () => {
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      shouldShowReviewModal(setShowReviewModal);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  const onSuccess = useCallback(async () => {
    window.open(
      `https://chromewebstore.google.com/detail/idb-crud-indexeddb-manage/olbigpjodejcmmdkafnhaphdblimjogg/reviews`
    );

    setShowReviewModal(false);

    await chromeStorage.update("appSettings", {
      lastReviewRequestDate: Date.now(),
      hasReviewed: true,
    });
  }, [setShowReviewModal]);

  const onFailure = useCallback(async () => {
    setShowReviewModal(false);

    await chromeStorage.update("appSettings", {
      lastReviewRequestDate: Date.now(),
    });
  }, [setShowReviewModal]);

  return (
    <Modal
      show={showReviewModal}
      onClose={() => setShowReviewModal(false)}
      closeOnBlur={false}
      size={"medium"}
      backgroundEffect={"shadow-sm"}
      header={"We'd Love Your Feedback!"}
      hideFooter
    >
      <div>
        <div className="pb-4 flex flex-col gap-4">
          <p>
            Thank you for using our idb crud - IndexedDB Manager, We hope it has
            made managing your IndexedDB more efficient and straightforward.
          </p>
          <p>
            If you've found our extension helpful, we'd greatly appreciate it if
            you could take a moment to leave us a review.
          </p>
          <p className="font-medium">
            Your feedback helps us grow and improve.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type={"secondary"}
            text={"Remind Me Later"}
            onClick={onFailure}
          />
          <Button
            type={"primary"}
            text={"Leave a Review"}
            onClick={onSuccess}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ReviewModal;
