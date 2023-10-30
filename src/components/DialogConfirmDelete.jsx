import { useEffect } from "react";

export default function DialogConfirmDelete(params) {
  const { sendDelete, idDelete, handleClearOpen } = params;

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      handleClearOpen();
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, [timeToOut]);
  return (
    <>
      <div className="p-0 modal-box bg-base-100">
        <form method="dialog">
          <button
            className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
            onClick={() => handleOnClose()}
          >
            ✕
          </button>
        </form>
        <div className="card-body">
          <h3 className="text-lg font-bold">ยืนยันการลบ</h3>

          <form method="dialog" className="w-full mt-12">
            <button
              className="w-full btn btn-error text-base-100"
              onClick={() => sendDelete(idDelete)}
            >
              ยืนยัน
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
