import React, { useEffect, useState } from "react";
import axios from "../../hooks/AxiosInterceptor";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Skeleton,
} from "@mui/material";
import {
  AdminPanelSettingsRounded,
  EngineeringRounded,
  PeopleRounded,
} from "@mui/icons-material";

interface InfoCardProps {
  count: number;
  title: string;
  icon: React.ElementType;
  loading?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({
  count,
  title,
  icon: Icon,
  loading,
}) => {
  return (
    <Card
      sx={{
        width: 300,
        boxShadow: 0.5,
        textAlign: "center",
      }}
    >
      <CardContent>
        {loading ? (
          <Skeleton
            variant="circular"
            width={56}
            height={56}
            sx={{ mx: "auto", mb: 2 }}
          />
        ) : (
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 56,
              height: 56,
              mx: "auto",
              mb: 2,
            }}
          >
            <Icon fontSize="large" />
          </Avatar>
        )}

        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>

        {loading ? (
          <Skeleton variant="text" width={60} height={40} sx={{ mx: "auto" }} />
        ) : (
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            {count}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

interface DashboardData {
  admins: number;
  scholars: number;
  moderators: number;
}

const UserSections: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/dashboard", {
          signal: controller.signal,
        });
        setDashboardData(response.data);
      } catch (err: any) {
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  if (error) {
    return (
      <Box p={2} sx={{ bgcolor: "#fff" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      <InfoCard
        count={dashboardData?.admins ?? 0}
        title="Total Admins"
        icon={AdminPanelSettingsRounded}
        loading={loading}
      />
      <InfoCard
        count={dashboardData?.scholars ?? 0}
        title="Total Scholars"
        icon={PeopleRounded}
        loading={loading}
      />
      <InfoCard
        count={dashboardData?.moderators ?? 0}
        title="Total Moderator"
        icon={EngineeringRounded}
        loading={loading}
      />
    </Box>
  );
};

export default UserSections;
