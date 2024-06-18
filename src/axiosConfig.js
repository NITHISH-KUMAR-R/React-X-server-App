import axios from "axios";
const axiosInstance=axios.create();

axiosInstance.interceptors.request.use(
    ( config ) => {
        let token='';
        if ( localStorage.getItem( 'user' ) ) {
            token=JSON.parse( localStorage.getItem( 'user' ) ).token;
        }
        if ( token ) {
            config.headers.Authorization=`Bearer ${ token }`;
        }
        return config
    },
    ( error ) => {
        return Promise.reject( error )

    }

)
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if ( error.response.status===401||400 ) {
            localStorage.removeItem( 'user' );
            console.log( 'getting 401' )
            window.location.href='/login';
        }
        return Promise.reject( error )
    }
)
export default axiosInstance