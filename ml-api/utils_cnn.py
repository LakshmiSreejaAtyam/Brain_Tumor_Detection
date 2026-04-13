import numpy as np
from tensorflow.keras.applications import VGG16
from tensorflow.keras.applications.vgg16 import preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image

# Load VGG16 as feature extractor
vgg = VGG16(
    weights="imagenet",
    include_top=False,
    pooling="avg",
    input_shape=(224, 224, 3)
)

vgg.trainable = False

def extract_cnn_features(image):
    # ✅ Convert RGBA → RGB if needed
    if image.mode == "RGBA":
        image = image.convert("RGB")

    img = image.resize((224, 224))
    img = img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = preprocess_input(img)

    features = vgg.predict(img, verbose=0)
    return features.reshape(1, -1)
