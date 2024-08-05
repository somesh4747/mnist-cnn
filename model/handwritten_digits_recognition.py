import os
from turtle import mode

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"


import cv2
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf

# Decide whether to load an existing model or train a new one
train_new_model = True

if train_new_model:
    # Loading the MNIST dataset and splitting it
    mnist = tf.keras.datasets.mnist
    (X_train, y_train), (X_test, y_test) = mnist.load_data()

    # Normalizing the data
    X_train = tf.keras.utils.normalize(X_train, axis=1)
    X_test = tf.keras.utils.normalize(X_test, axis=1)

    # Building the model
    model = tf.keras.models.Sequential()
    model.add(
        tf.keras.layers.Flatten(input_shape=(28, 28))
    )  # Input shape needed for Flatten
    model.add(tf.keras.layers.Dense(units=128, activation="relu"))
    model.add(tf.keras.layers.Dense(units=128, activation="relu"))
    model.add(tf.keras.layers.Dense(units=10, activation="softmax"))

    # Compiling the model
    model.compile(
        optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"]
    )

    # Training the model
    model.fit(X_train, y_train, epochs=15)

    # Evaluating the model
    val_loss, val_acc = model.evaluate(X_test, y_test)
    print(f"Validation Loss: {val_loss}")
    print(f"Validation Accuracy: {val_acc}")

    # Saving the model
    model.save("somesh.keras")


# else:
# Load the model
# model = tf.keras.models.load_model("model.keras")
# model.summary()

# image_number = 1
# while os.path.isfile(f"digits/digit{image_number}.png"):
#     try:
#         img = cv2.imread(f"digits/digit{image_number}.png")[:, :, 0]
#         img = np.invert(np.array([img]))
#         prediction = model.predict(img)
#         print("The number is probably a {}".format(np.argmax(prediction)))
#         plt.imshow(img[0], cmap=plt.cm.binary)
#         plt.show()
#         image_number += 1
#     except:
#         print("Error reading image! Proceeding with next image...")
#         image_number += 1
