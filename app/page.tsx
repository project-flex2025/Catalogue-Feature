"use client"
import AddCategory from "@/components/AddCategory";
import SimpleDialog from "@/components/AddCategory";
import { Button } from "@mui/material";
import { useState, useRef, useEffect } from "react";
// import "./IndustrySelector.css"; // Import the CSS file

export default function IndustrySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSubCat, setIsOpenSubCat] = useState(false);
  const [addCategory, setaddCategory] = useState(false)
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef(null);
  const [categories, setCategories] = useState<any[]>([]);

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
                value: "Product Categories",
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

  if (categories.length > 0) {
    console.log(categories[categories.length - 1].record_id || "", "categories");
  }
  

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

  console.log(filteredIndustries,"filteredIndustries");


  // Handle key navigation (Arrow Up, Arrow Down, Enter)
  const handleKeyDown = (e:any) => {
    console.log("handleKeyDown start",e.key);
    
    
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

  console.log(isOpen,"isOpen");

  const handleSelectCategory = (industry:any) => {
    console.log(isOpen,"isOpen handleSelectCategory start"); 
    setIsOpen(false);
    setSelectedIndustry(industry);
   
    setSearch("");
    console.log(isOpen,"isOpen isOpen handleSelectCategory end");
  }  
  

  return (
    <div className="container">
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
            {filteredIndustries.map((industry, index) => (
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
              <Button onClick={() => setaddCategory(true)} variant="contained" size="small" sx={{m:"5px auto"}}>Add Category</Button>
            </li>
          </ul>
        </div>
      )}
    </div>
    
    <AddCategory
        open={addCategory}
        setOpen={setaddCategory}
        lastRecordId={categories.length > 0 ? categories[categories.length - 1].record_id : ""}
      />    
    </div>
  );
}







// import { useState, useRef, useEffect } from "react";
// export default function IndustrySelector() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [selectedIndustry, setSelectedIndustry] = useState("");
//   const [highlightIndex, setHighlightIndex] = useState(0);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const searchInputRef = useRef(null);

//   const industries = [
//     "E-commerce",
//     "Healthcare",
//     "Finance",
//     "Education",
//     "Real Estate",
//     "Entertainment",
//     "Travel",
//     "Food & Beverage",
//   ];

//   console.log(isOpen,"isOpen");
  

//   // Filter industries based on search input
//   const filteredIndustries = industries.filter((industry) =>
//     industry.toLowerCase().includes(search.toLowerCase())
//   );

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event:any) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // console.log(filteredIndustries,"filteredIndustries");
  

//   // Handle key navigation (Arrow Up, Arrow Down, Enter)
//   const handleKeyDown = (e:any) => {
//     console.log(filteredIndustries,"handleKeyDown start",e.key);
    
//     if (e.key === "ArrowDown") {
//       setHighlightIndex((prev) => (prev + 1) % filteredIndustries.length);
//     } else if (e.key === "ArrowUp") {
//       setHighlightIndex((prev) =>
//         prev === 0 ? filteredIndustries.length - 1 : prev - 1
//       );
//     } else if (e.key === "Enter") {
//       if (filteredIndustries.length > 0) {
//         setSelectedIndustry(filteredIndustries[highlightIndex]);
//         setIsOpen(false);
//         setSearch("");
//       }
//     }
//   };

//   return (
//     <div className="container">
//       {/* Industry Selector */}
//       <div
//         className="dropdown-input"
//         onClick={() => setIsOpen(true)}
//       >
//         <span className={selectedIndustry ? "selected-text" : "placeholder-text"}>
//           {selectedIndustry || "Select your industry"}
//         </span>
//         <span className="arrow">&#9662;</span>
//       </div>

//       {/* Dropdown List */}
//       {isOpen && (
//         <div ref={dropdownRef} className="dropdown-list">
//           {/* Search Input */}
//           <div className="search-box">
//             <input
//               ref={searchInputRef}
//               type="text"
//               className="search-input"
//               placeholder="Search industry..."
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setHighlightIndex(0); // Reset highlight index on search change
//               }}
//               onKeyDown={handleKeyDown}
//               onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
//             />
//           </div>

//           {/* Industry List */}
//           <ul className="industry-list">
//             {filteredIndustries.map((industry, index) => (
//               <li
//                 key={industry}
//                 className={`industry-item ${
//                   index === highlightIndex ? "highlighted" : ""
//                 }`}
//                 onClick={() => {
//                   setSelectedIndustry(industry);
//                   setIsOpen(false);
//                   setSearch("");
//                 }}
//               >
//                 {industry}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }
