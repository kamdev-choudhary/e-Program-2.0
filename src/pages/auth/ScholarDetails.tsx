import {
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface UserProps {
  _id: string;
  email: string;
  name: string;
  mobile: string;
  role: string;
}

interface ScholarDetailsProps {
  user?: UserProps | null;
}

const ScholarDetails: React.FC<ScholarDetailsProps> = ({ user }) => {
  const [details, setDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const getUserDetails = async () => {
    try {
      setDetails(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    getUserDetails();
  }, [user]);

  return (
    <Card>
      <Typography variant="h6" sx={{ p: 1, fontWeight: "bold" }}>
        More Details
      </Typography>
      <Divider />
      {isLoading ? (
        <CardContent sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </CardContent>
      ) : details && details.length > 0 ? (
        <>
          <CardContent></CardContent>
        </>
      ) : (
        <>
          <CardContent>
            <Typography variant="body1">No Details Found</Typography>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default ScholarDetails;
