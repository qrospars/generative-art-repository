from msilib import type_binary
import bpy
from random import randint, uniform
import math

RND_VAL = 1.5

# Remove all meshes in the scene
for mesh in bpy.data.meshes:
    if mesh is not bpy.data.meshes['Plane']:
        bpy.data.meshes.remove(mesh)

# Add cubes
for i in range(50):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(uniform(-RND_VAL, RND_VAL), uniform(-RND_VAL, RND_VAL),
                                    uniform(-RND_VAL, RND_VAL)), scale=(uniform(0.5, 1), uniform(0.5, 1), uniform(0.5, 1)))
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_mode(type='EDGE')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.bevel(offset=0.03, segments=4)
    bpy.ops.object.mode_set(mode='OBJECT')

    bpy.ops.object.origin_set(type='ORIGIN_CENTER')
