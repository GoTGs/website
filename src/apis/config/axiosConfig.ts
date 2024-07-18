
export const axiosConfigAuth = {
    baseURL: import.meta.env.VITE_BACKEND_URL_AUTHENTICATION,
}

export const axiosConfigUser = {
    baseURL: import.meta.env.VITE_BACKEND_URL_USER,
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
}

export const axiosConfigClassrooms = {
    baseURL: import.meta.env.VITE_BACKEND_URL_CLASSROOM,
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
}