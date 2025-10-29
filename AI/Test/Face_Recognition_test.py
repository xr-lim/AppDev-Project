from mtcnn import MTCNN
import cv2

# Create a detector instance
detector = MTCNN(device="CPU:0")

# Load an image
image = cv2.imread(r"C:\UTM\Y3S1\App Development\AppDev-Project\AI\Image\ivan.jpg")

# Detect faces in the image
result = detector.detect_faces(image)

for face in result:
    x, y, w, h = face['box']
    cv2.rectangle(image, (x, y), (x+w, y+h), (0,255,0), 2)

    for key, point in face['keypoints'].items():
        cv2.circle(image, (point[0], point[1]), 3, (0,0,255), -1)

# Define a desired width (e.g., 800 pixels)
desired_width = 500

# Calculate the ratio
(h, w) = image.shape[:2]
ratio = desired_width / float(w)
desired_height = int(h * ratio)

# Resize the image
resized_image = cv2.resize(image, (desired_width, desired_height), interpolation=cv2.INTER_AREA)

# Display the resized image
cv2.imshow("MTCNN Face Detection", resized_image)
cv2.waitKey(0)
cv2.destroyAllWindows()