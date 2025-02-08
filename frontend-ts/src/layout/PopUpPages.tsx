import React from "react";
import OnlineStatusIndicator from "./OnlineStatusIndicator";
// import ChatbotWithFAB from "../pages/chatbot/ChatBotWithFab";
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
      {/* <ChatbotWithFAB /> */}

      {/* Auth Page */}
      <CustomModal
        open={showAuth}
        header=""
        autoClose={false}
        onClose={() => dispatch({ type: "SET_AUTHPAGE", payload: false })}
        // showHeader={false}
        height="auto"
        width="auto"
      >
        <AuthPage />
      </CustomModal>

      {/* Forgot Password Page */}
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
