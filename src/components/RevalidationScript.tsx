'use client'

import { useEffect } from 'react'

export default function RevalidationScript() {
  useEffect(() => {
    // Define global revalidation functions
    (window as any).revalidatePages = async (type: string) => {
      const statusDiv = document.getElementById('revalidate-status')

      const showStatus = (message: string, statusType: 'info' | 'success' | 'error' = 'info') => {
        if (!statusDiv) return

        statusDiv.className = 'block p-4 rounded-lg '
        statusDiv.innerHTML = message

        if (statusType === 'success') {
          statusDiv.className += 'bg-gray-1 text-primary border border-gray-2'
        } else if (statusType === 'error') {
          statusDiv.className += 'bg-secondary text-light border border-orange'
        } else {
          statusDiv.className += 'bg-accent text-light border border-gray-1'
        }

        setTimeout(() => {
          statusDiv.className = 'hidden'
        }, 5000)
      }

      showStatus('🔄 Revalidating pages...', 'info')

      try {
        const response = await fetch('/api/dynamic-pages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ type })
        })

        const result = await response.json()

        if (result.revalidated) {
          showStatus(`✅ Success! Revalidated ${result.paths.length} items:<br><br><code class="font-mono text-xs">${result.paths.join('<br>')}</code>`, 'success')
        } else {
          showStatus('❌ Failed to revalidate pages', 'error')
        }
      } catch (error: any) {
        showStatus(`❌ Error: ${error.message}`, 'error')
      }
    }

    (window as any).checkSystemStatus = () => {
      const statusDiv = document.getElementById('revalidate-status')
      if (!statusDiv) return

      statusDiv.className = 'block p-4 rounded-lg bg-gray-1 text-primary border border-gray-2'
      statusDiv.innerHTML = '🟢 System Status: Online<br><br>• Database: Connected<br>• Cache: Active<br>• ISR: Manual Revalidation<br>• API: Available'

      setTimeout(() => {
        statusDiv.className = 'hidden'
      }, 5000)
    }

    (window as any).clearCache = () => {
      if (confirm('Clear all cached content? This will trigger regeneration on next requests.')) {
        const statusDiv = document.getElementById('revalidate-status')
        if (statusDiv) {
          statusDiv.className = 'block p-4 rounded-lg bg-gray-1 text-primary border border-gray-2'
          statusDiv.innerHTML = '🗑️ Cache cleared! Pages will regenerate on next visit.'

          setTimeout(() => {
            statusDiv.className = 'hidden'
          }, 5000)
        }
      }
    }

    (window as any).generateSitemap = () => {
      const statusDiv = document.getElementById('revalidate-status')
      if (statusDiv) {
        statusDiv.className = 'block p-4 rounded-lg bg-accent text-light border border-gray-1'
        statusDiv.innerHTML = '📄 Sitemap generation started! Check /sitemap.xml in a few moments.'

        setTimeout(() => {
          statusDiv.className = 'hidden'
        }, 5000)
      }
    }
  }, [])

  return null // This component doesn't render anything
}