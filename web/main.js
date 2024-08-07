import './style.css'
import './index.css'




const htmlBody = document.querySelector('#app')

const server = import.meta.env.VITE_BACKEND_URL
// console.log(import.meta.env.VITE_BACKEND_URL);


export async function uploadImage() {
    // const fileInput = document.getElementById('fileInput')
    // let file = fileInput.files[0]
    let file = null
    // console.log(file)

    const formData = new FormData()

    const canvas = document.getElementById('canvas')
    const jpegFile = canvas.toDataURL('image/jpeg')

    // converting blob to binary-file for uploadFile
    file = dataURLtoFile(jpegFile, 'test.png')

    if (true) {
        formData.append('file', file)

        const result = fetch(`${server}/upload`, {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data)
                return data.prediction
            })
            .catch((error) => {
                console.error('Error:', error)
            })
        return result
    } else {
        console.log('No file selected')
    }
}

// document.getElementById('btn').addEventListener('click', uploadImage)

export function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
}
