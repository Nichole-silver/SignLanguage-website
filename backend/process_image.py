import cv2
import mediapipe as mp
from gesture_rules import get_gesture_from_fingers

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True)
mp_draw = mp.solutions.drawing_utils

def detect_gesture(image):
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    result = hands.process(image_rgb)
    
    if not result.multi_hand_landmarks:
            return "Không nhận diện được tay"

    hand_landmarks = result.multi_hand_landmarks[0]
    landmarks = hand_landmarks.landmark

    fingers = []
    tip_ids = [4, 8, 12, 16, 20]
    
    if landmarks[tip_ids[0]].x < landmarks[tip_ids[0] - 1].x:
        fingers.append(1)
    else:
        fingers.append(0)
        
    for id in range(1, 5):
        if landmarks[tip_ids[id]].y < landmarks[tip_ids[id] - 2].y:
            fingers.append(1)
        else:
            fingers.append(0)
    
    return get_gesture_from_fingers(fingers)