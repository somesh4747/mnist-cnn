import { uploadImage } from './main'

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

const result = document.getElementById('result')
let isDrawing = false
let x = 0
let y = 0
var offsetX
var offsetY

async function startup() {
    canvas.addEventListener('touchstart', handleStart)
    canvas.addEventListener('touchend', handleEnd)
    canvas.addEventListener('touchcancel', handleCancel)
    canvas.addEventListener('touchmove', handleMove)
    canvas.addEventListener('mousedown', (e) => {
        x = e.offsetX
        y = e.offsetY
        isDrawing = true
    })

    canvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            drawLine(context, x, y, e.offsetX, e.offsetY)
            x = e.offsetX
            y = e.offsetY
        }
    })

    canvas.addEventListener('mouseup', async (e) => {
        if (isDrawing) {
            drawLine(context, x, y, e.offsetX, e.offsetY)
            x = 0
            y = 0
            isDrawing = false
        }

        // setting the output
        const data = await uploadImage()
        result.innerHTML = data
    })
}

document.addEventListener('DOMContentLoaded', startup)

const ongoingTouches = []

function handleStart(evt) {
    evt.preventDefault()
    const touches = evt.changedTouches
    offsetX = canvas.getBoundingClientRect().left
    offsetY = canvas.getBoundingClientRect().top
    for (let i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]))
    }
}

function handleMove(evt) {
    evt.preventDefault()
    const touches = evt.changedTouches
    for (let i = 0; i < touches.length; i++) {
        const color = 'white'
        const idx = ongoingTouchIndexById(touches[i].identifier)
        if (idx >= 0) {
            context.beginPath()
            context.moveTo(
                ongoingTouches[idx].clientX - offsetX,
                ongoingTouches[idx].clientY - offsetY
            )
            context.lineTo(
                touches[i].clientX - offsetX,
                touches[i].clientY - offsetY
            )
            context.lineWidth = document.getElementById('selWidth').value
            context.strokeStyle = color
            context.lineJoin = 'round'
            context.closePath()
            context.stroke()
            ongoingTouches.splice(idx, 1, copyTouch(touches[i])) // swap in the new touch record
        }
    }
}

function handleEnd(evt) {
    evt.preventDefault()
    const touches = evt.changedTouches
    for (let i = 0; i < touches.length; i++) {
        const color = document.getElementById('selColor').value
        let idx = ongoingTouchIndexById(touches[i].identifier)
        if (idx >= 0) {
            context.lineWidth = document.getElementById('selWidth').value
            context.fillStyle = color
            ongoingTouches.splice(idx, 1) // remove it; we're done
        }
    }
}

function handleCancel(evt) {
    evt.preventDefault()
    const touches = evt.changedTouches
    for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier)
        ongoingTouches.splice(idx, 1) // remove it; we're done
    }
}

function copyTouch({ identifier, clientX, clientY }) {
    return { identifier, clientX, clientY }
}

function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
        const id = ongoingTouches[i].identifier
        if (id === idToFind) {
            return i
        }
    }
    return -1 // not found
}

function drawLine(context, x1, y1, x2, y2) {
    context.beginPath()
    context.strokeStyle = 'white'
    context.lineWidth = 11
    context.lineJoin = 'round'
    context.moveTo(x1, y1)
    context.lineTo(x2, y2)
    context.closePath()
    context.stroke()
}

function clearArea() {
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
}

document.getElementById('clrBtn').addEventListener('click', clearArea)
