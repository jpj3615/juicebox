import { toPng } from 'html-to-image'
import { saveAs } from 'file-saver'

export async function exportChartAsPng(
  element: HTMLElement,
  filename = 'juicebox-chart',
) {
  const dataUrl = await toPng(element, {
    pixelRatio: 2,
    backgroundColor: '#0a0a0a',
  })
  saveAs(dataUrl, `${filename}.png`)
}
