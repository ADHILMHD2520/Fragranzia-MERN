import useAxiosPrivate from "../hooks/useAxiosPrivate";


const AdminService = () => {


    // =====================================================
    // PRIVATE AXIOS
    // =====================================================

    const axiosPrivate = useAxiosPrivate();



    // =====================================================
    // PRODUCTS
    // =====================================================


    const addToProduct = async (data) => {

        const response =
            await axiosPrivate.post(
                "/products",
                data
            );

        return response.data;

    };


    const updateProduct = async (
        productId,
        data
    ) => {

        const response =
            await axiosPrivate.put(
                `/products/${productId}`,
                data
            );

        return response.data;

    };


    const getProductData = async () => {

        const response =
            await axiosPrivate.get(
                "/products"
            );

        return response.data;

    };



    // =====================================================
    // CATEGORIES
    // =====================================================


    // GET ALL CATEGORIES

    const getCategoryData = async () => {

        const response =
            await axiosPrivate.get(
                "/categories"
            );

        return response.data;

    };


    // ADD CATEGORY

    const AddCategory = async (data) => {

        const response =
            await axiosPrivate.post(
                "/categories",
                data
            );

        return response.data;

    };


    // UPDATE CATEGORY

    const EditCategory = async (
        categoryId,
        data
    ) => {

        const response =
            await axiosPrivate.put(
                `/categories/${categoryId}`,
                data
            );

        return response.data;

    };


    // DELETE CATEGORY

    const deleteCategory = async (
        categoryId
    ) => {

        const response =
            await axiosPrivate.delete(
                `/categories/${categoryId}`
            );

        return response.data;

    };


    // BLOCK / UNBLOCK CATEGORY

    const toggleCategoryStatus = async (categoryId) => {
        const response = await axiosPrivate.put(
            `/categories/${categoryId}/status`
        );

        return response.data;
    };



    // =====================================================
    // CART
    // =====================================================


    const handleRemoveFromCart = async (
        productId
    ) => {

        const response =
            await axiosPrivate.delete(
                `/cart/${productId}`
            );

        return response.data;

    };



    // =====================================================
    // GET CURRENT USER
    // =====================================================


    const getCurrentUser = async () => {

        const response =
            await axiosPrivate.get(
                "/profile"
            );

        return response.data;

    };



    // =====================================================
    // UPDATE CURRENT USER
    // =====================================================


    const updateCurrentUser = async (
        data
    ) => {

        const response =
            await axiosPrivate.put(
                "/profile",
                data
            );

        return response.data;

    };



    // =====================================================
    // ADDRESSES
    // =====================================================


    const getAddresses = async () => {

        const response =
            await axiosPrivate.get(
                "/addresses"
            );

        return response.data;

    };


    const addAddress = async (data) => {

        const response =
            await axiosPrivate.post(
                "/addresses",
                data
            );

        return response.data;

    };


    const updateAddress = async (
        addressId,
        data
    ) => {

        const response =
            await axiosPrivate.put(
                `/addresses/${addressId}`,
                data
            );

        return response.data;

    };


    const deleteAddress = async (
        addressId
    ) => {

        const response =
            await axiosPrivate.delete(
                `/addresses/${addressId}`
            );

        return response.data;

    };


    const setPrimaryAddress = async (
        addressId
    ) => {

        const response =
            await axiosPrivate.patch(
                `/addresses/${addressId}/primary`
            );

        return response.data;

    };



    // =====================================================
    // RETURN
    // =====================================================

    return {


        // =================================================
        // PRODUCTS
        // =================================================

        addToProduct,

        updateProduct,

        getProductData,



        // =================================================
        // CATEGORIES
        // =================================================

        getCategoryData,

        AddCategory,

        EditCategory,

        deleteCategory,

        toggleCategoryStatus,



        // =================================================
        // CART
        // =================================================

        handleRemoveFromCart,



        // =================================================
        // PROFILE
        // =================================================

        getCurrentUser,

        updateCurrentUser,



        // =================================================
        // ADDRESSES
        // =================================================

        getAddresses,

        addAddress,

        updateAddress,

        deleteAddress,

        setPrimaryAddress

    };

};


export default AdminService;