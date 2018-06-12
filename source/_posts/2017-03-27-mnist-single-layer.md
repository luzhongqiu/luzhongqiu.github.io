---
title: mnist单隐层的神经网络
date: 2017-03-27 22:17:48
categories:
    - Machine Learning
tags:
    - tensorflow
    - mnist
---
#mnist单隐层的神经网络


```python
from tensorflow.examples.tutorials.mnist import input_data
import tensorflow as tf
mnist = input_data.read_data_sets('mnist', one_hot=True)
sess =  tf.InteractiveSession()
in_units = 784   # 28 * 28
h1_units = 300 # hidden nodes
w1 = tf.Variable(tf.truncated_normal([in_units, h1_units], stddev=0.1))
b1 = tf.Variable(tf.zeros([h1_units]))
w2 = tf.Variable(tf.zeros([h1_units, 10]))
b2 = tf.Variable(tf.zeros([10]))

# 1 forwawrd part
x = tf.placeholder(tf.float32, [None, in_units])
keep_prob = tf.placeholder(tf.float32)
hidden1 = tf.nn.relu(tf.matmul(x, w1) + b1)
hidden1_drop = tf.nn.dropout(hidden1, keep_prob)
y = tf.nn.softmax(tf.matmul(hidden1_drop, w2) + b2)
# 2 loss and optimizer
y_ = tf.placeholder(tf.float32, [None, 10])
cross_entropy = tf.reduce_mean(-tf.reduce_sum(y_ * tf.log(y), reduction_indices=[1]))
train_step = tf.train.AdagradOptimizer(0.3).minimize(cross_entropy)
# 3 run
tf.global_variables_initializer().run()
for i in range(3000):
    batch_xs, batch_ys = mnist.train.next_batch(100)
    train_step.run({x: batch_xs, y_:batch_ys, keep_prob: 0.75})
# 4 test
correct_prediction = tf.equal(tf.argmax(y, 1), tf.argmax(y_,1))
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
print(accuracy.eval({x:mnist.test.images, y_:mnist.test.labels, keep_prob:3.0}))  # 0.979
最后准确率在0.979
```

## summary
依然是4个步骤
1 定义forward部分
2 定义损失函数和优化器，制定学习率
3 运行训练
4 运行测试



