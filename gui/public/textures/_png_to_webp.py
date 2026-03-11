# take png from the /png folder and convert to webp in the /webp folder
import os
from PIL import Image

def check_webp_exists(webp_folder, filename):
    webp_path = os.path.join(webp_folder, filename[:-4] + '.webp')
    return os.path.exists(webp_path)

def reduce_resolution(png_path, max_size=(640, 640)):
    with Image.open(png_path) as img:
        img.thumbnail(max_size)
        return img.copy()

def convert_png_to_webp(png_folder, webp_folder):
    if not os.path.exists(webp_folder):
        os.makedirs(webp_folder)
    for filename in os.listdir(png_folder):
        if check_webp_exists(webp_folder, filename):
            print(f"{filename[:-4]}.webp already exists, skipping conversion.")
            continue
        if filename.endswith('.png'):
            png_path = os.path.join(png_folder, filename)
            webp_path = os.path.join(webp_folder, filename[:-4] + '.webp')
            with Image.open(png_path) as img:
                img = reduce_resolution(png_path)
                img.save(webp_path, 'WEBP')




if __name__ == "__main__":
    png_folder = 'png'
    webp_folder = 'webp'
    convert_png_to_webp(png_folder, webp_folder)