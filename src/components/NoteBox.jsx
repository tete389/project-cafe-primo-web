import { useContext, useState } from "react";
import { LanguageContext, OrderValueContext } from "../pages/Store";

export default function NoteBox(props) {
  const {  setOpenBox } = props;
  const { orderValue, setOrderValue } = useContext(OrderValueContext);
  const userLanguage = useContext(LanguageContext);


  const [textNote, setTextNote] = useState(orderValue.note || "");


  
  const handleCreateTextNote = (value) => {
    setOrderValue((prev) => ({
      ...prev,
      note: value,
    }));
  };

  const handleTextNote = (event) => {
    setTextNote(event.target.value);
  };

  const handleSaveTextNote = () => {
    handleCreateTextNote(textNote);
    setOpenBox((prev) => ({
      ...prev,
      box1: !prev.box1,
    }));
  };

  return (
    <div className="flex flex-col items-center">
      <textarea
      name="text-note"
        className="w-full textarea textarea-bordered max-h-60"
        placeholder={`${userLanguage === "th" ? "ข้อความ" : "Message"}`}
        value={textNote}
        onChange={handleTextNote}
      ></textarea>
      <button
        className="mt-4 text-white btn btn-info"
        onClick={handleSaveTextNote}
      >
        <box-icon type="solid" name="save" color="#ffffff"></box-icon>{" "}
        {userLanguage === "th" ? "บันทึก" : "Save"}
      </button>
    </div>
  );
}
