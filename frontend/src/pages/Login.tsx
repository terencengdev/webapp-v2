import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useForm, SubmitHandler, useWatch, Control } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useAuth } from "../AuthContext";
import { getCookie, setCookie } from "typescript-cookie";

import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

import { ToastContainer, toast, Slide } from "react-toastify";

interface FormInput {
  userid: string;
  password: string;
}

export default function Login() {
  const {
    register,
    reset,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<FormInput>({
    mode: "all",
  });

  const toastId = "toast-id";
  const [pass_type, SetPassType] = useState("password");
  const [keepLogin, setkeepLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = getCookie("authToken");
  const { setLoggedIn } = useAuth();

  const api_url = "http://localhost:3002";
  const navigate = useNavigate();

  let user_id,
    password = "";

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    user_id = data.userid;
    password = data.password;
    try {
      setLoading(true);
      const response = await axios.post(api_url + "/api/login", {
        user_id,
        password,
      });

      if (response.status === 200 && response.data.token) {
        if (!response.data.token) {
          const notify = () => toast.error(response.data.message);
          notify();
          return;
        } else {
          const notify = () => toast.success(response.data.message);
          notify();
          if (keepLogin) {
            setCookie("authToken", response.data.token, { expires: 365 });
            setCookie("userId", response.data.userdbid, {
              expires: 365,
            });
          } else {
            setCookie("authToken", response.data.token);
            setCookie("userId", response.data.userdbid);
          }
          setLoggedIn(true);
        }
        reset();
        setLoading(false);

        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const notify = () =>
          toast.error(
            error.response ? error.response.data.message : error.message,
            {
              position: "bottom-center",
              toastId: toastId,
            }
          );
        notify();
        setLoading(false);
      }
    }
    if (toast.isActive(toastId)) {
      return;
    }
  };

  const handlePasswordToggle = () => {
    if (pass_type == "text") {
      SetPassType("password");
    } else {
      SetPassType("text");
    }
  };

  const handleKeepLogin = () => {
    setkeepLogin(true);
  };

  function SubmitButton({ control }: { control: Control<FormInput> }) {
    const required = useWatch({
      control,
      name: ["userid", "password"],
    });

    const all_valid = required.every(
      (element) => element != "" && element !== undefined
    );

    return (
      <button
        id="login_btn"
        name="login"
        type="submit"
        className="main-btn"
        disabled={loading || !all_valid}
      >
        {loading ? "Loading..." : "Login"}
      </button>
    );
  }

  return token ? (
    <Navigate to="/home" replace />
  ) : (
    <>
      <div className="login-page text-sm md:text-base main-section w-full min-h-screen flex items-center">
        <div className="container mx-auto flex flex-col justify-center items-center">
          <h1 className="main-title mb-3 text-center text-4xl md:text-5xl lg:text-6xl">
            Welcome to <strong>MyApp</strong>
          </h1>
          <div className="w-full max-w-md login-form my-10">
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-field flex mb-10 items-center">
                <label className="flex-[0_0_20%]">User ID*</label>
                <div className="field flex-[0_0_80%]">
                  <input
                    {...register("userid", {
                      required: "User ID is required.",
                    })}
                    type="text"
                    id="userid"
                    name="userid"
                    className={` ${
                      errors.userid ? "error" : ""
                    } block w-full text-gray-900 border border-[#cccccc] placeholder:text-gray-400 p-1.5`}
                  />

                  {errors.userid && (
                    <p role={"alert"} className="text-red-600 text-sm">
                      {errors?.userid ? errors.userid.message : null}
                    </p>
                  )}
                </div>
              </div>
              <div className="form-field flex mb-10  items-center">
                <label className="flex-[0_0_20%]">Password*</label>
                <div className="field flex-[0_0_80%]">
                  <div className="password-wrap relative">
                    <input
                      {...register("password", {
                        required: "Password is required.",
                      })}
                      id="password"
                      name="password"
                      type={pass_type}
                      autoComplete="current-password"
                      className={` ${
                        errors.password ? "error" : ""
                      } block w-full text-gray-900 border border-[#cccccc] placeholder:text-gray-400 p-1.5`}
                    />
                    {pass_type == "password" && (
                      <FaEye
                        className="cursor-pointer absolute top-[50%] right-2 translate-y-[-50%]"
                        onClick={handlePasswordToggle}
                      />
                    )}
                    {pass_type == "text" && (
                      <FaEyeSlash
                        className="cursor-pointer cursor-pointer absolute top-[50%] right-2 translate-y-[-50%]"
                        onClick={handlePasswordToggle}
                      />
                    )}
                  </div>
                  {errors.password && (
                    <p role={"alert"} className="text-red-600 text-sm">
                      {errors?.password ? errors.password.message : null}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-field flex mb-10  items-center">
                <label className="flex-[0_0_20%]"></label>
                <div className="field flex-[0_0_80%] flex items-center">
                  <input
                    id="logged"
                    name="logged"
                    type="checkbox"
                    className="mr-3 custom-checkbox flex items-center justify-center"
                    onChange={handleKeepLogin}
                  />
                  <label htmlFor="logged">Keep me logged in</label>
                </div>
              </div>

              <div className="form-field flex mb-10 items-center">
                <label className="flex-[0_0_20%]"></label>
                <div className="field flex-[0_0_80%]">
                  <SubmitButton control={control} />
                </div>
              </div>
              <div className="form-field flex mb-10 items-center">
                No account?
                <Link to="/register" className="ml-1 text-black link">
                  Register here.
                </Link>
              </div>
            </form>
            <ToastContainer
              autoClose={10000}
              hideProgressBar={true}
              position="bottom-center"
              theme="colored"
              transition={Slide}
            />
          </div>
        </div>
      </div>
    </>
  );
}
