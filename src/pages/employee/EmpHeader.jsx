/* eslint-disable react/prop-types */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EmpHeader(props) {
  const { onDrawerToggle } = props;
  const navigate = useNavigate();

  const hadleLogOut = () => {
    localStorage.setItem("loggedIn", JSON.stringify({}));
    handleOnClose();
  };

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, [timeToOut]);

  return (
    <div className="fixed max-w-full bg-base-100 navbar lg:pr-[188px] z-[8999]">
      <div className="flex-none">
        <div>{onDrawerToggle}</div>
      </div>
      <div className="flex-1">
        <a className="pl-2 text-xl normal-case btn btn-ghost text-base-content ">
          Kaffe Primo
        </a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost rounded-btn">
            <box-icon
              name="dots-horizontal-rounded"
              color="hsl(var(--bc) / var(--tw-bg-opacity))"
            ></box-icon>
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-40 mt-4"
          >
            <li>
              <a
                className="flex flex-row justify-around"
                onClick={() => hadleLogOut()}
              >
                <box-icon name="log-out"></box-icon>
                <span>ล็อกเอาท์</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default EmpHeader;
