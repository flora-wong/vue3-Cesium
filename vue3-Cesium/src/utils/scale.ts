import { transform } from 'typescript'

function getScale(style_width: number, style_height: number) {
  console.log(window.innerWidth, window.innerHeight, style_width, style_height)
  const width = window.innerWidth / style_width
  const height = window.innerHeight / style_height
  console.log(window.innerWidth, window.innerHeight)
  return {
    x: width,
    y: height,
  }
}

export default function setScale(style_width: number, style_height: number) {
  const scale = getScale(style_width, style_height)
  const { x, y } = scale
  console.log('scale', x, y)
  return {
    width: style_width + 'px',
    height: style_height + 'px',
    transform: `scaleY(${y}) scaleX(${x})`,
  }
}
