
const referenceImage = document.getElementById('referenceImage');
const queryImage1 = document.getElementById('queryImage1');

// console.log(faceapi.nets)

async function loadModel() {
    // await faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    // await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
}


async function compareFaces() {
    const results = await faceapi.detectSingleFace(referenceImage).withFaceLandmarks().withFaceDescriptor()
    // console.log(results)

    if (!results) {
        console.log("no face")
        return
    }

    // const faceMatcher = new faceapi.FaceMatcher(results)

    const singleResult = await faceapi.detectSingleFace(queryImage1).withFaceLandmarks().withFaceDescriptor()
    // console.log(results)
    // console.log(singleResult)

    // if (singleResult) {
    //     const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
    //     console.log(bestMatch.toString())
    // }

    const dist = faceapi.euclideanDistance(results.descriptor, singleResult.descriptor)
    console.log(`Euclidean distance: ${dist}`)
}

loadModel()
    .then(console.log('Models loaded'))
    .then(compareFaces)
    // .then(getDetection)


// async function getDetection() {
//     const detection = await faceapi.detectSingleFace(referenceImage)
//     console.log(detection)
// }