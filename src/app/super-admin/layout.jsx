import { assets } from "@/Assets/assets";
import Sidebar from "@/Components/AdminComponents/newSidebar";
import Image from "next/image";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppProvider } from "@/context/AppContext"; // <-- import your provider
import Navbar from "@/Components/NavbarNew";
import PrivateComponent from "@/Components/privateComponent";
export default function Layout({ children }) {
    return (
      <PrivateComponent>
        <AppProvider> {/* <-- wrap everything with AppProvider */}
<div className="flex flex-col w-full">
  <div className="z-10 relative">
    <Navbar />
  </div>
  <div className="flex flex-row w-full">
    <div className="z-0">
      <Sidebar />
    </div>
    <div className="flex flex-col w-full">
      
      {children}
    </div>
  </div>
</div>
        </AppProvider>
        </PrivateComponent>
    )
}
