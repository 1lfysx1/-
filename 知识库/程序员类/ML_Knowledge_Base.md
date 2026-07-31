# 📚 机器学习知识库：从入门到精通

> **版本**: 2026 最新版  
> **语言**: Python (sklearn + NumPy + Pandas + Matplotlib)  
> **适用人群**: 零基础到进阶开发者  
> **学习目标**: 掌握核心算法原理、熟练运用 sklearn、具备独立建模能力

---

## 📖 目录

| 章节 | 内容 | 难度 |
|------|------|------|
| 第1章 | 机器学习概述 | ⭐ |
| 第2章 | 有监督学习 - 线性回归 | ⭐ |
| 第3章 | 有监督学习 - 逻辑回归 | ⭐⭐ |
| 第4章 | 有监督学习 - KNN | ⭐⭐ |
| 第5章 | 有监督学习 - 朴素贝叶斯 | ⭐⭐ |
| 第6章 | 有监督学习 - SVM | ⭐⭐⭐ |
| 第7章 | 有监督学习 - 决策树 | ⭐⭐ |
| 第8章 | 有监督学习 - 集成算法概述 | ⭐⭐⭐ |
| 第9章 | 有监督学习 - Bagging | ⭐⭐⭐ |
| 第10章 | 有监督学习 - 随机森林 | ⭐⭐⭐ |
| 第11章 | 有监督学习 - Boosting | ⭐⭐⭐ |
| 第12章 | 有监督学习 - AdaBoost | ⭐⭐⭐ |
| 第13章 | 有监督学习 - GBDT | ⭐⭐⭐⭐ |
| 第14章 | 有监督学习 - XGBoost | ⭐⭐⭐⭐ |
| 第15章 | 无监督学习 - 聚类算法 | ⭐⭐⭐ |
| 第16章 | 无监督学习 - 关联规则 | ⭐⭐ |

---



---

# 第1章 机器学习概述

## 1.1 什么是机器学习？

机器学习（Machine Learning, ML）是人工智能的一个分支，它使计算机能够从数据中**自动学习规律**，而无需显式编程。

### 核心定义
> "A computer program is said to learn from experience E with respect to some class of tasks T and performance measure P, if its performance at tasks in T, as measured by P, improves with experience E." —— Tom Mitchell

### 机器学习的三大类型

| 类型 | 说明 | 典型算法 | 数据特点 |
|------|------|----------|----------|
| **监督学习** | 有标签数据，学习输入→输出的映射 | 线性回归、SVM、决策树 | (X, y) |
| **无监督学习** | 无标签数据，发现数据内在结构 | K-Means、PCA、关联规则 | (X) |
| **强化学习** | 通过与环境交互获得奖励来学习 | Q-Learning、DQN | 状态-动作-奖励 |

### 机器学习工作流程

```
1. 数据收集 → 2. 数据清洗/预处理 → 3. 特征工程 → 4. 模型选择
    ↓
5. 模型训练 → 6. 模型评估 → 7. 超参数调优 → 8. 模型部署
```

## 1.2 核心概念速览

### 数据集划分
- **训练集（Training Set）**: 用于训练模型参数，通常占 70%~80%
- **验证集（Validation Set）**: 用于调参和模型选择，通常占 10%~15%
- **测试集（Test Set）**: 用于最终评估模型泛化能力，通常占 10%~20%

### 过拟合 vs 欠拟合

| 现象 | 表现 | 原因 | 解决方案 |
|------|------|------|----------|
| **欠拟合** | 训练集和测试集表现都差 | 模型太简单，特征不足 | 增加特征、换复杂模型、减少正则化 |
| **过拟合** | 训练集好，测试集差 | 模型太复杂，记住了噪声 | 正则化、增加数据、交叉验证、简化模型 |

### 常用评估指标

**分类任务**：
- 准确率（Accuracy）= (TP+TN)/(TP+TN+FP+FN)
- 精确率（Precision）= TP/(TP+FP)
- 召回率（Recall）= TP/(TP+FN)
- F1-Score = 2 × Precision × Recall / (Precision + Recall)

**回归任务**：
- MSE（均方误差）= 1/n Σ(yᵢ - ŷᵢ)²
- RMSE = √MSE
- MAE（平均绝对误差）= 1/n Σ|yᵢ - ŷᵢ|
- R²（决定系数）= 1 - SS_res/SS_tot

## 1.3 环境准备与第一个ML程序

```python
# ============================================
# 环境准备：安装核心库
# pip install numpy pandas matplotlib scikit-learn
# ============================================

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report

# 1. 加载经典数据集：鸢尾花（Iris）
# 这是机器学习中最经典的数据集之一，包含3种鸢尾花，各50个样本，4个特征
iris = load_iris()
X = iris.data          # 特征矩阵 (150, 4)
y = iris.target        # 标签向量 (150,)

print(f"数据集形状: {X.shape}")
print(f"特征名称: {iris.feature_names}")
print(f"类别名称: {iris.target_names}")

# 2. 划分训练集和测试集
# test_size=0.2 表示 20% 数据用于测试
# random_state 保证结果可复现
# stratify=y 保证各类别比例一致（分层抽样）
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 3. 特征标准化（Z-score标准化）
# 消除量纲影响，使不同特征在同一尺度上
# 公式: z = (x - μ) / σ
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)   # fit: 计算均值和标准差; transform: 转换
X_test_scaled = scaler.transform(X_test)         # 测试集只用 transform，避免数据泄漏

# 4. 选择模型并训练
# KNN: K近邻分类器，简单直观的监督学习算法
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train_scaled, y_train)   # fit: 训练模型

# 5. 预测与评估
y_pred = knn.predict(X_test_scaled)
acc = accuracy_score(y_test, y_pred)
print(f"
测试集准确率: {acc:.4f}")
print("
详细分类报告:")
print(classification_report(y_test, y_pred, target_names=iris.target_names))

# 6. 可视化（选取前两个特征）
plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
for i, name in enumerate(iris.target_names):
    plt.scatter(X[y==i, 0], X[y==i, 1], label=name)
plt.xlabel(iris.feature_names[0])
plt.ylabel(iris.feature_names[1])
plt.title("原始数据分布")
plt.legend()

plt.subplot(1, 2, 2)
colors = ['red', 'green', 'blue']
for i in range(3):
    mask = y_test == i
    plt.scatter(X_test[mask, 0], X_test[mask, 1], 
                c=colors[i], marker='o', label=f'{iris.target_names[i]}(真实)')
    # 预测错误的点用叉号标出
    wrong = mask & (y_pred != y_test)
    if wrong.sum() > 0:
        plt.scatter(X_test[wrong, 0], X_test[wrong, 1], 
                    c=colors[i], marker='x', s=200, linewidths=3)
plt.xlabel(iris.feature_names[0])
plt.ylabel(iris.feature_names[1])
plt.title("测试集预测结果 (x=预测错误)")
plt.legend()
plt.tight_layout()
plt.savefig('/mnt/agents/output/ch1_iris_visualization.png', dpi=150)
plt.show()
```

---

## 📝 第1章 练习题

### 一、选择题

**1.1** 以下哪种情况属于过拟合？

A. 训练集准确率 65%，测试集准确率 63%  
B. 训练集准确率 99%，测试集准确率 72%  
C. 训练集准确率 70%，测试集准确率 68%  
D. 训练集准确率 85%，测试集准确率 84%

**1.2** 在 sklearn 中，`train_test_split` 的 `stratify` 参数作用是？

A. 随机打乱数据顺序  
B. 保证训练集和测试集中各类别比例与原始数据一致  
C. 自动进行特征标准化  
D. 设置随机种子保证可复现

**1.3** 特征标准化（StandardScaler）的公式是？

A. x' = (x - min) / (max - min)  
B. x' = x / max  
C. x' = (x - μ) / σ  
D. x' = log(x)

### 二、判断题

**1.4** 机器学习中，测试集也可以参与模型训练，只是不用于调参。（  ）

**1.5** 无监督学习不需要标签数据。（  ）

**1.6** 在 sklearn 中，`fit_transform` 用于训练集，`transform` 用于测试集，这是为了避免数据泄漏。（  ）

### 三、代码填空题

**1.7** 补全以下代码，实现数据的标准化处理：

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_train_scaled = scaler.________(X_train)   # 填空1
X_test_scaled = scaler.________(X_test)    # 填空2
```

**1.8** 补全以下代码，计算模型的 F1-Score：

```python
from sklearn.metrics import f1_score

f1 = f1_score(y_true, y_pred, average=________)  # 填空：多分类时用什么参数
```

---

## ✅ 第1章 答案与解析

### 选择题

**1.1 答案: B**  
解析: 过拟合的核心特征是模型在训练集上表现极好，但在测试集上表现明显变差。B选项训练集99%而测试集72%，差距27个百分点，是典型的过拟合。A、C属于欠拟合，D属于正常拟合。

**1.2 答案: B**  
解析: `stratify=y` 会进行分层抽样，确保训练集和测试集中各类别的比例与原始数据集一致。这在类别不平衡时尤为重要。D选项是 `random_state` 的作用。

**1.3 答案: C**  
解析: StandardScaler 执行 Z-score 标准化，公式为 x' = (x - μ) / σ，其中 μ 是均值，σ 是标准差。A 是 MinMaxScaler 的公式。

### 判断题

**1.4 答案: ×（错误）**  
解析: 测试集绝对不能参与任何训练或调参过程，只能用于最终评估。如果测试集参与了训练，评估结果将失去意义，无法反映模型的真实泛化能力。

**1.5 答案: √（正确）**  
解析: 无监督学习的定义就是在没有标签的情况下，从数据中发现隐藏的模式或结构，如聚类、降维等。

**1.6 答案: √（正确）**  
解析: `fit_transform` 会基于训练集计算统计量（如均值、标准差），然后转换数据。测试集只能用 `transform`，使用训练集计算出的统计量，避免测试集信息泄漏到训练过程中。

### 代码填空题

**1.7 答案:**
- 填空1: `fit_transform`
- 填空2: `transform`

**1.8 答案:** `'weighted'`（或 `'macro'` / `'micro'`）  
解析: 多分类 F1-Score 常用 `average='weighted'`，它会根据每个类别的样本数加权计算 F1 值，更适合类别不平衡场景。`'macro'` 是不加权平均，`'micro'` 是全局计算。

---
---

# 第2章 有监督学习 - 线性回归

## 2.1 算法原理

线性回归（Linear Regression）是监督学习中最基础的回归算法，假设目标变量 y 与特征 X 之间存在**线性关系**。

### 数学模型

$$\hat{y} = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + ... + \beta_n x_n = X\beta$$

其中：
- $\hat{y}$: 预测值
- $\beta_0$: 截距（偏置）
- $\beta_i$: 第 i 个特征的权重
- $x_i$: 第 i 个特征值

### 损失函数（MSE）

$$J(\beta) = \frac{1}{2m} \sum_{i=1}^{m} (\hat{y}^{(i)} - y^{(i)})^2$$

### 求解方法

| 方法 | 原理 | 适用场景 |
|------|------|----------|
| **最小二乘法（OLS）** | 直接求解正规方程 $\beta = (X^T X)^{-1} X^T y$ | 特征数少，数据量不大 |
| **梯度下降法** | 迭代更新 $\beta := \beta - \alpha \nabla J(\beta)$ | 大规模数据，在线学习 |

## 2.2 正则化线性回归

为了防止过拟合，引入正则化项：

| 类型 | 损失函数 | 特点 | sklearn类 |
|------|----------|------|-----------|
| **Ridge（L2）** | $J + \lambda \sum \beta_j^2$ | 权重趋于小但不为零，平滑 | `Ridge` |
| **Lasso（L1）** | $J + \lambda \sum |\beta_j|$ | 产生稀疏解，可做特征选择 | `Lasso` |
| **ElasticNet** | L1 + L2 组合 | 兼顾两者优点 | `ElasticNet` |

## 2.3 代码实战

```python
# ============================================
# 线性回归完整实战：波士顿房价预测（使用替代数据集）
# ============================================

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import fetch_california_housing  # California Housing 替代波士顿
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# 1. 加载数据集
# California Housing: 预测加州各区域房价中位数
# 特征包括：收入、房龄、房间数、卧室数、人口、家庭数、经纬度等
housing = fetch_california_housing()
X, y = housing.data, housing.target
feature_names = housing.feature_names

print(f"数据集形状: {X.shape}")
print(f"特征名称: {feature_names}")
print(f"目标变量范围: [{y.min():.2f}, {y.max():.2f}] (单位: 10万美元)")

# 2. 划分数据集
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 3. 特征标准化（线性回归对特征尺度敏感）
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 4. 训练普通线性回归模型
lr = LinearRegression()
lr.fit(X_train_scaled, y_train)

# 5. 训练 Ridge 回归（L2正则化）
# alpha: 正则化强度，越大惩罚越重
ridge = Ridge(alpha=1.0)
ridge.fit(X_train_scaled, y_train)

# 6. 训练 Lasso 回归（L1正则化）
# Lasso 可以将不重要特征的系数压缩到0，实现特征选择
lasso = Lasso(alpha=0.1)
lasso.fit(X_train_scaled, y_train)

# 7. 模型评估函数
def evaluate_model(model, X_test, y_test, model_name):
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"\n【{model_name}】")
    print(f"  MSE  : {mse:.4f}")
    print(f"  RMSE : {rmse:.4f}")
    print(f"  MAE  : {mae:.4f}")
    print(f"  R²   : {r2:.4f}")
    return y_pred

