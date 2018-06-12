---
title: tensorflow mnist 初体验
date: 2017-03-26 09:31:42
categories:
    - Machine Learning
tags:
    - tensorflow
    - mnist
---

前提： tensorflow安装好，包括cuda和cudnn

先上代码
```python
from tensorflow.examples.tutorials.mnist import input_data
mnist = input_data.read_data_sets('./mnist_data/', one_hot=True)
import tensorflow as tf
sess = tf.InteractiveSession()
x = tf.placeholder(tf.float32, [None,784])
w = tf.Variable(tf.zeros([784,10]))
b = tf.Variable(tf.zeros([10]))
y = tf.nn.softmax(tf.matmul(x, w)+b)
y_ = tf.placeholder(tf.float32, [None, 10])
cross_entropy = tf.reduce_mean(-tf.reduce_sum(y_ * tf.log(y), reduction_indices=[1]))
train_step = tf.train.GradientDescentOptimizer(0.5).minimize(cross_entropy)
tf.global_variables_initializer().run()
for i in range(1000):
    batch_xs, batch_ys = mnist.train.next_batch(100)
    train_step.run({x: batch_xs, y_:batch_ys})
correct_prediction = tf.equal(tf.argmax(y,1), tf.argmax(y_,1))
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
print(accuracy.eval({x:mnist.test.images, y_:mnist.test.labels}))
```

行2 自动下载已经失效，手动下载gz压缩包到文件夹下，read_data_sets会自动检测到
行8 softmax函数
行9 y_为真实的label
行10 损失函数 loss function
行11 自动梯度下降，学习率为0.5
行12 初始化变量，并且run
行13-15 训练阶段
行16-17 定义准确率判别方法
行18 注入x, y_，运行计算准确率，
输出0.9202

# 总结
mnist初体验总共分为4步
（1）定义算法公式，也就是神经网络forward时的计算
（2）定义loss function， 选定优化器，指定优化器优化loss
（3）迭代进行数据训练
（4）在测试集上测试




