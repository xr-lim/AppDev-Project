import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
import cv2
import numpy as np
import io

# Import the processing functions from our other file
from Face_Processing import detect_and_crop_face, upscale_face

app = FastAPI(
    title="Face Upscaler API",
    description="Upload an image to detect, crop, and upscale a face."
)

@app.get("/")
def read_root():
    """
    Root endpoint to check if the server is running.
    """
    return {"message": "Welcome to the Face Upscaler API. POST an image to /upscale-face/"}

@app.post("/upscale-face/")
async def create_upscale(file: UploadFile = File(...)):
    """
    Main endpoint to process an uploaded image.
    
    1. Receives an image file.
    2. Detects and crops the first face found.
    3. Upscales the cropped face.
    4. Returns the upscaled face as a JPG image.
    """
    
    # 1. Read image file bytes
    contents = await file.read()
    
    # 2. Convert bytes to a NumPy array for OpenCV
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image file. Could not decode.")

    # 3. Detect and crop the face
    cropped_face = detect_and_crop_face(img)
    
    if cropped_face is None:
        raise HTTPException(status_code=404, detail="No face detected in the uploaded image.")

    # 4. Upscale the cropped face
    upscaled_face = upscale_face(cropped_face)
    
    if upscaled_face is None:
        raise HTTPException(status_code=500, detail="Face upscaling process failed on the server.")

    # 5. Encode the final image (NumPy array) back to bytes (PNG format)
    try:
        is_success, buffer = cv2.imencode(".jpg", upscaled_face)
        if not is_success:
            raise HTTPException(status_code=500, detail="Failed to encode upscaled image.")
        
        # Convert the buffer to bytes
        io_buf = io.BytesIO(buffer)
        
        print("Successfully processed image. Returning upscaled JPG.")
        
        # 6. Return the image as a streaming response
        return StreamingResponse(io_buf, media_type="image/jpg")
        
    except Exception as e:
        print(f"Error encoding or streaming response: {e}")
        raise HTTPException(status_code=500, detail=f"Final image encoding failed: {e}")

if __name__ == "__main__":
    print("Starting FastAPI server...")
    print("Go to http://127.0.0.1:8000/docs to test the API.")
    # This runs the server
    uvicorn.run(app, host="127.0.0.1", port=8000)