# 评估三个模型
pred_lr = evaluate_model(lr, X_test_scaled, y_test, "普通线性回归")
pred_ridge = evaluate_model(ridge, X_test_scaled, y_test, "Ridge回归")
pred_lasso = evaluate_model(lasso, X_test_scaled, y_test, "Lasso回归")

# 8. 查看特征重要性（系数）
coef_df = pd.DataFrame({
    'Feature': feature_names,
    'Linear': lr.coef_,
    'Ridge': ridge.coef_,
    'Lasso': lasso.coef_
})
print("\n特征系数对比:")
print(coef_df.round(4))

# 9. 交叉验证评估模型稳定性
# 5折交叉验证，使用 R² 作为评分指标
cv_scores = cross_val_score(lr, X_train_scaled, y_train, cv=5, scoring='r2')
print(f"\n线性回归 5折交叉验证 R²: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

# 10. 使用 GridSearchCV 自动调参（以 Ridge 为例）
param_grid = {'alpha': [0.001, 0.01, 0.1, 1, 10, 100]}
grid_search = GridSearchCV(Ridge(), param_grid, cv=5, scoring='r2')
grid_search.fit(X_train_scaled, y_train)
print(f"\nRidge 最优 alpha: {grid_search.best_params_['alpha']}")
print(f"最优交叉验证 R²: {grid_search.best_score_:.4f}")

# 11. 可视化：预测值 vs 真实值
plt.figure(figsize=(15, 4))

plt.subplot(1, 3, 1)
plt.scatter(y_test, pred_lr, alpha=0.5)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
plt.xlabel("真实值")
plt.ylabel("预测值")
plt.title("普通线性回归")

plt.subplot(1, 3, 2)
plt.scatter(y_test, pred_ridge, alpha=0.5)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
plt.xlabel("真实值")
plt.ylabel("预测值")
plt.title("Ridge 回归")

plt.subplot(1, 3, 3)
plt.scatter(y_test, pred_lasso, alpha=0.5)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
plt.xlabel("真实值")
plt.ylabel("预测值")
plt.title("Lasso 回归")

plt.tight_layout()
plt.savefig('/mnt/agents/output/ch2_linear_regression.png', dpi=150)
plt.show()

# 12. 残差分析（检查模型假设）
residuals = y_test - pred_lr
plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
plt.scatter(pred_lr, residuals, alpha=0.5)
plt.axhline(y=0, color='r', linestyle='--')
plt.xlabel("预测值")
plt.ylabel("残差")
plt.title("残差图")

plt.subplot(1, 2, 2)
plt.hist(residuals, bins=30, edgecolor='black')
plt.xlabel("残差")
plt.ylabel("频数")
plt.title("残差分布")

plt.tight_layout()
plt.savefig('/mnt/agents/output/ch2_residuals.png', dpi=150)
plt.show()
```

## 2.4 关键要点总结

1. **线性回归假设**：特征与目标线性相关、残差正态分布、同方差性、特征间低共线性
2. **正则化选择**：特征多且可能存在多重共线性 → Ridge；需要做特征选择 → Lasso
3. **特征必须标准化**：线性回归对特征尺度敏感，标准化后正则化效果更公平
4. **R² 解读**：越接近1越好，但可能受异常值影响；RMSE 与目标变量同量纲，更直观

---

## 📝 第2章 练习题

### 一、选择题

**2.1** 线性回归的损失函数通常采用？

A. 交叉熵损失  
B. 均方误差（MSE）  
C.  hinge 损失  
D. 对数损失

**2.2** 关于 L1 正则化（Lasso）和 L2 正则化（Ridge），以下说法正确的是？

A. L1 正则化会使权重趋于小但不为零  
B. L2 正则化可以产生稀疏解，用于特征选择  
C. L1 正则化可能将某些特征的系数压缩到零  
D. L1 和 L2 正则化对异常值的鲁棒性相同

**2.3** 在 sklearn 中使用 `GridSearchCV` 时，`cv=5` 表示？

A. 将数据分成5份，取其中1份作为训练集  
B. 将数据分成5份，进行5折交叉验证  
C. 训练5个不同的模型  
D. 测试集占50%

### 二、判断题

**2.4** 线性回归只能解决一维特征的回归问题。（  ）

**2.5** 在正则化线性回归中，`alpha` 越大，模型对训练数据的拟合程度越高。（  ）

**2.6** 特征标准化对普通最小二乘法（OLS）求解线性回归的参数没有影响，但会影响梯度下降的收敛速度。（  ）

### 三、代码填空题

**2.7** 补全代码，使用 Ridge 回归并设置正则化强度：

```python
from sklearn.linear_model import Ridge

model = Ridge(alpha=________)  # 填空：设置正则化强度为 0.5
model.fit(X_train, y_train)
```

**2.8** 补全代码，计算模型的 R² 分数：

```python
from sklearn.metrics import r2_score

r2 = r2_score(________, ________)  # 填空
print(f"R² Score: {r2:.4f}")
```

**2.9** 补全代码，使用 GridSearchCV 搜索最优超参数：

```python
from sklearn.model_selection import GridSearchCV
from sklearn.linear_model import Lasso

param_grid = {'alpha': [0.01, 0.1, 1, 10]}
grid = GridSearchCV(Lasso(), param_grid, cv=________, scoring='r2')  # 填空
grid.fit(X_train, y_train)
print(f"最优参数: {grid.best_params_}")
```

---

## ✅ 第2章 答案与解析

### 选择题

**2.1 答案: B**  
解析: 线性回归使用均方误差（MSE）作为损失函数，衡量预测值与真实值之间差异的平方和。交叉熵用于分类问题，hinge 损失用于 SVM。

**2.2 答案: C**  
解析: L1 正则化（Lasso）由于使用绝对值惩罚，会在坐标轴上产生"角点"，使得某些特征的系数恰好为0，从而实现特征选择。A描述的是L2，B描述的是L1。

**2.3 答案: B**  
解析: `cv=5` 表示 5 折交叉验证，将数据分成5份，轮流用4份训练、1份验证，共进行5次训练和验证，取平均结果。

### 判断题

**2.4 答案: ×（错误）**  
解析: 线性回归可以处理任意维度的特征，称为多元线性回归（Multiple Linear Regression）。一维特征只是特例。

**2.5 答案: ×（错误）**  
解析: `alpha` 越大，正则化惩罚越强，模型越简单，对训练数据的拟合程度越低（偏差增大，方差减小），是为了防止过拟合。

**2.6 答案: √（正确）**  
解析: OLS 的解析解 $\beta = (X^T X)^{-1} X^T y$ 不受特征尺度影响。但梯度下降中，不同尺度的特征会导致等高线呈椭圆形，收敛路径曲折，标准化后能加速收敛。

### 代码填空题

**2.7 答案:** `0.5`  
解析: Ridge 的 `alpha` 参数直接控制正则化强度。

**2.8 答案:** `y_test, y_pred`（或 `y_true, y_pred`）  
解析: `r2_score(y_true, y_pred)` 第一个参数是真实值，第二个是预测值。

**2.9 答案:** `5`（或任意正整数）  
解析: `cv` 参数指定交叉验证的折数，常用 5 或 10。

---
---

# 第3章 有监督学习 - 逻辑回归

## 3.1 算法原理

逻辑回归（Logistic Regression）虽然名字里有"回归"，但它是**分类算法**，用于解决二分类和多分类问题。

### 核心思想

通过 **Sigmoid 函数** 将线性回归的输出映射到 (0, 1) 区间，表示概率：

$$\sigma(z) = \frac{1}{1 + e^{-z}}$$

其中 $z = \beta_0 + \beta_1 x_1 + ... + \beta_n x_n$

### 决策边界

$$\hat{y} = \begin{cases} 1, & \text{if } P(y=1|x) \geq 0.5 \\ 0, & \text{if } P(y=1|x) < 0.5 \end{cases}$$

### 损失函数（交叉熵损失）

$$J(\beta) = -\frac{1}{m} \sum_{i=1}^{m} [y^{(i)} \log(\hat{y}^{(i)}) + (1-y^{(i)}) \log(1-\hat{y}^{(i)})]$$

### 多分类扩展

| 策略 | 说明 | sklearn 参数 |
|------|------|-------------|
| **OvR (One-vs-Rest)** | N 个二分类器，每个区分"是某类"vs"其他" | `multi_class='ovr'` |
| **Softmax (Multinomial)** | 直接输出各类概率，概率和为1 | `multi_class='multinomial'` |

## 3.2 代码实战

```python
# ============================================
# 逻辑回归完整实战：乳腺癌分类 + 决策边界可视化
# ============================================

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer, make_classification
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, precision_score, recall_score, 
                             f1_score, confusion_matrix, roc_curve, auc,
                             classification_report)

# 1. 加载乳腺癌数据集
# 特征：细胞核的半径、纹理、周长、面积、平滑度、紧密度、凹陷度等30个特征
# 目标：良性(B) / 恶性(M)
cancer = load_breast_cancer()
X, y = cancer.data, cancer.target

print(f"数据集形状: {X.shape}")
print(f"类别分布: 良性={sum(y==1)}, 恶性={sum(y==0)}")
print(f"特征示例: {cancer.feature_names[:5]}")

# 2. 划分与标准化
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

# 3. 训练逻辑回归模型
# C: 正则化强度的倒数，C越小正则化越强（与alpha相反）
# solver: 优化算法，小数据用 'liblinear'，大数据用 'lbfgs' 或 'saga'
# max_iter: 最大迭代次数
lr_model = LogisticRegression(C=1.0, solver='lbfgs', max_iter=1000, random_state=42)
lr_model.fit(X_train_s, y_train)

# 4. 预测
y_pred = lr_model.predict(X_test_s)
y_prob = lr_model.predict_proba(X_test_s)[:, 1]  # 预测为类别1的概率

# 5. 评估指标
print("\n===== 模型评估 =====")
print(f"准确率 (Accuracy) : {accuracy_score(y_test, y_pred):.4f}")
print(f"精确率 (Precision): {precision_score(y_test, y_pred):.4f}")
print(f"召回率 (Recall)   : {recall_score(y_test, y_pred):.4f}")
print(f"F1-Score          : {f1_score(y_test, y_pred):.4f}")
print("\n详细报告:")
print(classification_report(y_test, y_pred, target_names=['恶性', '良性']))

# 6. 混淆矩阵
cm = confusion_matrix(y_test, y_pred)
print(f"\n混淆矩阵:\n{cm}")
# TN=cm[0,0], FP=cm[0,1], FN=cm[1,0], TP=cm[1,1]

# 7. ROC 曲线与 AUC
fpr, tpr, thresholds = roc_curve(y_test, y_prob)
roc_auc = auc(fpr, tpr)

plt.figure(figsize=(15, 4))

plt.subplot(1, 3, 1)
plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (AUC = {roc_auc:.4f})')
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--', label='Random')
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curve')
plt.legend(loc='lower right')

# 8. 特征重要性（系数绝对值）
importance = pd.DataFrame({
    'Feature': cancer.feature_names,
    'Coefficient': lr_model.coef_[0],
    'Abs_Coef': np.abs(lr_model.coef_[0])
}).sort_values('Abs_Coef', ascending=True)

plt.subplot(1, 3, 2)
plt.barh(importance['Feature'][-10:], importance['Abs_Coef'][-10:])
plt.xlabel('|Coefficient|')
plt.title('Top 10 重要特征')

# 9. 概率分布直方图
plt.subplot(1, 3, 3)
plt.hist(y_prob[y_test==0], bins=20, alpha=0.5, label='恶性', color='red')
plt.hist(y_prob[y_test==1], bins=20, alpha=0.5, label='良性', color='green')
plt.xlabel('预测概率 P(良性)')
plt.ylabel('样本数')
plt.title('预测概率分布')
plt.legend()

plt.tight_layout()
plt.savefig('/mnt/agents/output/ch3_logistic_regression.png', dpi=150)
plt.show()

# 10. 二分类决策边界可视化（选取2个特征）
# 生成一个二维分类数据集用于可视化
X_vis, y_vis = make_classification(n_samples=200, n_features=2, n_redundant=0, 
                                    n_informative=2, n_clusters_per_class=1, 
                                    random_state=42)
X_vis_train, X_vis_test, y_vis_train, y_vis_test = train_test_split(
    X_vis, y_vis, test_size=0.3, random_state=42
)

lr_vis = LogisticRegression()
lr_vis.fit(X_vis_train, y_vis_train)

# 绘制决策边界
h = 0.02
x_min, x_max = X_vis[:, 0].min() - 1, X_vis[:, 0].max() + 1
y_min, y_max = X_vis[:, 1].min() - 1, X_vis[:, 1].max() + 1
xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))
Z = lr_vis.predict_proba(np.c_[xx.ravel(), yy.ravel()])[:, 1]
Z = Z.reshape(xx.shape)

plt.figure(figsize=(8, 6))
plt.contourf(xx, yy, Z, levels=50, alpha=0.6, cmap='RdYlGn')
plt.colorbar(label='P(y=1)')
plt.scatter(X_vis[:, 0], X_vis[:, 1], c=y_vis, cmap='RdYlGn', edgecolors='k')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.title('逻辑回归决策边界')
plt.savefig('/mnt/agents/output/ch3_decision_boundary.png', dpi=150)
plt.show()

# 11. 多分类示例（使用 Iris 数据集）
from sklearn.datasets import load_iris
iris = load_iris()
X_iris, y_iris = iris.data, iris.target

X_i_train, X_i_test, y_i_train, y_i_test = train_test_split(
    X_iris, y_iris, test_size=0.2, random_state=42, stratify=y_iris
)
scaler_i = StandardScaler()
X_i_train_s = scaler_i.fit_transform(X_i_train)
X_i_test_s = scaler_i.transform(X_i_test)

