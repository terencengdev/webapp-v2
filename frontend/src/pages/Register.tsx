import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm, SubmitHandler, useWatch, Control } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useAuth } from "../AuthContext";
import { setCookie } from "typescript-cookie";

import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

import { ToastContainer, toast, Slide } from "react-toastify";

interface FormInput {
  userid: string;
  password: string;
  confirm_password: string;
}

export default function Register() {
  const toastId = "toast-id";
  const [pass_type, SetPassType] = useState("password");
  const [confirm_pass_type, SetConfirmPassType] = useState("password");
  const [loading, setLoading] = useState(false);
  const { setLoggedIn } = useAuth();

  const {
    register,
    formState: { errors },
    control,
    watch,
    handleSubmit,
  } = useForm<FormInput>({
    mode: "all",
  });

  const api_url = "http://localhost:3002";

  let user_id,
    password = "";
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      setLoading(true);
      user_id = data.userid;
      password = data.password;

      const response = await axios.post(api_url + "/api/register", {
        user_id,
        password,
      });

      if (response.status === 200) {
        setCookie("authToken", response.data.token);
        setCookie("userId", response.data.userdbid);

        const notify = () => toast.success(response.data.message);
        notify();
        setLoading(false);

        setTimeout(() => {
          setLoggedIn(true);
          navigate("/home");
        }, 1200);
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
  const handleconfirmPasswordToggle = () => {
    if (confirm_pass_type == "text") {
      SetConfirmPassType("password");
    } else {
      SetConfirmPassType("text");
    }
  };

  function SubmitButton({ control }: { control: Control<FormInput> }) {
    const required = useWatch({
      control,
      name: ["userid", "password", "confirm_password"],
    });

    const all_valid = required.every(
      (element) => element != "" && element !== undefined
    );

    return (
      <button
        id="register_btn"
        name="register"
        type="submit"
        className="main-btn"
        disabled={loading || !all_valid}
      >
        {loading ? "Loading..." : "Register"}
      </button>
    );
  }
  return (
    <>
      <div className="register-page text-sm md:text-base main-section w-full min-h-[90vh] flex items-center">
        <div className="container mx-auto flex flex-col justify-center items-center">
          <h1 className="main-title mb-3 text-center text-4xl md:text-5xl lg:text-6xl">
            Register <strong>MyApp</strong>
          </h1>
          <div className="w-full max-w-sm md:max-w-md login-form my-10">
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
                      name="password"
                      id="password"
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
                        className="cursor-pointer absolute top-[50%] right-2 translate-y-[-50%]"
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
                <label className="flex-[0_0_20%]">Comfirm Password*</label>
                <div className="field flex-[0_0_80%]">
                  <div className="password-wrap relative">
                    <input
                      {...register("confirm_password", {
                        required: "Confirm Password is required.",
                        validate: (value) => {
                          if (value !== watch("password")) {
                            return "Your passwords do not match";
                          }
                        },
                      })}
                      id="confirm_password"
                      type={confirm_pass_type}
                      autoComplete="current-password"
                      className={` ${
                        errors.confirm_password ? "error" : ""
                      } block w-full text-gray-900 border border-[#cccccc] placeholder:text-gray-400 p-1.5`}
                    />

                    {confirm_pass_type == "password" && (
                      <FaEye
                        className="cursor-pointer  absolute top-[50%] right-2 translate-y-[-50%]"
                        onClick={handleconfirmPasswordToggle}
                      />
                    )}
                    {confirm_pass_type == "text" && (
                      <FaEyeSlash
                        className="cursor-pointer absolute top-[50%] right-2 translate-y-[-50%]"
                        onClick={handleconfirmPasswordToggle}
                      />
                    )}
                  </div>
                  {errors.confirm_password && (
                    <p role={"alert"} className="text-red-600 text-sm">
                      {errors?.confirm_password
                        ? errors.confirm_password.message
                        : null}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-field flex mb-10 items-center">
                <label className="flex-[0_0_20%]"></label>
                <div className="field flex-[0_0_80%]">
                  <SubmitButton control={control} />
                </div>
              </div>
              <div className="form-field flex mb-10 items-center">
                Already registered?
                <Link to="/" className="ml-1 text-black link">
                  Login here.
                </Link>
              </div>
            </form>
          </div>
          <ToastContainer
            autoClose={6000}
            hideProgressBar={true}
            position="bottom-center"
            theme="colored"
            transition={Slide}
          />
        </div>
      </div>
    </>
  );
}
