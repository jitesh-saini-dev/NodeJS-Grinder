import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Header from "./components/Header";
import Protectedroute from "./components/Protectedroute";
import Bin from "./components/Bin";

import ViewTask from "./components/ViewTask";
import EditTask from "./components/EditTask";
import TaskDashboard from "./components/TaskDashboard";
import TaskForm from "./components/TaskForm";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import TaskCalendar from "./components/TaskCalendar";

const App = () => {
  return (
    <>
      <BrowserRouter>
        {/* <Header/> */}
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
          <Route path="/forgotpass" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/task-calendar" element={<TaskCalendar />} />

          <Route path="/viewtask/:id" element={<ViewTask />} />
          <Route path="/edittask/:id" element={<EditTask />} />

          <Route
            path="/taskdata"
            element={
              <Protectedroute>
                <TaskDashboard />
              </Protectedroute>
            }
          />
          <Route path="/form" element={<TaskForm />} />

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
