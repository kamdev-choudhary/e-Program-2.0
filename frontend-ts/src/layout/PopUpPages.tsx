import React from "react";
import OnlineStatusIndicator from "../hooks/OnlineStatusIndicator";
import ChatbotWithFAB from "../pages/chatbot/ChatBotWithFab";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { CustomModal } from "../components/CustomModal";
import AuthPage from "../pages/auth/AuthPage";
import UpdatePassword from "./UpdatePassword";

const PopUpPages: React.FC = () => {
  const showAuth = useSelector((state: RootState) => state.showAuth);
  const forgotPassword = useSelector(
    (state: RootState) => state.showForgotPassword
  );
  const dispatch = useDispatch();
  return (
    <>
      {/* Online Status Indicator */}
      <OnlineStatusIndicator />

      {/* ChatBoat with FAB */}
      <ChatbotWithFAB />

      {/* Toast Contained */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        theme="light"
        limit={1}
        style={{ padding: 0 }}
      />

      {/* Auth Page */}
      <CustomModal
        open={showAuth}
        header=""
        autoClose={true}
        onClose={() => dispatch({ type: "SET_AUTHPAGE", payload: false })}
        showHeader={false}
        height="auto"
        width="auto"
      >
        <AuthPage />
      </CustomModal>

      <CustomModal
        open={forgotPassword}
        onClose={() => dispatch({ type: "SET_FORGOTPASSWORD", payload: false })}
        showHeader={false}
        height="auto"
        width="auto"
        header=""
      >
        <UpdatePassword />
      </CustomModal>
    </>
  );
};

export default PopUpPages;
