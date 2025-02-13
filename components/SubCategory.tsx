"use client"
import AddCategory from "@/components/AddCategory";
import { Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import AddSubCategory from "./AddSubCategory";

export default function SubCategory(categoryId:any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSubCat, setIsOpenSubCat] = useState(false);
  const [addCategory, setaddCategory] = useState(false)
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef(null);
  const [categories, setCategories] = useState<any[]>([]);

  console.log(categories[1]?.more_data?.categories.find((ele:any) => ele == "category_002"),"categories");

  let products = categories?.filter((ele:any) => ele?.more_data?.categories?.find((ele:any) => ele == categoryId?.categoryId));


  const temp1 = products?.flatMap((category: any) =>
    category?.feature_data?.record_data
      .filter((record: any) => record.record_label === 
      "Product Name")
  );
  const p = temp1.map((ele:any) => ele.record_value_text).filter((industry) =>
    industry.toLowerCase().includes(search.toLowerCase())
  );

  console.log(temp1,"temp1",p);
  
  

  console.log(categoryId.categoryId,"categoryId");
  
  
  



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
                field: "feature_name",
                value: "Products",
                search_type: "exact",
              },
            ],
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
    fetchCategories();
  }, []);

  

  // Filter industries based on search input
  const tempfilteredIndustries = categories.flatMap((category: any) =>
    category.feature_data?.record_data
      .filter((record: any) => record.record_label === "category_name")
  );

  const filteredIndustries = tempfilteredIndustries.map((ele:any) => ele.record_value_text).filter((industry) =>
    industry.toLowerCase().includes(search.toLowerCase())
  )
  ;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event:any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsOpenSubCat(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  // Handle key navigation (Arrow Up, Arrow Down, Enter)
  const handleKeyDown = (e:any) => {    
    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) => (prev + 1) % filteredIndustries.length);
    } else if (e.key === "ArrowUp") {
      setHighlightIndex((prev) =>
        prev === 0 ? filteredIndustries.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      if (filteredIndustries.length > 0) {
        setSelectedIndustry(filteredIndustries[highlightIndex]);
        setIsOpen(false);
        setSearch("");
      }
    }
  };

  const handleSelectCategory = (industry:any) => {
    setIsOpen(false);
    setSelectedIndustry(industry);
    setSearch("");
  }  
  

  return (
    <div  style={{marginTop:"20px"}} >
      {/* Industry Selector */}
      <div style={{position:"relative"}}>
      <div  className="dropdown-input"
        onClick={() => setIsOpen(true)}
      >
        <span className={selectedIndustry ? "selected-text" : "placeholder-text"}>
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
            {p.map((industry, index) => (
              <li
                key={industry}
                className={`industry-item ${
                  index === highlightIndex ? "highlighted" : ""
                }`}

                  onClick={() => handleSelectCategory(industry)}
              >
                {industry}
              </li>
            ))}
            <li style={{display:"flex",justifyContent:"center",marginBottom:"5px"}}>
              <Button onClick={() => setaddCategory(true)} variant="contained" size="small" sx={{m:"5px auto"}}>Add Sub Category</Button>
            </li>
          </ul>
        </div>
      )}
    </div>

    
    <AddSubCategory
        open={addCategory}
        setOpen={setaddCategory}
        lastRecordId={categories.length > 0 ? categories[categories.length - 1]?.record_id : ""}
        categoryId={categoryId.categoryId}
      />    
    </div>
  );
}