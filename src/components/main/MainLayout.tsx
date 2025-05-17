import Navbar from "../Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import Chatbot from "../chatbot/Chatbot";

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow">
                <Outlet />
            </div>
            <Footer />
            <Chatbot />
        </div>
    );
}
export default MainLayout;