"use client";
import AddCategory from "@/components/AddCategory";
import { Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import AddSubCategory from "./AddSubCategory";

export default function SubCategory({ categoryId, setSubCategory,setsubCategoryId }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSubCat, setIsOpenSubCat] = useState(false);
  const [addCategory, setaddCategory] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  
  const extractRecordIdAndProductName = (records:any) => {
    return records.map((record:any) => {
      // Find the record where record_label is "Product Name"
      const productRecord = record.feature_data?.record_data?.find(
        (item:any) => item.record_label === "Product Name"
      );
  
      return {
        record_id: record.record_id,
        product_name: productRecord?.record_value_text || "N/A" // Default to "N/A" if not found
      };
    });
  };

  let products = categories?.filter((ele: any) =>
    ele?.more_data?.categories?.find((ele: any) => ele == categoryId)
  );

  useEffect(() => {
    setFilteredProducts(extractRecordIdAndProductName(categories) || []);
  }, [categories]);

  let tempArray = extractRecordIdAndProductName(categories);

  // i want to filter caragories based on search
  // const tempfilteredIndustries = categories.flatMap((category: any) =>
  //   category.feature_data?.record_data.filter(
  //     (record: any) => record.record_label === "Product Name"
  //   )
  // );
  

  // Function to extract data

// filteredProducts = extractRecordIdAndProductName(categories);

useEffect(() => {
  setFilteredProducts(tempArray.filter((industry:any) =>
    search ? industry.product_name.toLowerCase().includes(search.toLowerCase()) : true
  ))
 
console.log(filteredProducts,"filteredProducts");

}, [search]);

    // useEffect(() => {
    //   const searchProducts = (search:any) => {
    //     return filteredProducts?.filter((item:any) =>
    //       item.product_name.toLowerCase().includes(search.toLowerCase())
    //     );
    //   };
    //   filteredProducts = searchProducts(search);
    //   console.log(filteredProducts,"filteredProducts");
    // }, [,search]);
    

  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const response = await fetch("api/proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conditions: [
              {
                field: "more_data.categories",
                value: `${categoryId}`,
                search_type: "exact",
              },
            ],
            page: 1,
            limit: 100,
            combination_type: "and",
            dataset: "feature_data",
            app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data || []); // Adjust based on API response
      } catch (err) {
        // setError(err.message);
      } finally {
        // setLoading(false);
      }
    };
    if (categoryId) {
      fetchCategories();
    }
    // fetchCategories();
  }, [categoryId]);

  // Filter industries based on search input
  // const tempfilteredIndustries = categories.flatMap((category: any) =>
  //   category.feature_data?.record_data.filter(
  //     (record: any) => record.record_label === "category_name"
  //   )
  // );

  // const filteredIndustries = tempfilteredIndustries
  //   .map((ele: any) => ele.record_value_text)
  //   .filter((industry) =>
  //     industry.toLowerCase().includes(search.toLowerCase())
  //   );
  // // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsOpenSubCat(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle key navigation (Arrow Up, Arrow Down, Enter)
  const handleKeyDown = (e: any) => {
    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) => (prev + 1) % filteredProducts?.length);
    } else if (e.key === "ArrowUp") {
      setHighlightIndex((prev) =>
        prev === 0 ? filteredProducts?.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      if (filteredProducts?.length > 0) {
        setSelectedIndustry(filteredProducts[highlightIndex]);
        setSubCategory(filteredProducts[highlightIndex]);
        setIsOpen(false);
        setSearch("");
      }
    }
  };

  const handleSelectCategory = (industry:string,record_id: string) => {
    setsubCategoryId(record_id);
    setIsOpen(false);
    setSelectedIndustry(industry);
    setSubCategory(industry);
    setSearch("");
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {/* Industry Selector */}
      <div style={{ position: "relative", width: "60%" }}>
        <div className="dropdown-input" onClick={() => setIsOpen(true)}>
          <span
            className={selectedIndustry ? "selected-text" : "placeholder-text"}
          >
            {selectedIndustry || "Select your category"}
          </span>
          <span className="arrow">&#9662;</span>
        </div>

        {/* Dropdown List */}
        {isOpen && (
          <div ref={dropdownRef} className="dropdown-list">
            {/* Search Input */}
            <div className="search-box">
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="Search industry..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setHighlightIndex(0); // Reset highlight index on search change
                }}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
              />
            </div>

            {/* Industry List */}
            <ul className="industry-list">
                {filteredProducts?.map((industry: any, index: number) => (
                <li
                  key={index}
                  className={`industry-item ${
                  index === highlightIndex ? "highlighted" : ""
                  }`}
                  onClick={() => handleSelectCategory(industry?.product_name, industry?.record_id)}
                >
                  {industry?.product_name}
                </li>
                ))}
              <li
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "5px",
                }}
              >
                <Button
                  onClick={() => setaddCategory(true)}
                  variant="contained"
                  size="small"
                  sx={{ m: "5px auto" }}
                >
                  Add Sub Category
                </Button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <AddSubCategory
        open={addCategory}
        setOpen={setaddCategory}
        lastRecordId={
          categories.length > 0
            ? categories[categories.length - 1]?.record_id
            : ""
        }
        categoryId={categoryId}
        searchVal={search}
      />
    </div>
  );
}
