import { tokenStore } from './api'

const UPLOAD_URL =
  import.meta.env.VITE_UPLOAD_URL || `${import.meta.env.VITE_API_URL || '/api'}/media/upload`

/**
 * Must match spring.servlet.multipart.max-file-size on the API.
 *
 * Checked before sending so an oversized file fails instantly with a message naming the
 * limit, rather than after uploading the whole thing only to be met with a 413.
 */
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024

export const formatBytes = (bytes) => {
  if (!bytes) return '0 MB'
  const mb = bytes / (1024 * 1024)
  return mb < 1 ? `${Math.round(bytes / 1024)} KB` : `${Number(mb.toFixed(1))} MB`
}

/** The reason this file cannot be uploaded, or null when it is fine to send. */
export function uploadRejectionReason(file) {
  if (!file) return 'No file selected'
  if (file.size === 0) return 'is empty'
  if (file.size > MAX_UPLOAD_BYTES) {
    return `is ${formatBytes(file.size)} — the limit is ${formatBytes(MAX_UPLOAD_BYTES)}`
  }
  return null
}

/**
 * Uploads a single file with progress reporting.
 * XHR is used instead of fetch because fetch has no upload progress events.
 */
export function uploadFile(file, { onProgress, fields } = {}) {
  return new Promise((resolve, reject) => {
    const reason = uploadRejectionReason(file)
    if (reason) {
      reject(new Error(`"${file?.name ?? 'This file'}" ${reason}`))
      return
    }

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
        // The server's own 413 copy ("Uploaded file is too large") names neither the
        // file nor the limit, so say it better here. Reachable despite the pre-check
        // when the two limits drift apart.
        let message =
          xhr.status === 413
            ? `"${file.name}" is too large — the limit is ${formatBytes(MAX_UPLOAD_BYTES)}`
            : `Upload failed (${xhr.status})`
        if (xhr.status !== 413) {
          try {
            message = JSON.parse(xhr.responseText)?.message || message
          } catch {
            // Non-JSON error body: keep the status-code message.
          }
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
