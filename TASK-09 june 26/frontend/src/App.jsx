import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./component/Home";
import Header from "./component/Header";
import Form from "./component/Form";
import ViewDetails from "./component/ViewDetails";
import Bin from "./component/Bin";
import Edit from "./component/Edit";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/viewdetails/:id" element={<ViewDetails />} />
          <Route path="/bin" element={<Bin />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
