import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, SelectChangeEvent } from "@mui/material";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import CustomDropDown from "../../../components/CustomDropDown";
import { RestorePageRounded } from "@mui/icons-material";
import axios from "../../../hooks/AxiosInterceptor";

import { CutoffDataProps, YearsProps, CategoryProp } from "../types";
import DebouncedInput from "../../../components/DebouncedInput";

interface RowData {
  id: number;
  category: string;
  subjectCutoff: number;
  totalCutoff: number;
}

interface CutoffCriteriaProps {
  cutoff: CutoffDataProps | null;
  setCutoff: (value: CutoffDataProps) => void;
  weightage: number | string;
  setWeightage: (value: number | string) => void;
}

type CutoffCategoryKey = Exclude<
  keyof CutoffDataProps,
  "year" | "examName" | "_id"
>;

const categoryMapping: Record<string, CutoffCategoryKey> = {
  General: "general",
  EWS: "ews",
  OBC: "obc",
  ST: "st",
  SC: "sc",
  "General PwD": "generalPwD",
  "EWS PwD": "ewsPwD",
  "OBC PwD": "obcPwD",
  "ST PwD": "stPwD",
  "SC PwD": "scPwD",
  // Preparatory: "preparatory",
};

const computeDisplayedCutoff = (
  original: CutoffDataProps,
  weightage: number | string,
  modified: Partial<CutoffDataProps>
): CutoffDataProps => {
  const weight =
    typeof weightage === "string" ? parseFloat(weightage) || 1 : weightage;

  // Create a copy while preserving non-category fields
  const displayed: CutoffDataProps = { ...original };

  (Object.keys(categoryMapping) as (keyof typeof categoryMapping)[]).forEach(
    (key) => {
      const categoryKey = categoryMapping[key];
      const modifiedCategory = modified[categoryKey] as
        | CategoryProp
        | undefined;
      const originalCategory = original[categoryKey] as CategoryProp;

      if (originalCategory && typeof originalCategory === "object") {
        displayed[categoryKey] = {
          subject:
            modifiedCategory?.subject !== undefined
              ? Number(modifiedCategory.subject)
              : Number(originalCategory.subject) * weight,
          total:
            modifiedCategory?.total !== undefined
              ? Number(modifiedCategory.total)
              : Number(originalCategory.total) * weight,
        };
      }
    }
  );

  return displayed;
};

const CutoffCriteria: React.FC<CutoffCriteriaProps> = ({
  cutoff,
  setCutoff,

  weightage,
  setWeightage,
}) => {
  const [years, setYears] = useState<YearsProps[] | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [originalCutoff, setOriginalCutoff] = useState<CutoffDataProps | null>(
    null
  );
  const [modifiedCutoffs, setModifiedCutoffs] = useState<
    Partial<CutoffDataProps>
  >({});

  useEffect(() => {
    const getJeeAdvancedYears = async () => {
      try {
        const res = await axios.get("/analysis/cutoff/jeeadvanced/metadata");
        setYears(res.data.years);
      } catch (error) {
        console.error(error);
      }
    };
    getJeeAdvancedYears();
  }, []);

  const getCutoff = useCallback(async () => {
    try {
      const res = await axios.get("/analysis/cutoff/jeeadvanced", {
        params: { year: selectedYear },
      });
      const data: CutoffDataProps = res.data.data;
      setOriginalCutoff(data);
      setModifiedCutoffs({});
      const computed = computeDisplayedCutoff(data, weightage, {});
      setCutoff(computed);
    } catch (error) {
      console.error(error);
    }
  }, [selectedYear, setCutoff, weightage]);

  useEffect(() => {
    if (selectedYear) getCutoff();
  }, [selectedYear, getCutoff]);

  useEffect(() => {
    if (originalCutoff) {
      const computed = computeDisplayedCutoff(
        originalCutoff,
        weightage,
        modifiedCutoffs
      );
      setCutoff(computed);
    }
  }, [originalCutoff, weightage, modifiedCutoffs, setCutoff]);

  const rows: RowData[] = cutoff
    ? (Object.entries(categoryMapping) as [string, CutoffCategoryKey][]).map(
        ([categoryLabel, categoryKey], index) => {
          const categoryData = cutoff[categoryKey];

          return {
            id: index + 1,
            category: categoryLabel,
            subjectCutoff: categoryData?.subject ?? 0,
            totalCutoff: categoryData?.total ?? 0,
          };
        }
      )
    : [];

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "SN",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "category",
      headerName: "Category",
      width: 180,
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "subjectCutoff",
      headerName: "Subject Cutoff",
      width: 180,
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 1,
    },
    {
      field: "totalCutoff",
      headerName: "Total Cutoff",
      width: 180,
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 1,
    },
  ];

  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    const categoryKey = categoryMapping[oldRow.category];
    if (!categoryKey || !originalCutoff) return newRow;

    const newSubject = Number(newRow.subjectCutoff) || 0;
    const newTotal = Number(newRow.totalCutoff) || 0;

    setModifiedCutoffs((prev) => ({
      ...prev,
      [categoryKey]: {
        subject: newSubject,
        total: newTotal,
      },
    }));

    return newRow;
  };

  return (
    <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", minWidth: 150 }}>
          <CustomDropDown
            label="Select Year"
            data={years || []}
            name="name"
            dropdownValue="value"
            value={selectedYear}
            onChange={(e: SelectChangeEvent) => setSelectedYear(e.target.value)}
            showClearButton={false}
          />
        </Box>
        <DebouncedInput
          sx={{ minWidth: 150 }}
          value={weightage}
          onChange={setWeightage}
          delay={500}
          placeholder="Weightage"
          label="Weightage"
        />
        <Button
          onClick={() => {
            setWeightage(1);
            getCutoff();
          }}
          startIcon={<RestorePageRounded />}
          variant="contained"
        >
          Reset Cutoff
        </Button>
      </Box>

      <DataGrid
        processRowUpdate={processRowUpdate}
        rows={rows}
        columns={columns}
        autoHeight
      />
    </Box>
  );
};

export default CutoffCriteria;
