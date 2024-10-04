import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setTitle,
  setAuthors,
  addAuthor,
  displayAuthor,
} from "../Redux/titleAndAuthors";
import { LuCircleDashed } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";

const TitleAndAuthors = () => {
  const dispatch = useDispatch();
  const title = useSelector((state) => state.titleAndAuthors.title);
  const authors = useSelector((state) => state.titleAndAuthors.authors);

  // Handle change for title
  const handleTitleChange = (e) => {
    dispatch(setTitle(e.target.value));
  };

  // Handle change for author fields
  const handleAuthorChange = (index, field, value) => {
    dispatch(setAuthors({ index, field, value }));
  };

  // Add new author
  const handleAddAuthor = () => {
    dispatch(addAuthor());
  };

  return (
    <>
      <div className="flex flex-col h-full w-full items-center justify-center">
        <div className="title w-full h-12 flex items-center justify-start px-4 bg-gradient-to-r from-[#9253FF] to-[#32A8FF] rounded-t-lg">
          <LuCircleDashed className="mx-2 text-white" />

          <h1 className="text-white">Enter a topic</h1>
        </div>
        <form
          onSubmit={(e) => e.preventDefault()} // Prevent default form submission
          className="flex flex-col h-full w-full max-h-[600px] p-4 overflow-y-auto items-center rounded-lg "
        >
          <div className="w-full p-4 mb-4 rounded-lg border-2  border-[#D4D4D4] h-36 ">
            <h1 className="text-lg">Paper Details</h1>
            <hr className=" mt-1 mb-1 w-[90%]  bg-[#d4d4d4] h-[1px]" />
            <label htmlFor="title" className="block mb-2  text-left">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Title"
              value={title}
              onChange={handleTitleChange}
              className="w-full h-[2.5rem] p-2 mb-2 border-2   focus:outline-none shadow-md rounded-md border-[#D4D4D4]"
            />
          </div>

          {authors &&
            authors.map((author, index) => (
              <div
                key={index}
                className="flex flex-col w-full mb-6 h-[500px]  p-4 rounded-lg border-2 border-[#d4d4d4]"
              >
                <div className="index text-lg ">
                  Author Details #{index + 1}
                </div>
                <hr className=" mt-1 mb-1 w-[90%] bg-[#d4d4d4] h-[2px]" />
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor={`author-name-${index}`}
                    className="mb-2 mt-1 text-md"
                  >
                    Author Name
                  </label>
                  <input
                    type="text"
                    id={`author-name-${index}`}
                    value={author.name}
                    onChange={(e) =>
                      handleAuthorChange(index, "name", e.target.value)
                    }
                    className="w-full h-[2.5rem] p-2  focus:outline-none shadow-md rounded-md border-2 border-[#D4D4D4]"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor={`author-email-${index}`}
                    className="mb-2 text-[#00072d]"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id={`author-email-${index}`}
                    value={author.email}
                    onChange={(e) =>
                      handleAuthorChange(index, "email", e.target.value)
                    }
                    className="w-full h-[2.5rem] p-2 mb-2  focus:outline-none shadow-md rounded-md border-2  border-[#D4D4D4]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor={`author-department-${index}`}
                      className="mb-2 text-md"
                    >
                      Department
                    </label>
                    <input
                      type="text"
                      id={`author-department-${index}`}
                      value={author.department}
                      onChange={(e) =>
                        handleAuthorChange(index, "department", e.target.value)
                      }
                      className="w-full h-[2.5rem] p-2   focus:outline-none shadow-md rounded-md border-2  border-[#D4D4D4]"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor={`author-organization-${index}`}
                      className="mb-2 text-md"
                    >
                      Organization
                    </label>
                    <input
                      type="text"
                      id={`author-organization-${index}`}
                      value={author.organization}
                      onChange={(e) =>
                        handleAuthorChange(
                          index,
                          "organization",
                          e.target.value
                        )
                      }
                      className="w-full h-[2.5rem] p-2   focus:outline-none shadow-md rounded-md border-2  border-[#D4D4D4]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor={`author-city-${index}`}
                      className="mb-2 text-md"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id={`author-city-${index}`}
                      value={author.city}
                      onChange={(e) =>
                        handleAuthorChange(index, "city", e.target.value)
                      }
                      className="w-full h-[2.5rem] p-2 mb-2  focus:outline-none shadow-md rounded-md border-2  border-[#D4D4D4]"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor={`author-country-${index}`}
                      className="mb-2 text-md"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      id={`author-country-${index}`}
                      value={author.country}
                      onChange={(e) =>
                        handleAuthorChange(index, "country", e.target.value)
                      }
                      className="w-full h-[2.5rem] p-2 mb-2  focus:outline-none shadow-md rounded-md border-2  border-[#D4D4D4] "
                    />
                  </div>
                </div>
              </div>
            ))}

          <button
            type="button"
            onClick={handleAddAuthor}
            className="flex flex-row items-center justify-center mt-4 p-2 bg-white text-blue-800 border-2 border-blue-800 rounded-lg"
          >
            <FaPlus className="mr-2" />
            Add Author
          </button>
        </form>
      </div>
    </>
  );
};

export default TitleAndAuthors;