# multinomial 使用 softmax 直接多分类
lr_multi = LogisticRegression(multi_class='multinomial', solver='lbfgs', max_iter=1000)
lr_multi.fit(X_i_train_s, y_i_train)
print(f"\n多分类准确率: {lr_multi.score(X_i_test_s, y_i_test):.4f}")
print(f"各类概率预测 (前3个样本):\n{lr_multi.predict_proba(X_i_test_s[:3])}")
```

## 3.3 关键要点总结

1. **逻辑回归输出的是概率**，通过阈值（默认0.5）转换为类别
2. **C 参数**：正则化强度的倒数，C 越大正则化越弱，模型越复杂
3. **solver 选择**：小数据集用 `liblinear`（支持L1），大数据集用 `lbfgs`/`saga`
4. **类别不平衡**：可用 `class_weight='balanced'` 自动调整权重
5. **多分类**：`ovr` 训练 N 个二分类器，`multinomial` 训练 1 个 softmax 模型

---

## 📝 第3章 练习题

### 一、选择题

**3.1** 逻辑回归使用以下哪个函数将线性输出映射到概率？

A. ReLU  
B. Sigmoid  
C. Tanh  
D. Softmax

**3.2** 在 sklearn 的 `LogisticRegression` 中，参数 `C` 的含义是？

A. 正则化强度，越大惩罚越强  
B. 正则化强度的倒数，越大惩罚越弱  
C. 学习率  
D. 最大迭代次数

**3.3** 对于类别不平衡的二分类问题，以下哪种方法最合适？

A. 增加 `max_iter`  
B. 设置 `class_weight='balanced'`  
C. 使用 `solver='liblinear'`  
D. 减小 `C` 值

### 二、判断题

**3.4** 逻辑回归的损失函数是均方误差（MSE）。（  ）

**3.5** 在逻辑回归中，决策边界是线性的。（  ）

**3.6** `predict_proba()` 返回的是样本属于各个类别的概率，所有概率之和为1。（  ）

### 三、代码填空题

**3.7** 补全代码，获取预测概率并绘制 ROC 曲线：

```python
from sklearn.metrics import roc_curve, auc

y_prob = model.________(X_test)[:, 1]  # 填空：获取正类概率
fpr, tpr, _ = roc_curve(y_test, y_prob)
roc_auc = auc(fpr, tpr)
```

**3.8** 补全代码，处理类别不平衡：

```python
model = LogisticRegression(class_weight=________, random_state=42)  # 填空
model.fit(X_train, y_train)
```

**3.9** 补全代码，使用 Softmax 进行多分类：

```python
model = LogisticRegression(multi_class=________, solver='lbfgs', max_iter=1000)
model.fit(X_train, y_train)
```

---

## ✅ 第3章 答案与解析

### 选择题

**3.1 答案: B**  
解析: Sigmoid 函数 $\sigma(z) = 1/(1+e^{-z})$ 将实数映射到 (0,1)，适合表示概率。Softmax 用于多分类，ReLU 是神经网络激活函数。

**3.2 答案: B**  
解析: `C` 是正则化强度的倒数（$C = 1/\lambda$），C 越大正则化越弱，模型越倾向于拟合训练数据。注意这与 Ridge/Lasso 中的 `alpha` 含义相反。

**3.3 答案: B**  
解析: `class_weight='balanced'` 会根据训练集中各类别的频率自动计算权重，让少数类获得更高的惩罚权重，从而缓解类别不平衡问题。

### 判断题

**3.4 答案: ×（错误）**  
解析: 逻辑回归使用**交叉熵损失（Cross-Entropy Loss / Log Loss）**，而非 MSE。因为 MSE 在分类问题中会导致非凸优化，存在多个局部最优。

**3.5 答案: √（正确）**  
解析: 逻辑回归的决策边界是 $P(y=1|x) = 0.5$ 即 $z = 0$ 的等值线，这是一个线性超平面。如果特征进行了多项式扩展，决策边界可以是非线性的。

**3.6 答案: √（正确）**  
解析: `predict_proba()` 返回的是样本属于每个类别的概率数组，每行和为1。对于二分类返回两列 [P(0), P(1)]，多分类返回 N 列。

### 代码填空题

**3.7 答案:** `predict_proba`  
解析: `predict_proba()` 返回各类概率矩阵，[:, 1] 取第二列即正类概率。

**3.8 答案:** `'balanced'`  
解析: `class_weight='balanced'` 自动平衡类别权重。

**3.9 答案:** `'multinomial'`  
解析: `multi_class='multinomial'` 使用 Softmax 回归直接进行多分类，比 OvR 更自然，通常效果更好。

---
---

# 第4章 有监督学习 - KNN（K近邻算法）

## 4.1 算法原理

KNN（K-Nearest Neighbors）是一种**惰性学习（Lazy Learning）**算法，没有显式的训练过程。

### 核心思想

> "近朱者赤，近墨者黑" — 一个样本的类别由其最近的 K 个邻居的多数类别决定。

### 算法步骤

```
1. 计算待预测样本与训练集中所有样本的距离
2. 选取距离最近的 K 个邻居
3. 分类任务：K 个邻居中多数类别即为预测结果（投票）
   回归任务：K 个邻居目标值的平均（或加权平均）
```

### 距离度量

| 距离 | 公式 | 适用场景 |
|------|------|----------|
| **欧氏距离** | $d = \sqrt{\sum(x_i - y_i)^2}$ | 连续特征，默认选择 |
| **曼哈顿距离** | $d = \sum|x_i - y_i|$ | 高维数据，网格状路径 |
| **闵可夫斯基距离** | $d = (\sum|x_i - y_i|^p)^{1/p}$ | p=1 为曼哈顿，p=2 为欧氏 |
| **余弦相似度** | $cos(\theta) = \frac{A \cdot B}{||A|| \cdot ||B||}$ | 文本、推荐系统 |

### K 值选择

| K 值 | 特点 | 风险 |
|------|------|------|
| K 较小 | 模型复杂，对噪声敏感 | 过拟合 |
| K 较大 | 模型简单，决策边界平滑 | 欠拟合 |
| K = 样本数 | 所有样本预测为多数类 | 完全失效 |

**经验法则**：$K = \sqrt{n}$（n 为样本数），且通常取**奇数**避免平票。

## 4.2 代码实战

```python
# ============================================
# KNN 完整实战：鸢尾花分类 + K值选择 + 距离度量对比
# ============================================

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris, make_classification
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# 1. 加载数据
iris = load_iris()
X, y = iris.data, iris.target

# 2. 划分与标准化（KNN 对距离敏感，必须标准化！）
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

# 3. 基础 KNN 分类
knn = KNeighborsClassifier(n_neighbors=5, weights='uniform', metric='minkowski', p=2)
# n_neighbors: K值
# weights: 'uniform' 等权重投票，'distance' 按距离倒数加权
# metric: 距离度量，'minkowski' 配合 p=2 即为欧氏距离
# algorithm: 'auto' 自动选择最优搜索算法（ball_tree, kd_tree, brute）

knn.fit(X_train_s, y_train)
y_pred = knn.predict(X_test_s)
print(f"K=5 准确率: {accuracy_score(y_test, y_pred):.4f}")

# 4. 不同 K 值的交叉验证（选择最优 K）
k_range = range(1, 31)
cv_scores = []
for k in k_range:
    knn_cv = KNeighborsClassifier(n_neighbors=k)
    scores = cross_val_score(knn_cv, X_train_s, y_train, cv=5, scoring='accuracy')
    cv_scores.append(scores.mean())

best_k = k_range[np.argmax(cv_scores)]
print(f"\n最优 K 值: {best_k}, 交叉验证准确率: {max(cv_scores):.4f}")

plt.figure(figsize=(10, 4))
plt.plot(k_range, cv_scores, marker='o')
plt.axvline(best_k, color='r', linestyle='--', label=f'Best K={best_k}')
plt.xlabel('K Value')
plt.ylabel('Cross-Validation Accuracy')
plt.title('K 值选择（5折交叉验证）')
plt.legend()
plt.grid(True)
plt.savefig('/mnt/agents/output/ch4_k_selection.png', dpi=150)
plt.show()

# 5. 不同距离度量对比
metrics = ['euclidean', 'manhattan', 'chebyshev']
metric_scores = {}
for metric in metrics:
    knn_m = KNeighborsClassifier(n_neighbors=best_k, metric=metric)
    scores = cross_val_score(knn_m, X_train_s, y_train, cv=5)
    metric_scores[metric] = scores.mean()

print("\n不同距离度量对比:")
for m, s in metric_scores.items():
    print(f"  {m}: {s:.4f}")

# 6. 权重策略对比（uniform vs distance）
weights_options = ['uniform', 'distance']
for w in weights_options:
    knn_w = KNeighborsClassifier(n_neighbors=best_k, weights=w)
    knn_w.fit(X_train_s, y_train)
    acc = knn_w.score(X_test_s, y_test)
    print(f"\nweights='{w}' 测试集准确率: {acc:.4f}")

# 7. 决策边界可视化（二维）
X_vis = X[:, [0, 2]]  # 取萼片长度和花瓣长度
X_v_train, X_v_test, y_v_train, y_v_test = train_test_split(
    X_vis, y, test_size=0.2, random_state=42, stratify=y
)
scaler_v = StandardScaler()
X_v_train_s = scaler_v.fit_transform(X_v_train)
X_v_test_s = scaler_v.transform(X_v_test)

knn_v = KNeighborsClassifier(n_neighbors=best_k)
knn_v.fit(X_v_train_s, y_v_train)

h = 0.02
x_min, x_max = X_v_train_s[:, 0].min() - 1, X_v_train_s[:, 0].max() + 1
y_min, y_max = X_v_train_s[:, 1].min() - 1, X_v_train_s[:, 1].max() + 1
xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))
Z = knn_v.predict(np.c_[xx.ravel(), yy.ravel()])
Z = Z.reshape(xx.shape)

plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
plt.contourf(xx, yy, Z, alpha=0.4, cmap='viridis')
scatter = plt.scatter(X_v_train_s[:, 0], X_v_train_s[:, 1], c=y_v_train, 
                       cmap='viridis', edgecolors='k')
plt.xlabel('Sepal Length (scaled)')
plt.ylabel('Petal Length (scaled)')
plt.title(f'KNN Decision Boundary (K={best_k})')
plt.colorbar(scatter)

# 8. KNN 回归示例
plt.subplot(1, 2, 2)
# 生成一维回归数据
np.random.seed(42)
X_reg = np.sort(5 * np.random.rand(80, 1), axis=0)
y_reg = np.sin(X_reg).ravel() + np.random.normal(0, 0.1, 80)

knn_reg = KNeighborsRegressor(n_neighbors=5)
knn_reg.fit(X_reg, y_reg)
X_test_reg = np.linspace(0, 5, 500).reshape(-1, 1)
y_pred_reg = knn_reg.predict(X_test_reg)

plt.scatter(X_reg, y_reg, c='blue', label='Data')
plt.plot(X_test_reg, y_pred_reg, c='red', label='KNN Regression (K=5)')
plt.xlabel('X')
plt.ylabel('y')
plt.title('KNN 回归')
plt.legend()

plt.tight_layout()
plt.savefig('/mnt/agents/output/ch4_knn_visualization.png', dpi=150)
plt.show()

# 9. 使用 GridSearchCV 自动调参
param_grid = {
    'n_neighbors': range(1, 20),
    'weights': ['uniform', 'distance'],
    'metric': ['euclidean', 'manhattan']
}
grid = GridSearchCV(KNeighborsClassifier(), param_grid, cv=5, scoring='accuracy')
grid.fit(X_train_s, y_train)
print(f"\nGridSearch 最优参数: {grid.best_params_}")
print(f"最优交叉验证准确率: {grid.best_score_:.4f}")
print(f"测试集准确率: {grid.score(X_test_s, y_test):.4f}")
```

## 4.3 KNN 优缺点

| 优点 | 缺点 |
|------|------|
| 简单直观，易于理解 | 预测时计算量大（需计算所有距离） |
| 无需训练过程 | 对高维数据效果差（维度灾难） |
| 对数据分布无假设 | 对异常值敏感 |
| 适合多分类问题 | 需要大量内存存储训练数据 |

---

## 📝 第4章 练习题

### 一、选择题

**4.1** KNN 算法属于以下哪种学习类型？

A. 参数化学习  
B. 非参数化学习 / 惰性学习  
C. 深度学习  
D. 强化学习

**4.2** KNN 中 `weights='distance'` 的含义是？

A. 所有邻居投票权重相同  
B. 距离越近的邻居权重越大  
C. 只考虑距离最近的1个邻居  
D. 不考虑距离因素

**4.3** 为什么 KNN 必须进行特征标准化？

A. 标准化可以提高模型精度  
B. KNN 基于距离计算，不同量纲的特征会主导距离  
C. 标准化是 sklearn 的强制要求  
D. 标准化可以减少内存占用

### 二、判断题

**4.4** KNN 算法在训练阶段几乎不做任何计算，所有计算都在预测阶段完成。（  ）

**4.5** K 值越大，KNN 的决策边界越复杂，越容易过拟合。（  ）

**4.6** KNN 只能用于分类任务，不能用于回归任务。（  ）

### 三、代码填空题

**4.7** 补全代码，使用曼哈顿距离和距离加权：

```python
knn = KNeighborsClassifier(
    n_neighbors=7, 
    metric=________,       # 填空：曼哈顿距离
    weights=________       # 填空：按距离加权
)
```

**4.8** 补全代码，使用交叉验证选择最优 K 值：

```python
from sklearn.model_selection import cross_val_score

