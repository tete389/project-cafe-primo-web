import React from "react";

export default function ToastAlertLoading() {
  return (
    <>
      <div className="toast toast-top toast-end z-[10000]">
        <div className="alert alert-info">
          <progress className="w-20 progress"></progress>
        </div>
      </div>
    </>
  );
}
