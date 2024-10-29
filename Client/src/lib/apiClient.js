import axios from "axios"

const apiClient = axios.create({
    baseURL: "http://localhost:1508",
})

export default apiClient
