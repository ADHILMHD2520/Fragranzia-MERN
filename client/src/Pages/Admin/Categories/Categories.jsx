import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "../../../Components/Admin/Sidebar/Sidebar";
import "./Categories.css";

import AdminService from "../../../services/AdminService";


const Categories = () => {

  const [showAddCategory, setShowAddCategory] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const [editCategory, setEditCategory] = useState(null);

  const [categories, setCategories] = useState([]);

  const [showCategory, setShowCategory] = useState(null);


  // =========================
  // ADMIN SERVICE
  // =========================

  const {
    getCategoryData,
    AddCategory,
    EditCategory,
    deleteCategory,
    toggleCategoryStatus
  } = AdminService();


  // =========================
  // VIEW CATEGORIES
  // =========================

  const fetchCategories = async () => {

    try {

      const data = await getCategoryData();

      console.log(data);

      setCategories(data.categories || []);

    } catch (error) {

      console.error(
        "Error fetching categories:",
        error.response?.data?.message || error.message
      );

    }
  };


  // =========================
  // LOAD CATEGORIES
  // =========================

  useEffect(() => {

    fetchCategories();

  }, []);


  // =========================
  // CREATE CATEGORY
  // =========================

  const addCategory = async () => {

    try {

      const data = {
        name: categoryName,
        description: categoryDescription
      };

      const response = await AddCategory(data);

      console.log(response);

      await fetchCategories();

      setCategoryName("");
      setCategoryDescription("");

      setShowAddCategory(false);

    } catch (error) {

      console.error(
        "Error adding category:",
        error.response?.data?.message || error.message
      );

    }
  };


  // =========================
  // UPDATE CATEGORY
  // =========================

  const updateCategory = async () => {

    try {

      const data = {
        name: categoryName,
        description: categoryDescription
      };

      const response = await EditCategory(
        editCategory._id,
        data
      );

      console.log(response);

      await fetchCategories();

      setCategoryName("");
      setCategoryDescription("");

      setEditCategory(null);

      setShowAddCategory(false);

    } catch (error) {

      console.error(
        "Error updating category:",
        error.response?.data?.message || error.message
      );

    }
  };


  // =========================
  // DELETE CATEGORY
  // =========================

  const handleDeleteCategory = async (categoryId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await deleteCategory(categoryId);

      console.log(response);

      await fetchCategories();

      toast.success("Category deleted successfully");

    } catch (error) {

      console.error(
        "Error deleting category:",
        error.response?.data?.message || error.message
      );

      toast.error(
        error.response?.data?.message ||
        "Error deleting category"
      );

    }
  };


  // =========================
  // TOGGLE CATEGORY STATUS
  // =========================

  const handleToggleStatus = async (categoryId) => {

    try {

      const response = await toggleCategoryStatus(categoryId);

      console.log(response);

      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === categoryId
            ? {
              ...category,
              isActive: response.category.isActive
            }
            : category
        )
      );

      toast.success(response.message);

    } catch (error) {

      console.error(
        "Error updating category status:",
        error.response?.data?.message || error.message
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to update category status"
      );

    }
  };


  // =========================
  // OPEN ADD CATEGORY
  // =========================

  const openAddCategory = () => {

    setEditCategory(null);

    setCategoryName("");
    setCategoryDescription("");

    setShowAddCategory(true);

  };


  // =========================
  // OPEN EDIT CATEGORY
  // =========================

  const openEditCategory = (category) => {

    setEditCategory(category);

    setCategoryName(category.name);

    setCategoryDescription(
      category.description || ""
    );

    setShowAddCategory(true);

  };


  // =========================
  // CLOSE DRAWER
  // =========================

  const closeDrawer = () => {

    setShowAddCategory(false);

    setEditCategory(null);

    setCategoryName("");
    setCategoryDescription("");

  };


  // =========================
  // SHOW CATEGORY
  // =========================

  const handleShowCategory = (category) => {

    setShowCategory(category);

  };


  return (

    <div className="admin-categories-container">


      {/* <Sidebar /> */}


      <div className="categories-page">


        {/* =========================
            ACTIONS
        ========================= */}

        <div className="categories-actions">

          <div>

            <button className="export-btn">
              Export
            </button>

            <button className="import-btn">
              Import
            </button>

          </div>


          <button
            className="add-category-btn"
            onClick={openAddCategory}
          >
            + Add Category
          </button>

        </div>


        {/* =========================
            CATEGORY TABLE
        ========================= */}

        <div className="categories-table-container">

          <table>

            <thead>

              <tr>

                <th>Name</th>

                <th>Description</th>

                <th>Actions</th>

                <th>Status</th>

              </tr>

            </thead>


            <tbody>

              {categories.map((category) => (

                <tr key={category._id}>

                  {/* NAME */}

                  <td>
                    {category.name}
                  </td>


                  {/* DESCRIPTION */}

                  <td>

                    {category.description?.length > 50
                      ? `${category.description.substring(0, 50)}...`
                      : category.description}

                  </td>


                  {/* ACTIONS */}

                  <td>

                    <button
                      className="show-btn"
                      onClick={() =>
                        handleShowCategory(category)
                      }
                    >
                      ◉ Show
                    </button>


                    <button
                      className="edit-btn"
                      onClick={() =>
                        openEditCategory(category)
                      }
                    >
                      ✎ Edit
                    </button>


                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDeleteCategory(category._id)
                      }
                    >
                      🗑 Delete
                    </button>

                  </td>


                  {/* STATUS */}

                  <td>

                    <button
                      className="status-btn"
                      onClick={() =>
                        handleToggleStatus(category._id)
                      }
                    >
                      {category.isActive
                        ? "Block"
                        : "Unblock"}
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* =========================
          ADD / EDIT CATEGORY DRAWER
      ========================= */}

      {showAddCategory && (

        <div className="add-category-overlay">

          <div className="add-category-drawer">


            {/* HEADER */}

            <div className="add-category-header">

              <h2>

                {editCategory
                  ? "Edit Category"
                  : "Add Category"}

              </h2>


              <button
                className="close-category-btn"
                onClick={closeDrawer}
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <div className="add-category-form">


              {/* NAME */}

              <label>
                Name
              </label>


              <input
                type="text"
                placeholder="Category title"
                value={categoryName}
                onChange={(e) =>
                  setCategoryName(e.target.value)
                }
              />


              {/* DESCRIPTION */}

              <label>
                Description
              </label>


              <textarea
                placeholder="Category Description"
                value={categoryDescription}
                onChange={(e) =>
                  setCategoryDescription(e.target.value)
                }
              />


              {/* BUTTONS */}

              <div className="add-category-buttons">


                <button
                  className="cancel-category-btn"
                  onClick={closeDrawer}
                >
                  Cancel
                </button>


                <button
                  className="submit-category-btn"
                  onClick={
                    editCategory
                      ? updateCategory
                      : addCategory
                  }
                >

                  {editCategory
                    ? "Update Category"
                    : "Add Category"}

                </button>


              </div>

            </div>

          </div>

        </div>

      )}

      {/* =========================
    SHOW CATEGORY
========================= */}

      {showCategory && (

        <div className="show-category-overlay">

          <div className="show-category-modal">

            {/* HEADER */}

            <div className="show-category-header">

              <h2>
                Category Details
              </h2>

              <button
                className="close-show-category-btn"
                onClick={() => setShowCategory(null)}
              >
                ×
              </button>

            </div>


            {/* CONTENT */}

            <div className="show-category-content">

              {/* NAME */}

              <div className="show-category-field">

                <label>
                  Name
                </label>

                <p className="category-name-box">
                  {showCategory.name}
                </p>

              </div>


              {/* DESCRIPTION */}

              <div className="show-category-field">

                <label>
                  Description
                </label>

                <div className="category-description-box">

                  {showCategory.description ||
                    "No description available"}

                </div>

              </div>


              {/* STATUS */}

              <div className="show-category-field">

                <label>
                  Status
                </label>

                <p className="category-status-box">

                  {showCategory.isActive
                    ? "Active"
                    : "Blocked"}

                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};


export default Categories;