k_range = range(1, 21)
cv_scores = []
for k in k_range:
    knn = KNeighborsClassifier(n_neighbors=k)
    scores = cross_val_score(knn, X_train, y_train, cv=________)  # 填空
    cv_scores.append(scores.mean())

best_k = k_range[np.argmax(cv_scores)]
```

**4.9** 补全代码，使用 GridSearchCV 搜索最优参数组合：

```python
from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_neighbors': [3, 5, 7, 9],
    'weights': ['uniform', 'distance']
}
grid = GridSearchCV(KNeighborsClassifier(), param_grid, cv=5, scoring=________)  # 填空
grid.fit(X_train, y_train)
print(grid.best_params_)
```

---

## ✅ 第4章 答案与解析

### 选择题

**4.1 答案: B**  
解析: KNN 是一种**非参数化**和**惰性学习**算法。它没有显式的训练过程，不学习模型参数，而是直接记忆训练数据，预测时才进行计算。

**4.2 答案: B**  
解析: `weights='distance'` 表示邻居的投票权重与其距离成反比，距离越近的邻居影响力越大。`'uniform'` 表示等权重投票。

**4.3 答案: B**  
解析: KNN 基于距离度量，如果某个特征的量纲很大（如收入以元为单位），它会完全主导距离计算，掩盖其他特征的作用。标准化使各特征在相同尺度上公平竞争。

### 判断题

**4.4 答案: √（正确）**  
解析: KNN 是惰性学习的典型代表。训练阶段仅仅是存储数据，预测阶段才计算距离、找邻居、投票，因此预测速度较慢，不适合大规模实时预测。

**4.5 答案: ×（错误）**  
解析: K 值越大，参与投票的邻居越多，决策边界越平滑，模型越简单，越容易**欠拟合**。K 值越小，边界越复杂，越容易过拟合。

**4.6 答案: ×（错误）**  
解析: KNN 既可以用于分类（`KNeighborsClassifier`，投票决定类别），也可以用于回归（`KNeighborsRegressor`，取邻居目标值的平均或加权平均）。

### 代码填空题

**4.7 答案:**
- 填空1: `'manhattan'`
- 填空2: `'distance'`

**4.8 答案:** `5`（或任意正整数）  
解析: `cv` 参数指定交叉验证折数。

**4.9 答案:** `'accuracy'`（或 `'f1'` / `'roc_auc'` 等）  
解析: `scoring` 参数指定评估指标，`'accuracy'` 是分类任务最常用的指标。

---


---
---

# 第5章 有监督学习 - 朴素贝叶斯

## 5.1 算法原理

朴素贝叶斯（Naive Bayes）是基于**贝叶斯定理**和**特征条件独立性假设**的分类算法。

### 贝叶斯定理

$$P(Y|X) = \frac{P(X|Y) \cdot P(Y)}{P(X)}$$

- $P(Y)$: 先验概率（各类别的初始概率）
- $P(X|Y)$: 似然（在某类别下观察到特征 X 的概率）
- $P(Y|X)$: 后验概率（观察到 X 后属于类别 Y 的概率）
- $P(X)$: 证据（归一化因子）

### "朴素"的含义

假设所有特征之间**条件独立**：

$$P(X|Y) = P(x_1|Y) \times P(x_2|Y) \times ... \times P(x_n|Y)$$

这个假设在现实中很少成立，但算法仍然表现优异，尤其在文本分类领域。

### 三种变体

| 变体 | 假设 | 适用数据 | sklearn 类 |
|------|------|----------|-----------|
| **高斯朴素贝叶斯** | 特征服从正态分布 | 连续数值特征 | `GaussianNB` |
| **多项式朴素贝叶斯** | 特征服从多项式分布 | 离散计数特征（词频） | `MultinomialNB` |
| **伯努利朴素贝叶斯** | 特征为二值（0/1） | 二值特征（词是否出现） | `BernoulliNB` |

## 5.2 代码实战

```python
# ============================================
# 朴素贝叶斯完整实战：文本分类 + 鸢尾花分类
# ============================================

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris, fetch_20newsgroups
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.naive_bayes import GaussianNB, MultinomialNB, BernoulliNB
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# ============ Part 1: 高斯朴素贝叶斯（连续特征）============
print("=" * 50)
print("Part 1: 高斯朴素贝叶斯 - 鸢尾花分类")
print("=" * 50)

iris = load_iris()
X, y = iris.data, iris.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 高斯朴素贝叶斯假设特征服从正态分布
# 虽然理论上不需要标准化，但标准化后效果通常更好
gnb = GaussianNB()
gnb.fit(X_train, y_train)

y_pred = gnb.predict(X_test)
y_prob = gnb.predict_proba(X_test)

print(f"准确率: {accuracy_score(y_test, y_pred):.4f}")
print(f"\n各类先验概率: {gnb.class_prior_}")
print(f"各类均值:\n{gnb.theta_}")      # 每类每个特征的均值
print(f"各类方差:\n{gnb.var_}")        # 每类每个特征的方差

# 交叉验证
cv_scores = cross_val_score(GaussianNB(), X, y, cv=5)
print(f"\n5折交叉验证准确率: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

# ============ Part 2: 多项式朴素贝叶斯（文本分类）============
print("\n" + "=" * 50)
print("Part 2: 多项式朴素贝叶斯 - 20类新闻文本分类")
print("=" * 50)

# 加载20类新闻数据集（取4个类别做演示）
categories = ['alt.atheism', 'sci.space', 'talk.religion.misc', 'comp.graphics']
newsgroups_train = fetch_20newsgroups(subset='train', categories=categories, 
                                       remove=('headers', 'footers', 'quotes'))
newsgroups_test = fetch_20newsgroups(subset='test', categories=categories,
                                      remove=('headers', 'footers', 'quotes'))

# TF-IDF 特征提取
# 将文本转换为数值向量，TF-IDF 衡量词在文档中的重要性
vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
X_train_text = vectorizer.fit_transform(newsgroups_train.data)
X_test_text = vectorizer.transform(newsgroups_test.data)

print(f"训练集文本数: {len(newsgroups_train.data)}")
print(f"特征维度: {X_train_text.shape}")

# 多项式朴素贝叶斯适合词频/TF-IDF 特征
# alpha: 拉普拉斯平滑参数，防止概率为0
mnb = MultinomialNB(alpha=1.0)
mnb.fit(X_train_text, newsgroups_train.target)

y_pred_text = mnb.predict(X_test_text)
print(f"\n文本分类准确率: {accuracy_score(newsgroups_test.target, y_pred_text):.4f}")
print("\n分类报告:")
print(classification_report(newsgroups_test.target, y_pred_text, 
                          target_names=newsgroups_train.target_names))

# 查看每个类别最重要的词
feature_names = vectorizer.get_feature_names_out()
for i, category in enumerate(newsgroups_train.target_names):
    top_indices = np.argsort(mnb.feature_log_prob_[i])[-10:]
    top_words = [feature_names[j] for j in top_indices]
    print(f"\n【{category}】Top 10 关键词: {', '.join(reversed(top_words))}")

# ============ Part 3: 伯努利朴素贝叶斯（二值特征）============
print("\n" + "=" * 50)
print("Part 3: 伯努利朴素贝叶斯")
print("=" * 50)

# 伯努利NB 适合二值特征（词是否出现）
# 使用 binary=True 将 TF-IDF 转为二值
vectorizer_bin = CountVectorizer(stop_words='english', max_features=5000, binary=True)
X_train_bin = vectorizer_bin.fit_transform(newsgroups_train.data)
X_test_bin = vectorizer_bin.transform(newsgroups_test.data)

bnb = BernoulliNB(alpha=1.0)
bnb.fit(X_train_bin, newsgroups_train.target)
print(f"伯努利NB准确率: {bnb.score(X_test_bin, newsgroups_test.target):.4f}")

# ============ Part 4: 可视化 - 决策边界 ============
# 使用鸢尾花前两个特征可视化
X_vis = X[:, :2]
X_v_train, X_v_test, y_v_train, y_v_test = train_test_split(
    X_vis, y, test_size=0.2, random_state=42, stratify=y
)

gnb_vis = GaussianNB()
gnb_vis.fit(X_v_train, y_v_train)

h = 0.02
x_min, x_max = X_vis[:, 0].min() - 0.5, X_vis[:, 0].max() + 0.5
y_min, y_max = X_vis[:, 1].min() - 0.5, X_vis[:, 1].max() + 0.5
xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))
Z = gnb_vis.predict(np.c_[xx.ravel(), yy.ravel()])
Z = Z.reshape(xx.shape)

plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
plt.contourf(xx, yy, Z, alpha=0.4, cmap='viridis')
scatter = plt.scatter(X_vis[:, 0], X_vis[:, 1], c=y, cmap='viridis', edgecolors='k')
plt.xlabel(iris.feature_names[0])
plt.ylabel(iris.feature_names[1])
plt.title('GaussianNB Decision Boundary')
plt.colorbar(scatter)

# 概率分布可视化
plt.subplot(1, 2, 2)
proba = gnb_vis.predict_proba(np.c_[xx.ravel(), yy.ravel()])
# 绘制最大概率的等高线
proba_max = proba.max(axis=1).reshape(xx.shape)
contour = plt.contourf(xx, yy, proba_max, levels=20, cmap='RdYlGn')
plt.colorbar(contour, label='Max Probability')
plt.scatter(X_vis[:, 0], X_vis[:, 1], c=y, cmap='viridis', edgecolors='k')
plt.xlabel(iris.feature_names[0])
plt.ylabel(iris.feature_names[1])
plt.title('Prediction Confidence')

plt.tight_layout()
plt.savefig('/mnt/agents/output/ch5_naive_bayes.png', dpi=150)
plt.show()
```

## 5.3 关键要点总结

1. **朴素贝叶斯的核心假设是特征条件独立**，现实中虽不成立，但分类效果往往很好
2. **拉普拉斯平滑（alpha）**：防止某个特征在某类别中未出现时概率为0
3. **文本分类首选**：多项式NB + TF-IDF 是垃圾邮件过滤、情感分析的经典组合
4. **训练速度极快**：时间复杂度 O(nd)，适合大规模数据
5. **对缺失值不敏感**：可以处理不完整数据

---

## 📝 第5章 练习题

### 一、选择题

**5.1** 朴素贝叶斯中的"朴素"指的是？

A. 算法实现简单  
B. 假设特征之间条件独立  
C. 模型参数很少  
D. 不需要训练数据

**5.2** 对于文本分类任务（词频特征），应该使用哪种朴素贝叶斯？

A. GaussianNB  
B. MultinomialNB  
C. BernoulliNB  
D. ComplementNB

**5.3** 拉普拉斯平滑（Laplace Smoothing）的作用是？

A. 提高模型训练速度  
B. 防止概率为0导致整个后验概率为0  
C. 减少模型内存占用  
D. 增加模型复杂度

### 二、判断题

**5.4** 朴素贝叶斯假设特征之间完全独立，因此如果特征之间相关性很强，算法一定表现很差。（  ）

**5.5** 高斯朴素贝叶斯假设连续特征服从正态分布。（  ）

**5.6** 在 sklearn 中，`alpha=0` 表示不使用拉普拉斯平滑。（  ）

### 三、代码填空题

**5.7** 补全代码，使用多项式朴素贝叶斯进行文本分类：

```python
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import TfidfVectorizer

vectorizer = TfidfVectorizer(stop_words='english')
X_train_vec = vectorizer.fit_transform(X_train_text)

model = MultinomialNB(alpha=________)  # 填空：设置拉普拉斯平滑参数为1.0
model.fit(X_train_vec, y_train)
```

**5.8** 补全代码，获取模型的先验概率：

```python
gnb = GaussianNB()
gnb.fit(X_train, y_train)
print(gnb.________)  # 填空：打印各类别的先验概率
```

**5.9** 补全代码，使用伯努利朴素贝叶斯处理二值特征：

```python
from sklearn.naive_bayes import BernoulliNB

# CountVectorizer 的 binary=True 将词频转为二值（出现为1，否则为0）
vectorizer = CountVectorizer(binary=________)  # 填空
X_train_bin = vectorizer.fit_transform(texts)

