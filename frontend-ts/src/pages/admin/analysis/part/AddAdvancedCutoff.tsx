import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid2 as Grid,
  Paper,
} from "@mui/material";
import axios from "../../../../hooks/AxiosInterceptor";

interface Category {
  subject: number | "";
  total: number | "";
}

interface CutoffData {
  year: number | "";
  examName: string;
  general: Category;
  obc: Category;
  sc: Category;
  st: Category;
  ews: Category;
  generalPwD: Category;
  obcPwD: Category;
  scPwD: Category;
  stPwD: Category;
  ewsPwD: Category;
  preparatory: { subject: number | ""; total: number | "" };
}

const initialCategory: Category = {
  subject: "",
  total: "",
};

const AddAdvancedCutoff: React.FC = () => {
  const [cutoffData, setCutoffData] = useState<CutoffData>({
    year: "",
    examName: "",
    general: { ...initialCategory },
    obc: { ...initialCategory },
    sc: { ...initialCategory },
    st: { ...initialCategory },
    ews: { ...initialCategory },
    generalPwD: { ...initialCategory },
    obcPwD: { ...initialCategory },
    scPwD: { ...initialCategory },
    stPwD: { ...initialCategory },
    ewsPwD: { ...initialCategory },
    preparatory: { subject: "", total: "" },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    category?: keyof Omit<CutoffData, "year" | "examName">, // This excludes "year" and "examName"
    field?: keyof Category
  ) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);

    if (category && field) {
      // Make sure category is valid before proceeding
      setCutoffData((prev) => ({
        ...prev,
        [category]: {
          ...(prev[category] as Category), // Type-casting category as Category
          [field]: value,
        },
      }));
    } else {
      setCutoffData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/analysis/cutoff/jeeadvanced", {
        data: JSON.stringify(cutoffData),
      });

      if (res.status === 200) {
        alert("Cutoff data added successfully!");
        setCutoffData({
          year: "",
          examName: "",
          general: { ...initialCategory },
          obc: { ...initialCategory },
          sc: { ...initialCategory },
          st: { ...initialCategory },
          ews: { ...initialCategory },
          generalPwD: { ...initialCategory },
          obcPwD: { ...initialCategory },
          scPwD: { ...initialCategory },
          stPwD: { ...initialCategory },
          ewsPwD: { ...initialCategory },
          preparatory: { subject: "", total: "" },
        });
      } else {
        alert("Failed to add cutoff data.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting data.");
    }
  };

  return (
    <Paper elevation={3} sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add JEE Advanced Cutoff
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Year"
              type="number"
              name="year"
              value={cutoffData.year}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Exam Name"
              name="examName"
              value={cutoffData.examName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          {[
            "general",
            "obc",
            "sc",
            "st",
            "ews",
            "generalPwD",
            "obcPwD",
            "scPwD",
            "stPwD",
            "ewsPwD",
          ].map((category) => (
            <Grid size={{ xs: 12 }} key={category}>
              <Paper elevation={2} sx={{ padding: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {category.toUpperCase()} Category
                </Typography>
                <Grid container spacing={2}>
                  {["subject", "total"].map((field) => (
                    <Grid size={{ xs: 6 }} key={field}>
                      <TextField
                        label={field.replace(/([A-Z])/g, " $1")}
                        type="number"
                        value={
                          (
                            cutoffData[category as keyof CutoffData] as Category
                          )[field as keyof Category]
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            category as keyof Omit<
                              CutoffData,
                              "year" | "examName"
                            >,
                            field as keyof Category
                          )
                        }
                        fullWidth
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          ))}

          <Grid size={{ xs: 12 }}>
            <Paper elevation={2} sx={{ padding: 2 }}>
              <Typography variant="h6">Preparatory Category</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    label="Subject"
                    type="number"
                    value={cutoffData.preparatory.subject}
                    onChange={(e) =>
                      handleChange(
                        e,
                        "preparatory" as keyof Omit<
                          CutoffData,
                          "year" | "examName"
                        >,
                        "subject" as keyof Category
                      )
                    }
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    label="Total"
                    type="number"
                    value={cutoffData.preparatory.total}
                    onChange={(e) =>
                      handleChange(
                        e,
                        "preparatory" as keyof Omit<
                          CutoffData,
                          "year" | "examName"
                        >,
                        "total" as keyof Category
                      )
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AddAdvancedCutoff;
