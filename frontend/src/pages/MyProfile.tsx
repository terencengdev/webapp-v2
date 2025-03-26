import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import Tabs from "../components/Tabs";
import Tab from "../components/Tab";
import TabPanel from "../components/TabPanel";
import { useAuth } from "../AuthContext";
import Avatar from "../assets/avatar.svg";
import { FaPen } from "react-icons/fa";

import { ToastContainer, toast, Slide } from "react-toastify";

interface UserInfo {
  salutation: string;
  first_name: string;
  last_name: string;
  email_address: string;
  mobile_number: string;
  home_address: string;
  country: string;
  postal_code: string;
  nationality: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  spouse_salutation: string;
  spouse_first_name: string;
  spouse_last_name: string;
  hobbies_and_interests: string;
  favourite_sports: string;
  preferred_music_genres: string;
  preferred_movies_shows: string;
}

export default function MyProfile() {
  const [currentTab, setCurrentTab] = useState(1);
  const [marital, setMarital] = useState("single");
  const [profileimage, setProfileImage] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const { userid } = useAuth();

  const api_url = "http://localhost:3002";

  useEffect(() => {
    axios
      .get(api_url + "/api/users/" + userid)
      .then((res) => {
        setUserInfo(res.data);
        setProfileImage(res.data.profile_image);
        setMarital(res.data.marital_status);
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          const notify = () =>
            toast.error(
              err.response ? err.response.data.message : err.message,
              {
                position: "bottom-center",
              }
            );
          notify();
        }
      });
  }, []);

  return (
    <>
      <div className="myprofile-page text-sm md:text-base main-section w-full min-h-[90vh] pt-[5%] md:pt-15 pb-10">
        <div className="container">
          <div className="flex flex-col md:flex-row flex-wrap lg:flex-nowrap gap-[20px] md:gap-[2%] w-full justify-between relative">
            <Tabs className="flex-[0_0_100%] md:flex-[0_0_23%] w-[100%] lg:w-[23%] order-2 lg:order-1 pr-0 md:pr-[2%]">
              <Tab
                id={1}
                className={`${
                  currentTab == 1 ? "active" : ""
                } tab cursor-pointer font-[400] p-3 border-b border-[#cccccc]
                `}
                onClick={(_e) => setCurrentTab(1)}
              >
                Basic Details
              </Tab>
              <Tab
                id={2}
                className={`${
                  currentTab == 2 ? "active" : ""
                } tab cursor-pointer font-[400] p-3 border-b border-[#cccccc]
                `}
                onClick={(_e) => setCurrentTab(2)}
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
                  onClick={(_e) => setCurrentTab(3)}
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
                onClick={(_e) => setCurrentTab(4)}
              >
                Personal Preferences
              </Tab>
            </Tabs>
            <div className="pt-5 flex-[0_0_75%] lg:flex-[0_0_55%] w-[75%] lg:w-[55%] w-full profile-form order-3 lg:order-2">
              <div className="title-link-wrap flex items-end justify-between mb-10">
                <h1 className="main-title full flex items-end left  text-left text-4xl md:text-5xl lg:text-6xl w-full">
                  My <strong className="ml-2">Profile</strong>
                </h1>
              </div>
              <div className="w-full flex gap-[5%] flex-wrap xs:flex-nowrap justify-center">
                <div className="profile-image flex-[0_0_50%] sm:flex-[0_0_20%] w-[50%] xs:w-[20%]">
                  <div className="upload-wrap text-center">
                    <div className="avatar">
                      <img
                        src={profileimage ? profileimage : Avatar}
                        alt=""
                        className="h-full max-h-[200px] w-full object-contain object-center"
                      />
                    </div>
                  </div>
                </div>
                <div className="tab-panels flex-[0_0_100%] sm:flex-[0_0_75%] w-[100%] sm:w-[75%]">
                  <TabPanel className="basic" currentTab={currentTab} index={1}>
                    <div className="form-field mb-8 required  items-center">
                      <label className="font-bold">Salutation</label>
                      <div className="field flex-[0_0_100%]">
                        {userInfo && userInfo.salutation}
                      </div>
                    </div>
                    <div className="form-field mb-8 required items-center">
                      <label className="font-bold">First Name</label>
                      <div className="field">
                        {userInfo && userInfo.first_name}
                      </div>
                    </div>

                    <div className="form-field mb-8 required items-center">
                      <label className="font-bold">Last Name</label>
                      <div className="field">
                        {userInfo && userInfo.last_name}
                      </div>
                    </div>

                    <div className="form-field mb-8 required items-center">
                      <label className="font-bold">Email</label>
                      <div className="field">
                        {userInfo && userInfo.email_address}
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
                        {userInfo && userInfo.mobile_number}
                      </div>
                    </div>
                    <div className="form-field mb-8 required items-center">
                      <label className="font-bold">Home address</label>
                      <div className="field">
                        {userInfo && userInfo.home_address}
                      </div>
                    </div>
                    <div className="form-field mb-8 required  items-center">
                      <label className="font-bold">Country</label>
                      <div className="field flex-[0_0_100%]">
                        {userInfo && userInfo.country}
                      </div>
                    </div>
                    <div className="form-field mb-8 required items-center">
                      <label className="font-bold">Postal code</label>
                      <div className="field">
                        {userInfo && userInfo.postal_code}
                      </div>
                    </div>
                    <div className="form-field mb-8 required items-center">
                      <label className="font-bold">Nationality</label>
                      <div className="field">
                        {userInfo && userInfo.nationality}
                      </div>
                    </div>
                    <div className="form-field mb-8 items-center">
                      <label className="font-bold">Date of birth</label>
                      <div className="field">
                        {userInfo && userInfo.date_of_birth}
                      </div>
                    </div>
                    <div className="form-field mb-8 items-center">
                      <label className="font-bold">Gender</label>
                      <div className="field">{userInfo && userInfo.gender}</div>
                    </div>
                    <div className="form-field mb-8 items-center">
                      <label className="font-bold">Marital Status</label>
                      <div className="field">
                        {userInfo && userInfo.marital_status}
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
                        {userInfo && userInfo.spouse_salutation}
                      </div>
                    </div>
                    <div className="form-field mb-8 items-center">
                      <label className="font-bold">First Name</label>
                      <div className="field">
                        {userInfo && userInfo.spouse_first_name}
                      </div>
                    </div>

                    <div className="form-field mb-8 items-center">
                      <label className="font-bold">Last Name</label>
                      <div className="field">
                        {userInfo && userInfo.spouse_last_name}
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
                        {userInfo && userInfo.hobbies_and_interests}
                      </div>
                    </div>
                    <div className="form-field mb-10 items-center">
                      <label className="font-bold">Favorite sport(s)</label>
                      <div className="field">
                        {userInfo && userInfo.favourite_sports}
                      </div>
                    </div>
                    <div className="form-field mb-10 items-center">
                      <label className="font-bold">
                        Preferred music genre(s)
                      </label>
                      <div className="field">
                        {userInfo && userInfo.preferred_music_genres}
                      </div>
                    </div>
                    <div className="form-field mb-10 items-center">
                      <label className="font-bold">
                        Preferred movie/TV show(s)
                      </label>
                      <div className="field">
                        {" "}
                        {userInfo && userInfo.preferred_movies_shows}
                      </div>
                    </div>
                  </TabPanel>
                </div>
              </div>
            </div>
            <div className="flex-[0_0_100%] lg:flex-[0_0_15%] order-1 lg:order-3 text-right pt-5 pb-5 lg:pb-0 lg:relative left-0 lg:left-auto top-[-12%] lg:top-0">
              <Link to="/edit-profile">
                <span className="flex justify-end items-center gap-2">
                  Edit Profile <FaPen />
                </span>
              </Link>
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