model = BernoulliNB()
model.fit(X_train_bin, y_train)
```

---

## ✅ 第5章 答案与解析

### 选择题

**5.1 答案: B**  
解析: "朴素"（Naive）指的是算法假设所有特征在已知类别条件下相互独立。这个强假设简化了计算，使后验概率的计算变得可行。

**5.2 答案: B**  
解析: `MultinomialNB` 假设特征服从多项式分布，适合离散计数数据如词频。`GaussianNB` 适合连续特征，`BernoulliNB` 适合二值特征。

**5.3 答案: B**  
解析: 拉普拉斯平滑通过在分子加1、分母加类别数，避免当某个特征在某类别中未出现时 $P(x_i|Y) = 0$ 导致整个后验概率连乘为0的情况。

### 判断题

**5.4 答案: ×（错误）**  
解析: 虽然特征独立性假设不成立，但朴素贝叶斯在很多实际任务中（尤其是文本分类）表现优异。这是因为分类决策只关心后验概率的**相对大小**，而非绝对值，即使概率估计有偏差，排序通常仍是正确的。

**5.5 答案: √（正确）**  
解析: `GaussianNB` 假设每个特征在每个类别下服从高斯（正态）分布，用训练数据估计每个特征的均值和方差，然后计算似然。

**5.6 答案: √（正确）**  
解析: `alpha=0` 表示不使用平滑，但当某个特征在某类别中未出现时会导致概率为0。`alpha=1.0` 是标准的拉普拉斯平滑，`alpha<1` 是 Lidstone 平滑。

### 代码填空题

**5.7 答案:** `1.0`  
解析: `alpha` 是拉普拉斯平滑参数，1.0 是默认值，也是最常用的设置。

**5.8 答案:** `class_prior_`  
解析: `class_prior_` 属性存储各类别的先验概率 $P(Y)$，由训练数据计算得出。

**5.9 答案:** `True`  
解析: `binary=True` 使 CountVectorizer 只记录词是否出现（0/1），不记录出现次数，适合伯努利朴素贝叶斯。

---
---

# 第6章 有监督学习 - SVM（支持向量机）

## 6.1 算法原理

支持向量机（Support Vector Machine, SVM）是一种**最大化分类间隔**的判别式模型。

### 核心思想

找到一个**最优超平面**，使得两类样本之间的**间隔（Margin）**最大。间隔越大，模型的泛化能力越强。

### 线性可分 SVM

对于线性可分数据，优化目标：

$$\min_{w,b} \frac{1}{2} ||w||^2$$

约束条件：$y^{(i)}(w^T x^{(i)} + b) \geq 1, \quad \forall i$

- **支持向量**：位于间隔边界上的样本点，决定了超平面的位置
- 只有支持向量影响模型，其他样本被"忽略"

### 软间隔与正则化

现实数据通常不完全线性可分，引入**松弛变量**和**惩罚参数 C**：

$$\min_{w,b,\xi} \frac{1}{2} ||w||^2 + C \sum_{i=1}^{m} \xi_i$$

| C 值 | 效果 | 风险 |
|------|------|------|
| C 很大 | 惩罚强，尽量正确分类所有点 | 过拟合 |
| C 很小 | 惩罚弱，允许更多误分类 | 欠拟合 |

### 核技巧（Kernel Trick）

当数据线性不可分时，通过**核函数**将数据映射到高维空间，使其线性可分。

| 核函数 | 公式 | 适用场景 |
|--------|------|----------|
| **线性核** | $K(x,y) = x^T y$ | 特征多，线性可分 |
| **多项式核** | $K(x,y) = (\gamma x^T y + r)^d$ | 图像处理 |
| **RBF（高斯核）** | $K(x,y) = \exp(-\gamma ||x-y||^2)$ | 通用，非线性问题 |
| **Sigmoid核** | $K(x,y) = \tanh(\gamma x^T y + r)$ | 类似神经网络 |

### SVM 的优缺点

| 优点 | 缺点 |
|------|------|
| 泛化能力强，理论基础扎实 | 大数据集训练慢（O(n²)~O(n³)） |
| 核技巧处理非线性问题 | 核函数和参数选择困难 |
| 最终模型只依赖支持向量，存储小 | 对噪声和缺失值敏感 |
| 适合高维数据 | 多分类需组合多个二分类器 |

## 6.2 代码实战

```python
# ============================================
# SVM 完整实战：线性/非线性分类 + 核函数对比 + 参数调优
# ============================================

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification, make_moons, load_breast_cancer
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC, LinearSVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# ============ Part 1: 线性 SVM ============
print("=" * 50)
print("Part 1: 线性 SVM")
print("=" * 50)

# 生成线性可分数据
X_linear, y_linear = make_classification(n_samples=200, n_features=2, n_redundant=0,
                                          n_informative=2, n_clusters_per_class=1,
                                          random_state=42)
X_l_train, X_l_test, y_l_train, y_l_test = train_test_split(
    X_linear, y_linear, test_size=0.3, random_state=42
)

# LinearSVC: 使用 liblinear 优化，适合大规模线性问题
# C: 正则化参数，越小正则化越强
linear_svc = LinearSVC(C=1.0, max_iter=10000)
linear_svc.fit(X_l_train, y_l_train)
print(f"线性 SVM 准确率: {linear_svc.score(X_l_test, y_l_test):.4f}")

# ============ Part 2: 非线性 SVM（核函数对比）============
print("\n" + "=" * 50)
print("Part 2: 非线性 SVM - 核函数对比")
print("=" * 50)

# 生成非线性数据（月牙形）
X_moon, y_moon = make_moons(n_samples=300, noise=0.2, random_state=42)
X_m_train, X_m_test, y_m_train, y_m_test = train_test_split(
    X_moon, y_moon, test_size=0.3, random_state=42
)

# 标准化（SVM 对特征尺度敏感）
scaler = StandardScaler()
X_m_train_s = scaler.fit_transform(X_m_train)
X_m_test_s = scaler.transform(X_m_test)

# 对比不同核函数
kernels = ['linear', 'poly', 'rbf', 'sigmoid']
results = {}

for kernel in kernels:
    if kernel == 'poly':
        svm = SVC(kernel=kernel, degree=3, C=1.0)
    else:
        svm = SVC(kernel=kernel, C=1.0)
    svm.fit(X_m_train_s, y_m_train)
    acc = svm.score(X_m_test_s, y_m_test)
    results[kernel] = acc
    print(f"{kernel:10s} 核函数准确率: {acc:.4f}")

# ============ Part 3: RBF 核 SVM 参数调优 ============
print("\n" + "=" * 50)
print("Part 3: RBF 核 SVM 参数调优")
print("=" * 50)

# C 和 gamma 是 RBF 核最重要的两个参数
# gamma: 影响单个样本的影响范围，gamma 越大，每个样本影响范围越小，模型越复杂
param_grid = {
    'C': [0.1, 1, 10, 100],
    'gamma': ['scale', 'auto', 0.001, 0.01, 0.1, 1]
}

grid = GridSearchCV(SVC(kernel='rbf'), param_grid, cv=5, scoring='accuracy', n_jobs=-1)
grid.fit(X_m_train_s, y_m_train)

print(f"最优参数: {grid.best_params_}")
print(f"最优交叉验证准确率: {grid.best_score_:.4f}")
print(f"测试集准确率: {grid.score(X_m_test_s, y_m_test):.4f}")

# ============ Part 4: 乳腺癌分类（高维数据）============
print("\n" + "=" * 50)
print("Part 4: SVM 乳腺癌分类")
print("=" * 50)

cancer = load_breast_cancer()
X_c, y_c = cancer.data, cancer.target
X_c_train, X_c_test, y_c_train, y_c_test = train_test_split(
    X_c, y_c, test_size=0.2, random_state=42, stratify=y_c
)

scaler_c = StandardScaler()
X_c_train_s = scaler_c.fit_transform(X_c_train)
X_c_test_s = scaler_c.transform(X_c_test)

# 线性核 vs RBF 核
svm_linear = SVC(kernel='linear', C=1.0)
svm_rbf = SVC(kernel='rbf', C=1.0, gamma='scale')

svm_linear.fit(X_c_train_s, y_c_train)
svm_rbf.fit(X_c_train_s, y_c_train)

print(f"线性核准确率: {svm_linear.score(X_c_test_s, y_c_test):.4f}")
print(f"RBF核准确率: {svm_rbf.score(X_c_test_s, y_c_test):.4f}")

# 查看支持向量数量
print(f"\nRBF 核支持向量数量: {svm_rbf.n_support_}")
print(f"总支持向量数: {svm_rbf.n_support_.sum()} / {len(X_c_train)}")

# ============ Part 5: 决策边界可视化 ============
fig, axes = plt.subplots(2, 2, figsize=(12, 10))
axes = axes.ravel()

for idx, kernel in enumerate(kernels):
    if kernel == 'poly':
        svm_v = SVC(kernel=kernel, degree=3, C=1.0)
    else:
        svm_v = SVC(kernel=kernel, C=1.0)
    svm_v.fit(X_m_train_s, y_m_train)

    h = 0.02
    x_min, x_max = X_m_train_s[:, 0].min() - 1, X_m_train_s[:, 0].max() + 1
    y_min, y_max = X_m_train_s[:, 1].min() - 1, X_m_train_s[:, 1].max() + 1
    xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))
    Z = svm_v.predict(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)

    axes[idx].contourf(xx, yy, Z, alpha=0.4, cmap='RdYlBu')
    axes[idx].scatter(X_m_train_s[:, 0], X_m_train_s[:, 1], c=y_m_train, 
                       cmap='RdYlBu', edgecolors='k')
    axes[idx].set_title(f'Kernel: {kernel}')
    axes[idx].set_xlabel('Feature 1')
    axes[idx].set_ylabel('Feature 2')

plt.tight_layout()
plt.savefig('/mnt/agents/output/ch6_svm_kernels.png', dpi=150)
plt.show()

# ============ Part 6: C 值影响可视化 ============
fig, axes = plt.subplots(1, 3, figsize=(15, 4))
C_values = [0.1, 1, 100]

for idx, C in enumerate(C_values):
    svm_c = SVC(kernel='rbf', C=C, gamma=0.5)
    svm_c.fit(X_m_train_s, y_m_train)

    h = 0.02
    x_min, x_max = X_m_train_s[:, 0].min() - 1, X_m_train_s[:, 0].max() + 1
    y_min, y_max = X_m_train_s[:, 1].min() - 1, X_m_train_s[:, 1].max() + 1
    xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))
    Z = svm_c.predict(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)

    axes[idx].contourf(xx, yy, Z, alpha=0.4, cmap='RdYlBu')
    axes[idx].scatter(X_m_train_s[:, 0], X_m_train_s[:, 1], c=y_m_train, 
                       cmap='RdYlBu', edgecolors='k')
    axes[idx].set_title(f'C={C}')
    axes[idx].set_xlabel('Feature 1')
    axes[idx].set_ylabel('Feature 2')

plt.suptitle('SVM: Effect of C parameter (RBF kernel, gamma=0.5)')
plt.tight_layout()
plt.savefig('/mnt/agents/output/ch6_svm_c_effect.png', dpi=150)
plt.show()
```

## 6.3 关键要点总结

1. **SVM 的核心是最大化间隔**，只有支持向量决定超平面
2. **C 参数**：控制对误分类的惩罚，C 越大越不允许误分类，模型越复杂
3. **gamma 参数（RBF核）**：控制单个样本的影响范围，gamma 越大越容易过拟合
4. **必须标准化**：SVM 基于距离计算，对特征尺度敏感
5. **核函数选择**：线性核优先尝试，不行再试 RBF；高维数据通常线性核就够了
6. **多分类**：sklearn 默认使用 One-vs-One（OvO）策略

---

## 📝 第6章 练习题

### 一、选择题

**6.1** SVM 的核心优化目标是？

A. 最小化训练误差  
B. 最大化分类间隔  
C. 最小化模型复杂度  
D. 最大化似然函数

**6.2** 在 SVM 中，参数 C 的作用是？

A. 核函数的带宽参数  
B. 正则化参数，C 越小正则化越强  
C. 支持向量的数量  
D. 特征维度

**6.3** 对于非线性可分数据，SVM 通常使用什么技巧？

A. 增加更多特征  
B. 核函数（Kernel Trick）  
C. 降维  
D. 增加训练数据

### 二、判断题

**6.4** SVM 的最终模型只依赖于支持向量，非支持向量的样本可以删除而不影响模型。（  ）

**6.5** RBF 核的 gamma 参数越大，模型的决策边界越平滑。（  ）

**6.6** `LinearSVC` 和 `SVC(kernel='linear')` 在数学上是完全等价的，只是实现不同。（  ）

### 三、代码填空题

**6.7** 补全代码，使用 RBF 核 SVM 并设置参数：

```python
from sklearn.svm import SVC

