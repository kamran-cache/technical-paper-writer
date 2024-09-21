import { useState } from "react";

// import "./App.css";
// import Form from "./Form";
import Login from "./pages/login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Paper from "./pages/Paper";
import PaperList from "./pages/PaperList";
import Images from "./pages/Images";
import AddPdf from "./components/AddPdf";
import Main from "./pages/Landing/Main";
import CustomPdf from "./components/CustomPdf";
import Navigationlink from "./components/NavigationLink";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/paper-list" element={<PaperList />}></Route>
          <Route exact path="/paper/:id" element={<Paper />}></Route>
          <Route exact path="/add-pdf" element={<AddPdf />}></Route>
          <Route exact path="/pdf/:id" element={<Navigationlink />}></Route>
          <Route exact path="/" element={<Main />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
