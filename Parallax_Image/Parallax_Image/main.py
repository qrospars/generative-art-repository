import parallax_image

# Importing the os library
import os
# The path for listing items
path = '.'
# The list of items
files = os.listdir(path)
# Loop to print each filename separately
for filename in files:
    print(filename)

layers = parallax_image.create_parallax_image('./sraps-sega-gt-2002/080.jpg')
parallax_image.show_parallax_image(layers)
