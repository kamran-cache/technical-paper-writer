import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setAbstract,
  setKeywords,
  addKeyword,
} from "../Redux/abstractsAndKeywordsSlice";
import store from "../Redux/store";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { LuCircleDashed } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";
import { RiShining2Line } from "react-icons/ri";
import { FaXmark } from "react-icons/fa6";

const AbstractAndKeywords = () => {
  const dispatch = useDispatch();
  const abstract = useSelector((state) => state.abstractAndKeywords.abstract);
  const keywords = useSelector((state) => state.abstractAndKeywords.keywords);
  const [newKeyword, setNewKeyword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const { id } = useParams();
  const titleofPaper = store.getState().titleAndAuthors.title;
  const token = window.localStorage.getItem("token");

  console.log("abstracts", abstract);
  console.log("keywods", keywords);

  const handleAbstractChange = (e) => {
    dispatch(setAbstract(e.target.value));
  };

  const handleKeywordChange = (e) => {
    setNewKeyword(e.target.value);
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      dispatch(addKeyword(newKeyword.trim()));
      setNewKeyword("");
    }
  };

  const handleKeywordRemove = (index) => {
    const updatedKeywords = keywords.filter((_, i) => i !== index);
    dispatch(setKeywords(updatedKeywords));
  };

  const handleAI = async () => {
    try {
      const formData = {
        titleOfPaper: titleofPaper,
        content: abstract,
        field: "ABSTRACT",
        isChecked: isChecked,
      };
      console.log(formData, "data");
      const response = await axios.post(
        `http://54.84.234.156/api/v1/openai/${id}`,
        formData,
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      console.log(response, "response");
      dispatch(setAbstract(response.data));
    } catch (error) {
      console.log("error occured", error);
    }
  };
  return (
    <>
      <div className="flex flex-col h-full w-full items-center justify-center">
        <div className=" w-full min-h-[58px] flex items-center justify-start px-4 bg-gradient-to-r from-[#9253FF] to-[#32A8FF] rounded-t-lg">
          <LuCircleDashed className="mx-2 text-white text-[20px]" />

          <h1 className="text-white  text-[18px] font-medium">Abstract</h1>
        </div>
        <form
          onSubmit={(e) => e.preventDefault()} // Prevent default form submission
          className="h-full w-full overflow-y-auto flex flex-col items-start rounded-lg justify-center space-y-6 p-4"
        >
          <div className="border-2 border-[#d4d4d4] p-4 w-full rounded-[16px] text-black font-medium">
            <h1 htmlFor="abstract" className="text-sm font-medium mt-3 mb-2">
              Abstract
            </h1>
            <hr className=" mt-1  w-full  bg-[#d4d4d4] h-[1px] mb-2" />
            <textarea
              id="abstract"
              placeholder="Enter abstract"
              value={abstract}
              onChange={handleAbstractChange}
              className="p-2 border-2 text-[14px] font-medium border-[#d4d4d4] focus:outline-none shadow-md rounded-lg h-60 w-full"
            />

            {/* Checkbox */}
            <div className="flex items-center justify-between space-x-2 mb-4 mt-2">
              <div className=" flex items-center justify-center">
                <input
                  type="checkbox"
                  id="checkbox"
                  name="abstract"
                  value="ABSTRACT"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(!isChecked)}
                  className="rounded "
                />
                <label htmlFor="checkbox" className="text-sm ml-2">
                  Refer to the abstract from the uploaded paper.
                </label>
              </div>
              <div className="flex flex-row items-center justify-center border-2 border-blue-500 rounded-lg text-blue-500 p-2 self-start hover:text-white hover:bg-gradient-to-r from-[#9253FF] to-[#32A8FF] transition-all ease-in-out duration-300 hover:border-blue-400 ">
                <RiShining2Line />
                <button type="button" onClick={handleAI} className=" ml-2  ">
                  Optimize with AI
                </button>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="flex flex-col w-full  border-2 border-[#d4d4d4] rounded-lg p-4">
            <label htmlFor="keywords" className="text-sm font-medium">
              Keywords
            </label>
            <hr className=" mt-1  w-full  bg-[#d4d4d4] h-[1px] mb-4" />
            <div className="flex space-x-2">
              <input
                type="text"
                id="keywords"
                placeholder="Add keyword and press enter"
                value={newKeyword}
                onChange={handleKeywordChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddKeyword();
                  }
                }}
                className="p-2 border-2 border-[#d4d4d4] focus:outline-none focus:shadow-md rounded-sm flex-grow"
              />
            </div>

            <div className="flex mt-3 flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <li
                  key={index}
                  className="flex  bg-[#EEF1FF] px-3 py-1 rounded-lg"
                >
                  <span>{keyword}</span>
                  <button
                    type="button"
                    onClick={() => handleKeywordRemove(index)}
                    className=""
                  >
                    <FaXmark className="text-lg ml-2 text-neutral-700 rounded-lg hover:text-neutral-950 transition duration-200" />
                  </button>
                </li>
              ))}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AbstractAndKeywords;
