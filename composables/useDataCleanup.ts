import { onBeforeUnmount, onUnmounted } from 'vue'

/**
 * Composable for managing data cleanup
 * Ensures Blob URLs and temporary data are cleaned up when components unmount or page unloads
 */
export const useDataCleanup = () => {
  // Track Blob URLs that need to be revoked
  const blobUrls = new Set<string>()

  /**
   * Register a Blob URL for cleanup
   */
  const registerBlobUrl = (url: string) => {
    if (url.startsWith('blob:')) {
      blobUrls.add(url)
    }
  }

  /**
   * Revoke a specific Blob URL
   */
  const revokeBlobUrl = (url: string) => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
      blobUrls.delete(url)
    }
  }

  /**
   * Revoke all registered Blob URLs
   */
  const revokeAllBlobUrls = () => {
    blobUrls.forEach(url => {
      URL.revokeObjectURL(url)
    })
    blobUrls.clear()
  }

  /**
   * Clear temporary data from localStorage/sessionStorage
   * Only clears QR code related data
   */
  const clearTemporaryStorage = () => {
    if (typeof window === 'undefined') return

    try {
      // Clear QR code related items from localStorage
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('qrcode_')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))

      // Clear QR code related items from sessionStorage
      const sessionKeysToRemove: string[] = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && key.startsWith('qrcode_')) {
          sessionKeysToRemove.push(key)
        }
      }
      sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key))
    } catch (err) {
      console.error('Failed to clear temporary storage:', err)
    }
  }

  /**
   * Perform complete cleanup
   */
  const cleanup = () => {
    revokeAllBlobUrls()
    clearTemporaryStorage()
  }

  // Cleanup on component unmount
  onBeforeUnmount(() => {
    cleanup()
  })

  onUnmounted(() => {
    cleanup()
  })

  // Cleanup on page unload
  if (typeof window !== 'undefined') {
    const handleBeforeUnload = () => {
      cleanup()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // Remove event listener on unmount
    onUnmounted(() => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    })
  }

  return {
    registerBlobUrl,
    revokeBlobUrl,
    revokeAllBlobUrls,
    clearTemporaryStorage,
    cleanup
  }
}
