# Image Minification Comparison

This project provides a comparison of two popular libraries: **Sharp** and **Imagemin** for minifying images in Nodejs. It supports JPEG and PNG formats and can output optimized images to specified directories.

## Features

- Minifies images using Sharp and Imagemin.
- Supports JPEG and PNG formats.
- Outputs minified images to separate directories for each method.
- Displays input size, output size, size difference, and time taken for minification.

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:chukwumaijem/blog-image-manipulation-comparison.git
   cd blog-image-manipulation-comparison
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

## Usage

1. Place your images in the `./image-inputs` directory.
2. Update the `fileNames` array in `index.js` with the names of the images you want to minify.
3. Run the script:
   ```bash
   npm start
   ```

## Output

Minified images will be saved in the `./image-outputs/sharp` and `./image-outputs/imagemin` directories, respectively. The console will display a summary of the minification results.

## License

This project is licensed under the MIT License.
