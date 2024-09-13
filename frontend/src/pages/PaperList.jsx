// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Paper from "../assets/paper.png";
// import Navigation from "../components/Navigation";
// const PaperList = () => {
//   const [user, setUser] = useState(null); // Initialize with null or empty array if no data
//   const [error, setError] = useState(null); // To handle errors
//   const [PaperList, setPaperList] = useState([]); // State to hold resumes
//   const navigate = useNavigate();
//   const getUser = async () => {
//     try {
//       const token = window.localStorage.getItem("token");

//       if (!token) {
//         console.log("No token found");
//         return;
//       }

//       const response = await axios.get(
//         "http://localhost:5000/api/v1/user/get-user",
//         {
//           headers: {
//             token: `Bearer ${token}`, // Using Authorization header
//           },
//         }
//       );

//       if (response.status === 200) {
//         const data = response.data;
//         setUser(data);
//         setPaperList(data.papers); // Set resume IDs to state
//       } else {
//         console.log("Error getting user info, status:", response.status);
//       }
//     } catch (error) {
//       setError(error.message);
//       console.error("Error fetching user data:", error.message);
//     }
//   };

//   useEffect(() => {
//     getUser();
//     console.log("data", PaperList);
//     // console.log("User Data:", data);
//   }, []);
//   useEffect(() => {
//     console.log("Updated PaperList:", PaperList);
//   }, [PaperList]);

//   const handleClick = async (resumeId) => {
//     if (!resumeId) {
//       // If resumeId is not provided, navigate to the base /resume/ path
//       navigate("/paper");
//     } else {
//       // If resumeId is provided, navigate to /resume/:resumeId
//       navigate(`/paper/${resumeId}`);
//     }
//   };

//   return (
//     <>
//       {/* <Navbar /> */}
//       <Navigation />
//       <div className="h-screen w-full mt-2 flex items-center justify-center">
//         <div className="container ml-8 h-[90%] w-[85%] bg-red-400 ">
//           <h1 className="flex font-Poppins font-semibold items-center justify-center mt-4 text-2xl">
//             Papers List
//           </h1>
//           {error && <p>Error: {error}</p>}
//           {user ? (
//             PaperList.length > 0 ? (
//               <>
//                 <ul className="h-full w-full flex flex-rows items-start justify-center mt-3">
//                   {PaperList.map((paper, index) => (
//                     <>
//                       <li
//                         key={paper}
//                         className="h-[200px] w-[200px] border-2 border-gray-300 shadow-lg m-4 rounded-lg flex flex-col items-center justify-center"
//                       >
//                         <img
//                           src={Paper}
//                           alt=""
//                           className="rounded-full h-12 w-12"
//                         />
//                         {paper.titleAndAuthors.title}
//                         <button
//                           className="h-12 w-16 mt-6 bg-black text-white rounded-lg flex items-center justify-center"
//                           onClick={() => handleClick(paper)}
//                         >
//                           Edit
//                         </button>
//                       </li>

//                       {/* new resume */}
//                     </>
//                   ))}
//                 </ul>
//                 <div className="h-full w-full flex flex-rows items-center justify-center mt-3">
//                   <div
//                     key={"new"}
//                     className="h-[200px] w-[200px] border-2 border-gray-300 shadow-lg m-4 rounded-lg flex flex-col items-center justify-center"
//                   >
//                     Add Paper
//                     <button
//                       className="h-12 w-16 bg-black rounded-lg text-white mt-6"
//                       onClick={() => handleClick()}
//                     >
//                       Edit
//                     </button>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="h-[200px] w-[200px] border-2 border-gray-300 shadow-lg m-4 flex flex-col items-center justify-center">
//                   <h1> Add Paper</h1>
//                   <button
//                     className="h-12 w-16 bg-black text-white flex"
//                     onClick={() => handleClick()}
//                   >
//                     Edit
//                   </button>
//                 </div>
//               </>
//             )
//           ) : (
//             <>
//               <p>Loading.....</p>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default PaperList;

