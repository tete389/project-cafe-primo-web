/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

export default function ToastAlertError(params) {
  const { setOnOpenToast, errorMessage } = params;
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setOnOpenToast(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <div className="toast toast-top toast-end z-[10000]">
        <div className="alert alert-error">
          <span>{errorMessage}</span>
        </div>
      </div>
    </>
  );
}
