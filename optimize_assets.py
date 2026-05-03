import os
from PIL import Image

def optimize_icon(input_path, output_path, size=(128, 128)):
    """
    Optimizes a PNG icon for use in loading components.
    Resizes the image and applies compression.
    """
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return

    try:
        with Image.open(input_path) as img:
            # Convert to RGBA if not already (to preserve transparency)
            img = img.convert("RGBA")
            
            # Resize with high-quality resampling
            img.thumbnail(size, Image.Resampling.LANCZOS)
            
            # Save with optimization
            img.save(output_path, "PNG", optimize=True)
            
            original_size = os.path.getsize(input_path) / 1024
            optimized_size = os.path.getsize(output_path) / 1024
            
            print(f"Success! Optimized icon saved to {output_path}")
            print(f"Original size: {original_size:.2f} KB")
            print(f"Optimized size: {optimized_size:.2f} KB")
            print(f"Reduction: {((original_size - optimized_size) / original_size) * 100:.1f}%")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Define paths relative to the project root
    base_dir = os.path.dirname(os.path.abspath(__file__))
    input_icon = os.path.join(base_dir, "gonza", "public", "icon.png")
    output_icon = os.path.join(base_dir, "gonza", "public", "loader-icon.png")
    
    optimize_icon(input_icon, output_icon)
