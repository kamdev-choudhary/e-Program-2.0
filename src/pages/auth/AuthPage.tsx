import { Box, Tab, Tabs } from "@mui/material";
import Login from "./Login";
import Register from "./Register";
import { useState } from "react";
import { motion } from "framer-motion";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <Box sx={{ maxWidth: 400, m: 1 }}>
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
      <motion.div
        key={activeTab}
        initial={{ rotateY: -90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={{ rotateY: 90, opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{ perspective: 1000 }}
      >
        {activeTab === 0 && <Login setActiveTab={setActiveTab} />}
        {activeTab === 1 && <Register setActiveTab={setActiveTab} />}
      </motion.div>
    </Box>
  );
};

export default AuthPage;
