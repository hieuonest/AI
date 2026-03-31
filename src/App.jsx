import { ToastContainer } from "react-toastify";
import AppRoutes from "./routers/AppRoutes";
import "react-toastify/dist/ReactToastify.css";
import "./App.css"

function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
