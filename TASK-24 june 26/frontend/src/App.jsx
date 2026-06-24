import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Header from "./components/Header";
import ViewDetails from "./components/ViewDetails";
import Edit from "./components/Edit";
import Protectedroute from "./components/Protectedroute";
import Bin from "./components/Bin";
import TaskForm from "./components/TaskForm";
import TaskDashboard from "./components/TaskDashboard";
import ViewTask from "./components/ViewTask";
import EditTask from "./components/EditTask";

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
          <Route path="/form" element={<TaskForm />} />
          <Route
            path="/taskdata"
            element={
              <Protectedroute>
                <TaskDashboard />
              </Protectedroute>
            }
          />

          <Route path="/viewtask/:id" element={<ViewTask />} />
          <Route path="/edittask/:id" element={<EditTask />} />

          <Route path="/viewdetails/:id" element={<ViewDetails />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route
            path="/bin"
            element={
              <Protectedroute>
                <Bin />
              </Protectedroute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
