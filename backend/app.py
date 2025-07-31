from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
from process_image import detect_gesture

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Flask API đang chạy."})

@app.route('/detect_image', methods=['POST'])
def detect_image():
    image = None

    # Trường hợp 1: nhận ảnh dạng file
    if 'image' in request.files:
        file = request.files['image']
        in_memory_file = file.read()
        npimg = np.frombuffer(in_memory_file, np.uint8)
        image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    # Trường hợp 2: nhận ảnh dạng base64 (từ testapi-mode)
    elif request.is_json:
        data = request.get_json()
        if 'image' in data:
            base64_data = data['image']
            if ',' in base64_data:
                base64_data = base64_data.split(',', 1)[1]
            try:
                image_bytes = base64.b64decode(base64_data)
                npimg = np.frombuffer(image_bytes, np.uint8)
                image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
            except Exception as e:
                return jsonify({'error': f'Lỗi khi decode base64: {str(e)}'}), 400
        else:
            return jsonify({'error': 'Không có ảnh trong dữ liệu JSON'}), 400
    else:
        return jsonify({'error': 'Định dạng không hợp lệ'}), 400

    if image is None:
        return jsonify({'error': 'Không thể đọc ảnh'}), 400

    result = detect_gesture(image)
    return jsonify({'result': result})

if __name__ == '__main__':
    print("API đang chạy tại http://127.0.0.1:5000")
    app.run(debug=True)
