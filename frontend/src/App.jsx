import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <div className="bg-zinc-900 h-screen w-screen">
        <ToastContainer />
        <Outlet />
      </div>
    </>
  );
};

export default App;
