import React from "react";

export default function DialogConfirm(props) {
  const { children, dialogTitle, dialogBody } = props;
  return (
    <>
      <dialog id="my_modal_2" className="modal">
        <form method="dialog" className="modal-box">
          <div className="flex flex-row justify-between">
            <h3 className="text-lg font-bold">{dialogTitle}</h3>
            <button>
              <box-icon type="solid" name="x-circle"></box-icon>
            </button>
          </div>
          <div className="py-2">{dialogBody}</div>
          <div className="mt-0 modal-action">{children}</div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </>
  );
}
