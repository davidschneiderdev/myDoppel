


const input = document.getElementById('myImage');

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
])
    .then(getDetection)


async function getDetection() {
    const detections = await faceapi.detectSingleFace(input);
    const labeledFaceDescriptors = await loadReferenceImage();
    const faceMatcher = new faceapi.Facematcher(labeledFaceDescriptors, 0.6)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    console.log(detections);
    console.log(results)
    return detections;
}

function loadReferenceImage() {
    const labels = ['Van Gogh'];
    return Promise.all(
        labels.map(async label => {
            for (let i=1; i<=2; i++) {
                const img = await faceapi.fetchImage(`/reference-image/VanGogh/vanGogh.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandMarks().push(detections.descriptor)
            }
            return new faceapi.labeledFaceDescriptors(label, descriptions)
        })
    )
}


// const input = document.getElementById('myImg');

// const MODEL_URL = `/models`

// async function loadModels() {
//     await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
//     await faceapi.loadFaceLandmarkModel(MODEL_URL)
//     await faceapi.loadFaceRecognitionModel(MODEL_URL)
// }




// loadModels();

// let fullFaceDescriptions = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors();
// fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions);
// faceapi.draw.drawDetections(canvas, fullFaceDescriptions);
// faceapi.draw.drawLandmarks(canvas, fullFaceDescriptions);














// const image = document.getElementById('myImg');
// console.log(image);

// Promise.all ([
//     faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//     faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//     faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
// ]).then(start)

// function start() {
//     const container = document.createElement('div')
//     container.style.position = 'relative';
//     document.body.append(container);
//     document.body.append('Loaded');
//     async function getDetection() {
//         const canvas = faceapi.createCanvasFromMedia(image);
//         container.append(canvas);
//         const displaySize = { width: image.width, height: image.height }
//         faceapi.matchDimensions(canvas, displaySize)
//         const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
//         // document.body.append(detections.length);
//         const resizedDetections = faceapi.resizeResults(detections, displaySize);
//         resizedDetections.forEach(detection => {
//             const box = detection.detection.box;
//             const drawBox = new faceapi.draw.Drawbox(box, { label: 'Face'});
//             drawBox.draw(canvas)
//         })
//     }
//     getDetection();
// }

