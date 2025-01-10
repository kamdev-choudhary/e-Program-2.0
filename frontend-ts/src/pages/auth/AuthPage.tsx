import { Tab, Tabs } from "@mui/material";
import Login from "./Login";
import Register from "./Register";
import { useState } from "react";
const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div style={{ maxWidth: 400 }}>
      <Tabs
        allowScrollButtonsMobile
        centered
        value={activeTab}
        sx={{ mb: 2 }}
        onChange={(_: React.SyntheticEvent, newValue: number) =>
          setActiveTab(newValue)
        }
      >
        <Tab label="Login" />
        <Tab label="SignUp" />
      </Tabs>
      {activeTab === 0 && <Login setActiveTab={setActiveTab} />}
      {activeTab === 1 && <Register setActiveTab={setActiveTab} />}
    </div>
  );
};

export default AuthPage;
