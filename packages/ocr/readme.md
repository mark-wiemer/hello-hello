# OCR: optical character recognition

OCR is the automated process of turning images into text.

This package contains open-source tools to help recreate searchable databases.

I use [Poppler](https://poppler.freedesktop.org/) to convert PDFs to images,
then I use
[Tesseract](https://tesseract-ocr.github.io/) to convert images to text.

## Setup

1. Install [Tesseract](https://tesseract-ocr.github.io/)
1. If using PDFs, install [Poppler](https://poppler.freedesktop.org/)

## Usage

If you're not using a PDF, skip to the section on images.

1. Download the PDF you want to run OCR on
1. Convert the PDF to a series of images (one per PDF page):

   ```sh
   pdftoppm -png input.pdf output_prefix
   ```

   This command does not print progress, see [enhancements](#enhancements)
   for a version of this command that does print progress

1. Convert the images to a series of plaintext files:

   ```bash
   find /path/to/images -name "*.png" -exec sh -c 'tesseract "$1" "$1.out" && echo "Done: $1"' _ {} \;
   ```

<a id="enhancements"></a>

### Enhancements

For progress when converting the PDF to a series of images, consider a loop:

```bash
n=$(pdfinfo input.pdf | grep Pages | awk '{print $2}')
for i in $(seq 1 $n); do
  pdftoppm -png -f $i -l $i input.pdf page
  echo "Converted page $i of $n"
done
```
