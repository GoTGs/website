
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

export const axiosConfigAssignment = {
    baseURL: import.meta.env.VITE_BACKEND_URL_ASSIGNMENT,
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
}

export const axiosConfigAI = {
    baseURL: import.meta.env.VITE_BACKEND_URL_AI,
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
}