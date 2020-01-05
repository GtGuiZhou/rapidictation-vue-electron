import Clipboard from 'clipboard'

export default function handleClipboard(text, event) {
    return new Promise(((resolve, reject) => {
        const clipboard = new Clipboard(event.target, {
            text: () => text
        })
        clipboard.on('success', () => {
            resolve()
            clipboard.destroy()
        })
        clipboard.on('error', () => {
            reject()
            clipboard.destroy()
        })
        clipboard.onClick(event)
    }))
}
