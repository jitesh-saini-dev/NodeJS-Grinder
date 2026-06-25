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
