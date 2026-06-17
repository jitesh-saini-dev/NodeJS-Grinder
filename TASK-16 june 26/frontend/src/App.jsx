import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Header from "./components/Header";
import Form from "./components/Form";
import ViewDetails from "./components/ViewDetails";
import Edit from "./components/Edit";
import Protectedroute from "./components/Protectedroute";
import Bin from "./components/Bin";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <Protectedroute>
                <Home />
              </Protectedroute>
            }
          />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/form" element={<Form />} />
          <Route path="/viewdetails/:id" element={<ViewDetails />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/bin" element={<Bin />} />

        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
