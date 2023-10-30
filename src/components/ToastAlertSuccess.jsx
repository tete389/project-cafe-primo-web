/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

export default function ToastAlertSuccess(params) {
  const { setOnOpenToast, successMessage } = params;
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setOnOpenToast(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <div className="toast toast-top toast-end z-[10000]">
        <div className="alert alert-success">
          <span>{successMessage}</span>
        </div>
      </div>
    </>
  );
}
