import subprocess
import sys
import os

# --- Configuration ---

# Path to the python.exe in your virtual environment
python_exe = sys.executable 

# Get the directory where this script is located (e.g., your 'AI' folder)
# __file__ is the path to this script
base_dir = os.path.dirname(os.path.abspath(__file__)) 

# Path to the Real-ESRGAN inference script
script_path = os.path.join(base_dir, 'Real-ESRGAN', 'inference_realesrgan.py')

# Define your input file and output folder
# We use os.path.join to correctly build paths for any OS (avoids \ vs / issues)
input_file = os.path.join(base_dir, 'Image', 'ivan_face.jpg')
output_folder = os.path.join(base_dir, 'Upscaled_Results')

# Create the output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# --- Run the Command ---

# Define the command using your dynamic variables
command = [
    python_exe,
    script_path,
    '-n', 'RealESRGAN_x4plus',
    '-i', input_file,
    '-o', output_folder,
    '-g', '0',           # Use GPU 0
    '--fp32',            # Use full precision to avoid black output
    '--face_enhance'
]

print("--- Real-ESRGAN Test Script ---")
print(f"Using Python: {python_exe}")
print(f"Running script: {script_path}")
print(f"Upscaling: {input_file}")
print(f"Output to: {output_folder}\n")

print("Starting upscaling...")
print("--- Real-ESRGAN Live Output (will appear below) ---")

try:
    # We run the command WITHOUT 'capture_output=True'.
    # This allows the output to stream live to your console,
    # preventing the "deadlock" or "waiting forever" issue.
    # 'check=True' ensures it will raise an error if the script fails.
    
    result = subprocess.run(command, check=True, encoding='utf-8')
    
    # If the script gets here, it means check=True passed (return code 0)
    print("--------------------------------------------------")
    print(f"✅ Upscaling complete!")
    print(f"Check the '{output_folder}' folder for your results.")

except subprocess.CalledProcessError as e:
    # The error message from Real-ESRGAN will have *already*
    # been printed live to your console *before* this message.
    print("--------------------------------------------------")
    print(f"❌ An error occurred during upscaling.")
    print(f"The script failed with error code: {e.returncode}")
    print("Check the console output above for the specific error message from Real-ESRGAN.")

except FileNotFoundError:
    print("--------------------------------------------------")
    print(f"❌ Error: File Not Found.")
    print(f"Could not find a file or script.")
    print(f"Please check these paths are correct:")
    print(f"  Script: {script_path}")
    print(f"  Input: {input_file}")

except Exception as e:
    # Catch any other unexpected errors
    print("--------------------------------------------------")
    print(f"An unexpected error occurred: {e}")