model = SVC(kernel=________, C=10, gamma=________)  # 填空
model.fit(X_train, y_train)
```

**6.8** 补全代码，使用 GridSearchCV 搜索 SVM 最优参数：

```python
param_grid = {
    'C': [0.1, 1, 10],
    'gamma': ['scale', 'auto', 0.01, 0.1],
    'kernel': ['rbf', 'linear']
}
grid = GridSearchCV(SVC(), param_grid, cv=________, scoring='accuracy')  # 填空
grid.fit(X_train, y_train)
```

**6.9** 补全代码，获取支持向量的数量：

```python
model = SVC(kernel='rbf')
model.fit(X_train, y_train)
print(f"各类别支持向量数: {model.________}")  # 填空
print(f"总支持向量数: {model.________.sum()}")  # 填空
```

---

## ✅ 第6章 答案与解析

### 选择题

**6.1 答案: B**  
解析: SVM 的核心思想是找到一个超平面，使得两类样本到超平面的**间隔（Margin）**最大化。间隔越大，模型的泛化能力越强。

**6.2 答案: B**  
解析: C 是惩罚参数（正则化参数），C 越小对误分类的惩罚越轻，允许更大的间隔，正则化越强。注意这与逻辑回归中的 C 含义相同（都是正则化强度的倒数）。

**6.3 答案: B**  
解析: 核技巧（Kernel Trick）通过核函数隐式地将数据映射到高维空间，使原本线性不可分的数据在新空间中变得线性可分，而无需显式计算高维映射。

### 判断题

**6.4 答案: √（正确）**  
解析: SVM 的模型参数 w 和 b 完全由支持向量决定。非支持向量满足 $y^{(i)}(w^T x^{(i)} + b) > 1$，其对应的拉格朗日乘子为0，对模型无影响。

**6.5 答案: ×（错误）**  
解析: gamma 越大，单个样本的影响范围越小，决策边界越"曲折"，越容易过拟合。gamma 越小，影响范围越大，决策边界越平滑。

**6.6 答案: ×（错误）**  
解析: 虽然两者都训练线性 SVM，但 `LinearSVC` 使用 liblinear 库（支持 L1/L2 正则化），`SVC(kernel='linear')` 使用 libsvm 库。它们在损失函数形式、优化算法、多分类策略上可能不同，结果也可能有差异。

### 代码填空题

**6.7 答案:**
- 填空1: `'rbf'`
- 填空2: `'scale'`（或 `'auto'` / 具体数值如 `0.1`）

**6.8 答案:** `5`（或任意正整数）  
解析: `cv` 指定交叉验证折数。

**6.9 答案:**
- 填空1: `n_support_`
- 填空2: `n_support_`  
解析: `n_support_` 返回每个类别的支持向量数量数组，`.sum()` 得到总数。

---
---

# 第7章 有监督学习 - 决策树

## 7.1 算法原理

决策树（Decision Tree）是一种**树形结构**的分类/回归模型，通过一系列**规则**对数据进行判断。

### 树的结构

- **根节点（Root）**：第一个分裂节点，包含全部数据
- **内部节点（Internal Node）**：根据某个特征进行判断
- **叶节点（Leaf）**：最终的预测结果

### 分裂准则

决策树的核心是选择**最优分裂特征和分裂点**，常用指标：

| 指标 | 公式 | 适用 | sklearn 参数 |
|------|------|------|-------------|
| **信息增益** | $IG = H(D) - \sum \frac{|D_v|}{|D|} H(D_v)$ | ID3 算法 | - |
| **信息增益率** | $GainRatio = \frac{IG}{H_A(D)}$ | C4.5 算法 | - |
| **基尼指数** | $Gini = 1 - \sum p_k^2$ | CART 分类树 | `criterion='gini'` |
| **均方误差** | $MSE = \frac{1}{n} \sum (y_i - \bar{y})^2$ | CART 回归树 | `criterion='squared_error'` |

### 熵与信息增益

**熵**衡量系统的不确定性：

$$H(D) = -\sum_{k=1}^{K} p_k \log_2 p_k$$

- 熵 = 0：完全纯净（所有样本同属一类）
- 熵最大：各类别均匀分布，不确定性最大

**信息增益** = 分裂前的熵 - 分裂后的加权平均熵，增益越大说明分裂效果越好。

### 防止过拟合

| 方法 | 说明 | sklearn 参数 |
|------|------|-------------|
| **预剪枝** | 在构建树时限制树的复杂度 | `max_depth`, `min_samples_split` |
| **后剪枝** | 先构建完整树，再剪枝 | `ccp_alpha`（代价复杂度剪枝） |

### 特征重要性

决策树可以计算每个特征的重要性：

$$Importance(x_i) = \sum_{t \in T_i} p(t) \Delta i(t)$$

即特征 $x_i$ 在所有节点中带来的不纯度减少的加权总和。

## 7.2 代码实战

```python
# ============================================
# 决策树完整实战：分类 + 回归 + 可视化 + 剪枝
# ============================================

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris, load_diabetes, make_classification
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor, export_text, plot_tree
from sklearn.metrics import accuracy_score, mean_squared_error, r2_score
from sklearn import tree

# ============ Part 1: 决策树分类 ============
print("=" * 50)
print("Part 1: 决策树分类 - 鸢尾花")
print("=" * 50)

iris = load_iris()
X, y = iris.data, iris.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 训练决策树分类器
# criterion: 'gini' 或 'entropy'
# max_depth: 最大深度，防止过拟合
# min_samples_split: 节点分裂所需最小样本数
# min_samples_leaf: 叶节点最小样本数
dt_clf = DecisionTreeClassifier(
    criterion='gini',
    max_depth=3,              # 限制深度防止过拟合
    min_samples_split=5,      # 至少5个样本才分裂
    min_samples_leaf=2,       # 叶节点至少2个样本
    random_state=42
)
dt_clf.fit(X_train, y_train)

y_pred = dt_clf.predict(X_test)
print(f"准确率: {accuracy_score(y_test, y_pred):.4f}")

# 特征重要性
importance_df = pd.DataFrame({
    'Feature': iris.feature_names,
    'Importance': dt_clf.feature_importances_
}).sort_values('Importance', ascending=False)
print(f"\n特征重要性:\n{importance_df}")

# 文本形式展示树结构
tree_rules = export_text(dt_clf, feature_names=list(iris.feature_names))
print(f"\n决策树规则（前20行）:\n{'\n'.join(tree_rules.split('\n')[:20])}")

# ============ Part 2: 决策树回归 ============
print("\n" + "=" * 50)
print("Part 2: 决策树回归 - 糖尿病数据")
print("=" * 50)

diabetes = load_diabetes()
X_d, y_d = diabetes.data, diabetes.target

X_d_train, X_d_test, y_d_train, y_d_test = train_test_split(
    X_d, y_d, test_size=0.2, random_state=42
)

dt_reg = DecisionTreeRegressor(
    criterion='squared_error',
    max_depth=5,
    min_samples_split=10,
    random_state=42
)
dt_reg.fit(X_d_train, y_d_train)

y_d_pred = dt_reg.predict(X_d_test)
print(f"MSE: {mean_squared_error(y_d_test, y_d_pred):.4f}")
print(f"R²: {r2_score(y_d_test, y_d_pred):.4f}")

# ============ Part 3: 预剪枝参数调优 ============
print("\n" + "=" * 50)
print("Part 3: 预剪枝参数调优")
print("=" * 50)

# 对比不同 max_depth 的效果
depths = range(1, 21)
train_scores = []
test_scores = []

for d in depths:
    dt = DecisionTreeClassifier(max_depth=d, random_state=42)
    dt.fit(X_train, y_train)
    train_scores.append(dt.score(X_train, y_train))
    test_scores.append(dt.score(X_test, y_test))

plt.figure(figsize=(10, 4))
plt.plot(depths, train_scores, 'o-', label='Train Accuracy')
plt.plot(depths, test_scores, 's-', label='Test Accuracy')
plt.xlabel('Max Depth')
plt.ylabel('Accuracy')
plt.title('Effect of Max Depth (Pre-pruning)')
plt.legend()
plt.grid(True)
plt.savefig('/mnt/agents/output/ch7_dt_pruning.png', dpi=150)
plt.show()

# 使用 GridSearchCV 自动调参
param_grid = {
    'max_depth': [2, 3, 5, 7, 10, None],
    'min_samples_split': [2, 5, 10, 20],
    'min_samples_leaf': [1, 2, 4, 8],
    'criterion': ['gini', 'entropy']
}

grid = GridSearchCV(DecisionTreeClassifier(random_state=42), param_grid, 
                    cv=5, scoring='accuracy')
grid.fit(X_train, y_train)
print(f"\n最优参数: {grid.best_params_}")
print(f"最优交叉验证准确率: {grid.best_score_:.4f}")
print(f"测试集准确率: {grid.score(X_test, y_test):.4f}")

# ============ Part 4: 后剪枝（代价复杂度剪枝）============
print("\n" + "=" * 50)
print("Part 4: 代价复杂度剪枝 (CCP)")
print("=" * 50)

# 先训练一棵完整的树
dt_full = DecisionTreeClassifier(random_state=42)
dt_full.fit(X_train, y_train)

# 获取剪枝路径
path = dt_full.cost_complexity_pruning_path(X_train, y_train)
ccp_alphas = path.ccp_alphas
impurities = path.impurities

# 对每个 alpha 训练一棵树并评估
train_scores_ccp = []
test_scores_ccp = []
for ccp_alpha in ccp_alphas:
    dt_ccp = DecisionTreeClassifier(random_state=42, ccp_alpha=ccp_alpha)
    dt_ccp.fit(X_train, y_train)
    train_scores_ccp.append(dt_ccp.score(X_train, y_train))
    test_scores_ccp.append(dt_ccp.score(X_test, y_test))

# 找到最优 alpha
best_alpha_idx = np.argmax(test_scores_ccp)
best_alpha = ccp_alphas[best_alpha_idx]
print(f"最优 ccp_alpha: {best_alpha:.6f}, 测试准确率: {test_scores_ccp[best_alpha_idx]:.4f}")

plt.figure(figsize=(10, 4))
plt.plot(ccp_alphas, train_scores_ccp, 'o-', label='Train')
plt.plot(ccp_alphas, test_scores_ccp, 's-', label='Test')
plt.axvline(best_alpha, color='r', linestyle='--', label=f'Best α={best_alpha:.4f}')
plt.xlabel('ccp_alpha')
plt.ylabel('Accuracy')
plt.title('Cost Complexity Pruning')
plt.legend()
plt.grid(True)
plt.savefig('/mnt/agents/output/ch7_dt_ccp.png', dpi=150)
plt.show()

# ============ Part 5: 决策树可视化 ============
plt.figure(figsize=(20, 12))
plot_tree(dt_clf, 
          feature_names=iris.feature_names,
          class_names=iris.target_names,
          filled=True,           # 用颜色填充节点
          rounded=True,          # 圆角节点
          fontsize=10,
          impurity=False,        # 不显示不纯度
          proportion=True)       # 显示比例
plt.title('Decision Tree Visualization (Iris Dataset)')
plt.savefig('/mnt/agents/output/ch7_dt_visualization.png', dpi=150, bbox_inches='tight')
plt.show()

# ============ Part 6: 决策边界可视化 ============
X_vis = X[:, [0, 2]]  # 萼片长度 vs 花瓣长度
X_v_train, X_v_test, y_v_train, y_v_test = train_test_split(
    X_vis, y, test_size=0.2, random_state=42, stratify=y
)

dt_vis = DecisionTreeClassifier(max_depth=3, random_state=42)
dt_vis.fit(X_v_train, y_v_train)

h = 0.02
x_min, x_max = X_vis[:, 0].min() - 0.5, X_vis[:, 0].max() + 0.5
y_min, y_max = X_vis[:, 1].min() - 0.5, X_vis[:, 1].max() + 0.5
xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))
Z = dt_vis.predict(np.c_[xx.ravel(), yy.ravel()])
Z = Z.reshape(xx.shape)

plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
plt.contourf(xx, yy, Z, alpha=0.4, cmap='viridis')
scatter = plt.scatter(X_vis[:, 0], X_vis[:, 1], c=y, cmap='viridis', edgecolors='k')
plt.xlabel(iris.feature_names[0])
plt.ylabel(iris.feature_names[2])
plt.title('Decision Tree Decision Boundary')
plt.colorbar(scatter)

# 对比不同深度的边界
plt.subplot(1, 2, 2)
dt_deep = DecisionTreeClassifier(max_depth=10, random_state=42)
dt_deep.fit(X_v_train, y_v_train)
Z_deep = dt_deep.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
plt.contourf(xx, yy, Z_deep, alpha=0.4, cmap='viridis')
plt.scatter(X_vis[:, 0], X_vis[:, 1], c=y, cmap='viridis', edgecolors='k')
plt.xlabel(iris.feature_names[0])
plt.ylabel(iris.feature_names[2])
plt.title('Decision Tree (max_depth=10) - Overfitting')

plt.tight_layout()
plt.savefig('/mnt/agents/output/ch7_dt_boundary.png', dpi=150)
plt.show()
```

## 7.3 关键要点总结

1. **决策树的优势**：可解释性强，无需特征标准化，能处理非线性关系
2. **主要缺点**：容易过拟合，对数据微小变化敏感（不稳定）
3. **剪枝策略**：
   - 预剪枝：`max_depth`, `min_samples_split`, `min_samples_leaf`
   - 后剪枝：`ccp_alpha` 代价复杂度剪枝
4. **特征重要性**：基于不纯度减少计算，可用于特征选择
5. **不稳定性**：数据的微小变化可能导致完全不同的树结构 → 解决方案：集成方法（随机森林）

---

## 📝 第7章 练习题

### 一、选择题

**7.1** 决策树中，CART 算法用于分类时默认使用的不纯度指标是？

A. 信息增益  
B. 基尼指数（Gini Index）  
C. 信息增益率  
D. 交叉熵

**7.2** 决策树中，以下哪个参数用于预剪枝？

A. `ccp_alpha`  
B. `max_depth`  
C. `random_state`  
D. `splitter`

**7.3** 关于决策树的特征重要性，以下说法正确的是？

A. 所有特征的重要性之和等于1  
B. 特征重要性可以为负数  
C. 只有根节点的特征才有重要性  
D. 特征重要性与特征类型无关

### 二、判断题

**7.4** 决策树对特征缩放（标准化/归一化）不敏感。（  ）

**7.5** 决策树的叶节点越多，模型越简单，越不容易过拟合。（  ）

**7.6** 代价复杂度剪枝（CCP）是一种后剪枝方法。（  ）

### 三、代码填空题

**7.7** 补全代码，使用基尼指数作为分裂标准：

```python
from sklearn.tree import DecisionTreeClassifier

model = DecisionTreeClassifier(criterion=________, max_depth=5, random_state=42)  # 填空
model.fit(X_train, y_train)
```

**7.8** 补全代码，使用代价复杂度剪枝：

```python
# 获取剪枝路径
path = model.cost_complexity_pruning_path(X_train, y_train)
ccp_alphas = path.________  # 填空

# 使用最优 alpha 重新训练
best_alpha = ccp_alphas[np.argmax(test_scores)]
pruned_model = DecisionTreeClassifier(ccp_alpha=________, random_state=42)  # 填空
pruned_model.fit(X_train, y_train)
```

**7.9** 补全代码，可视化决策树：

```python
from sklearn.tree import plot_tree
import matplotlib.pyplot as plt

plt.figure(figsize=(20, 12))
plot_tree(model, feature_names=feature_names, class_names=class_names, 
          filled=________, rounded=________)  # 填空