// demo2
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Paper1 from "../assets/paper1.png";
import Navigation from "../components/Navigation";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import "./paperlist.css";
const PaperList = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [PaperList, setPaperList] = useState([]);
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const token = window.localStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await axios.get(
        "http://54.84.234.156/api/v1/user/get-user",
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setUser(data);
        setPaperList(data.papers);
      } else {
        console.log("Error getting user info, status:", response.status);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    if (!window.localStorage.getItem("token")) {
      navigate("/login");
    }
    getUser();
  }, []);

  const handleClick = (paperId) => {
    console.log(paperId, "id");
    navigate(`/paper/${paperId}`);
  };

  const handleDelete = async (paperId) => {
    try {
      console.log(paperId, "id");
      const response = await axios.delete(
        `http://54.84.234.156/api/v1/paper/${paperId}`,
        {
          headers: {
            token: `Bearer ${window.localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        getUser();
      } else {
        console.log("Error deleting paper, status:", response.status);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error deleting paper:", error.message);
    }
  };

  return (
    <>
      <Navigation />
      <div className="h-screen w-full bg-gradient-to-b from-slate-50 to-sky-100 flex items-center justify-center">
        <div className="container ml-10 h-[92%] w-[85%] bg-[#faf5ff]  shadow-xl shadow-neutral-400 p-4 rounded-xl overflow-y-auto scrollbar-hidden border-t-2">
          <h1 className="flex font-Poppins font-semibold items-center justify-center mt-1 mb-5 text-2xl">
            Papers List
          </h1>
          {error && <p>Error: {error}</p>}
          {user ? (
            <ul className="h-full m w-full flex flex-wrap justify-start mt-3 ml-2">
              {PaperList.length > 0 &&
                PaperList.map((paper) => (
                  <li
                    key={paper.id}
                    className="bg-neutral-100 hover:shadow-sky-300 hover:shadow-2xl  mt-8 h-[280px] w-[250px]   shadow-xl shadow-neutral-400 m-4 rounded-xl flex flex-col items-center justify-center"
                  >
                    <div className="mx-auto flex h-[4.5rem] w-[4.5rem] -translate-y-10 transform items-center justify-center rounded-full bg-sky-500 shadow-lg shadow-sky-400/40">
                      <img src={Paper1} alt="" className="h-20 w-20 p-2" />
                    </div>
                    <h1 className="text-gray-800 mb-3 p-2 text-center text-xl font-semibold">
                      {paper.titleAndAuthors.title.length > 45
                        ? `${paper.titleAndAuthors.title.slice(0, 45)}...`
                        : paper.titleAndAuthors.title}
                    </h1>
                    <div className="flex justify-end w-full mt-auto px-4 pb-4">
                      <button
                        className="   flex items-center justify-center"
                        onClick={() => handleClick(paper._id)}
                      >
                        <FiEdit className=" text-neutral-800 text-2xl" />
                      </button>
                      <button
                        className="   flex items-center justify-center"
                        onClick={() => handleDelete(paper._id)}
                      >
                        <MdDeleteOutline className=" text-neutral-800 text-3xl" />
                      </button>
                    </div>
                  </li>
                ))}
              {/* Card to add new paper */}
              <li className="bg-neutral-100 mt-8 h-[280px] w-[250px]  shadow-xl shadow-neutral-400 m-4 rounded-xl flex flex-col items-center justify-center">
                <div className="mx-auto flex h-[4.5rem] w-[4.5rem] -translate-y-10 transform items-center justify-center rounded-full bg-sky-500 shadow-lg shadow-sky-400/40">
                  <img src={Paper1} alt="" className="h-20 w-20 p-2" />
                </div>
                <div className="flex items-center justify-center text-gray-800 mt-3  text-center text-xl font-semibold">
                  Write New Paper
                </div>
                <button
                  className="h-10 w-16 mt-4 bg-black text-white rounded-lg flex items-center justify-center mr-2"
                  onClick={() => handleClick()}
                >
                  Add
                </button>
                <div className="flex justify-center w-full mt-auto px-4 pb-4 "></div>
              </li>
            </ul>
          ) : (
            <p>Loading.....</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PaperList;
