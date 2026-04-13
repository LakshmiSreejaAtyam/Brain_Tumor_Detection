from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from PIL import Image
import io
import base64
from utils_cnn import extract_cnn_features

app = Flask(__name__)
CORS(app)

# Load model files
svm_model = joblib.load("cnn_svm_model.pkl")
label_encoder = joblib.load("label_encoder.pkl")
class_centers = joblib.load("class_centers.pkl")

CONF_THRESHOLD = 0.65
DIST_THRESHOLD = 120

STAGE_MAP = {
    "notumor": "No Tumor",
    "pituitary": "Stage I",
    "meningioma": "Stage II",
    "glioma": "Stage III"
}

@app.route("/", methods=["GET"])
def home():
    return "Flask ML API Running"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)
    image_data = data["image"]

    # Decode base64 image
    image_bytes = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_bytes))

    features = extract_cnn_features(image)

    probs = svm_model.predict_proba(features)[0]
    pred_index = np.argmax(probs)
    confidence = float(probs[pred_index])
    tumor_type = label_encoder.inverse_transform([pred_index])[0]

    # Distance calculation
    distances = []
    for label, center in class_centers.items():
        dist = np.linalg.norm(features.flatten() - center)
        distances.append(dist)

    min_distance = min(distances)

    # Decision logic
    if tumor_type == "notumor" and confidence >= 0.75:
        result = {
            "tumor_detected": False,
            "tumor_type": "notumor",
            "stage": "None",
            "confidence": confidence
        }

    elif tumor_type != "notumor" and confidence >= CONF_THRESHOLD and min_distance <= DIST_THRESHOLD:
        result = {
            "tumor_detected": True,
            "tumor_type": tumor_type,
            "stage": STAGE_MAP.get(tumor_type, "Unknown"),
            "confidence": confidence
        }

    else:
        result = {
            "tumor_detected": True,
            "tumor_type": "Unknown",
            "stage": "Unknown",
            "confidence": confidence
        }

    return jsonify(result)


if __name__ == "__main__":
    app.run(port=5100, debug=True)