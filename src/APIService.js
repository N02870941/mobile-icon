const API_BASE_URL = `${(process.env.REACT_APP_API_BASE_URL || "http://localhost:8080")}/v1`
const UPLOAD_API_URL = `${API_BASE_URL}/upload`
const SCALES_API_URL = `${API_BASE_URL}/scales`

export default class APIService {
  static loadScales() {
    return fetch(SCALES_API_URL)
    .then(response => response.json())
  }

  static upload(formData) {
    return fetch(UPLOAD_API_URL, { body: formData, method: "post" })
    .then(response => {
      if (!response.ok) {
        throw response.json()
      }
      return response.blob()
    })
    .catch(error => {
      console.error(error)

      throw new Error({
        title: "Oops",
        message: "Something went wrong"
      })
    })
  }
}
