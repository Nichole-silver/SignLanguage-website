def get_gesture_from_fingers(fingers):
    if fingers == [0, 1, 1, 0, 0]:
        return "V"
    elif fingers == [0, 1, 0, 0, 0]:
        return "L"
    elif fingers == [0, 1, 1, 1, 0]:
        return "W"
    elif fingers == [1, 1, 0, 0, 0]:
        return "Y"
    elif fingers == [0, 1, 1, 1, 1]:
        return "B"
    elif fingers == [0, 1, 1, 0, 1]:
        return "Spider-Man"
    elif fingers == [0, 0, 0, 0, 0]:
        return "Nắm tay"
    else:
        return "Không rõ"