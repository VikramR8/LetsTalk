export const HOST=import.meta.env.VITE_SERVER_URL

export const AUTH_ROUTES="api/auth"
export const SIGNUP_ROUTE =`${AUTH_ROUTES}/signup`
export const LOGIN_ROUTE=`${AUTH_ROUTES}/login`
export const GET_USER_INFO=`${AUTH_ROUTES}/userinfo`
export const UPDATED_INFO=`${AUTH_ROUTES}/updateinfo`
export const PROFILE_IMAGE_ROUTE=`${AUTH_ROUTES}/profileimage`
export const DELETE_IMAGE=`${AUTH_ROUTES}/deleteprofileimage`