export function scrollbarWidth() {
  const wrapper = document.createElement('div')
  wrapper.style.position = 'absolute'
  wrapper.style.visibility = 'hidden'
  wrapper.style.overflow = 'hidden'
  wrapper.style.width = '100px'
  wrapper.style.height = '100px'
  wrapper.style.top = '-9999px'

  wrapper.innerHTML = '<div style="width: 200px; height: 200px;"></div>'
  document.body.appendChild(wrapper)

  // Get the scrollbar width
  const withoutScrollbar = wrapper.clientWidth
  wrapper.style.overflow = 'scroll'
  const withScrollbar = wrapper.clientWidth

  // Clean up
  document.body.removeChild(wrapper)

  return Math.round(withoutScrollbar - withScrollbar)
}
