import React, { useState, ChangeEvent } from "react";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  ListItemButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { searchData } from "./searchConfig";

// Define the type of data being searched
interface SearchItem {
  path: string;
  title: string;
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchItem[]>([]); // Strongly type results array
  const navigate = useNavigate();

  // Configure Fuse.js with type inference
  const fuse = new Fuse<SearchItem>(searchData, {
    keys: ["title", "path"],
    threshold: 0.5, // Adjust threshold for better matching
  });

  // Handle search input changes
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (value.trim()) {
      const searchResults = fuse.search(value).map((result) => result.item);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  // Handle result selection
  const handleSelect = (path: string) => {
    setQuery("");
    setResults([]);
    navigate(path);
  };

  return (
    <Box sx={{ position: "relative", width: "100%", maxWidth: "400px" }}>
      <TextField
        fullWidth
        value={query}
        onChange={handleSearch}
        placeholder="Search..."
        variant="outlined"
      />
      {results.length > 0 && (
        <Paper
          sx={{
            position: "absolute",
            top: "40px",
            width: "100%",
            maxHeight: "300px",
            overflowY: "auto",
            borderRadius: "4px",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
            minWidth: 280,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <List sx={{ p: 0, m: 0 }}>
            {results.map((item, index) => (
              <ListItem
                sx={{ p: 0, m: 0 }}
                key={index}
                onClick={() => handleSelect(item.path)}
              >
                <ListItemButton>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;
