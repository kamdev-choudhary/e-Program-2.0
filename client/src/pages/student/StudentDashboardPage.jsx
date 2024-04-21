import React, { useEffect, useState } from "react";
import { useAuth } from "../../store/Auth";
import StudentProfile from "../../components/StudentProfile";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function DashboardPage() {
  const { userId } = useAuth();
  const [user, setUser] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/auth/user/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setUser(data.user))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <>
      {user && !user.isProfileUpdated && (
        <div>
          <h5>Update Your Profile</h5>
          <StudentProfile user={user} />
        </div>
      )}
    </>
  );
}
