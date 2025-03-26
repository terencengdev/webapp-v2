import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import {
  useForm,
  SubmitHandler,
  Controller,
  useWatch,
  Control,
} from "react-hook-form";
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import Tabs from "../components/Tabs";
import Tab from "../components/Tab";
import TabPanel from "../components/TabPanel";
import countryList from "../countries";
import DatePicker from "react-datepicker";
import Select from "react-select";
import dayjs from "dayjs";
import Avatar from "../assets/avatar.svg";

import "react-datepicker/dist/react-datepicker.css";

import { ToastContainer, toast, Slide } from "react-toastify";

const toastId = "toast-id";

enum SalutationEnum {
  Mr = "Mr",
  Ms = "Ms",
  Mrs = "Mrs",
}
enum GenderEnum {
  Male = "Male",
  Female = "Female",
}
enum MaritalStatusEnum {
  Single = "Single",
  Married = "Married",
}
type SalutationOptionType = { value: SalutationEnum; label: string };
type GenderOptionType = { value: GenderEnum; label: string };
type MaritalStatusOptionType = { value: MaritalStatusEnum; label: string };
type CountryOptionType = { value: string; label: string };

interface FormInput {
  profile_image: File;
  salutation: SalutationOptionType | { value: ""; label: string };
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  home_address: string;
  country: CountryOptionType | { value: ""; label: string };
  postal_code: string;
  nationality: string;
  date_of_birth: string;
  gender: GenderOptionType | { value: ""; label: string };
  marital_status: MaritalStatusOptionType | { value: ""; label: string };
  spouse_salutation: SalutationOptionType | { value: ""; label: string };
  spouse_first_name: string;
  spouse_last_name: string;
  hobbies_and_interests: string;
  favourite_sports: string;
  preferred_music_genres: string;
  preferred_movies_shows: string;
}

