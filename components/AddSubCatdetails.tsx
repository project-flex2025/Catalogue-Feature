import { it } from "node:test";
import { useEffect, useState } from "react";

export default function ItemForm({
  subCategory,
  categoryId,
  subCategoryId,
}: any) {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [temp, setTemp] = useState<any[]>([]);

  console.log(subCategoryId, "subCategoryId---", categories);

  useEffect(() => {
    setItemName(subCategory?.subCategory || "");
  }, [subCategory?.subCategory]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch("api/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            "data": {
              "record_id": `${subCategoryId}` || "",
              "feature_name": "Products",
              "fields_to_update": {
                "feature_data.record_data": [
                          {
                              "record_label": "Product Name",
                              "record_type": "type_text",
                              "record_value_text": `${itemName}` || ""
                          },
                                    {
                                      "record_value_number": `${price}` || "",
                                      "record_label": "Price",
                                      "record_type": "type_number"
                                  },
                                  {
                                      "record_value_text": `${itemDescription}` || "",
                                      "record_label": "Description",
                                      "record_type": "type_text"
                                  }
          
                      ],
                "record_status": "active"
              }
            },
            "dataset": "feature_data",
            "app_secret": "38475203487kwsdjfvb1023897yfwbhekrfj"
          }
      ),
      });
      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }
      const data = await response.json();
    } catch (err) {
      // setError(err.message);
    } finally {
      // setLoading(false);
    }
  };

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
              {
                field: "record_id",
                value: `${subCategoryId}`,
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
  }, [categoryId]);

  useEffect(() => {
    setItemName(
      categories[0]?.feature_data?.record_data?.filter(
        (item: any) => item?.record_label == "Product Name"
      )[0]?.record_value_text || ""
    );
    setItemDescription(
      categories[0]?.feature_data?.record_data?.filter(
        (item: any) => item?.record_label == "Description"
      )[0]?.record_value_text || ""
    );
    setPrice(
      categories[0]?.feature_data?.record_data?.filter(
        (item: any) => item?.record_label == "Price"
      )[0]?.record_value_number || ""
    );
  }, [categories]);

  return (
    <div className="container">
      <h2 className="title">Item Details</h2>
      <form onSubmit={handleSubmit}>
        <table className="form-table">
          <thead>
            <tr>
              <th>Label</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Item Name</td>
              <td>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Enter item name"
                />
              </td>
            </tr>
            <tr>
              <td>Item Description</td>
              <td>
                <textarea
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="Enter item description"
                />
              </td>
            </tr>
            <tr>
              <td>Price</td>
              <td>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit">Submit</button>
      </form>

      <style jsx>{`
        .container {
          margin: 0;
          padding-top: 50px;
          font-family: Arial, sans-serif;
        }
        .title {
          font-size: 24px;
          margin-bottom: 16px;
        }
        .form-table {
          border-collapse: collapse;
          width: 100%;
        }
        th,
        td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
        }
        input,
        textarea {
          width: 100%;
          padding: 6px;
          box-sizing: border-box;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          margin-top: 16px;
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}
