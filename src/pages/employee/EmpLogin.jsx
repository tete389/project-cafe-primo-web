import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseURL, empLogIn } from "../../service/BaseURL";
import axios from "axios";
import ToastAlertLoading from "../../components/ToastAlertLoading";
import ToastAlertSuccess from "../../components/ToastAlertSuccess";
import ToastAlertError from "../../components/ToastAlertError";
import { useEffect } from "react";

export default function EmpLogin() {
  const navigate = useNavigate();
  const [onOpenToast, setOnOpenToast] = useState(false);
  const [resLogin, setResLogin] = useState({
    resLogin: "",
    error: "",
    isLoading: false,
  });


  const [dataLogin, setDataLogin] = useState({
    username: "",
    password: "",
  });

  const handleUsername = (event) => {
    setDataLogin((prev) => ({
      ...prev,
      username: event.target.value,
    }));
  };

  const handlePassword = (event) => {
    setDataLogin((prev) => ({
      ...prev,
      password: event.target.value,
    }));
  };

  //  send  update
  const sendEmpLogIn = async () => {
    if (!dataLogin.username || !dataLogin.password) {
      return;
    }
    const fetcherEmpLogin = async () => {
      let dataJson = JSON.stringify(dataLogin);

      const sendUrl = `${BaseURL}${empLogIn}`;
      setOnOpenToast(true);
      setResLogin((prev) => ({
        ...prev,
        isLoading: true,
      }));
      let customConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const response = await axios.post(sendUrl, dataJson, customConfig);
        const data = await response.data;
        setResLogin((prev) => ({
          ...prev,
          resLogin: data,
          error: "",
        }));

        localStorage.setItem(
          "loggedIn",
          JSON.stringify({ accessToken: data.accessToken })
        );
        handleOnClose();
      } catch (error) {
        console.error("error : ", error);
        setResLogin((prev) => ({
          ...prev,
          resLogin: "",
          error: error,
        }));
      } finally {
        setResLogin((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };
    ////////// use
    await fetcherEmpLogin();
  };

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      navigate("/report");
    }, 1000);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, []);

  return (
    <>
      <div
        className="min-h-screen hero bg-base-200"
        style={{
          backgroundImage: "url(images/bg5.jpg)",
        }}
      >
        <div className="flex-col hero-content lg:flex-row-reverse hero-overlay bg-opacity-60">
          <div className="mb-10 text-center lg:text-left text-base-100">
            <p className="text-5xl font-bold ">Kaffe Primo </p>
            <span className="text-3xl font-bold ">เข้าสู่ระบบพนักงาน </span>
          </div>
          <div className="flex-shrink-0 w-full max-w-sm shadow-2xl card bg-base-100">
            <div className="card-body">
              <div className="form-control">
                <label className="label" htmlFor="username-login">
                  <span className="label-text">ชื่อผู้ใช้</span>
                </label>
                <input
                  id="username-login"
                  type="text"
                  value={dataLogin.username}
                  placeholder="username"
                  className="input input-bordered"
                  onChange={handleUsername}
                />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="password-login">
                  <span className="label-text">รหัสผ่าน</span>
                </label>
                <input
                  id="password-login"
                  type="password"
                  value={dataLogin.password}
                  placeholder="password"
                  className="input input-bordered"
                  onChange={handlePassword}
                />
              </div>
              <div className="mt-6 form-control">
                <button
                  className="btn btn-primary"
                  onClick={() => sendEmpLogIn()}
                >
                  ล็อกอิน
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  Toast   */}
      <>
        {onOpenToast &&
          (resLogin.isLoading ? (
            <ToastAlertLoading />
          ) : resLogin.resLogin ? (
            <ToastAlertSuccess
              setOnOpenToast={setOnOpenToast}
              successMessage={"Login success"}
            />
          ) : (
            <ToastAlertError
              setOnOpenToast={setOnOpenToast}
              errorMessage={"Login fail"}
            />
          ))}
      </>
    </>
  );
}