plt.show()
```

---

## ✅ 第7章 答案与解析

### 选择题

**7.1 答案: B**  
解析: sklearn 的 `DecisionTreeClassifier` 默认 `criterion='gini'`，使用基尼指数。ID3 使用信息增益，C4.5 使用信息增益率。

**7.2 答案: B**  
解析: `max_depth` 限制树的最大深度，是预剪枝参数。`ccp_alpha` 是后剪枝参数。`splitter` 控制分裂策略（best/random）。

**7.3 答案: A**  
解析: sklearn 中 `feature_importances_` 已归一化，所有特征重要性之和为1。重要性基于该特征在所有节点中带来的不纯度减少的加权总和。

### 判断题

**7.4 答案: √（正确）**  
解析: 决策树基于特征的排序进行分裂，不受特征的绝对数值和量纲影响，因此不需要标准化/归一化。这是决策树相比 KNN、SVM 的一大优势。

**7.5 答案: ×（错误）**  
解析: 叶节点越多，树的结构越复杂，模型对训练数据的拟合程度越高，越容易**过拟合**。限制叶节点数量是防止过拟合的手段。

**7.6 答案: √（正确）**  
解析: 代价复杂度剪枝（Cost Complexity Pruning）先构建完整的树，然后通过 `ccp_alpha` 参数控制剪枝强度，属于后剪枝方法。

### 代码填空题

**7.7 答案:** `'gini'`  
解析: `criterion='gini'` 使用基尼指数，`'entropy'` 使用信息增益（基于熵）。

**7.8 答案:**
- 填空1: `ccp_alphas`
- 填空2: `best_alpha`  
解析: `cost_complexity_pruning_path()` 返回 `ccp_alphas` 和 `impurities`，用最优 alpha 重新训练剪枝后的树。

**7.9 答案:**
- 填空1: `True`
- 填空2: `True`  
解析: `filled=True` 用颜色表示类别，`rounded=True` 使用圆角节点，使可视化更美观。

---
---

# 第8章 有监督学习 - 集成算法概述

## 8.1 为什么需要集成学习？

**集成学习（Ensemble Learning）** 通过组合多个基学习器（Base Learner）来提升整体性能。

### 核心思想

> "三个臭皮匠，顶个诸葛亮" — 多个弱学习器组合可以变成强学习器。

### 集成学习的优势

| 优势 | 说明 |
|------|------|
| **降低方差** | 多个模型平均，减少随机性 |
| **降低偏差** | 组合可以拟合更复杂的模式 |
| **提高稳定性** | 对数据扰动不敏感 |
| **减少过拟合** | 通过正则化组合防止过拟合 |

### 基学习器的要求

集成学习要有效，基学习器需要满足：
1. **准确性**：每个基学习器至少比随机猜测好
2. **多样性**：基学习器之间要有差异（不能全部相同）

## 8.2 集成学习的三大范式

### 1. Bagging（Bootstrap Aggregating）

**并行训练**多个同质模型，通过**自助采样（Bootstrap）**产生不同的训练子集。

```
训练阶段:
  For i = 1 to M:
    从原始数据集 D 中有放回地抽取 n 个样本 → D_i
    用 D_i 训练基学习器 h_i

预测阶段:
  分类：多数投票 h(x) = mode{h_1(x), ..., h_M(x)}
  回归：平均 h(x) = (1/M) Σ h_i(x)
```

**代表算法**：随机森林（Random Forest）

### 2. Boosting（提升）

**串行训练**多个模型，每个新模型重点关注前一个模型**分错的样本**。

```
训练阶段:
  1. 初始化样本权重（均匀分布）
  2. For t = 1 to T:
       a. 根据当前权重训练基学习器 h_t
       b. 计算 h_t 的错误率 ε_t
       c. 计算 h_t 的权重 α_t
       d. 更新样本权重：分错的样本权重增加
  3. 组合所有基学习器
```

**代表算法**：AdaBoost、GBDT、XGBoost、LightGBM、CatBoost

### 3. Stacking（堆叠）

用**另一个模型（元学习器）**来组合多个基学习器的预测结果。

```
训练阶段:
  1. 将数据分为 K 折
  2. 训练第一层模型（基学习器）
  3. 用第一层模型的输出作为特征，训练第二层模型（元学习器）
```

## 8.3 Bagging vs Boosting 对比

| 维度 | Bagging | Boosting |
|------|---------|----------|
| **训练方式** | 并行，相互独立 | 串行，依赖前一个模型 |
| **采样方式** | 自助采样（有放回） | 调整样本权重 |
| **基学习器关系** | 同等重要 | 根据表现赋予不同权重 |
| **主要目标** | 降低方差 | 降低偏差 |
| **代表算法** | 随机森林 | AdaBoost、GBDT、XGBoost |
| **对异常值敏感** | 不敏感 | 敏感 |
| **过拟合风险** | 低 | 较高（需控制迭代次数） |

## 8.4 偏差-方差分解

$$E[(y - \hat{f}(x))^2] = Bias^2 + Variance + Noise$$

| 方法 | 对偏差的影响 | 对方差的影响 |
|------|-------------|-------------|
| **Bagging** | 轻微增加 | 显著降低 |
| **Boosting** | 显著降低 | 轻微增加 |

- **Bagging** 适合**高方差低偏差**的基学习器（如深度决策树）
- **Boosting** 适合**低方差高偏差**的基学习器（如浅层决策树）

## 8.5 代码实战：集成效果演示

```python
# ============================================
# 集成算法概述：单棵树 vs Bagging vs Boosting 效果对比
# ============================================

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification, make_moons
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import BaggingClassifier, AdaBoostClassifier, RandomForestClassifier
from sklearn.metrics import accuracy_score

# 生成复杂数据集
X, y = make_moons(n_samples=500, noise=0.3, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 1. 单棵决策树
dt = DecisionTreeClassifier(random_state=42)
dt.fit(X_train, y_train)
dt_acc = accuracy_score(y_test, dt.predict(X_test))

# 2. Bagging（以决策树为基学习器）
bagging = BaggingClassifier(
    estimator=DecisionTreeClassifier(),  # 基学习器
    n_estimators=100,                   # 100棵树
    max_samples=0.8,                    # 每次采样80%数据
    max_features=0.8,                   # 每次采样80%特征
    bootstrap=True,                     # 有放回采样
    bootstrap_features=False,           # 特征无放回
    n_jobs=-1,
    random_state=42
)
bagging.fit(X_train, y_train)
bagging_acc = accuracy_score(y_test, bagging.predict(X_test))

# 3. AdaBoost
adaboost = AdaBoostClassifier(
    estimator=DecisionTreeClassifier(max_depth=1),  # 决策树桩
    n_estimators=100,
    learning_rate=1.0,
    random_state=42
)
adaboost.fit(X_train, y_train)
ada_acc = accuracy_score(y_test, adaboost.predict(X_test))

# 4. 随机森林
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
rf_acc = accuracy_score(y_test, rf.predict(X_test))

print("=" * 50)
print("集成算法效果对比")
print("=" * 50)
print(f"单棵决策树:     {dt_acc:.4f}")
print(f"Bagging:        {bagging_acc:.4f}")
print(f"AdaBoost:       {ada_acc:.4f}")
print(f"随机森林:       {rf_acc:.4f}")

# 可视化决策边界
fig, axes = plt.subplots(2, 2, figsize=(12, 10))
models = [
    ('Single Decision Tree', dt),
    ('Bagging (100 trees)', bagging),
    ('AdaBoost (100 stumps)', adaboost),
    ('Random Forest (100 trees)', rf)
]

h = 0.02
x_min, x_max = X[:, 0].min() - 0.5, X[:, 0].max() + 0.5
y_min, y_max = X[:, 1].min() - 0.5, X[:, 1].max() + 0.5
xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))