export default function EditProfile() {
  const [currentTab, setCurrentTab] = useState(1);
  const [marital, setMarital] = useState("Single");
  const [profileimage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);

  const { userid } = useAuth();

  const salutation_options: SalutationOptionType[] = [
    { value: SalutationEnum.Mr, label: "Mr" },
    { value: SalutationEnum.Ms, label: "Ms" },
    { value: SalutationEnum.Mrs, label: "Mrs" },
  ];
  const gender_options: GenderOptionType[] = [
    { value: GenderEnum.Male, label: "Male" },
    { value: GenderEnum.Female, label: "Female" },
  ];
  const marital_options: MaritalStatusOptionType[] = [
    { value: MaritalStatusEnum.Single, label: "Single" },
    { value: MaritalStatusEnum.Married, label: "Married" },
  ];

  const country_list_options: CountryOptionType[] = countryList.map(
    (country, _index) => {
      return {
        value: country.code,
        label: country.name,
      };
    }
  );

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    register,
  } = useForm<FormInput>({ mode: "all" });

  const tab1Required = watch([
    "salutation",
    "first_name",
    "last_name",
    "email",
  ]);

  const tab2Required = watch([
    "mobile_number",
    "home_address",
    "country",
    "postal_code",
    "nationality",
  ]);

  const tab1_all_valid = tab1Required.every(
    (element) => element != "" && element !== undefined
  );
  const tab2_all_valid = tab2Required.every(
    (element) => element != "" && element !== undefined
  );
  useEffect(() => {
    if (!tab1_all_valid) {
      setCurrentTab(1);
    } else if (!tab2_all_valid) {
      setCurrentTab(2);
    }
  });

  const handleClickTab = (tab: any) => {
    const tabid = tab.target.dataset.id;
    if (!tab1_all_valid) {
      setCurrentTab(1);
      const notify = () =>
        toast.error("Please fill in all required Basic Details fields", {
          position: "bottom-center",
          toastId: toastId,
        });
      notify();
    } else if (!tab2_all_valid) {
      setCurrentTab(2);
      const notify = () =>
        toast.error("Please fill in all required Additional Details fields", {
          position: "bottom-center",
          toastId: toastId,
        });
      notify();
    } else {
      setCurrentTab(tabid);
    }
    if (toast.isActive(toastId)) {
      return;
    }
  };

  const api_url = "http://localhost:3002";

  useEffect(() => {
    axios
      .get(api_url + "/api/users/" + userid)
      .then((res) => {
        const matchingSalutation = salutation_options.find((option) => {
          return option.value == res.data.salutation;
        });

        const matchingSpouseSalutation = salutation_options.find((option) => {
          return option.value == res.data.spouse_salutation;
        });

        const matchingGender = gender_options.find((option) => {
          return option.value == res.data.gender;
        });

        const matchingMarital = marital_options.find((option) => {
          return option.value == res.data.marital_status;
        });

        const matchingCountry = country_list_options.find((option) => {
          return option.value == res.data.country;
        });

        setProfileImage(res.data.profile_image);
        setValue(
          "salutation",
          matchingSalutation ? matchingSalutation : { value: "", label: "" }
        );
        setValue("first_name", res.data.first_name);
        setValue("last_name", res.data.last_name);
        setValue("email", res.data.email_address);
        setValue("mobile_number", res.data.mobile_number);
        setValue("home_address", res.data.home_address);
        setValue(
          "country",
          matchingCountry ? matchingCountry : { value: "", label: "" }
        );
        setValue("postal_code", res.data.postal_code);
        setValue("nationality", res.data.nationality);
        setValue(
          "marital_status",
          matchingMarital ? matchingMarital : { value: "", label: "" }
        );
        setMarital(res.data.marital_status);
        setValue("date_of_birth", res.data.date_of_birth);
        setValue(
          "gender",
          matchingGender ? matchingGender : { value: "", label: "" }
        );
        setValue(
          "spouse_salutation",
          matchingSpouseSalutation
            ? matchingSpouseSalutation
            : { value: "", label: "" }
        );
        setValue("spouse_first_name", res.data.spouse_first_name);
        setValue("spouse_last_name", res.data.spouse_last_name);
        setValue("hobbies_and_interests", res.data.hobbies_and_interests);
        setValue("favourite_sports", res.data.favourite_sports);
        setValue("preferred_music_genres", res.data.preferred_music_genres);
        setValue("preferred_movies_shows", res.data.preferred_movies_shows);
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          const notify = () =>
            toast.error(
              err.response ? err.response.data.message : err.message,
              {
                position: "bottom-center",
                toastId: toastId,
              }
            );
          notify();
        }

        if (toast.isActive(toastId)) {
          return;
        }
      });
  }, []);

  const calculateAge = (value: string) => {
    const birthDate = dayjs(value);
    const today = dayjs();
    const age = today.diff(birthDate, "year");

    return !value
      ? "Date of birth is required"
      : age >= 17 || "You must be at least 17 years old";
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const filepath = event.target.files[0];
      setValue("profile_image", filepath);
      setProfileImage(URL.createObjectURL(filepath));
    }
  };

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("salutation", data.salutation.value);
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("email_address", data.email);
      formData.append("mobile_number", data.mobile_number);
      formData.append("home_address", data.home_address);
      formData.append("country", data.country.value);
      formData.append("postal_code", data.postal_code);
      formData.append("nationality", data.nationality);
      formData.append(
        "date_of_birth",
        new Date(data.date_of_birth).toLocaleDateString("fr-CA", {
          timeZone: "UTC",
        })
      );
      formData.append("gender", data.gender ? data.gender.value : "");
      formData.append(
        "marital_status",
        data.marital_status ? data.marital_status.value : ""
      );
      formData.append("spouse_salutation", data.spouse_salutation.value);
      formData.append("spouse_first_name", data.spouse_first_name || "");
      formData.append("spouse_last_name", data.spouse_last_name || "");
      formData.append(
        "hobbies_and_interests",
        data.hobbies_and_interests || ""
      );
      formData.append("favourite_sports", data.favourite_sports || "");
      formData.append(
        "preferred_music_genres",
        data.preferred_music_genres || ""
      );
      formData.append(
        "preferred_movies_shows",
        data.preferred_movies_shows || ""
      );

      if (data.profile_image) {
        formData.append("profile_image", data.profile_image);
      }

      const response = await axios.put(
        api_url + "/api/edit-user/" + userid,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const notify = () =>
          toast.success(response.data.message, {
            position: "bottom-center",
            toastId: toastId,
          });
        notify();
        setLoading(false);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const notify = () =>
          toast.error(
            error.response ? error.response.data.message : error.message,
            {
              position: "bottom-center",
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

  function SubmitButton({ control }: { control: Control<FormInput> }) {
    const required = useWatch({
      control,
      name: [
        "salutation",
        "first_name",
        "last_name",
        "email",
        "mobile_number",
        "home_address",
        "country",
        "postal_code",
        "nationality",
      ],
    });

    const all_valid = required.every(
      (element) => element != "" && element !== undefined
    );

    return (
      <button
        id="edit_profile_btn"
        name="edit_profile"
        type="submit"
        className="main-btn edit"
        disabled={loading || !all_valid}
      >
        {loading ? "Loading..." : "Save and Update"}
      </button>
    );
  }

  return (
    <>
      <div className="edit-profile-page text-sm md:text-base main-section w-full min-h-[90vh] pt-[5%] md:pt-15 pb-10">
        <div className="container">
          <div className="flex flex-col md:flex-row flex-wrap lg:flex-nowrap gap-[20px] md:gap-[2%] w-full justify-between relative">
            <Tabs className="flex-[0_0_100%] md:flex-[0_0_23%] w-[100%] lg:w-[23%] order-2 lg:order-1 pr-0 md:pr-[2%]">
              <Tab
                id={1}
                className={`${
                  currentTab == 1 ? "active" : ""
                } tab cursor-pointer font-[400] p-3 border-b border-[#cccccc]
                `}
                onClick={handleClickTab}
              >
                Basic Details
              </Tab>
              <Tab
                id={2}
                className={`${
                  currentTab == 2 ? "active" : ""
                } tab cursor-pointer font-[400] p-3 border-b border-[#cccccc]
                `}
                onClick={handleClickTab}
              >
                Additional Details
              </Tab>
              {marital.toLowerCase() == "married" && (
                <Tab
                  id={3}
                  className={`${
                    currentTab == 3 ? "active" : ""
                  } tab cursor-pointer font-[400] p-3 border-b border-[#cccccc]
                  `}
                  onClick={handleClickTab}
                >
                  Spouse
                </Tab>
              )}
              <Tab
                id={4}
                className={`${
                  currentTab == 4 ? "active" : ""
                } tab cursor-pointer font-[400] p-3 border-b border-[#cccccc]
                `}
                onClick={handleClickTab}
              >
                Personal Preferences
              </Tab>
            </Tabs>
            <div className="pt-5 flex-[0_0_75%] lg:flex-[0_0_55%] w-[75%] lg:w-[55%] w-full profile-form order-3 lg:order-2">
              <div className="title-link-wrap flex items-end justify-between mb-10">
                <h1 className="main-title full flex items-end left  text-left text-4xl md:text-5xl lg:text-6xl w-full">
                  Edit <strong className="ml-2">Profile</strong>
                </h1>
              </div>

              <form
                className="w-full flex gap-[5%] flex-wrap xs:flex-nowrap justify-center"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="profile-image mb-5 md:mb-0 flex-[0_0_50%] sm:flex-[0_0_20%] w-[50%] xs:w-[20%]">
                  <div className="upload-wrap text-center">
                    <div className="avatar">
                      <img
                        src={profileimage ? profileimage : Avatar}
                        alt=""
                        className="h-full max-h-[200px] w-full object-contain object-center"
                      />
                    </div>

                    <div className="bold text-sm mb-2 underline">
                      <label className="cursor-pointer ">
                        Upload Image
                        <input
                          name="profile_image"
                          type="file"
                          hidden
                          accept="image/png, image/jpeg"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                    <div className="text-xs">
                      (JPG or PNG format with maximum size of 1 MB)
                    </div>
                  </div>
                </div>
                <div className="tab-panels flex-[0_0_100%] sm:flex-[0_0_75%] w-[100%] sm:w-[75%]">
                  <TabPanel className="basic" currentTab={currentTab} index={1}>
                    <div className="form-field mb-8 required  items-center">
                      <label className="font-bold">Salutation</label>
                      <div className="field flex-[0_0_100%]">
                        <Controller
                          name="salutation"
                          control={control}
                          rules={{ required: "Please select your salutation." }}
                          render={({ field }: any) => (
                            <Select
                              {...field}
                              options={salutation_options}
                              className={`react-select-container ${
                                errors.salutation ? "error" : ""
                              }`}
                              classNamePrefix="react-select"
                              placeholder="Salutation"
                            />
                          )}
                        />
                        {errors.salutation && (
                          <p role={"alert"} className="text-red-600 text-sm">
                            {errors?.salutation
                              ? errors.salutation.message
                              : null}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-field mb-8 required items-center">
                      <label className="font-bold">First Name</label>
                      <div className="field">
                        <input
                          {...register("first_name", {
                            required: "First Name is required.",
                          })}
                          type="text"
                          id="first_name"
                          name="first_name"
                          className={` ${
                            errors.first_name ? "error" : ""
                          } block w-full text-gray-900 border border-[#cccccc] placeholder:text-gray-400 p-1.5`}
                        />
                        {errors.first_name && (
                          <p role={"alert"} className="text-red-600 text-sm">
                            {errors?.first_name
                              ? errors.first_name.message
                              : null}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-field mb-8 required items-center">
                      <label className="font-bold">Last Name</label>
                      <div className="field">
                        <input
                          {...register("last_name", {
                            required: "Last Name is required.",
                          })}
                          type="text"
                          id="last_name"
                          name="last_name"
                          className={` ${
                            errors.last_name ? "error" : ""
                          } block w-full text-gray-900 border border-[#cccccc] placeholder:text-gray-400 p-1.5`}
                        />
                        {errors.last_name && (
                          <p role={"alert"} className="text-red-600 text-sm">
                            {errors?.last_name
                              ? errors.last_name.message
                              : null}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-field mb-8 required items-center">
                      <label className="font-bold">Email</label>
                      <div className="field">
                        <input
                          {...register("email", {
                            required: "Email is required.",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          type="email"
                          id="email"
                          name="email"
                          className={` ${
                            errors.email ? "error" : ""
                          } block w-full text-gray-900 border border-[#cccccc] placeholder:text-gray-400 p-1.5`}
                        />
                        {errors.email && (
                          <p role={"alert"} className="text-red-600 text-sm">
                            {errors?.email ? errors.email.message : null}
                          </p>
                        )}
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel
                    className="additional"
                    currentTab={currentTab}
                    index={2}
                  >
                    <div className="form-field mb-8 items-center">
                      <label className="font-bold">Mobile number*</label>
                      <div className="field flex-[0_0_100%]">
                        <input
                          {...register("mobile_number", {
                            required: "Mobile Number is required.",
                            pattern: {
                              value: /^\+[1-9]{1}[0-9]{3,14}$/,
                              message: "Invalid Phone Number eg.+6591001002",
                            },
                          })}
                          type="text"
                          id="mobile_number"
                          name="mobile_number"
                          className={` ${
                            errors.mobile_number ? "error" : ""
                          } block w-full text-gray-900 border border-[#cccccc] placeholder:text-gray-400 p-1.5`}
                        />

                        {errors.mobile_number && (
                          <p role={"alert"} className="text-red-600 text-sm">
                            {errors?.mobile_number
                              ? errors.mobile_number.message
                              : null}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-field mb-8 required items-center">
                      <label className="font-bold">Home address</label>
                      <div className="field">
                        <input
                          {...register("home_address", {
                            required: "Home Address is required.",
                          })}
                          type="text"
                          id="home_address"
                          name="home_address"
                          className={` ${
                            errors.home_address ? "error" : ""
                          } block w-full text-gray-900 border border-[#cccccc] placeholder:text-gray-400 p-1.5`}
                        />
                        {errors.home_address && (
                          <p role={"alert"} className="text-red-600 text-sm">
                            {errors?.home_address
                              ? errors.home_address.message
                              : null}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-field mb-8 required  items-center">
                      <label className="font-bold">Country</label>
                      <div className="field flex-[0_0_100%]">
                        <Controller
                          name="country"
                          control={control}
                          rules={{ required: "Country is required" }}
                          render={({ field }: any) => (
                            <Select
                              {...field}
                              options={country_list_options}
                              className={`react-select-container ${
                                errors.country ? "error" : ""
                              }`}
                              classNamePrefix="react-select"
                              placeholder="Country"
                              sel
                            />
                          )}
                        />
                        {errors.country && (
                          <p role={"alert"} className="text-red-600 text-sm">
                            {errors?.country ? errors.country.message : null}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-field mb-8 required items-center">
                      <label className="font-bold">Postal code</label>
                      <div className="field">
                        <input
                          {...register("postal_code", {
                            required: "Postal Code is required.",
                          })}
                          type="text"
                          id="postal_code"
                          name="postal_code"
                          className={` ${
                            errors.postal_code ? "error" : ""
                          } block w-full text-gray-900 border border-[#cccccc] placeholder:text-gray-400 p-1.5`}
                        />
                        {errors.postal_code && (
                          <p role={"alert"} className="text-red-600 text-sm">
                            {errors?.postal_code
                              ? errors.postal_code.message
                              : null}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-field mb-8 required items-center">
                      <label className="font-bold">Nationality</label>
                      <div className="field">
                        <input
                          {...register("nationality", {
                            required: "nationality is required.",
                          })}
                          type="text"
                          id="nationality"
                          name="nationality"
                          className={` ${
                            errors.nationality ? "error" : ""
                          } block w-full text-gray-900 border border-[#cccccc] placeholder:text-gray-400 p-1.5`}
                        />
                        {errors.nationality && (
                          <p role={"alert"} className="text-red-600 text-sm">
                            {errors?.nationality
                              ? errors.nationality.message
                              : null}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-field mb-8 items-center">
                      <label className="font-bold">Date of birth</label>
                      <div className="field">
                        <Controller
                          control={control}
                          name="date_of_birth"
                          rules={{
                            validate: { calculateAge },
                          }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <DatePicker
                              className="block w-full text-gray-900 border border-[#cccccc] placeholder:text-gray-400 p-1.5"
                              onChange={onChange}
                              onBlur={onBlur}
                              selected={value ? new Date(value) : null}
                              showYearDropdown
                              showMonthDropdown
                              dateFormat="yyyy-MM-dd"
                            />
                          )}
                        />

                        {errors.date_of_birth && (
                          <p role={"alert"} className="text-red-600 text-sm">
                            {errors?.date_of_birth
                              ? errors.date_of_birth.message
                              : null}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="form-field mb-8 items-center">
                      <label className="font-bold">Gender</label>
                      <div className="field">
                        <Controller
                          name="gender"
                          rules={{ required: false }}
                          control={control}
                          render={({ field }: any) => (
                            <Select
                              {...field}
                              options={gender_options}
                              className={`react-select-container`}
                              classNamePrefix="react-select"
                              placeholder="Gender"
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption)
                              }
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="form-field mb-8 items-center">
                      <label className="font-bold">Marital Status</label>
                      <div className="field">
                        <Controller
                          name="marital_status"
                          rules={{ required: false }}
                          control={control}
                          render={({ field }: any) => (
                            <Select
                              {...field}
                              onChange={(selectedOption: any) => {
                                setMarital(selectedOption.value);
                                field.onChange(selectedOption);
                              }}
                              options={marital_options}
                              className={`react-select-container`}
                              classNamePrefix="react-select"
                              placeholder="Marital Status"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel
                    className="spouse"
                    currentTab={currentTab}
                    index={3}
                  >
                    <div className="form-field mb-8 items-center">
                      <label className="font-bold">Salutation</label>
                      <div className="field flex-[0_0_100%]">
                        <Controller
                          name="spouse_salutation"
                          control={control}
                          render={({ field }: any) => (
                            <Select
                              {...field}
                              options={salutation_options}
                              className={`react-select-container`}
                              classNamePrefix="react-select"
                              placeholder="Salutation"
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="form-field mb-8 items-center">
                      <label className="font-bold">First Name</label>
                      <div className="field">
                        <input
                          {...register("spouse_first_name", {
                            required: false,
                          })}
                          type="text"
                          id="spouse_first_name"
                          name="spouse_first_name"
                          className={`block w-full text-gray-900 border border-[#cccccc] placeholder:text-gray-400 p-1.5`}
                        />
                      </div>
                    </div>

                    <div className="form-field mb-8 items-center">
                      <label className="font-bold">Last Name</label>
                      <div className="field">
                        <input
                          {...register("spouse_last_name", {
                            required: false,
                          })}
                          type="text"
                          id="spouse_last_name"
                          name="spouse_last_name"
                          className={`block w-full text-gray-900 border border-[#cccccc] placeholder:text-gray-400 p-1.5`}
                        />
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel
                    className="personal-preference"
                    currentTab={currentTab}
                    index={4}
                  >
                    <div className="form-field mb-10 items-center">
                      <label className="font-bold">Hobbies and Interests</label>
                      <div className="field">
                        <input
                          {...register("hobbies_and_interests", {
                            required: false,
                          })}
                          type="text"
                          id="hobbies_and_interests"
                          name="hobbies_and_interests"
                          className={`block w-full text-gray-900 border border-[#cccccc] placeholder:text-gray-400 p-1.5`}
                        />
                      </div>
                    </div>
                    <div className="form-field mb-10 items-center">
                      <label className="font-bold">Favorite sport(s)</label>
                      <div className="field">
                        <input
                          {...register("favourite_sports", {
                            required: false,
                          })}
                          type="text"
                          id="favourite_sports"
                          name="favourite_sports"
                          className={`block w-full text-gray-900 border border-[#cccccc] placeholder:text-gray-400 p-1.5`}
                        />
                      </div>
                    </div>
                    <div className="form-field mb-10 items-center">
                      <label className="font-bold">
                        Preferred music genre(s)
                      </label>
                      <div className="field">
                        <input
                          {...register("preferred_music_genres", {
                            required: false,
                          })}
                          type="text"
                          id="preferred_music_genres"
                          name="preferred_music_genres"
                          className={`block w-full text-gray-900 border border-[#cccccc] placeholder:text-gray-400 p-1.5`}
                        />
                      </div>
                    </div>
                    <div className="form-field mb-10 items-center">
                      <label className="font-bold">
                        Preferred movie/TV show(s)
                      </label>
                      <div className="field">
                        <input
                          {...register("preferred_movies_shows", {
                            required: false,
                          })}
                          type="text"
                          id="preferred_movies_shows"
                          name="preferred_movies_shows"
                          className={`block w-full text-gray-900 border border-[#cccccc] placeholder:text-gray-400 p-1.5`}
                        />
                      </div>
                    </div>
                  </TabPanel>
                  <div className="form-field button-field flex justify-end mt-15 mb-10 gap-2 items-center">
                    <div className="field">
                      <SubmitButton control={control} />
                    </div>
                    <div className="field">
                      <Link to="/my-profile">
                        <button className="main-btn cancel">Cancel</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="flex-[0_0_100%] lg:flex-[0_0_15%] order-1 lg:order-3 text-right pt-5 pb-5 lg:pb-0 lg:relative left-0 lg:left-auto top-[-12%] lg:top-0">
              <Link to="/my-profile">{"<"} Go back to My Profile</Link>
            </div>
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
