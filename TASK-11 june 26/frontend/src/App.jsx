import { BrowserRouter, Route, Routes } from "react-router-dom";
import Form from "./component/Form";
import Header from "./component/Header";
import BmiUsers from "./component/BmiUsers";
import Bin from "./component/Bin";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/bmiusers" element={<BmiUsers />} />
        <Route path="/bin" element={<Bin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
