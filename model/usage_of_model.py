import os

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import cv2
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt


# model = pickle.load(open('trained_model', 'rb'))
model = tf.keras.models.load_model("mnist_cnn_model.h5")
# model.summary()
image_number = 1
# while os.path.isfile(f"digits/digit{image_number}.png"):
# print(f'digit{image_number}.png')
while image_number < 20:
    try:
        img = cv2.imread(f"digits/digit{image_number}.png")[:, :, 0]
        # img = cv2.resize(img, dsize=(28, 28))
        img = np.invert(np.array([img]))
        prediction = model.predict(img)
        print(prediction)
        print("The number is probably a {}".format(np.argmax(prediction)))
        plt.imshow(img[0], cmap=plt.cm.binary)
        plt.show()
        image_number += 1
    except:
        print("Error reading image! Proceeding with next image...")
        image_number += 1
