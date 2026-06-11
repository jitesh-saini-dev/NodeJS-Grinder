import { BrowserRouter, Route, Routes } from "react-router-dom";
import Form from "./component/Form";
import Header from "./component/Header";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Form/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
