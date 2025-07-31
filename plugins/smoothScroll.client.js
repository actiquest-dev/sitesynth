export default defineNuxtPlugin(() => {
  // Function to get the current header height
  const getHeaderHeight = () => {
    const header = document.querySelector('header') || 
                   document.querySelector('[data-header]') || 
                   document.querySelector('.header') ||
                   document.querySelector('nav')
    
    if (header) {
      return header.offsetHeight
    }
    
    // Fallback: try to find any fixed positioned element at the top
    const fixedElements = document.querySelectorAll('[style*="position: fixed"], .fixed')
    for (const el of fixedElements) {
      const rect = el.getBoundingClientRect()
      if (rect.top === 0) {
        return rect.height
      }
    }
    
    return 0 // No header found
  }

  // Custom smooth scroll function with dynamic offset
  const smoothScrollTo = (targetId, extraOffset = 20) => {
    const target = document.getElementById(targetId.replace('#', ''))
    if (target) {
      const headerHeight = getHeaderHeight()
      const totalOffset = headerHeight + extraOffset
      const targetPosition = target.offsetTop - totalOffset
      
      window.scrollTo({
        top: Math.max(0, targetPosition), // Ensure we don't scroll above the page
        behavior: 'smooth'
      })
    }
  }

  // Override default anchor link behavior
  const handleAnchorClick = (event) => {
    const href = event.target.getAttribute('href')
    
    // Check if it's an internal anchor link
    if (href && href.startsWith('#') && href.length > 1) {
      event.preventDefault()
      smoothScrollTo(href)
    }
  }

  // Add event listeners when DOM is ready
  if (process.client) {
    const addClickListeners = () => {
      document.addEventListener('click', (event) => {
        if (event.target.tagName === 'A' || event.target.closest('a')) {
          const link = event.target.tagName === 'A' ? event.target : event.target.closest('a')
          handleAnchorClick({ target: link, preventDefault: () => event.preventDefault() })
        }
      })
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addClickListeners)
    } else {
      addClickListeners()
    }
  }

  // Make the function globally available
  return {
    provide: {
      smoothScrollTo
    }
  }
})
