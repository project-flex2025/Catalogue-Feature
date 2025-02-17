import { Box, Button, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import * as React from "react";

export default function AddSubCategory({
  open,
  setOpen,
  lastRecordId,
  categoryId,
  searchVal
}: any) {
  const [error, setError] = React.useState("");    

  React.useEffect(() => {
      setSearch(searchVal);
    }, [searchVal]);    
  

  function incrementCategory(category: string) {
    const match = category.match(/(\D+)(\d+)/);
    if (!match) return category;
    const prefix = match[1];
    let number = parseInt(match[2], 10);
    number++;
    const paddedNumber = number.toString().padStart(match[2].length, "0");
    return `${prefix}${paddedNumber}`;
  }

  const [search, setSearch] = React.useState(searchVal);
  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const fetchCategories = async () => {};
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (search === "") {
      setError("Please enter a subcategory name");
      return;
    }

    if(!categoryId){
  alert("Please select a category");
  return;
    }
    try {
      const response = await fetch("api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [
            {
              record_id: `${incrementCategory(lastRecordId)}1`,
              feature_name: "Products",
              added_by: "flex_admin",
              record_status: "active",
              created_on_date: "2025-02-10",
              feature_data: {
                record_data: [
                  {
                    record_label: "Product Name",
                    record_type: "type_text",
                    record_value_text: `${search}`,
                  },
                ],
              },
              more_data: {
                categories: [`${categoryId}`],
              },
            },
          ],
          dataset: "feature_data",
          app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();            
    } catch (err) {
      // setError(err.message);
    } finally {
      // setLoading(false);
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ p: 4, width: 400 }}>
          <Typography sx={{ textAlign: "center", fontSize: "18px", mb: 2 }}>
            Add Sub Categorey
          </Typography>
          <input
            type="text"
            className="search-input"
            placeholder="Search industry..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <Typography sx={{ color: "red", mt: 1, fontSize: "16px" }}>
            {error}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Button
              onClick={handleSubmit}
              variant="contained"
              size="small"
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