for idx, (name, model) in enumerate(models):
    ax = axes[idx // 2, idx % 2]
    Z = model.predict(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)

    ax.contourf(xx, yy, Z, alpha=0.4, cmap='RdYlBu')
    ax.scatter(X[:, 0], X[:, 1], c=y, cmap='RdYlBu', edgecolors='k')
    ax.set_title(f'{name}\nAccuracy: {accuracy_score(y_test, model.predict(X_test)):.4f}')
    ax.set_xlabel('Feature 1')
    ax.set_ylabel('Feature 2')

plt.tight_layout()
plt.savefig('/mnt/agents/output/ch8_ensemble_comparison.png', dpi=150)
plt.show()

# 学习曲线：随着基学习器数量增加，集成效果的变化
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Bagging 学习曲线
n_estimators_range = range(1, 201, 10)
bagging_scores = []
for n in n_estimators_range:
    bag = BaggingClassifier(estimator=DecisionTreeClassifier(), 
                            n_estimators=n, random_state=42)
    scores = cross_val_score(bag, X, y, cv=5)
    bagging_scores.append(scores.mean())

axes[0].plot(n_estimators_range, bagging_scores, 'o-')
axes[0].set_xlabel('Number of Estimators')
axes[0].set_ylabel('Cross-Validation Accuracy')
axes[0].set_title('Bagging: Effect of n_estimators')
axes[0].grid(True)

# AdaBoost 学习曲线
ada_scores = []
for n in n_estimators_range:
    ada = AdaBoostClassifier(estimator=DecisionTreeClassifier(max_depth=1), 
                             n_estimators=n, random_state=42)
    scores = cross_val_score(ada, X, y, cv=5)
    ada_scores.append(scores.mean())

axes[1].plot(n_estimators_range, ada_scores, 's-', color='orange')
axes[1].set_xlabel('Number of Estimators')
axes[1].set_ylabel('Cross-Validation Accuracy')
axes[1].set_title('AdaBoost: Effect of n_estimators')
axes[1].grid(True)

plt.tight_layout()
plt.savefig('/mnt/agents/output/ch8_learning_curves.png', dpi=150)
plt.show()
```

## 8.6 关键要点总结

1. **Bagging 降低方差**：通过并行训练多个模型取平均，适合不稳定的基学习器（如决策树）
2. **Boosting 降低偏差**：通过串行训练，逐步纠正错误，适合弱学习器
3. **随机森林 = Bagging + 随机特征子集**，是 Bagging 的增强版
4. **集成不是万能的**：如果基学习器已经很好且同质，集成提升有限
5. **计算成本**：集成通常需要更多的训练时间和内存

---

## 📝 第8章 练习题

### 一、选择题

**8.1** Bagging 的主要目标是？

A. 降低偏差  
B. 降低方差  
C. 增加模型复杂度  
D. 减少训练时间

**8.2** Boosting 中，每个新基学习器重点关注什么？

A. 所有样本  
B. 前一个模型分错的样本  
C. 特征重要性高的样本  
D. 随机选择的样本

**8.3** 以下哪种方法不属于集成学习？

A. 随机森林  
B. AdaBoost  
C. 决策树  
D. Stacking

### 二、判断题

**8.4** Bagging 中的基学习器是串行训练的，每个模型依赖前一个模型的结果。（  ）

**8.5** 随机森林是 Bagging 的一种改进，它在采样样本的同时还随机选择特征子集。（  ）

**8.6** 集成学习中，基学习器之间的多样性越强，集成效果一定越好。（  ）

### 三、代码填空题

**8.7** 补全代码，使用 Bagging 集成决策树：

```python
from sklearn.ensemble import BaggingClassifier
from sklearn.tree import DecisionTreeClassifier

model = BaggingClassifier(
    estimator=________,       # 填空：基学习器
    n_estimators=________,    # 填空：100个基学习器
    max_samples=0.8,
    random_state=42
)
model.fit(X_train, y_train)
```

**8.8** 补全代码，使用 AdaBoost：

```python
from sklearn.ensemble import AdaBoostClassifier

model = AdaBoostClassifier(
    estimator=DecisionTreeClassifier(max_depth=________),  # 填空：决策树桩
    n_estimators=100,
    learning_rate=________,  # 填空：学习率0.1
    random_state=42
)
```

**8.9** 补全代码，随机森林的关键参数：

```python
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(
    n_estimators=100,
    max_depth=________,       # 填空：限制树的最大深度为10
    max_features=________,    # 填空：每次分裂考虑sqrt(n_features)个特征
    random_state=42
)
```

---

## ✅ 第8章 答案与解析

### 选择题

**8.1 答案: B**  
解析: Bagging 通过并行训练多个模型并取平均，主要降低模型的方差（随机性），提高稳定性。Boosting 主要降低偏差。

**8.2 答案: B**  
解析: Boosting 的核心思想是"关注错误"：每个新基学习器通过增加被前一个模型分错样本的权重，来重点学习难分样本。

**8.3 答案: C**  
解析: 决策树是单个基学习器，不是集成方法。随机森林（Bagging）、AdaBoost（Boosting）、Stacking 都是集成学习方法。

### 判断题

**8.4 答案: ×（错误）**  
解析: Bagging 的基学习器是**并行**训练的，相互独立。Boosting 才是串行训练，每个模型依赖前一个模型的结果。

**8.5 答案: √（正确）**  
解析: 随机森林在 Bagging 的基础上增加了**随机特征选择**（`max_features`），进一步增加了树之间的多样性，是 Bagging 的增强版。

**8.6 答案: ×（错误）**  
解析: 多样性需要与准确性平衡。如果基学习器多样性很强但每个都很差（比随机猜测还差），集成效果反而会更差。有效的集成需要"好而不同"的基学习器。

### 代码填空题

**8.7 答案:**
- 填空1: `DecisionTreeClassifier()`
- 填空2: `100`

**8.8 答案:**
- 填空1: `1`（决策树桩，只有1层分裂）
- 填空2: `0.1`

**8.9 答案:**
- 填空1: `10`
- 填空2: `'sqrt'`  
解析: `max_features='sqrt'` 是随机森林的经典设置，每次分裂随机选择 $\sqrt{n}$ 个特征，增加树之间的多样性。

---

越小，$\alpha_t$ 越大  
C. $\alpha_t$ 与 $\epsilon_t$ 无关  
D. $\alpha_t$ 始终等于1

**12.3** sklearn 中 AdaBoost 默认使用的算法是？

A. SAMME  
B. SAMME.R  
C. Gentle AdaBoost  
D. LogitBoost

### 二、判断题

**12.4** AdaBoost 中，如果某个基学习器的错误率大于 0.5，算法会停止。（  ）

**12.5** AdaBoost 的基学习器之间是并行训练的。（  ）

**12.6** 增加 AdaBoost 的 n_estimators 一定会提高测试集性能。（  ）

### 三、代码填空题

**12.7** 补全代码，创建 AdaBoost 分类器：

```python
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier

model = AdaBoostClassifier(
    estimator=DecisionTreeClassifier(max_depth=________),  # 填空：决策树桩
    n_estimators=________,    # 填空：100轮迭代
    learning_rate=________,   # 填空：学习率0.1
    algorithm='SAMME.R',
    random_state=42
)
```

**12.8** 补全代码，获取每个基学习器的权重：

```python
model.fit(X_train, y_train)
weights = model.________  # 填空
errors = model.________   # 填空
print(f"基学习器权重: {weights}")
print(f"基学习器错误率: {errors}")
```

**12.9** 补全代码，使用 staged_predict 查看训练过程：

```python
for i, pred in enumerate(model.________(X_test)):  # 填空
    acc = accuracy_score(y_test, pred)
    if i % 10 == 0:
        print(f"Iteration {i+1}: {acc:.4f}")
```

---

## ✅ 第12章 答案与解析

### 选择题

**12.1 答案: B**  
解析: AdaBoost 的核心机制是增加被分错样本的权重。样本权重更新公式为 $D_{t+1}(i) = D_t(i) \cdot \exp(\alpha_t)$（分错时 $y_i h_t(x_i) = -1$），所以分错样本权重按 $\exp(\alpha_t) > 1$ 的倍数增加。

**12.2 答案: B**  
解析: $\alpha_t = \frac{1}{2} \ln \frac{1-\epsilon_t}{\epsilon_t}$，错误率越低，$(1-\epsilon_t)/\epsilon_t$ 越大，$\alpha_t$ 越大。当 $\epsilon_t = 0.5$ 时 $\alpha_t = 0$。

**12.3 答案: B**  
解析: sklearn 的 `AdaBoostClassifier` 默认 `algorithm='SAMME.R'`，它使用基学习器的概率估计而非离散预测，收敛更快。SAMME 是离散版本。

### 判断题

**12.4 答案: √（正确）**  
解析: 当基学习器错误率 $\epsilon_t > 0.5$ 时，$\alpha_t$ 会为负数，这意味着该学习器比随机猜测还差。此时算法应停止或重新采样。

**12.5 答案: ×（错误）**  
解析: AdaBoost 是串行训练，每轮迭代依赖前一轮的样本权重分布，无法并行。

**12.6 答案: ×（错误）**  
解析: 迭代次数过多会导致过拟合（尤其对噪声数据）。应使用验证集监控性能，或使用早停策略。

### 代码填空题

**12.7 答案:**
- 填空1: `1`
- 填空2: `100`
- 填空3: `0.1`

**12.8 答案:**
- 填空1: `estimator_weights_`
- 填空2: `estimator_errors_`  
解析: `estimator_weights_` 存储每个基学习器的权重 $\alpha_t$，`estimator_errors_` 存储每个基学习器的错误率 $\epsilon_t$。

**12.9 答案:** `staged_predict`  
解析: `staged_predict()` 返回生成器，每轮产生当前集成模型的预测结果。

---
---

解析: FP-Growth 只需**扫描数据库两次**：第一次统计1项集的支持度，第二次构建 FP 树。之后所有操作都在 FP 树上进行，无需重复扫描数据库。

**16.6 答案: ×（错误）**  
解析: 置信度高但提升度可能很低。例如，如果 B 在所有交易中都很常见（高支持度），即使 $conf(A \to B)$ 很高，$lift$ 也可能接近 1（A 和 B 独立）。

### 代码填空题

**16.7 答案:** `0.3`  
解析: `min_support` 是最小支持度阈值，只有支持度大于等于该值的项集才会被保留。

**16.8 答案:**
- 填空1: `'confidence'`（或 `'support'` / `'lift'`）
- 填空2: `0.5`（或任意阈值）  
解析: `metric` 指定评估指标，`min_threshold` 指定该指标的最小阈值。

**16.9 答案:**
- 填空1: `1.5`
- 填空2: `0.6`

---
---

# 附录

## A. sklearn 常用模块速查

```
sklearn
├── datasets          # 内置数据集
├── model_selection   # 模型选择（交叉验证、划分、调参）
│   ├── train_test_split
│   ├── cross_val_score
│   ├── GridSearchCV
│   └── validation_curve
├── preprocessing     # 数据预处理
│   ├── StandardScaler      # Z-score标准化
│   ├── MinMaxScaler        # 归一化到[0,1]
│   ├── LabelEncoder        # 标签编码
│   └── OneHotEncoder       # 独热编码
├── metrics           # 评估指标
│   ├── accuracy_score, precision_score, recall_score, f1_score
│   ├── mean_squared_error, mean_absolute_error, r2_score
│   ├── confusion_matrix, classification_report
│   ├── roc_curve, auc, silhouette_score
│   └── adjusted_rand_score
├── linear_model      # 线性模型
│   ├── LinearRegression
│   ├── LogisticRegression
│   ├── Ridge, Lasso, ElasticNet
│   └── SGDClassifier, SGDRegressor
├── neighbors         # K近邻
│   └── KNeighborsClassifier, KNeighborsRegressor
├── naive_bayes       # 朴素贝叶斯
│   ├── GaussianNB
│   ├── MultinomialNB
│   └── BernoulliNB
├── svm               # 支持向量机
│   ├── SVC, SVR
│   └── LinearSVC, LinearSVR
├── tree              # 决策树
│   ├── DecisionTreeClassifier
│   ├── DecisionTreeRegressor
│   └── export_text, plot_tree
├── ensemble          # 集成学习
│   ├── BaggingClassifier
│   ├── RandomForestClassifier, RandomForestRegressor
│   ├── AdaBoostClassifier, AdaBoostRegressor
│   ├── GradientBoostingClassifier, GradientBoostingRegressor
│   ├── VotingClassifier, StackingClassifier
│   └── HistGradientBoostingClassifier  # sklearn 0.24+
├── cluster           # 聚类
│   ├── KMeans
│   ├── AgglomerativeClustering
│   ├── DBSCAN
│   └── SpectralClustering
├── decomposition     # 降维
│   ├── PCA
│   └── TruncatedSVD
└── inspection        # 模型解释
    ├── permutation_importance
    └── PartialDependenceDisplay
```

## B. 常用评估指标速查表

### 分类指标

| 指标 | sklearn 函数 | 公式 | 适用场景 |
|------|-------------|------|----------|
| 准确率 | `accuracy_score` | $(TP+TN)/(TP+TN+FP+FN)$ | 类别平衡 |
| 精确率 | `precision_score` | $TP/(TP+FP)$ | 关注误报 |
| 召回率 | `recall_score` | $TP/(TP+FN)$ | 关注漏报 |
| F1-Score | `f1_score` | $2PR/(P+R)$ | 平衡精确率和召回率 |
| AUC-ROC | `roc_auc_score` | ROC 曲线下面积 | 排序能力 |
| 对数损失 | `log_loss` | $-\sum y\log(\hat{y})$ | 概率校准 |

### 回归指标

| 指标 | sklearn 函数 | 公式 | 特点 |
|------|-------------|------|------|
| MSE | `mean_squared_error` | $\frac{1}{n}\sum(y-\hat{y})^2$ | 对异常值敏感 |
| RMSE | `np.sqrt(MSE)` | $\sqrt{MSE}$ | 与目标同量纲 |
| MAE | `mean_absolute_error` | $\frac{1}{n}\sum|y-\hat{y}|$ | 对异常值鲁棒 |
| R² | `r2_score` | $1 - \frac{SS_{res}}{SS_{tot}}$ | 解释方差比例 |
| MAPE | 手动计算 | $\frac{1}{n}\sum|\frac{y-\hat{y}}{y}|$ | 百分比误差 |

### 聚类指标

| 指标 | sklearn 函数 | 是否需要标签 | 说明 |
|------|-------------|-------------|------|
| 轮廓系数 | `silhouette_score` | 否 | [-1, 1]，越大越好 |
| CH 指数 | `calinski_harabasz_score` | 否 | 越大越好 |
| DB 指数 | `davies_bouldin_score` | 否 | 越小越好 |
| ARI | `adjusted_rand_score` | 是 | [-1, 1]，越大越好 |
| NMI | `normalized_mutual_info_score` | 是 | [0, 1]，越大越好 |

## C. 超参数调优策略

### 通用调参顺序

```
1. 确定学习率和迭代次数的大致范围
2. 调整树的复杂度参数（max_depth, min_samples_split）
3. 调整采样参数（subsample, colsample_bytree）
4. 调整正则化参数（reg_alpha, reg_lambda）
5. 降低学习率，增加迭代次数，使用早停
```

### 各算法关键参数

| 算法 | 最重要参数 | 调参建议 |
|------|-----------|----------|
| KNN | `n_neighbors` | 交叉验证选择，通常 5~15 |
| 逻辑回归 | `C` | 从大范围开始，逐步缩小 |
| SVM | `C`, `gamma` | 网格搜索，C 取对数尺度 |
| 决策树 | `max_depth` | 先大后小，配合剪枝 |
| 随机森林 | `n_estimators`, `max_features` | n_estimators 尽量大，max_features 用 'sqrt' |
| AdaBoost | `n_estimators`, `learning_rate` | 学习率小则树多 |
| GBDT | `n_estimators`, `learning_rate`, `max_depth` | 深度 3~5，学习率 0.01~0.1 |
| XGBoost | `max_depth`, `learning_rate`, `n_estimators` | 用早停自动选 n_estimators |
| K-Means | `n_clusters` | 肘部法则 + 轮廓系数 |
| DBSCAN | `eps`, `min_samples` | k-距离图辅助确定 eps |

## D. 常见陷阱与最佳实践

### 1. 数据泄漏（Data Leakage）

```python
# ❌ 错误：先标准化再划分
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)  # 用了全部数据！
X_train, X_test = train_test_split(X_scaled)  # 测试集信息泄漏到训练集

# ✅ 正确：先划分再标准化
X_train, X_test = train_test_split(X)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)  # 只用训练集 fit
X_test_scaled = scaler.transform(X_test)          # 测试集只 transform
```

### 2. 类别不平衡处理

```python
# 方法1: 类别权重
model = LogisticRegression(class_weight='balanced')

# 方法2: 过采样（SMOTE）
from imblearn.over_sampling import SMOTE
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_train, y_train)

# 方法3: 欠采样
from imblearn.under_sampling import RandomUnderSampler
rus = RandomUnderSampler(random_state=42)
X_resampled, y_resampled = rus.fit_resample(X_train, y_train)
```

### 3. 特征工程 checklist

- [ ] 处理缺失值（删除/填充/插值）
- [ ] 处理异常值（截断/删除/转换）
- [ ] 类别特征编码（One-Hot / Label / Target Encoding）
- [ ] 数值特征标准化/归一化（对距离敏感模型）
- [ ] 特征选择（过滤法/包装法/嵌入法）
- [ ] 特征构造（交叉特征、多项式特征）
- [ ] 降维（PCA / 特征选择）

### 4. 模型选择流程

```
1. 数据探索（EDA）
   ↓
2. 数据清洗与预处理
   ↓
3. 基线模型（简单模型如逻辑回归）
   ↓
4. 尝试多种算法
   ↓
5. 交叉验证评估
   ↓
6. 超参数调优
   ↓
7. 模型融合（可选）
   ↓
8. 在测试集上最终评估
   ↓
9. 模型解释与部署
```

## E. 学习路径建议

### 入门阶段（第1-5章）
- 掌握 Python 基础 + NumPy/Pandas
- 理解监督学习 vs 无监督学习
- 熟练使用线性回归、逻辑回归、KNN、朴素贝叶斯
- 掌握 train_test_split、交叉验证、标准化

### 进阶阶段（第6-10章）
- 理解 SVM 的核技巧和决策树的分裂准则
- 掌握随机森林和 Bagging 的原理
- 能够进行超参数调优（GridSearchCV）
- 理解偏差-方差权衡

### 精通阶段（第11-16章）
- 深入理解 Boosting 原理（AdaBoost、GBDT、XGBoost）
- 掌握 XGBoost 的参数调优和早停
- 理解聚类算法的适用场景和评估方法
- 能够处理实际业务问题（特征工程、类别不平衡、模型解释）

### 持续学习
- 深度学习（神经网络、CNN、RNN、Transformer）
- 模型解释（SHAP、LIME）
- 模型部署（Flask/FastAPI、Docker、MLflow）
- 大规模机器学习（Spark MLlib、Dask）

---

> **结语**: 机器学习是一门理论与实践并重的学科。掌握算法原理是基础，但真正的能力来自于大量的实践和项目经验。建议读者在学习每个章节后，找 2~3 个实际数据集进行练习，并尝试参加 Kaggle 等竞赛来检验学习成果。
>
> **推荐资源**:
> - 《机器学习》周志华（西瓜书）
> - 《统计学习方法》李航
> - 《Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow》
> - Kaggle Learn (https://www.kaggle.com/learn)
> - sklearn 官方文档 (https://scikit-learn.org/stable/)

---

*本文档由 AI 辅助生成，内容基于 2026 年最新 sklearn 版本和机器学习最佳实践。*

