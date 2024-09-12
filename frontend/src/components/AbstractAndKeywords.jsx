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
        `http://localhost:5000/api/v1/openai/${id}`,
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
    <form
      onSubmit={(e) => e.preventDefault()} // Prevent default form submission
      className="h-full w-full overflow-y-auto flex flex-col items-start rounded-lg justify-center space-y-6 p-4"
    >
      {/* Abstract */}
      <label htmlFor="abstract" className="text-sm font-medium">
        Abstract
      </label>
      <textarea
        id="abstract"
        placeholder="Enter abstract"
        value={abstract}
        onChange={handleAbstractChange}
        className="p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg h-64 w-full"
      />

      {/* Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="checkbox"
          name="abstract"
          value="ABSTRACT"
          checked={isChecked}
          onChange={(e) => setIsChecked(!isChecked)}
          className="rounded"
        />
        <label htmlFor="checkbox" className="text-sm">
          Refer to the abstract from the uploaded paper.
        </label>
      </div>

      {/* AI Writing */}
      <button
        type="button"
        onClick={handleAI}
        className="bg-gradient-to-r from-sky-500  to-fuchsia-600 via-violet-500 rounded-lg text-white p-2 self-start"
      >
        Write with AI
      </button>

      {/* Keywords */}
      <div className="flex flex-col w-full space-y-4">
        <label htmlFor="keywords" className="text-sm font-medium">
          Keywords
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            id="keywords"
            placeholder="Add keyword"
            value={newKeyword}
            onChange={handleKeywordChange}
            className="p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg flex-grow"
          />
          <button
            type="button"
            onClick={handleAddKeyword}
            className="p-2 bg-[#00072d] text-white rounded-lg"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {keywords.map((keyword, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 p-2 rounded-lg"
            >
              <span>{keyword}</span>
              <button
                type="button"
                onClick={() => handleKeywordRemove(index)}
                className=""
              >
                <MdDeleteOutline className="text-2xl text-neutral-700 rounded-lg hover:text-neutral-950 transition duration-200" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
};

export default AbstractAndKeywords;
