import { tokenStore } from './api'

const UPLOAD_URL =
  import.meta.env.VITE_UPLOAD_URL || `${import.meta.env.VITE_API_URL || '/api'}/media/upload`

/**
 * Uploads a single file with progress reporting.
 * XHR is used instead of fetch because fetch has no upload progress events.
 */
export function uploadFile(file, { onProgress, fields } = {}) {
  return new Promise((resolve, reject) => {
    const form = new FormData()
    form.append('file', file)
    Object.entries(fields || {}).forEach(([key, value]) => form.append(key, value))

    const xhr = new XMLHttpRequest()
    xhr.open('POST', UPLOAD_URL)

    const token = tokenStore.get()
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          // This request bypasses services/api.js, so the API envelope
          // ({ success, message, data }) has to be unwrapped here too.
          const body = JSON.parse(xhr.responseText)
          resolve(body && typeof body === 'object' && 'data' in body ? body.data : body)
        } catch {
          resolve(xhr.responseText)
        }
      } else {
        let message = `Upload failed (${xhr.status})`
        try {
          message = JSON.parse(xhr.responseText)?.message || message
        } catch {
          // Non-JSON error body: keep the status-code message.
        }
        reject(new Error(message))
      }
    }
    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.onabort = () => reject(new Error('Upload cancelled'))
    xhr.send(form)
  })
}

export async function uploadFiles(files, { onFileProgress } = {}) {
  const results = []
  for (const file of Array.from(files)) {
    results.push(
      await uploadFile(file, { onProgress: (p) => onFileProgress?.(file, p) })
    )
  }
  return results
}
