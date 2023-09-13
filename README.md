# snapml-templates
This repository provides training notebooks for Lens Studio templates powered with Snap ML.
Each notebook allows to train a model which then can be brought into Lens Studio project.

[Lens Studio download page](https://lensstudio.snapchat.com/download/)

[SnapML overview](https://lensstudio.snapchat.com/guides/machine-learning/)

# Templates 

## Style Transfer
Allows you to train Style Transfer model based on provided image. 

<img src="https://user-images.githubusercontent.com/84346153/150581229-c4aa60d6-f371-4919-9372-0f421a9476a3.gif" width="200">

- [Notebook](https://github.com/Snapchat/snapml-templates/blob/main/Style%20Transfer/style_transfer.ipynb)
- Dataset: [COCO](http://cocodataset.org/#explore) dataset
- [Template Guide](https://docs.snap.com/lens-studio/references/templates/ml/style-transfer)

## Classification
Provides an example of binary classification 

<img src="https://user-images.githubusercontent.com/84346153/150581048-13e05812-04ee-44a8-96a6-2f1446243175.gif" width="200">

- [Notebook](https://github.com/Snapchat/snapml-templates/blob/main/Classification/eyeglasses_classification.ipynb)
- Dataset: [CelebA](https://drive.google.com/drive/folders/0B7EVK8r0v71pWEZsZE9oNnFzTm8)
- [Template Guide](https://docs.snap.com/lens-studio/references/templates/ml/classification)

## Object Detection 
Provides an example of the car detection  

<img src="https://user-images.githubusercontent.com/84346153/150581045-40e01183-334c-4631-8115-70b4a0b2c7c3.gif" width="200">

- [Notebook](https://github.com/Snapchat/snapml-templates/blob/main/Object%20Detection/object_detection.ipynb)
- Dataset: [COCO](http://cocodataset.org/#explore)
- [Template Guide](https://docs.snap.com/lens-studio/references/templates/ml/object-detection)

## Custom Segmentation 
Provides an example of pizza segmentation  

<img src="https://user-images.githubusercontent.com/84346153/150581035-bde72638-c804-447d-b9ac-f678bc6f26a1.gif" width="200">

- [Notebook](https://github.com/Snapchat/snapml-templates/blob/main/Custom%20Segmentation/segmentation_training.ipynb)
- Dataset: [COCO](http://cocodataset.org/#explore)
- [Template Guide](https://docs.snap.com/lens-studio/references/templates/ml/custom-segmentation)

## Keyword Detection 
Provides an example of training a model that classifies spectrogram images generated from audio.

<img src="https://user-images.githubusercontent.com/84346153/150581018-e4395543-8685-4d54-a351-a0eb0813cc27.gif" width="200">

- [Notebook](https://github.com/Snapchat/snapml-templates/blob/main/Keyword%20Detection/Keyword_Detection.ipynb)
- Dataset: [SpeechCommands](https://arxiv.org/abs/1804.03209)
- [Template Guide](https://docs.snap.com/lens-studio/references/templates/audio/keyword-detection)

## Image-to-Image Translation
Demonstrates how to train and compress popular image-to-image networks like [CycleGAN](https://junyanz.github.io/CycleGAN/) and [Pix2Pix](https://phillipi.github.io/pix2pix/) so that we could achieve real time performance on mobile devices. 

<img src="https://user-images.githubusercontent.com/84346153/150579553-1b48de31-1fb2-47a7-93fb-7a3dd4369870.gif" width="200">

- [Notebook](https://github.com/Snapchat/snapml-templates/blob/main/Image-to-Image%20Translation/Image_to_Image_translation_with_GAN_Compression.ipynb)
- [Template Guide](https://docs.snap.com/lens-studio/references/templates/ml/style-transfer) (This model is compatible with Style Transfer Template)

## Multi Class Classification with Quantization
Demonstrates how to train an image classification models with Keras and TFLite model maker and quantize them using TensorFlow

<img src="https://user-images.githubusercontent.com/84346153/164765465-8ec22c64-e134-4cb6-903f-57e5c55b4c71.gif" width="200">


- [Notebook](https://github.com/Snapchat/snapml-templates/blob/main/Quantization%20With%20TFLite/classification_and_quantization_with_tflite.ipynb)
- [Template Guide](https://docs.snap.com/lens-studio/references/templates/ml/multi-class-classification)

## Multi-Object Detection
Demonstrates how to train a multi-object detection model using custom datasets annotated by ourselves with a step-by-step example on berries detection.

<img src="https://user-images.githubusercontent.com/81824886/201995717-bffac47a-52ed-41c4-8d4e-184ec6d15092.gif" width="200">

- [Notebook](https://github.com/Snapchat/snapml-templates/blob/main/Multi-Object%20Detection/Multi-Object%20Detection.ipynb)
- [Template Guide](https://docs.snap.com/lens-studio/references/templates/ml/multi-object-detection)


## SnapAR Global Lensathon - SnapML Workshop
Educational walkthrough of how to train your own image classifier from scratch and making it SnapML compatible. This is intended for educational purposes only. Please review relevant dataset licenses prior to usage.

- [Notebook](https://github.com/Snapchat/snapml-templates/blob/9a2b3b6e4aaa93e3a8d39f0322fdcc0a3e4fe622/SnapAR%20Global%20Lensathon%20-%20SnapML%20Workshop/%5BSnap_AR_Lensathon%5D_SnapML_Image_Classification_Tutorial.ipynb)

## Optical Character Recognition
Through Snap’s partnership with OpenCV, we are bringing to you a training notebook that allows you to train ML Models that can be later brought into Lens Studio and used to recognize text in the camera view.

<img src="https://github.com/Snapchat/snapml-templates/assets/84346153/980cecdb-24e8-4abd-897e-288ac39517e6.gif" width="200">

- [Inference Notebook](https://github.com/Snapchat/snapml-templates/blob/main/Optical%20Character%20Recognition/Optical%20Character%20Recognition%20-%20ONNX%20Inference.ipynb)
- [Training Notebook](https://github.com/Snapchat/snapml-templates/blob/main/Optical%20Character%20Recognition/Optical%20Character%20Recognition%20-%20OCR%20Training.ipynb) (optional)
- [Template Guide](https://docs.snap.com/lens-studio/references/templates/ml/optical-character-recognition)

## Real-Time Neural Rendering
The template demonstrates how to render 3D assets real-time on device on Snapchat, using 2D images captured with a phone. There are also notebooks with training code to generate any 3D asset, and helpful guides covering how to deploy these models into a Lens.

<img src="https://github.com/Snapchat/snapml-templates/assets/84346153/f66d670a-734d-405e-a541-4cb456f67b9d" width="200">

This is a state-of-the-art model based on a [research paper](https://snap-research.github.io/MobileR2L/) from Snap’s Creative Vision Research team that was accepted into CVPR this year, one of the most important and major computer vision and ML conferences in the world, where we also presented a live demo. This model and template in Lens Studio showcases how Snap’s research becomes an applied project that any developer can use.

- [Inference Notebook](Neural%20Rendering/Realtime%20Neural%20Rendering.ipynb)
- [Guide](Neural%20Rendering/Advanced%20Neural%20Rendering%20Guide.md)
- [Lens Studio Project](Neural%20Rendering/Lens%20Studio%20Projects/360)



## License
A license file is included with each folder project.
