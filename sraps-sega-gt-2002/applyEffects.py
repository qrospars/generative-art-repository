# This file will contain all the code to process the images
import sys
import os
import cv2
import pygame as pg
import numpy as np


def glitch_effect_on_image(index):
    from glitch_this import ImageGlitcher

    glitcher = ImageGlitcher()

    # Apply a glitch effect
    glitch_img = glitcher.glitch_image(
        'blender/first_render.png', 5, color_offset=True)

    glitch_img.save('blender'+str(index)+'.png')


for i in range(10):
    glitch_effect_on_image(i)
