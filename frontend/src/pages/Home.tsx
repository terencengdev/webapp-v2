import { useEffect, useState } from "react";
import ContactCard from "../components/ContactCard";
import LoadingCard from "../components/LoadingCard";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Select from "react-select";

export default function Home() {
  const [listdata, setListData] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");

  const itemsPerPage = 9;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const results = filteredList.slice(startIndex, endIndex);

  type Option = {
    value: string;
    label: string;
  };
  const countries: Option[] = [
    { value: "all", label: "All" },
    { value: "AU", label: "Australia" },
    { value: "BR", label: "Brazil" },
    { value: "CA", label: "Canada" },
    { value: "CH", label: "Switzerland" },
    { value: "DE", label: "Germany" },
    { value: "DK", label: "Denmark" },
    { value: "ES", label: "Spain" },
    { value: "FI", label: "Finland" },
    { value: "FR", label: "France" },
    { value: "GB", label: "United Kingdom" },
    { value: "IE", label: "Ireland" },
    { value: "IN", label: "India" },
    { value: "IR", label: "Iran" },
    { value: "MX", label: "Mexico" },
    { value: "NL", label: "Netherlands" },
    { value: "NO", label: "Norway" },
    { value: "NZ", label: "New Zealand" },
    { value: "RS", label: "Serbia" },
    { value: "TR", label: "Turkey" },
    { value: "UA", label: "Ukraine" },
    { value: "US", label: "United States" },
  ];

  const gender_options = [
    { value: "all", label: "All" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://randomuser.me/api?results=100&seed=contactlist&exc=login")
      .then((response) => {
        setListData(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    let filtered_data = listdata;

    if (gender && gender !== "all") {
      filtered_data = filtered_data.filter((item) => item.gender === gender);
    }

    if (nationality && nationality !== "all") {
      filtered_data = filtered_data.filter((item) => item.nat === nationality);
    }
    setFilteredList(filtered_data);
  }, [gender, nationality, listdata]);

  useEffect(() => {
    setLoading(true);
  }, [gender, nationality]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [filteredList, currentPage]);

  const handlePageClick = (value: any) => {
    setLoading(true);
    const selectedPage = value.selected + 1;

    setTimeout(() => {
      setCurrentPage(selectedPage);
    }, 500);
  };

  const handleGender = (option: Option | null) => {
    setCurrentPage(1);
    option && setGender(option.value);
  };
  const handleNationality = (option: Option | null) => {
    setCurrentPage(1);
    option && setNationality(option.value);
  };

  return (
    <div className="home pt-10 pb-10">
      <div className="homepage text-sm md:text-base main-section w-full min-h-[90vh] flex">
        <div className="container mx-auto flex flex-col">
          <h1 className="main-title full flex items-end left mb-3 text-left text-4xl md:text-5xl lg:text-6xl  w-full mb-10">
            My <strong>Contacts</strong>
          </h1>

          <div className="filter-dropdown dropdown-wrap flex-wrap md:flex-nowrap flex justify-end items-center gap-5 mb-10">
            <div className="gender-dropdown flex-[0_0_100%] md:flex-[0_0_200px] flex gap-3 items-center">
              <Select
                onChange={handleGender}
                options={gender_options}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Gender"
              />
            </div>
            <div className="countries-dropdown flex-[0_0_100%] md:flex-[0_0_200px] flex gap-3 items-center">
              <Select
                onChange={handleNationality}
                options={countries}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Nationality"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 min-h-[60vh] lg:grid-cols-3 gap-5 items-start justify-center mb-10">
            {results ? (
              loading ? (
                Array.from(Array(9), (_item, index) => {
                  return <LoadingCard key={index} />;
                })
              ) : (
                results.map((item, index) => {
                  return (
                    <ContactCard
                      key={index}
                      className=""
                      imagepath={item.picture.large}
                      name={item.name.first + " " + item.name.last}
                      address={
                        item.location.street.number +
                        " " +
                        item.location.street.name
                      }
                      email={item.email}
                      phone={item.phone}
                    />
                  );
                })
              )
            ) : (
              <div className="no-results h-full text-3xl flex justify-center items-center">
                No results found
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination flex justify-center items-center">
              <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                pageRangeDisplayed={2}
                pageCount={totalPages}
                previousLabel="<"
                renderOnZeroPageCount={null}
                className="flex gap-3 justify-center items-center"
                onPageChange={handlePageClick}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
