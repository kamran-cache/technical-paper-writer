import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setTitle,
  setAuthors,
  addAuthor,
  displayAuthor,
} from "../Redux/titleAndAuthors";

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
    // <div className="flex flex-col h-full w-full items-center justify-center">
    //   <form
    //     onSubmit={(e) => e.preventDefault()} // Prevent default form submission
    //     className="flex flex-col  h-full w-full max-h-[600px] p-4 overflow-y-auto items-center rounded-lg border border-gray-300"
    //   >
    //     <label htmlFor="title" className="mr-6 mb-2 text-left items-start">
    //       Title
    //     </label>
    //     <input
    //       type="text"
    //       id="title"
    //       placeholder="Title"
    //       value={title}
    //       onChange={handleTitleChange}
    //       className="mb-4 w-full p-2 border border-black rounded-lg"
    //     />

    //     {authors &&
    //       authors.map((author, index) => (
    //         <div key={index} className="flex flex-col w-full mb-4 mt-3">
    //           <label htmlFor={`author-name-${index}`} className="mr-4">
    //             Author Name
    //           </label>
    //           <input
    //             type="text"
    //             id={`author-name-${index}`}
    //             value={author.name}
    //             onChange={(e) =>
    //               handleAuthorChange(index, "name", e.target.value)
    //             }
    //             className="w-full p-2 border border-black rounded-lg"
    //           />

    //           <label htmlFor={`author-department-${index}`}>Department</label>
    //           <input
    //             type="text"
    //             id={`author-department-${index}`}
    //             value={author.department}
    //             onChange={(e) =>
    //               handleAuthorChange(index, "department", e.target.value)
    //             }
    //             className="w-full p-2 border border-black rounded-lg"
    //           />

    //           <label htmlFor={`author-organization-${index}`}>
    //             Organization
    //           </label>
    //           <input
    //             type="text"
    //             id={`author-organization-${index}`}
    //             value={author.organization}
    //             onChange={(e) =>
    //               handleAuthorChange(index, "organization", e.target.value)
    //             }
    //             className="w-full p-2 border border-black rounded-lg"
    //           />

    //           <label htmlFor={`author-city-${index}`}>City</label>
    //           <input
    //             type="text"
    //             id={`author-city-${index}`}
    //             value={author.city}
    //             onChange={(e) =>
    //               handleAuthorChange(index, "city", e.target.value)
    //             }
    //             className="w-full p-2 border border-black rounded-lg"
    //           />

    //           <label htmlFor={`author-country-${index}`}>Country</label>
    //           <input
    //             type="text"
    //             id={`author-country-${index}`}
    //             value={author.country}
    //             onChange={(e) =>
    //               handleAuthorChange(index, "country", e.target.value)
    //             }
    //             className="w-full p-2 border border-black rounded-lg"
    //           />

    //           <label htmlFor={`author-email-${index}`}>Email</label>
    //           <input
    //             type="email"
    //             id={`author-email-${index}`}
    //             value={author.email}
    //             onChange={(e) =>
    //               handleAuthorChange(index, "email", e.target.value)
    //             }
    //             className="w-full p-2 border border-black rounded-lg"
    //           />
    //         </div>
    //       ))}

    //     <button
    //       type="button"
    //       onClick={handleAddAuthor}
    //       className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
    //     >
    //       Add Author
    //     </button>
    //   </form>
    // </div>

    <>
      <div className="flex flex-col h-full w-full items-center justify-center">
        <form
          onSubmit={(e) => e.preventDefault()} // Prevent default form submission
          className="flex flex-col h-full w-full max-h-[600px] p-4 overflow-y-auto items-center rounded-lg "
        >
          <div className="w-full mb-4">
            <label htmlFor="title" className="block mb-2 text-left">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Title"
              value={title}
              onChange={handleTitleChange}
              className="w-full p-2 shadow-neutral-400 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
            />
          </div>

          {authors &&
            authors.map((author, index) => (
              <div key={index} className="flex flex-col w-full mb-6">
                <div className="flex flex-col mb-4">
                  <label htmlFor={`author-name-${index}`} className="mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    id={`author-name-${index}`}
                    value={author.name}
                    onChange={(e) =>
                      handleAuthorChange(index, "name", e.target.value)
                    }
                    className="w-full p-2 shadow-neutral-400 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor={`author-department-${index}`}
                      className="mb-2"
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
                      className="w-full p-2 shadow-neutral-400 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor={`author-organization-${index}`}
                      className="mb-2"
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
                      className="w-full p-2 shadow-neutral-400 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col">
                    <label htmlFor={`author-city-${index}`} className="mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      id={`author-city-${index}`}
                      value={author.city}
                      onChange={(e) =>
                        handleAuthorChange(index, "city", e.target.value)
                      }
                      className="w-full p-2 shadow-neutral-400 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor={`author-country-${index}`} className="mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      id={`author-country-${index}`}
                      value={author.country}
                      onChange={(e) =>
                        handleAuthorChange(index, "country", e.target.value)
                      }
                      className="w-full p-2 shadow-neutral-400  rounded-lg bg-gray-200/40 focus:outline-none shadow-md  "
                    />
                  </div>
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
                    className="w-full p-2   shadow-neutral-400 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
                  />
                </div>
              </div>
            ))}

          <button
            type="button"
            onClick={handleAddAuthor}
            className="mt-4 p-2 bg-[#00072d] text-white rounded-lg"
          >
            Add Author
          </button>
        </form>
      </div>
    </>
  );
};

export default TitleAndAuthors;
