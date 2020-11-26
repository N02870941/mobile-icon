const API_PROTOCOL = "http"
const API_HOST = "localhost"
const API_PORT = "5001"
const API_BASE_PATH = "mobile-icon/us-central1/api/v1"
const API_BASE_URL = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/${API_BASE_PATH}`
const UPLOAD_API_URL = `${API_BASE_URL}/upload`
const SCALES_API_URL = `${API_BASE_URL}/scales`

export default class APIService {
  static loadScales() {
    return fetch(SCALES_API_URL)
    .then(response => response.json())
  }
}
