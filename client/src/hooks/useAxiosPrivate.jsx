import { useEffect } from "react";
import { axiosPrivate } from "../axios";


const useAxiosPrivate = () => {

    // =====================================================
    // ADD JWT TOKEN TO EVERY PRIVATE REQUEST
    // =====================================================

    useEffect(() => {

        // Create request interceptor
        //
        // This code runs before every request made
        // using axiosPrivate.
        const requestInterceptor =
            axiosPrivate.interceptors.request.use(

                (config) => {

                    // Get the JWT token that was saved
                    // when the user logged in.
                    const token =
                        localStorage.getItem("accessToken");


                    // If a token exists, add it to
                    // the Authorization header.
                    if (token) {

                        config.headers.Authorization =
                            `Bearer ${token}`;

                    }


                    // Tell the backend that we are
                    // sending JSON data.
                    if (config.data instanceof FormData) {

                        config.headers["Content-Type"] =
                            "multipart/form-data";

                    } else {

                        config.headers["Content-Type"] =
                            "application/json";

                    }


                    // Continue with the request.
                    return config;

                },


                (error) => {

                    // If there is an error while creating
                    // the request, reject it.
                    return Promise.reject(error);

                }

            );


        // =================================================
        // RESPONSE INTERCEPTOR
        // =================================================

        const responseInterceptor =
            axiosPrivate.interceptors.response.use(

                // Successful response
                (response) => {

                    return response;

                },


                // Failed response
                (error) => {

                    return Promise.reject(error);

                }

            );


        // =================================================
        // CLEANUP
        // =================================================

        // Remove the interceptors when the component
        // using this hook is unmounted.
        return () => {

            axiosPrivate.interceptors.request.eject(
                requestInterceptor
            );

            axiosPrivate.interceptors.response.eject(
                responseInterceptor
            );

        };

    }, []);


    // Return the configured Axios instance
    return axiosPrivate;
};


export default useAxiosPrivate;