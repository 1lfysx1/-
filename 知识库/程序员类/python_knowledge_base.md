# Python 从入门到精通知识库

> 本知识库涵盖 Python 编程从基础到高级的完整学习路径，每个知识点均配有代码示例、详细注释、以及配套练习题（选择题、判断题、代码填空题），并附答案与讲解。

---

## 目录

- [第一部分：入门篇](#第一部分入门篇)
  - [第1章 Python 简介与环境搭建](#第1章-python-简介与环境搭建)
  - [第2章 基础语法](#第2章-基础语法)
  - [第3章 流程控制](#第3章-流程控制)
  - [第4章 数据结构](#第4章-数据结构)
  - [第5章 函数基础](#第5章-函数基础)
  - [第6章 文件操作](#第6章-文件操作)
  - [第7章 异常处理](#第7章-异常处理)
  - [第8章 模块与包](#第8章-模块与包)
- [第二部分：进阶篇](#第二部分进阶篇)
  - [第9章 面向对象编程](#第9章-面向对象编程)
  - [第10章 迭代器与生成器](#第10章-迭代器与生成器)
  - [第11章 装饰器](#第11章-装饰器)
  - [第12章 上下文管理器](#第12章-上下文管理器)
  - [第13章 正则表达式](#第13章-正则表达式)
  - [第14章 多线程与多进程](#第14章-多线程与多进程)
  - [第15章 网络编程基础](#第15章-网络编程基础)
- [第三部分：精通篇](#第三部分精通篇)
  - [第16章 元类](#第16章-元类)
  - [第17章 描述符](#第17章-描述符)
  - [第18章 内存管理与垃圾回收](#第18章-内存管理与垃圾回收)
  - [第19章 设计模式](#第19章-设计模式)
  - [第20章 性能优化](#第20章-性能优化)
  - [第21章 异步编程](#第21章-异步编程)
  - [第22章 类型提示与静态检查](#第22章-类型提示与静态检查)
  - [第23章 C 扩展开发](#第23章-c-扩展开发)

---

# 第一部分：入门篇

---

## 第1章 Python 简介与环境搭建

### 1.1 知识讲解

Python 是一种高级、解释型、通用的编程语言，由 Guido van Rossum 于 1991 年创建。其设计哲学强调代码的可读性和简洁性，使用缩进来表示代码块。

**主要特点：**
- **简洁优雅**：语法接近自然语言，学习曲线平缓
- **解释型语言**：无需编译，直接运行源代码
- **动态类型**：变量类型在运行时确定
- **面向对象**：一切皆对象，支持 OOP 全部特性
- **丰富的标准库**：内置大量实用模块
- **跨平台**：可在 Windows、macOS、Linux 上运行

**Python 版本选择：**
- Python 2.x 已于 2020 年停止维护
- Python 3.x 是当前唯一推荐版本（建议 3.8+）
- 主要版本差异：`print` 成为函数、`/` 除法返回浮点数、字符串默认 Unicode

### 1.2 代码示例

```python
# 第一个 Python 程序：Hello World
# print() 是内置函数，用于将内容输出到控制台
print("Hello, Python!")

# 使用 Python 作为计算器
print(3 + 5)      # 加法：输出 8
print(10 / 3)     # 除法：输出 3.333...（Python3 中 / 总是返回浮点数）
print(10 // 3)    # 整除：输出 3（向下取整）
print(2 ** 10)    # 幂运算：2 的 10 次方，输出 1024

# 查看 Python 版本信息
import sys
print(f"Python版本: {sys.version}")  # f-string 是 Python 3.6+ 的格式化语法
```

### 1.3 练习题

#### 选择题

**1. Python 属于以下哪种语言类型？**

A. 编译型语言  
B. 解释型语言  
C. 汇编语言  
D. 机器语言  

**2. Python 3 中，`10 / 4` 的结果是？**

A. 2  
B. 2.5  
C. 2  
D. 报错  

**3. 以下哪个不是 Python 的主要特点？**

A. 动态类型  
B. 强制缩进  
C. 编译执行  
D. 面向对象  

#### 判断题

**1. Python 2.x 和 Python 3.x 完全兼容，代码可以无缝迁移。**（  ）

**2. Python 使用缩进来表示代码块，而不是花括号。**（  ）

#### 代码填空题

**1. 补全代码，输出 `Python 版本是 3.x`：**

```python
import sys
print(f"Python 版本是 {____.version_info.major}")
```

**2. 补全代码，计算 2 的 8 次方：**

```python
result = 2 ____ 8
print(result)  # 应输出 256
```

### 1.4 答案与讲解

#### 选择题答案

1. **B** - Python 是解释型语言，代码由 Python 解释器逐行执行，无需预先编译成机器码。
2. **B** - Python 3 中 `/` 执行真除法，返回浮点数 `2.5`；`//` 才执行整除。
3. **C** - Python 是解释执行而非编译执行（虽然有 .pyc 字节码缓存，但对用户透明）。

#### 判断题答案

1. **x** - Python 2 和 3 不完全兼容，例如 `print` 语句变为函数，`unicode` 和 `str` 合并等。
2. **v** - Python 强制使用缩进（通常为 4 个空格）来标识代码块，这是其语法特色。

#### 代码填空题答案

1. `sys` - `sys.version_info` 返回版本号元组，`.major` 获取主版本号。
2. `**` - `**` 是 Python 的幂运算符。

---

## 第2章 基础语法

### 2.1 知识讲解

#### 变量与命名规则
- 变量名只能包含字母、数字和下划线
- 不能以数字开头
- 区分大小写
- 不能使用关键字（如 `if`、`for`、`class` 等）
- 命名规范：模块/包用小写；类用大驼峰；函数/变量用下划线分隔的小写

#### 基本数据类型

| 类型 | 示例 | 说明 |
|------|------|------|
| `int` | `42`, `-7` | 整数，无大小限制（受内存限制） |
| `float` | `3.14`, `-0.5` | 浮点数，双精度 64 位 |
| `bool` | `True`, `False` | 布尔值，是 `int` 的子类 |
| `str` | `"hello"` | 字符串，不可变序列 |
| `NoneType` | `None` | 空值，表示什么都没有 |

#### 运算符优先级（从高到低）
1. `()` 括号
2. `**` 幂运算
3. `*`, `/`, `//`, `%` 乘除相关
4. `+`, `-` 加减
5. `==`, `!=`, `>`, `<` 比较
6. `not`, `and`, `or` 逻辑运算

### 2.2 代码示例

```python
# ========== 变量赋值 ==========
# Python 是动态类型语言，变量类型由赋值决定
name = "Alice"        # str 类型
age = 25              # int 类型
height = 1.75         # float 类型
is_student = False    # bool 类型

# 多重赋值：同时给多个变量赋值
x, y, z = 1, 2, 3

# 链式赋值：多个变量指向同一对象
a = b = c = 100

# ========== 字符串操作 ==========
# 字符串是不可变对象，所有操作都返回新字符串
s = "  Hello, Python!  "

# 去除空白
print(s.strip())           # "Hello, Python!"

# 大小写转换
print(s.lower())           # "  hello, python!  "
print(s.upper())           # "  HELLO, PYTHON!  "

# 分割与连接
words = s.strip().split(", ")   # ["Hello", "Python!"]
print("-".join(words))          # "Hello-Python!"

# 字符串格式化（三种方式）
name, score = "Bob", 95.5
# 方式1：% 格式化（旧式，不推荐）
print("%s 考了 %.1f 分" % (name, score))
# 方式2：str.format()
print("{} 考了 {:.1f} 分".format(name, score))
# 方式3：f-string（推荐，Python 3.6+）
print(f"{name} 考了 {score:.1f} 分")

# ========== 类型转换 ==========
num_str = "42"
num_int = int(num_str)       # 字符串转整数
num_float = float(num_str)   # 字符串转浮点数
back_to_str = str(num_int)   # 整数转字符串

# ========== 输入输出 ==========
# input() 函数接收用户输入，返回字符串
# user_input = input("请输入你的名字: ")
# print(f"你好, {user_input}!")
```

### 2.3 练习题

#### 选择题

**1. 以下哪个变量名是合法的？**

A. `2name`  
B. `_private`  
C. `class`  
D. `my-name`  

**2. 执行 `3 * "abc"` 的结果是？**

A. `9`  
B. `"abcabcabc"`  
C. 报错  
D. `"3abc"`  

**3. 以下代码的输出是？**

```python
a = 5
b = 2
print(a // b, a / b, a % b)
```
A. `2 2.5 1`  
B. `2.5 2.5 1`  
C. `2 2 1`  
D. `2 2.5 0`  

**4. `f"{3.14159:.2f}"` 的结果是？**

A. `"3.14"`  
B. `"3.14159"`  
C. `"3.15"`  
D. `"3.1"`  

#### 判断题

**1. Python 中字符串是可变对象，可以直接修改某个字符。**（  ）

**2. `type(5/2)` 的结果是 `<class 'int'>`。**（  ）

#### 代码填空题

**1. 补全代码，交换两个变量的值（不使用临时变量）：**

```python
a, b = 10, 20
a, b = ____, ____
print(a, b)  # 应输出 20 10
```

**2. 补全代码，提取字符串中的年龄并计算 5 年后的年龄：**

```python
info = "年龄:25"
age = int(info.____(____))  # 提取 "25"
print(f"5年后年龄: {age + 5}")
```

**3. 补全代码，将用户输入的两个数字相加：**

```python
x = int(____("请输入第一个数字: "))
y = int(____("请输入第二个数字: "))
print(f"和为: {x + y}")
```

### 2.4 答案与讲解

#### 选择题答案

1. **B** - A 以数字开头非法；C 是关键字；D 含连字符非法（会被解释为减号）。
2. **B** - 字符串乘整数表示重复， `"abc" * 3` 得到 `"abcabcabc"`。
3. **A** - `//` 整除得 `2`，`/` 真除法得 `2.5`，`%` 取余得 `1`。
4. **A** - `:.2f` 表示保留两位小数，四舍五入后 `3.14`。

#### 判断题答案

1. **x** - 字符串是不可变对象，`s[0] = 'A'` 会报错，需通过切片或 `replace()` 创建新字符串。
2. **x** - `5/2` 返回 `2.5`，类型是 `<class 'float'>`；`5//2` 才是 `int`。

#### 代码填空题答案

1. `b, a` - Python 支持元组解包交换，右侧先打包成元组 `(20, 10)`，再解包赋值。
2. `split(":")[1]` - 先用 `split("=")` 分割成 `["年龄", "25"]`，再取索引 1。
3. `input`, `input` - `input()` 返回字符串，需用 `int()` 转换为整数。

---

## 第3章 流程控制

### 3.1 知识讲解

#### 条件语句
- `if`：条件为真时执行
- `elif`（else if）：前一个条件不满足时检查新条件
- `else`：所有条件都不满足时执行
- **注意**：Python 使用缩进表示代码块，条件后必须加冒号 `:`

#### 循环语句
- `for` 循环：遍历可迭代对象（列表、字符串、range 等）
- `while` 循环：条件为真时持续执行
- `break`：立即退出循环
- `continue`：跳过当前迭代，进入下一次
- `else` 子句：循环正常结束（未被 break）时执行

#### 循环技巧
- `range(start, stop, step)`：生成整数序列，左闭右开 `[start, stop)`
- `enumerate()`：同时获取索引和值
- `zip()`：并行遍历多个序列

### 3.2 代码示例

```python
# ========== if-elif-else ==========
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "D"

print(f"成绩等级: {grade}")  # 输出 B

# 三元表达式（条件表达式）
age = 20
status = "成年" if age >= 18 else "未成年"

# ========== for 循环 ==========
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# range(5) -> 0, 1, 2, 3, 4
for i in range(5):
    print(i, end=" ")

# 使用 enumerate 获取索引
for index, value in enumerate(fruits):
    print(f"{index}: {value}")

# 使用 zip 并行遍历
names = ["Alice", "Bob", "Charlie"]
ages = [25, 30, 35]
for name, age in zip(names, ages):
    print(f"{name} 今年 {age} 岁")

# ========== while 循环 ==========
count = 0
while count < 5:
    print(count, end=" ")
    count += 1

# while-else：循环正常结束时执行 else
n = 2
while n < 5:
    print(n)
    n += 1
else:
    print("循环正常结束")

# break 示例：找到第一个能被 7 整除的数
for num in range(1, 20):
    if num % 7 == 0:
        print(f"找到了: {num}")
        break

# continue 示例：跳过奇数，只打印偶数
for num in range(1, 10):
    if num % 2 != 0:
        continue
    print(num, end=" ")
```

### 3.3 练习题

#### 选择题

**1. 以下代码的输出是？**

```python
for i in range(3):
    if i == 1:
        continue
    print(i, end="")
```
A. `012`  
B. `02`  
C. `13`  
D. `01`  

**2. `range(5, 0, -1)` 生成的序列是？**

A. `[5, 4, 3, 2, 1, 0]`  
B. `[5, 4, 3, 2, 1]`  
C. `[5, 3, 1]`  
D. 空序列  

**3. 以下关于 `while-else` 的说法正确的是？**

A. `else` 总是执行  
B. `else` 仅在循环被 `break` 时执行  
C. `else` 仅在循环未被 `break` 时执行  
D. `while` 不能有 `else`  

**4. 以下代码的输出是？**

```python
x = 5
if x > 10:
    print("A")
elif x > 3:
    print("B")
elif x > 1:
    print("C")
```
A. `A`  
B. `B`  
C. `C`  
D. `BC`  

#### 判断题

**1. `if` 语句中，条件可以是任意表达式，非零、非空即为真。**（  ）

**2. `for i in range(10, 0, 2)` 会生成一个空序列。**（  ）

#### 代码填空题

**1. 补全代码，计算 1 到 100 的累加和：**

```python
total = 0
for i in range(1, ____):
    total += ____
print(total)  # 应输出 5050
```

**2. 补全代码，找出列表中第一个负数：**

```python
nums = [3, 7, -2, 5, -8, 1]
for n in nums:
    if n ____ 0:
        print(f"第一个负数: {n}")
        ____
```

**3. 补全代码，使用 zip 同时遍历两个列表并打印对应元素之和：**

```python
a = [1, 2, 3]
b = [4, 5, 6]
for x, y in ____(a, b):
    print(____)
```

### 3.4 答案与讲解

#### 选择题答案

1. **B** - `i==1` 时执行 `continue` 跳过打印，所以只输出 `0` 和 `2`。
2. **B** - `range(5, 0, -1)` 从 5 递减到 1（左闭右开，不包含 0）。
3. **C** - `while-else` 和 `for-else` 的 `else` 仅在循环未被 `break` 中断时执行。
4. **B** - `x > 3` 为真，执行 `print("B")`，`elif` 条件满足后不再检查后续条件。

#### 判断题答案

1. **v** - Python 中 `0`、`0.0`、`""`、`[]`、`{}`、`None`、`False` 等为假，其余为真。
2. **v** - 起始值 10 已经大于终止值 0，且步长为正方向，因此生成空序列。

#### 代码填空题答案

1. `101`, `i` - `range(1, 101)` 生成 1~100；`total += i` 累加每个数。
2. `<`, `break` - `n < 0` 判断负数；`break` 找到后立即退出循环。
3. `zip`, `x + y` - `zip` 并行打包两个列表；`x + y` 计算对应元素之和。

---

## 第4章 数据结构

### 4.1 知识讲解

Python 内置四种核心数据结构：

#### 列表（List）
- 有序、可变、可重复元素的序列
- 用 `[]` 定义，支持索引、切片、增删改查
- 时间复杂度：索引 O(1)，尾部插入 O(1)，中间插入/删除 O(n)

#### 元组（Tuple）
- 有序、不可变、可重复元素的序列
- 用 `()` 定义，不可修改但可重新赋值
- 比列表更轻量，可作为字典的键

#### 字典（Dictionary）
- 无序（Python 3.7+ 保持插入顺序）、键值对集合
- 用 `{}` 定义，键必须是不可变类型且唯一
- 时间复杂度：查找/插入/删除平均 O(1)

#### 集合（Set）
- 无序、不重复元素的集合
- 用 `{}` 或 `set()` 定义，支持交并差等数学运算
- 只能存储不可变（可哈希）对象

### 4.2 代码示例

```python
# ========== 列表（List）==========
fruits = ["apple", "banana", "cherry"]
mixed = [1, "hello", 3.14, True]

# 索引与切片（左闭右开）
print(fruits[0])       # "apple"（第一个元素）
print(fruits[-1])      # "cherry"（最后一个元素）
print(fruits[0:2])     # ["apple", "banana"]
print(fruits[::-1])    # 反转

# 常用方法
fruits.append("date")
fruits.insert(1, "apricot")
fruits.remove("banana")
popped = fruits.pop()
fruits.sort()
fruits.sort(reverse=True)

# 列表推导式
squares = [x**2 for x in range(10)]
evens = [x for x in range(10) if x % 2 == 0]

# ========== 元组（Tuple）==========
point = (3, 4)
single = (5,)     # 单元素元组必须加逗号
x, y = point      # 元组解包

# ========== 字典（Dictionary）==========
student = {"name": "Alice", "age": 20, "grades": [85, 90, 88]}
print(student["name"])
student["age"] = 21
student["major"] = "CS"
print(student.get("gpa", 0.0))

for key, value in student.items():
    print(f"{key}: {value}")

# 字典推导式
square_dict = {x: x**2 for x in range(5)}

# ========== 集合（Set）==========
nums = {1, 2, 3, 3, 3}    # 自动去重，实际为 {1, 2, 3}
empty_set = set()         # 不能用 {}，那是空字典

a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a | b)    # 并集
print(a & b)    # 交集
print(a - b)    # 差集
print(a ^ b)    # 对称差集

# 去重利器
items = [1, 2, 2, 3, 3, 3]
unique = list(set(items))
```

### 4.3 练习题

#### 选择题

**1. 以下哪个不能作为字典的键？**

A. `"name"`  
B. `42`  
C. `(1, 2)`  
D. `[1, 2]`  

**2. 执行 `list("abc")` 的结果是？**

A. `["abc"]`  
B. `['a', 'b', 'c']`  
C. 报错  
D. `[97, 98, 99]`  

**3. 以下代码的输出是？**

```python
s = {1, 2, 3}
s.add(3)
print(len(s))
```
A. `3`  
B. `4`  
C. `2`  
D. 报错  

**4. 列表推导式 `[x for x in range(10) if x % 2 == 0 if x % 3 == 0]` 的结果是？**

A. `[0, 6]`  
B. `[0, 2, 4, 6, 8]`  
C. `[0, 3, 6, 9]`  
D. `[6]`  

#### 判断题

**1. 元组是不可变的，因此元组中的列表元素也不能被修改。**（  ）

**2. `dict.get(key)` 在键不存在时返回 `None`，不会抛出异常。**（  ）

#### 代码填空题

**1. 补全代码，使用列表推导式获取字符串列表中长度大于 3 的单词：**

```python
words = ["cat", "elephant", "dog", "butterfly"]
long_words = [w ____ w ____ ____ if len(w) ____ 3]
print(long_words)  # ['elephant', 'butterfly']
```

**2. 补全代码，合并两个字典：**

```python
d1 = {"a": 1, "b": 2}
d2 = {"b": 3, "c": 4}
d1.____(d2)
print(d1)  # {'a': 1, 'b': 3, 'c': 4}
```

**3. 补全代码，找出两个列表的共同元素（使用集合）：**

```python
list1 = [1, 2, 3, 4, 5]
list2 = [4, 5, 6, 7, 8]
common = list(set(list1) ____ set(list2))
print(common)  # [4, 5]
```

### 4.4 答案与讲解

#### 选择题答案

1. **D** - 字典键必须是不可变（可哈希）对象，列表是可变的，不能作为键。
2. **B** - `list()` 将可迭代对象转为列表，字符串迭代得到单个字符。
3. **A** - 集合自动去重，`add(3)` 时 3 已存在，长度仍为 3。
4. **A** - 同时满足被 2 整除和被 3 整除，即被 6 整除，0~9 中只有 0 和 6。

#### 判断题答案

1. **x** - 元组本身不可变，但如果元素是可变对象（如列表），其内容可以修改。
2. **v** - `dict.get(key, default)` 安全访问，键不存在时返回默认值（默认为 `None`）。

#### 代码填空题答案

1. `for`, `in`, `words`, `>` - 完整推导式：`[w for w in words if len(w) > 3]`。
2. `update` - `dict.update(other)` 将另一个字典的键值对合并进来，存在则覆盖。
3. `&` - `&` 是集合的交集运算符，也可以用 `.intersection()` 方法。

---

## 第5章 函数基础

### 5.1 知识讲解

#### 函数定义
- 使用 `def` 关键字定义函数
- 函数名后加 `()` 和冒号 `:`
- 使用 `return` 返回值（无 `return` 默认返回 `None`）
- 函数是"一等公民"，可赋值给变量、作为参数、作为返回值

#### 参数类型
1. **位置参数**：按位置传递，最常用
2. **默认参数**：定义时指定默认值，调用时可省略
3. **关键字参数**：调用时指定参数名，顺序可打乱
4. **可变参数**：`*args` 接收多余位置参数（元组），`**kwargs` 接收多余关键字参数（字典）
5. **仅限关键字参数**：放在 `*` 后面的参数必须用关键字传入

#### 作用域规则（LEGB）
- **L**ocal：函数内部
- **E**nclosing：嵌套函数的外层函数
- **G**lobal：模块全局
- **B**uilt-in：内置命名空间
- 查找顺序：L -> E -> G -> B

### 5.2 代码示例

```python
# ========== 基础函数 ==========
def greet(name):
    """函数的文档字符串（docstring），说明函数用途"""
    return f"Hello, {name}!"

# ========== 参数类型 ==========
# 默认参数
def power(base, exponent=2):
    return base ** exponent

print(power(3))         # 9
print(power(2, 3))      # 8
print(power(base=2, exponent=4))  # 16

# 可变参数 *args
def sum_all(*args):
    result = 0
    for num in args:
        result += num
    return result

print(sum_all(1, 2, 3, 4))   # 10

# 可变参数 **kwargs
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

# 组合使用
def complex_func(a, b, *args, c=10, **kwargs):
    print(f"a={a}, b={b}, args={args}, c={c}, kwargs={kwargs}")

complex_func(1, 2, 3, 4, c=20, x=100, y=200)

# ========== 作用域与 global ==========
count = 0
def increment():
    global count
    count += 1
    return count

# ========== 匿名函数 lambda ==========
students = [
    {"name": "Alice", "score": 85},
    {"name": "Bob", "score": 92}
]
students.sort(key=lambda s: s["score"], reverse=True)

nums = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, nums))
evens = list(filter(lambda x: x % 2 == 0, nums))
```

### 5.3 练习题

#### 选择题

**1. 以下关于函数默认参数的说法，正确的是？**

A. 默认参数必须是最后一个参数  
B. 默认参数在每次调用时都会重新计算默认值  
C. 默认参数如果是可变对象，可能在多次调用间共享状态  
D. 默认参数不能用关键字方式传入  

**2. 执行以下代码的结果是？**

```python
def func(a, b, c=3):
    return a + b + c
print(func(1, c=5, b=2))
```
A. `6`  
B. `8`  
C. 报错  
D. `11`  

**3. `*args` 在函数内部的数据类型是？**

A. 列表  
B. 元组  
C. 字典  
D. 集合  

**4. 以下代码的输出是？**

```python
x = 10
def foo():
    x = 20
    def bar():
        nonlocal x
        x = 30
    bar()
    return x
print(foo())
```
A. `10`  
B. `20`  
C. `30`  
D. 报错  

#### 判断题

**1. Python 函数可以返回多个值，实际上返回的是一个元组。**（  ）

**2. `lambda` 表达式可以包含任意复杂的语句和多条代码。**（  ）

#### 代码填空题

**1. 补全代码，实现一个计算任意数量数字平均值的函数：**

```python
def average(____):
    if not args:
        return 0
    return sum(args) / ____
print(average(1, 2, 3, 4))  # 应输出 2.5
```

**2. 补全代码，使用 lambda 对字符串列表按长度排序：**

```python
words = ["python", "is", "awesome", "!"]
words.sort(key=____)
print(words)  # ['!', 'is', 'python', 'awesome']
```

**3. 补全代码，实现一个函数，接收字典参数并打印所有键值对：**

```python
def show_config(____):
    for k, v in kwargs.items():
        print(f"{k} = {v}")
show_config(debug=True, port=8080)
```

### 5.4 答案与讲解

#### 选择题答案

1. **C** - 默认参数在函数定义时求值一次，如果是列表、字典等可变对象，多次调用会共享同一个对象。正确做法是用 `None` 做默认值，函数内部再创建新对象。
2. **B** - 关键字参数 `c=5, b=2` 可以打乱顺序，计算 `1 + 2 + 5 = 8`。
3. **B** - `*args` 收集多余位置参数，内部是元组类型（不可变）。
4. **C** - `nonlocal` 声明 `x` 来自外层（非全局）作用域，`bar()` 中修改的是 `foo` 中的 `x`，最终返回 30。

#### 判断题答案

1. **v** - `return a, b` 等价于 `return (a, b)`，调用时可用 `x, y = func()` 解包。
2. **x** - `lambda` 只能包含单个表达式，不能有多条语句、赋值、循环等复杂逻辑。

#### 代码填空题答案

1. `*args`, `len(args)` - `*args` 接收任意位置参数；`len(args)` 计算参数个数求平均。
2. `lambda s: len(s)` - `sort` 的 `key` 参数接收一个函数，lambda 返回字符串长度作为排序依据。
3. `**kwargs` - `**kwargs` 接收任意关键字参数，内部为字典类型。

---

## 第6章 文件操作

### 6.1 知识讲解

#### 文件打开模式

| 模式 | 说明 |
|------|------|
| `'r'` | 只读（默认），文件必须存在 |
| `'w'` | 只写，文件存在则清空，不存在则创建 |
| `'a'` | 追加写，文件存在则在末尾追加 |
| `'x'` | 独占创建，文件已存在则报错 |
| `'b'` | 二进制模式 |
| `'+'` | 读写模式 |

#### 文件操作最佳实践
- 使用 `with` 语句（上下文管理器）自动关闭文件
- 文本文件默认编码为 UTF-8（Python 3）
- 大文件推荐逐行读取，避免一次性载入内存
- 二进制文件（图片、视频等）需用 `'b'` 模式

#### 常用路径操作
- `os.path` 模块：跨平台路径处理
- `pathlib` 模块（Python 3.4+）：面向对象的路径操作（推荐）

### 6.2 代码示例

```python
# ========== 基础文件读写 ==========
# 使用 with 语句确保文件正确关闭（即使发生异常）
with open("example.txt", "w", encoding="utf-8") as f:
    f.write("第一行\n")
    f.write("第二行\n")
    f.writelines(["第三行\n", "第四行\n"])

# 读取整个文件
with open("example.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)

# 逐行读取（推荐大文件使用）
with open("example.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())

# 读取为列表
with open("example.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

# ========== 二进制文件操作 ==========
with open("source.jpg", "rb") as src:
    data = src.read()
with open("copy.jpg", "wb") as dst:
    dst.write(data)

# ========== 路径操作（pathlib）==========
from pathlib import Path

p = Path("/home/user/documents")
print(p.name)
print(p.parent)
print(p.suffix)

new_path = p / "file.txt"
print(new_path.exists())
print(new_path.is_file())

output_dir = Path("output")
output_dir.mkdir(parents=True, exist_ok=True)

for file in output_dir.glob("*.txt"):
    print(file)

Path("data.txt").write_text("Hello", encoding="utf-8")
text = Path("data.txt").read_text(encoding="utf-8")
```

### 6.3 练习题

#### 选择题

**1. 以下哪种方式打开文件，如果文件不存在会创建新文件？**

A. `'r'`  
B. `'x'`  
C. `'a'`  
D. B 和 C  

**2. 关于 `with open(...) as f:`，以下说法错误的是？**

A. 文件会在 with 块结束时自动关闭  
B. 即使发生异常，文件也会被关闭  
C. 等同于 f = open(...); f.close()  
D. 可以省略 `as f` 部分  

**3. `pathlib.Path("a/b/c.txt").stem` 的值是？**

A. `"c.txt"`  
B. `"c"`  
C. `".txt"`  
D. `"a/b/c"`  

**4. 大文件处理时，推荐的方式是？**

A. `f.read()`  
B. `f.readlines()`  
C. `for line in f:`  
D. `f.read(1024)`  

#### 判断题

**1. 在 Windows 上使用 `pathlib` 拼接路径时，需要手动使用反斜杠 `\`。**（  ）

**2. 以 `'w+'` 模式打开文件，既可以读也可以写，且不会清空原有内容。**（  ）

#### 代码填空题

**1. 补全代码，统计文本文件的行数：**

```python
with open("data.txt", ____, encoding="utf-8") as f:
    count = 0
    for ____ in f:
        count += 1
print(f"总行数: {count}")
```

**2. 补全代码，将列表数据写入 CSV 格式文件：**

```python
data = [["name", "age"], ["Alice", 20], ["Bob", 25]]
with open("output.csv", ____, encoding="utf-8") as f:
    for row in data:
        f.____(","____(row) + "\n")
```

**3. 补全代码，使用 pathlib 查找当前目录下所有 `.py` 文件：**

```python
from pathlib import Path
current = Path(____)
for py_file in current.____("**/*.py"):
    print(py_file)
```

### 6.4 答案与讲解

#### 选择题答案

1. **D** - `'x'` 独占创建（文件已存在会报错），`'a'` 追加模式（不存在则创建），`'w'` 也会创建但会清空已存在文件。
2. **D** - `as f` 将文件对象绑定到变量 `f`，如果省略则无法在 with 块内操作文件。
3. **B** - `.stem` 返回文件名去掉后缀的部分，`"c.txt"` 的 stem 是 `"c"`。
4. **C** - `for line in f` 逐行迭代，内存中只保留一行，适合大文件。

#### 判断题答案

1. **x** - `pathlib` 自动处理跨平台路径分隔符，使用 `/` 即可，在 Windows 上会自动转换为 `\`。
2. **x** - `'w+'` 会清空文件内容（如果文件存在），`'r+'` 才不会清空且支持读写。

#### 代码填空题答案

1. `"r"`, `line` - 以只读模式打开；`for line in f` 逐行迭代。
2. `"w"`, `write`, `.join` - 写入模式；`",".join(row)` 将列表用逗号连接成 CSV 格式字符串。
3. `.`, `glob` 或 `rglob` - `Path(".")` 表示当前目录；`glob("**/*.py")` 递归匹配所有 py 文件。

---

## 第7章 异常处理

### 7.1 知识讲解

#### 异常层级
- `BaseException`：所有异常的基类
  - `SystemExit`、`KeyboardInterrupt`：系统级
  - `Exception`：常规异常的基类
    - `ValueError`、`TypeError`、`KeyError`、`IndexError` 等

#### 异常处理结构

```python
try:
    # 可能出错的代码
except SpecificError as e:
    # 捕获特定异常
except (Error1, Error2):
    # 捕获多种异常
except:
    # 捕获所有异常（不推荐）
else:
    # 没有异常时执行
finally:
    # 无论有无异常都执行
```

#### 自定义异常
- 继承 `Exception` 或其子类
- 通常只需定义类，无需额外代码

### 7.2 代码示例

```python
# ========== 基础异常捕获 ==========
def divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("错误：除数不能为零")
        return None
    except TypeError as e:
        print(f"错误：类型不匹配 - {e}")
        return None
    else:
        print("计算成功")
        return result
    finally:
        print("divide 函数执行完毕")

print(divide(10, 2))
print(divide(10, 0))
print(divide("10", 2))

# ========== 主动抛出异常 ==========
def set_age(age):
    if age < 0:
        raise ValueError("年龄不能为负数")
    if age > 150:
        raise ValueError("年龄超出合理范围")
    return age

# ========== 自定义异常 ==========
class ValidationError(Exception):
    def __init__(self, field, message):
        self.field = field
        self.message = message
        super().__init__(f"[{field}] {message}")

def validate_user(data):
    if "name" not in data:
        raise ValidationError("name", "姓名不能为空")
    if len(data["name"]) < 2:
        raise ValidationError("name", "姓名至少2个字符")
    return True

try:
    validate_user({"name": "A"})
except ValidationError as e:
    print(f"验证失败: {e}")

# ========== 异常链 ==========
def parse_int(s):
    try:
        return int(s)
    except ValueError as e:
        raise RuntimeError(f"无法解析整数: {s}") from e

# ========== 断言（Assertion）==========
def factorial(n):
    assert n >= 0, "n 必须是非负整数"
    if n == 0:
        return 1
    return n * factorial(n - 1)
```

### 7.3 练习题

#### 选择题

**1. 以下代码的输出是？**

```python
try:
    print("A")
    raise ValueError("test")
    print("B")
except ValueError:
    print("C")
finally:
    print("D")
```
A. `A B C D`  
B. `A C D`  
C. `A D C`  
D. `A C`  

**2. 以下关于 `except:`（不带异常类型）的说法，正确的是？**

A. 只捕获 Exception 的子类  
B. 捕获所有异常，包括 KeyboardInterrupt  
C. 性能比指定异常类型更好  
D. 是推荐的做法  

**3. `raise RuntimeError("msg") from e` 的作用是？**

A. 忽略原始异常 e  
B. 将 e 作为新异常的原因，保留异常链  
C. 同时抛出两个异常  
D. 捕获异常 e  

**4. `assert condition` 在什么情况下会抛出异常？**

A. condition 为 True  
B. condition 为 False  
C. 总是抛出  
D. 从不抛出  

#### 判断题

**1. `finally` 块中的代码在函数内遇到 `return` 时不会执行。**（  ）

**2. 自定义异常应该继承自 `BaseException` 而不是 `Exception`。**（  ）

#### 代码填空题

**1. 补全代码，安全地将字符串转为整数，失败时返回 0：**

```python
def safe_int(s):
    try:
        return ____(s)
    except ____:
        return 0
print(safe_int("123"))   # 123
print(safe_int("abc"))   # 0
```

**2. 补全代码，实现文件读取并在无论成功与否时都关闭文件：**

```python
try:
    f = open("data.txt", "r")
    content = f.read()
    print(content)
____ ____:
    print("发生错误")
____ ____:
    f.close()
    print("文件已关闭")
```

**3. 补全代码，定义一个自定义异常并在验证失败时抛出：**

```python
class BusinessError(____):
    pass

def check_balance(amount):
    if amount < 0:
        raise BusinessError("余额不足")
```

### 7.4 答案与讲解

#### 选择题答案

1. **B** - `raise` 后 `print("B")` 不会执行；`except` 捕获后打印 `C`；`finally` 总是执行打印 `D`。
2. **B** - 裸 `except:` 捕获 `BaseException` 下的所有异常，包括 `KeyboardInterrupt`（Ctrl+C）和 `SystemExit`，会干扰程序正常退出，极不推荐。
3. **B** - `from e` 建立异常链，新异常的 `__cause__` 指向原始异常，便于追溯根因。
4. **B** - `assert` 断言机制，条件为假时抛出 `AssertionError`，用于调试检查前置条件。

#### 判断题答案

1. **x** - `finally` 块**一定会**执行，即使在 `try` 或 `except` 中遇到 `return`，也是先执行 `finally` 再返回。
2. **x** - 自定义异常应继承 `Exception`（或其子类）。继承 `BaseException` 会捕获系统级异常，不符合常规错误语义。

#### 代码填空题答案

1. `int`, `ValueError` - `int()` 转换失败时抛出 `ValueError`，捕获后返回默认值 0。
2. `except`, `Exception`, `finally` - 标准 try-except-finally 结构（也可捕获具体异常类型）。
3. `Exception` - 自定义业务异常继承自 `Exception`，保持与 Python 异常体系的一致性。

---

## 第8章 模块与包

### 8.1 知识讲解

#### 模块（Module）
- 一个 `.py` 文件就是一个模块
- 模块名即文件名（不含 `.py`）
- 使用 `import` 导入，避免命名冲突

#### 包（Package）
- 包含 `__init__.py` 的目录（Python 3.3+ 允许没有，但不推荐）
- 用于组织相关模块的层次结构
- 导入方式：`from package.module import something`

#### 导入机制
- `import module`：导入整个模块，使用 `module.name` 访问
- `from module import name`：导入特定名称，直接使用
- `from module import *`：导入所有公开名称（受 `__all__` 控制）
- `import module as alias`：使用别名

#### 模块搜索路径
1. 当前目录
2. `PYTHONPATH` 环境变量中的目录
3. 标准库目录
4. 第三方包目录（site-packages）
- 可通过 `sys.path` 查看和修改

### 8.2 代码示例

```python
# ========== 导入方式 ==========
import math
print(math.sqrt(16))    # 4.0

from math import sqrt, pi
print(sqrt(16))
print(pi)

import numpy as np
from datetime import datetime as dt

# ========== __name__ 与主程序入口 ==========
def main():
    print("程序启动")

if __name__ == "__main__":
    main()

# ========== 常用标准库模块 ==========
import os           # 操作系统接口
import sys          # 系统相关参数和函数
import json         # JSON 数据处理
import re           # 正则表达式
import random       # 随机数生成
import datetime     # 日期和时间
import collections  # 高级数据结构
import itertools    # 迭代器工具
```

### 8.3 练习题

#### 选择题

**1. 以下关于 `if __name__ == "__main__":` 的说法，正确的是？**

A. 被导入时也会执行  
B. 只有直接运行该文件时才会执行  
C. 是 Python 强制要求的  
D. 必须放在文件最后一行  

**2. `from package import *` 导入的内容由什么控制？**

A. `__file__`  
B. `__all__`  
C. `__path__`  
D. `__doc__`  

**3. 模块搜索路径中，优先级最高的是？**

A. 标准库目录  
B. 当前目录  
C. PYTHONPATH  
D. site-packages  

**4. 以下哪个不是合法的导入语句？**

A. `import os.path`  
B. `from . import module`  
C. `import 123utils`  
D. `from module import func as f`  

#### 判断题

**1. Python 3.3 之后，包目录下可以没有 `__init__.py` 文件。**（  ）

**2. `sys.path` 是一个列表，运行时可以通过 `append()` 添加自定义模块搜索路径。**（  ）

#### 代码填空题

**1. 补全代码，安全导入可选的第三方库，不存在时给出提示：**

```python
try:
    import numpy ____ np
except ImportError:
    print("请安装 numpy: pip install numpy")
    np = None
```

**2. 补全代码，在包初始化时自动导入子模块的特定函数：**

```python
# mypkg/__init__.py
from .utils import ____
from .core import ____
__all__ = ["helper", "MainClass"]
```

**3. 补全代码，获取当前模块的绝对路径：**

```python
import os
import ____
current_dir = os.path.____(os.path.____(____.__file__))
print(current_dir)
```

### 8.4 答案与讲解

#### 选择题答案

1. **B** - `__name__` 在直接运行时为 `"__main__"`，被导入时为模块名，利用此特性可区分"直接运行"和"被导入"。
2. **B** - `__all__` 列表定义了 `from module import *` 时导出的公开接口。
3. **B** - 搜索顺序：当前目录 > PYTHONPATH > 标准库 > site-packages。
4. **C** - 模块名不能以数字开头，`123utils` 不是合法标识符。

#### 判断题答案

1. **v** - Python 3.3 引入隐式命名空间包，允许无 `__init__.py`，但显式包（regular package）仍有 `__init__.py` 更规范。
2. **v** - `sys.path` 是模块搜索路径列表，运行时修改可动态添加路径。

#### 代码填空题答案

1. `as` - `import numpy as np` 给模块起别名，捕获 `ImportError` 处理缺失依赖。
2. `helper`, `MainClass` - 相对导入子模块内容；`__all__` 控制公开接口（假设 utils 中有 helper，core 中有 MainClass）。
3. `sys`, `dirname`, `abspath`, `sys` - `sys.__file__` 获取当前模块路径；`os.path.abspath` 转绝对路径；`os.path.dirname` 获取所在目录。注意：更推荐 `Path(__file__).resolve().parent`（pathlib 方式）。

---

# 第二部分：进阶篇

---

## 第9章 面向对象编程

### 9.1 知识讲解

#### 核心概念
- **类（Class）**：对象的蓝图，定义属性和方法
- **对象（Object）**：类的实例，具体的数据实体
- **属性（Attribute）**：对象的数据成员
- **方法（Method）**：对象的函数成员

#### 三大特性
1. **封装**：将数据和方法绑定，隐藏内部实现
2. **继承**：子类继承父类的属性和方法，可扩展或重写
3. **多态**：不同对象对同一消息作出不同响应（鸭子类型）

#### 特殊方法（魔术方法）
- `__init__`：构造方法，创建对象时调用
- `__str__`/`__repr__`：字符串表示
- `__eq__`/`__lt__` 等：比较运算符
- `__len__`/`__getitem__`：容器协议

#### 访问控制
- `name`：公开
- `_name`：约定为内部使用（受保护）
- `__name`：名称修饰（私有，实际为 `_ClassName__name`）

### 9.2 代码示例

```python
class Person:
    species = "Homo sapiens"    # 类属性：所有实例共享

    def __init__(self, name, age):
        self.name = name        # 实例属性
        self._age = age         # 受保护属性（约定）
        self.__id = id(self)    # 私有属性（名称修饰）

    def greet(self):
        return f"你好，我是{self.name}"

    @property
    def age(self):
        """属性装饰器，像访问属性一样调用方法"""
        return self._age

    @age.setter
    def age(self, value):
        if value < 0:
            raise ValueError("年龄不能为负数")
        self._age = value

    def __str__(self):
        return f"Person(name={self.name}, age={self._age})"

    def __repr__(self):
        return f"Person('{self.name}', {self._age})"

    def __eq__(self, other):
        if not isinstance(other, Person):
            return False
        return self.name == other.name and self._age == other._age

alice = Person("Alice", 25)
print(alice.greet())
alice.age = 26
print(alice.age)

# ========== 继承与多态 ==========
class Student(Person):
    def __init__(self, name, age, student_id):
        super().__init__(name, age)
        self.student_id = student_id

    def greet(self):
        base = super().greet()
        return f"{base}，学号：{self.student_id}"

# 多态示例
def introduce(person):
    print(person.greet())

introduce(Person("Bob", 30))
introduce(Student("Carol", 20, "S001"))

# ========== 类方法与静态方法 ==========
class MathUtils:
    @classmethod
    def create_pi(cls):
        return cls()

    @staticmethod
    def add(a, b):
        return a + b

# ========== 抽象基类 ==========
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)
```

### 9.3 练习题

#### 选择题

**1. `self` 参数的作用是？**

A. 指向父类  
B. 指向类本身  
C. 指向实例对象本身  
D. 是可选的，可以省略  

**2. 以下关于 `__init__` 的说法，错误的是？**

A. 是构造方法，创建实例时自动调用  
B. 必须返回 None  
C. 可以返回其他对象  
D. 用于初始化实例属性  

**3. `super()` 函数的主要作用是？**

A. 调用父类的方法  
B. 创建父类实例  
C. 返回父类对象  
D. 检查继承关系  

**4. 以下代码的输出是？**

```python
class A:
    x = 1
class B(A):
    pass
class C(A):
    pass
B.x = 2
print(A.x, B.x, C.x)
```
A. `1 2 1`  
B. `1 2 2`  
C. `2 2 2`  
D. `1 1 1`  

#### 判断题

**1. Python 中的私有属性 `__name` 是完全无法从外部访问的。**（  ）

**2. `@staticmethod` 装饰的方法既不需要 `self` 也不需要 `cls` 参数。**（  ）

#### 代码填空题

**1. 补全代码，使用 `@property` 实现只读属性：**

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @____
    def radius(self):
        return self._radius

    @____
    def area(self):
        return 3.14 * self._radius ** 2
```

**2. 补全代码，实现单继承并调用父类方法：**

```python
class Animal:
    def speak(self):
        return "..."

class Dog(____):
    def speak(self):
        base = ____.speak(self)
        return base + " 汪汪!"
```

**3. 补全代码，禁止直接实例化抽象类：**

```python
from abc import ABC, abstractmethod

class BaseService(____):
    @abstractmethod
    def process(self):
        ____
```

### 9.4 答案与讲解

#### 选择题答案

1. **C** - `self` 指向实例对象本身，是 Python 的约定（可用其他名字但不推荐）。
2. **C** - `__init__` 不能返回非 None 值，返回其他对象会报错。
3. **A** - `super()` 返回一个代理对象，用于调用父类的方法（遵循 MRO）。
4. **A** - `B.x = 2` 是给 B 创建了自己的类属性，不影响 A 和 C 的 `x`。

#### 判断题答案

1. **x** - `__name` 通过名称修饰变为 `_ClassName__name`，仍可通过 `_Person__id` 访问，只是约定上不建议。
2. **v** - `@staticmethod` 与类和实例无关，不需要 `self` 或 `cls`，类似于普通函数放在类命名空间中。

#### 代码填空题答案

1. `property`, `property` - `@property` 将方法转换为属性访问；`area` 也可以加 `@property` 使其成为只读属性。
2. `Animal`, `super()` 或 `Animal` - `Dog` 继承 `Animal`；`super().speak()` 或 `Animal.speak(self)` 调用父类方法。
3. `ABC`, `pass` - 继承 `ABC` 使类成为抽象基类；`pass` 或 `...` 作为抽象方法的空实现。

---

## 第10章 迭代器与生成器

### 10.1 知识讲解

#### 迭代器（Iterator）
- 实现了 `__iter__()` 和 `__next__()` 协议的对象
- `__iter__()` 返回迭代器自身
- `__next__()` 返回下一个值，无值时抛出 `StopIteration`
- 可迭代对象（Iterable）只需实现 `__iter__()`，返回一个迭代器

#### 生成器（Generator）
- 使用 `yield` 关键字的函数，调用时返回生成器对象
- 每次 `next()` 时从上次 `yield` 处继续执行
- 天然支持迭代器协议，内存友好
- 生成器表达式：`(x for x in iterable)`，类似列表推导式但惰性求值

#### 生成器的高级用法
- `send(value)`：向生成器发送值，作为 `yield` 表达式的结果
- `throw(type)`：在生成器内部抛出异常
- `close()`：终止生成器

### 10.2 代码示例

```python
# ========== 自定义迭代器 ==========
class CountDown:
    def __init__(self, start):
        self.start = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.start <= 0:
            raise StopIteration
        self.start -= 1
        return self.start + 1

for num in CountDown(5):
    print(num, end=" ")  # 5 4 3 2 1

# ========== 生成器函数 ==========
def fibonacci(n):
    """生成前 n 个斐波那契数"""
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

for num in fibonacci(10):
    print(num, end=" ")

# ========== 生成器表达式 ==========
# 惰性求值，不会一次性创建整个列表
squares = (x**2 for x in range(1000000))
print(next(squares))  # 0
print(next(squares))  # 1

# 与列表推导式的区别
list_sq = [x**2 for x in range(1000000)]  # 立即创建，占内存
gen_sq = (x**2 for x in range(1000000))   # 惰性求值，省内存

# ========== yield from ==========
def sub_generator():
    yield 1
    yield 2

def main_generator():
    yield 'start'
    yield from sub_generator()
    yield 'end'

print(list(main_generator()))  # ['start', 1, 2, 'end']

# ========== send() 方法 ==========
def accumulator():
    total = 0
    while True:
        value = yield total
        if value is None:
            break
        total += value

acc = accumulator()
next(acc)           # 启动生成器
print(acc.send(10))  # 10
print(acc.send(20))  # 30
acc.close()
```

### 10.3 练习题

#### 选择题

**1. 以下哪个对象不是迭代器？**

A. `iter([1, 2, 3])`  
B. `(x for x in range(5))`  
C. `[1, 2, 3]`  
D. `map(str, [1, 2, 3])`  

**2. 生成器函数与普通函数的主要区别是？**

A. 生成器函数不能返回值  
B. 生成器函数使用 `yield` 而不是 `return` 来产生值  
C. 生成器函数执行更快  
D. 生成器函数只能生成数字  

**3. `yield from` 的主要作用是？**

A. 终止生成器  
B. 将子生成器的值委托给外部生成器  
C. 从列表中删除元素  
D. 创建一个新的列表  

**4. 以下代码的输出是？**

```python
def gen():
    yield 1
    yield 2
    yield 3
print(sum(gen()))
```
A. `6`  
B. `123`  
C. 报错  
D. `None`  

#### 判断题

**1. 生成器只能被迭代一次，第二次迭代需要重新创建生成器对象。**（  ）

**2. 生成器表达式 `(x for x in range(10))` 比列表推导式 `[x for x in range(10)]` 占用更多内存。**（  ）

#### 代码填空题

**1. 补全代码，实现一个自定义可迭代类，生成 1 到 n 的平方数：**

```python
class SquareIterator:
    def __init__(self, n):
        self.n = n
        self.current = 1

    def __iter__(self):
        return ____

    def __next__(self):
        if self.current > self.n:
            raise ____
        result = self.current ** 2
        self.current += 1
        return ____
```

**2. 补全代码，使用生成器函数实现文件逐行读取并过滤空行：**

```python
def read_lines(filename):
    with open(filename, 'r') as f:
        for line in f:
            stripped = line.strip()
            if stripped:
                ____ stripped
```

**3. 补全代码，使用 `send()` 实现一个可以重置的计数器：**

```python
def resettable_counter():
    count = 0
    while True:
        reset = ____ count
        if reset is not None:
            count = reset
        count += 1
```

### 10.4 答案与讲解

#### 选择题答案

1. **C** - `[1, 2, 3]` 是可迭代对象但不是迭代器，`iter()` 才能返回迭代器。
2. **B** - 生成器函数使用 `yield` 暂停并返回值，状态被保存，下次从暂停处继续。
3. **B** - `yield from` 将子生成器的产出值直接传递给外部生成器的调用者，简化嵌套生成器。
4. **A** - `sum()` 可以接收任何可迭代对象，生成器产出 1+2+3=6。

#### 判断题答案

1. **v** - 生成器是单遍迭代器，迭代完后状态耗尽，需重新调用生成器函数创建新对象。
2. **x** - 生成器表达式是惰性求值，只在需要时生成值，内存占用远小于列表推导式。

#### 代码填空题答案

1. `self`, `StopIteration`, `result` - `__iter__` 返回自身；超出范围抛出 `StopIteration`；返回当前平方值。
2. `yield` - 生成器函数使用 `yield` 产出非空行。
3. `yield` - `yield count` 产出当前值，`send()` 传入的值作为 `yield` 表达式的结果赋给 `reset`。

---

## 第11章 装饰器

### 11.1 知识讲解

#### 装饰器本质
- 装饰器是一个接收函数作为参数并返回函数的函数
- 语法糖：`@decorator` 等价于 `func = decorator(func)`
- 常用于日志记录、权限校验、缓存、性能计时等横切关注点

#### 常见装饰器类型
1. **无参数装饰器**：`@decorator`
2. **带参数装饰器**：`@decorator(args)`，需要三层嵌套
3. **类装饰器**：使用类实现 `__call__` 方法
4. **内置装饰器**：`@property`、`@classmethod`、`@staticmethod`、`@functools.lru_cache` 等

#### functools.wraps
- 使用 `@wraps(func)` 保留原函数的元数据（`__name__`、`__doc__` 等）
- 否则装饰后的函数会丢失原函数信息

### 11.2 代码示例

```python
from functools import wraps
import time

# ========== 基础装饰器 ==========
def my_decorator(func):
    @wraps(func)  # 保留原函数元数据
    def wrapper(*args, **kwargs):
        print(f"调用 {func.__name__}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} 执行完毕")
        return result
    return wrapper

@my_decorator
def say_hello(name):
    """打招呼"""
    return f"Hello, {name}"

# 等价于 say_hello = my_decorator(say_hello)

# ========== 带参数的装饰器 ==========
def repeat(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(times=3)
def greet(name):
    print(f"Hi, {name}")

# ========== 性能计时装饰器 ==========
def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"{func.__name__} 耗时: {elapsed:.4f}秒")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "Done"

# ========== 类装饰器 ==========
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.count = 0

    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"第 {self.count} 次调用")
        return self.func(*args, **kwargs)

@CountCalls
def hello():
    print("Hello!")

# ========== 内置装饰器 ==========
from functools import lru_cache

@lru_cache(maxsize=128)
def fib(n):
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)
```

### 11.3 练习题

#### 选择题

**1. `@decorator` 语法糖等价于以下哪种写法？**

A. `decorator(func)`  
B. `func = decorator(func)`  
C. `func.decorator()`  
D. `decorator.func()`  

**2. 以下关于 `functools.wraps` 的说法，正确的是？**

A. 用于包装函数参数  
B. 用于保留被装饰函数的元数据  
C. 用于缓存函数结果  
D. 用于限制函数调用次数  

**3. 带参数的装饰器（如 `@repeat(3)`）需要几层嵌套函数？**

A. 1 层  
B. 2 层  
C. 3 层  
D. 4 层  

**4. 类装饰器必须实现哪个特殊方法？**

A. `__init__`  
B. `__call__`  
C. `__enter__`  
D. `__iter__`  

#### 判断题

**1. 一个函数可以被多个装饰器装饰，执行顺序是从上到下。**（  ）

**2. 装饰器只能用于函数，不能用于类。**（  ）

#### 代码填空题

**1. 补全代码，实现一个记录函数调用参数的装饰器：**

```python
from functools import wraps

def log_args(func):
    @____(func)
    def wrapper(*args, **kwargs):
        print(f"调用 {func.__name__}，参数: {args}, {kwargs}")
        return func(*args, **kwargs)
    return ____
```

**2. 补全代码，实现一个带参数的权限校验装饰器：**

```python
def require_role(role):
    def decorator(func):
        def wrapper(user, *args, **kwargs):
            if user.role != ____:
                raise PermissionError("权限不足")
            return func(user, *args, **kwargs)
        return wrapper
    return ____
```

**3. 补全代码，使用 `lru_cache` 缓存递归函数：**

```python
from functools import lru_cache

@lru_cache(____=100)
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
```

### 11.4 答案与讲解

#### 选择题答案

1. **B** - `@decorator` 是 `func = decorator(func)` 的语法糖，装饰器接收函数并返回新函数。
2. **B** - `@wraps(func)` 将原函数的 `__name__`、`__doc__` 等元数据复制到包装函数上。
3. **C** - 带参数装饰器需要三层：外层接收参数 -> 中间层接收函数 -> 内层包装逻辑。
4. **B** - 类装饰器需要实现 `__call__` 方法，使实例可像函数一样被调用。

#### 判断题答案

1. **x** - 多个装饰器执行顺序是从下到上（靠近函数的先执行），`@a @b def f()` 等价于 `f = a(b(f))`。
2. **x** - 装饰器可以用于类（类装饰器），也可以用于方法，Python 中一切皆对象。

#### 代码填空题答案

1. `wraps`, `wrapper` - `@wraps(func)` 保留元数据；返回 `wrapper` 函数。
2. `role`, `decorator` - 检查用户角色是否匹配传入的 `role`；返回 `decorator` 函数本身。
3. `maxsize` - `lru_cache(maxsize=100)` 设置缓存最大条目数为 100，`None` 表示无限制。

---

## 第12章 上下文管理器

### 12.1 知识讲解

#### 上下文管理器协议
- 实现 `__enter__()` 和 `__exit__()` 方法的对象
- `__enter__()`：进入上下文时执行，返回值赋给 `as` 后的变量
- `__exit__(exc_type, exc_val, exc_tb)`：退出上下文时执行，处理异常清理
- 若 `__exit__` 返回 `True`，则抑制异常传播

#### contextlib 模块
- `@contextmanager`：将生成器函数转换为上下文管理器
- `closing()`：确保对象调用 `close()` 方法
- `suppress()`：忽略指定异常
- `redirect_stdout()`/`redirect_stderr()`：重定向输出

### 12.2 代码示例

```python
# ========== 自定义上下文管理器（类实现）==========
class DatabaseConnection:
    def __init__(self, dsn):
        self.dsn = dsn
        self.connection = None

    def __enter__(self):
        print(f"连接到数据库: {self.dsn}")
        self.connection = f"conn-{self.dsn}"
        return self.connection

    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"关闭数据库连接")
        self.connection = None
        # 返回 False 让异常继续传播
        return False

with DatabaseConnection("localhost:5432") as conn:
    print(f"使用连接: {conn}")

# ========== 使用 @contextmanager ==========
from contextlib import contextmanager

@contextmanager
def managed_resource(name):
    print(f"获取资源: {name}")
    resource = f"resource-{name}"
    try:
        yield resource
    finally:
        print(f"释放资源: {name}")

with managed_resource("file_handle") as r:
    print(f"使用资源: {r}")

# ========== 嵌套上下文管理器 ==========
with open("a.txt", "w") as f1, open("b.txt", "w") as f2:
    f1.write("hello")
    f2.write("world")

# ========== suppress 忽略异常 ==========
from contextlib import suppress

with suppress(FileNotFoundError):
    os.remove("nonexistent_file.txt")
```

### 12.3 练习题

#### 选择题

**1. 上下文管理器的 `__exit__` 方法接收几个参数？**

A. 0 个  
B. 1 个  
C. 3 个  
D. 4 个  

**2. 如果 `__exit__` 方法返回 `True`，会发生什么？**

A. 程序立即退出  
B. 上下文中的异常被抑制，不再传播  
C. 上下文重新执行  
D. 什么都不会发生  

**3. `@contextmanager` 装饰的生成器函数中，`yield` 之前的代码相当于？**

A. `__exit__` 方法  
B. `__enter__` 方法  
C. 析构方法  
D. 构造函数  

**4. 以下哪个不是 contextlib 提供的工具？**

A. `closing`  
B. `suppress`  
C. `lru_cache`  
D. `redirect_stdout`  

#### 判断题

**1. `with` 语句可以同时管理多个上下文管理器，用逗号分隔。**（  ）

**2. `@contextmanager` 只能用于函数，不能用于类。**（  ）

#### 代码填空题

**1. 补全代码，实现一个计时上下文管理器：**

```python
import time

class Timer:
    def __enter__(self):
        self.start = time.time()
        return ____

    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed = time.time() - self.start
        print(f"耗时: {elapsed:.4f}秒")
        return ____  # 不抑制异常
```

**2. 补全代码，使用 `@contextmanager` 实现临时修改工作目录：**

```python
import os
from contextlib import contextmanager

@contextmanager
def temp_chdir(path):
    original = os.getcwd()
    os.chdir(path)
    ____
        ____
    finally:
        os.chdir(original)
```

**3. 补全代码，使用 `suppress` 安全删除可能不存在的文件：**

```python
from contextlib import suppress
import os

with suppress(____):
    os.remove("temp.txt")
```

### 12.4 答案与讲解

#### 选择题答案

1. **C** - `__exit__(self, exc_type, exc_val, exc_tb)` 接收异常类型、异常值和异常追踪信息三个参数。
2. **B** - `__exit__` 返回 `True` 表示异常已被处理，不再向上传播；返回 `False` 或 `None` 则继续传播。
3. **B** - `yield` 之前的代码在 `__enter__` 阶段执行，`yield` 的值赋给 `as` 变量，`yield` 之后的代码在 `__exit__` 阶段执行。
4. **C** - `lru_cache` 是 `functools` 模块的装饰器，不是 `contextlib` 的工具。

#### 判断题答案

1. **v** - `with A() as a, B() as b:` 可以管理多个上下文，等价于嵌套的 `with` 语句。
2. **v** - `@contextmanager` 专门用于将生成器函数转换为上下文管理器，类应直接实现 `__enter__` 和 `__exit__`。

#### 代码填空题答案

1. `self`, `False` - `__enter__` 返回 `self`（计时器对象本身）；`False` 表示不抑制异常，让异常正常传播。
2. `try`, `yield` - `yield` 产出控制权给 `with` 块，`try/finally` 确保无论是否异常都恢复原始目录。
3. `FileNotFoundError` - `suppress(FileNotFoundError)` 在文件不存在时静默忽略删除错误。

---

## 第13章 正则表达式

### 13.1 知识讲解

#### re 模块核心函数
- `re.match(pattern, string)`：从字符串开头匹配
- `re.search(pattern, string)`：搜索整个字符串，返回第一个匹配
- `re.findall(pattern, string)`：返回所有匹配的列表
- `re.finditer(pattern, string)`：返回匹配对象的迭代器
- `re.sub(pattern, repl, string)`：替换匹配项
- `re.split(pattern, string)`：按模式分割字符串
- `re.compile(pattern)`：编译正则表达式，提升重复使用效率

#### 常用元字符
| 元字符 | 含义 |
|--------|------|
| `.` | 匹配任意单个字符（除换行符） |
| `^` | 匹配字符串开头 |
| `$` | 匹配字符串结尾 |
| `*` | 匹配前一个字符 0 次或多次 |
| `+` | 匹配前一个字符 1 次或多次 |
| `?` | 匹配前一个字符 0 次或 1 次 |
| `{n,m}` | 匹配前一个字符 n 到 m 次 |
| `[]` | 字符集，匹配括号内的任意字符 |
| `|` | 或运算符 |
| `()` | 分组，捕获匹配内容 |
| `\d` | 匹配数字 [0-9] |
| `\w` | 匹配单词字符 [a-zA-Z0-9_] |
| `\s` | 匹配空白字符 |
| `\b` | 单词边界 |

### 13.2 代码示例

```python
import re

# ========== 基础匹配 ==========
text = "我的邮箱是 alice@example.com，电话是 138-1234-5678"

# search: 搜索第一个匹配
match = re.search(r"\w+@\w+\.\w+", text)
if match:
    print(match.group())  # alice@example.com
    print(match.start())  # 匹配起始位置
    print(match.end())    # 匹配结束位置

# findall: 查找所有匹配
emails = re.findall(r"\w+@\w+\.\w+", text)
print(emails)

# ========== 分组捕获 ==========
pattern = r"(\d{3})-(\d{4})-(\d{4})"
match = re.search(pattern, text)
if match:
    print(match.group(0))  # 完整匹配: 138-1234-5678
    print(match.group(1))  # 第一组: 138
    print(match.group(2))  # 第二组: 1234
    print(match.group(3))  # 第三组: 5678
    print(match.groups())  # ('138', '1234', '5678')

# 命名分组
pattern = r"(?P<area>\d{3})-(?P<mid>\d{4})-(?P<end>\d{4})"
match = re.search(pattern, text)
print(match.groupdict())  # {'area': '138', 'mid': '1234', 'end': '5678'}

# ========== 替换 ==========
# 将电话格式改为连续数字
new_text = re.sub(r"(\d{3})-(\d{4})-(\d{4})", r"\1\2\3", text)
print(new_text)

# ========== 编译正则（提升性能）==========
email_pattern = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
emails = email_pattern.findall(text)

# ========== 贪婪 vs 非贪婪 ==========
html = "<div>内容1</div><div>内容2</div>"
# 贪婪匹配（默认）：匹配最长
greedy = re.findall(r"<div>.*</div>", html)
# 非贪婪匹配：匹配最短
non_greedy = re.findall(r"<div>.*?</div>", html)
```

### 13.3 练习题

#### 选择题

**1. `re.match()` 和 `re.search()` 的主要区别是？**

A. `match` 更快  
B. `match` 从字符串开头匹配，`search` 搜索整个字符串  
C. `search` 只能找到第一个匹配  
D. 没有区别  

**2. 正则表达式 `a+?` 中的 `?` 表示？**

A. 匹配 0 次或 1 次  
B. 使 `+` 变为非贪婪模式  
C. 匹配任意字符  
D. 表示可选分组  

**3. `re.findall(r"(\d)(\d)", "1234")` 的结果是？**

A. `['12', '34']`  
B. `[('1', '2'), ('3', '4')]`  
C. `['1', '2', '3', '4']`  
D. `['12', '23', '34']`  

**4. 以下哪个正则可以匹配以字母开头、后跟数字的用户名（如 `user123`）？**

A. `\d+\w+`  
B. `\w+\d+`  
C. `[a-zA-Z]\w*`  
D. `[a-zA-Z]\d+`  

#### 判断题

**1. `re.compile()` 编译后的正则对象可以被多次使用，提升重复匹配的性能。**（  ）

**2. 在正则表达式中，`.` 可以匹配换行符 `\n`。**（  ）

#### 代码填空题

**1. 补全代码，提取字符串中的所有邮箱地址：**

```python
import re
text = "联系: alice@test.com 或 bob@demo.org"
emails = re.____(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
print(emails)  # ['alice@test.com', 'bob@demo.org']
```

**2. 补全代码，使用命名分组提取日期中的年、月、日：**

```python
import re
pattern = r"(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})"
match = re.____(pattern, "2024-03-15")
print(match.____('year'))  # 2024
```

**3. 补全代码，使用 `re.sub` 将所有连续空白替换为单个空格：**

```python
import re
text = "Hello    world\t\n  Python"
clean = re.____(r"____", " ", text)
print(clean)  # "Hello world Python"
```

### 13.4 答案与讲解

#### 选择题答案

1. **B** - `re.match()` 必须从字符串开头匹配（等效于 `^`），`re.search()` 扫描整个字符串找第一个匹配。
2. **B** - 量词后加 `?` 变为非贪婪模式（最小匹配），`a+?` 匹配最少的连续 a。
3. **B** - `findall` 在有分组时返回元组列表，每个元组包含各分组捕获的内容。
4. **C** - `[a-zA-Z]` 匹配字母开头，`\w*` 匹配后续任意单词字符（包括数字和下划线）。

#### 判断题答案

1. **v** - `re.compile()` 将正则编译为内部格式，避免每次匹配时重新解析，适合在循环中重复使用。
2. **x** - 默认情况下 `.` 不匹配换行符，需设置 `re.DOTALL` 标志才能匹配包括换行符在内的任意字符。

#### 代码填空题答案

1. `findall` - `re.findall()` 返回所有非重叠匹配的列表。
2. `search`, `group` - `re.search()` 搜索第一个匹配；`match.group('year')` 按名称获取分组内容。
3. `sub`, `\s+` - `re.sub(r"\s+", " ", text)` 将一处或多处连续空白替换为单个空格。

---

## 第14章 多线程与多进程

### 14.1 知识讲解

#### GIL（全局解释器锁）
- Python 的 CPython 实现中，GIL 确保同一时刻只有一个线程执行 Python 字节码
- 对于 CPU 密集型任务，多线程无法利用多核优势
- 对于 I/O 密集型任务，多线程仍然有效（线程在等待 I/O 时释放 GIL）

#### 线程 vs 进程
| 特性 | 线程（threading） | 进程（multiprocessing） |
|------|------------------|------------------------|
| 内存空间 | 共享 | 独立 |
| 通信方式 | 共享变量（需锁） | Queue/Pipe |
| 创建开销 | 小 | 大 |
| 适用场景 | I/O 密集型 | CPU 密集型 |
| GIL 影响 | 受 GIL 限制 | 每个进程独立 GIL |

#### 同步机制
- `Lock`：互斥锁，保证同一时间只有一个线程访问资源
- `RLock`：可重入锁，同一线程可多次获取
- `Semaphore`：信号量，控制同时访问的线程数量
- `Event`：事件，线程间信号通知
- `Condition`：条件变量，复杂的线程同步
- `Queue`：线程安全队列

### 14.2 代码示例

```python
import threading
import multiprocessing
import time

# ========== 基础线程 ==========
def worker(name, delay):
    print(f"线程 {name} 开始")
    time.sleep(delay)
    print(f"线程 {name} 结束")

threads = []
for i in range(3):
    t = threading.Thread(target=worker, args=(f"T{i}", 1))
    threads.append(t)
    t.start()

for t in threads:
    t.join()  # 等待线程结束

# ========== 线程锁 ==========
counter = 0
lock = threading.Lock()

def increment():
    global counter
    for _ in range(100000):
        with lock:  # 获取锁
            counter += 1

# ========== 线程池 ==========
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

def fetch_url(url):
    time.sleep(1)
    return f"数据: {url}"

urls = ["url1", "url2", "url3", "url4"]
with ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(fetch_url, urls))
    print(results)

# ========== 多进程（CPU 密集型）==========
def cpu_task(n):
    """计算密集型任务"""
    count = 0
    for i in range(n):
        count += i * i
    return count

if __name__ == "__main__":
    numbers = [10**6, 10**6, 10**6, 10**6]
    with ProcessPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(cpu_task, numbers))

# ========== 线程本地存储 ==========
thread_local = threading.local()

def process_request(request_id):
    thread_local.request_id = request_id
    print(f"处理请求: {thread_local.request_id}")
```

### 14.3 练习题

#### 选择题

**1. Python 的 GIL 对以下哪种任务影响最大？**

A. 文件读写  
B. 网络请求  
C. 大量数值计算  
D. 数据库查询  

**2. 以下哪种同步机制允许同一线程多次获取锁而不会死锁？**

A. `Lock`  
B. `RLock`  
C. `Semaphore`  
D. `Event`  

**3. 对于 CPU 密集型任务，推荐使用？**

A. `threading.Thread`  
B. `multiprocessing.Process`  
C. `asyncio`  
D. `threading.Lock`  

**4. `ThreadPoolExecutor` 的 `max_workers` 参数表示？**

A. 最大任务数  
B. 最大线程数  
C. 最大内存使用量  
D. 最大执行时间  

#### 判断题

**1. Python 的多线程在 I/O 密集型任务中仍然可以提高效率。**（  ）

**2. `multiprocessing` 模块的进程间可以直接共享 Python 对象（如列表、字典）。**（  ）

#### 代码填空题

**1. 补全代码，使用锁保护共享计数器：**

```python
import threading

counter = 0
lock = threading.____()

def add_one():
    global counter
    with ____:
        counter += 1
```

**2. 补全代码，使用线程池并发执行多个任务：**

```python
from concurrent.futures import ThreadPoolExecutor

def task(n):
    return n * n

with ThreadPoolExecutor(max_workers=____) as executor:
    results = list(executor.____(task, range(5)))
print(results)  # [0, 1, 4, 9, 16]
```

**3. 补全代码，等待所有线程执行完毕：**

```python
import threading

threads = []
for i in range(5):
    t = threading.Thread(target=worker, args=(i,))
    t.____()
    threads.append(t)

for t in threads:
    t.____()
```

### 14.4 答案与讲解

#### 选择题答案

1. **C** - GIL 限制 CPU 密集型任务的多线程并行，因为同一时刻只有一个线程执行 Python 字节码。
2. **B** - `RLock`（可重入锁）允许同一线程多次获取，内部维护获取次数计数器。
3. **B** - CPU 密集型任务应使用多进程，每个进程有独立 GIL，可充分利用多核 CPU。
4. **B** - `max_workers` 指定线程池中最大的工作线程数量。

#### 判断题答案

1. **v** - I/O 操作时线程会释放 GIL，其他线程可以执行，因此多线程对 I/O 密集型任务有效。
2. **x** - 多进程间内存独立，不能直接共享对象，需通过 `Queue`、`Pipe`、`Manager` 或共享内存（`Value`、`Array`）通信。

#### 代码填空题答案

1. `Lock`, `lock` - `threading.Lock()` 创建互斥锁；`with lock` 上下文管理器自动获取和释放锁。
2. `5`（或任意数字）, `map` - `ThreadPoolExecutor(max_workers=5)` 创建线程池；`executor.map()` 将任务映射到线程池执行。
3. `start`, `join` - `t.start()` 启动线程；`t.join()` 阻塞等待线程执行完毕。

---

## 第15章 网络编程基础

### 15.1 知识讲解

#### socket 编程基础
- `socket` 是网络通信的端点，提供进程间通信的能力
- TCP（传输控制协议）：面向连接、可靠传输、流式数据
- UDP（用户数据报协议）：无连接、不可靠、数据报式
- 关键方法：`bind()`、`listen()`、`accept()`、`connect()`、`send()`/`recv()`

#### HTTP 请求
- `urllib`：标准库中的 HTTP 客户端
- `http.client`：低级别 HTTP 操作
- 第三方库 `requests`：更友好的 HTTP 接口（推荐）

#### 网络协议层次
| 层次 | 协议 | Python 支持 |
|------|------|------------|
| 应用层 | HTTP/FTP/SMTP | `urllib`, `http`, `smtplib` |
| 传输层 | TCP/UDP | `socket` |
| 网络层 | IP | `socket` |

### 15.2 代码示例

```python
import socket

# ========== TCP 服务端 ==========
def tcp_server(host='localhost', port=8080):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((host, port))
        s.listen(5)
        print(f"服务端监听 {host}:{port}")
        while True:
            conn, addr = s.accept()
            with conn:
                print(f"连接来自: {addr}")
                data = conn.recv(1024)
                if data:
                    conn.sendall(b"Hello, " + data)

# ========== TCP 客户端 ==========
def tcp_client(message, host='localhost', port=8080):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((host, port))
        s.sendall(message.encode())
        data = s.recv(1024)
        print(f"收到: {data.decode()}")

# ========== UDP 通信 ==========
# UDP 服务端
with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
    s.bind(('localhost', 9999))
    data, addr = s.recvfrom(1024)
    s.sendto(b"Received", addr)

# UDP 客户端
with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
    s.sendto(b"Hello UDP", ('localhost', 9999))
    data, _ = s.recvfrom(1024)

# ========== HTTP 请求（urllib）==========
from urllib.request import urlopen
from urllib.parse import urlencode

# GET 请求
with urlopen("https://api.github.com") as response:
    print(response.status)
    print(response.read().decode())

# POST 请求
data = urlencode({'key': 'value'}).encode()
with urlopen("https://httpbin.org/post", data=data) as response:
    print(response.read().decode())

# ========== 使用 requests（第三方库）==========
# import requests
# response = requests.get("https://api.github.com")
# print(response.json())
```

### 15.3 练习题

#### 选择题

**1. `socket.AF_INET` 表示使用哪种地址族？**

A. IPv6  
B. IPv4  
C. Unix 域套接字  
D. 蓝牙  

**2. `socket.SOCK_STREAM` 对应哪种协议？**

A. UDP  
B. TCP  
C. HTTP  
D. ICMP  

**3. TCP 服务端调用 `accept()` 后返回什么？**

A. 客户端 IP 地址  
B. 新的 socket 对象和客户端地址  
C. 接收到的数据  
D. 连接状态码  

**4. 以下哪个不是 Python 标准库中的 HTTP 客户端模块？**

A. `urllib`  
B. `http.client`  
C. `requests`  
D. `urllib.request`  

#### 判断题

**1. UDP 通信不需要建立连接，直接发送数据即可。**（  ）

**2. `socket` 的 `recv()` 方法是阻塞的，直到收到数据或连接关闭。**（  ）

#### 代码填空题

**1. 补全代码，创建一个 TCP 客户端连接并发送数据：**

```python
import socket

with socket.socket(socket.AF_INET, socket.____) as s:
    s.____(('localhost', 8080))
    s.sendall(b"Hello Server")
    data = s.recv(1024)
    print(data.decode())
```

**2. 补全代码，使用 `urllib` 发送带参数的 GET 请求：**

```python
from urllib.request import urlopen
from urllib.parse import urlencode

params = {'q': 'python', 'page': 1}
query = urlencode(params)
url = f"https://example.com/search?____"
with urlopen(url) as response:
    print(response.____)
```

**3. 补全代码，创建一个简单的 UDP 服务端接收并回复消息：**

```python
import socket

with socket.socket(socket.AF_INET, socket.____) as s:
    s.bind(('localhost', 9999))
    while True:
        data, addr = s.____(1024)
        print(f"收到来自 {addr}: {data.decode()}")
        s.____(b"ACK", addr)
```

### 15.4 答案与讲解

#### 选择题答案

1. **B** - `AF_INET` 表示 IPv4 地址族，`AF_INET6` 表示 IPv6，`AF_UNIX` 表示 Unix 域套接字。
2. **B** - `SOCK_STREAM` 表示面向连接的 TCP 流式套接字，`SOCK_DGRAM` 表示 UDP 数据报套接字。
3. **B** - `accept()` 返回一个元组 `(conn, address)`，`conn` 是新的 socket 对象用于通信，`address` 是客户端地址。
4. **C** - `requests` 是第三方库，不是 Python 标准库的一部分，需通过 `pip install requests` 安装。

#### 判断题答案

1. **v** - UDP 是无连接协议，不需要握手建立连接，直接通过 `sendto()` 发送数据到指定地址。
2. **v** - `recv()` 默认是阻塞调用，程序会暂停等待数据到达；可通过 `setblocking(False)` 或 `settimeout()` 设为非阻塞。

#### 代码填空题答案

1. `SOCK_STREAM`, `connect` - TCP 客户端使用 `SOCK_STREAM`；`connect()` 连接到服务端地址。
2. `{query}`, `status`（或 `code`） - `urlencode` 将字典转为查询字符串；`response.status` 获取 HTTP 状态码。
3. `SOCK_DGRAM`, `recvfrom`, `sendto` - UDP 使用 `SOCK_DGRAM`；`recvfrom()` 接收数据和来源地址；`sendto()` 发送数据到指定地址。

---

# 第三部分：精通篇

---

## 第16章 元类

### 16.1 知识讲解

#### 什么是元类
- 元类（Metaclass）是'类的类'，用于创建和控制类的行为
- 默认元类是 `type`，所有类都是 `type` 的实例
- 自定义元类需继承 `type`
- 使用 `metaclass=MyMeta` 指定类的元类

#### type 的两种用法
1. `type(obj)`：返回对象的类型
2. `type(name, bases, namespace)`：动态创建类

#### 元类的核心方法
- `__new__(cls, name, bases, namespace)`：创建类对象（控制类的创建）
- `__init__(cls, name, bases, namespace)`：初始化类对象（控制类的初始化）
- `__call__(cls, *args, **kwargs)`：控制类的实例化过程

### 16.2 代码示例

```python
# ========== 使用 type 动态创建类 ==========
def greet(self):
    return f"Hello, I'm {self.name}"

Person = type('Person', (), {'name': 'Alice', 'greet': greet})
p = Person()
print(p.greet())  # Hello, I'm Alice

# ========== 自定义元类 ==========
class SingletonMeta(type):
    """单例元类：确保类只有一个实例"""
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Database(metaclass=SingletonMeta):
    def __init__(self, dsn):
        self.dsn = dsn

db1 = Database('localhost')
db2 = Database('remote')
print(db1 is db2)  # True

# ========== 自动注册子类的元类 ==========
class PluginMeta(type):
    registry = {}

    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)
        if name != 'BasePlugin':
            PluginMeta.registry[name] = cls
        return cls

class BasePlugin(metaclass=PluginMeta):
    pass

class EmailPlugin(BasePlugin):
    pass

class SMSPlugin(BasePlugin):
    pass

print(PluginMeta.registry)  # {'EmailPlugin': ..., 'SMSPlugin': ...}

# ========== 强制命名规范的元类 ==========
class NamingMeta(type):
    def __new__(mcs, name, bases, namespace):
        if not name[0].isupper():
            raise ValueError(f'类名 {name} 必须大写开头')
        return super().__new__(mcs, name, bases, namespace)

# class badName(metaclass=NamingMeta):  # 报错
#     pass
```

### 16.3 练习题

#### 选择题

**1. Python 中所有类的默认元类是什么？**

A. `object`  
B. `type`  
C. `class`  
D. `meta`  

**2. 元类的 `__call__` 方法在什么时候被调用？**

A. 定义类时  
B. 创建类实例时  
C. 删除类时  
D. 导入模块时  

**3. `type('MyClass', (Base,), {'x': 1})` 中第二个参数 `(Base,)` 表示？**

A. 类的属性  
B. 类的基类元组  
C. 类的元类  
D. 类的方法  

**4. 以下哪个场景最适合使用元类？**

A. 简单的数据封装  
B. 需要统一控制多个类的创建行为（如 ORM 模型注册）  
C. 单次使用的工具函数  
D. 字符串处理  

#### 判断题

**1. 元类可以像普通类一样被继承，子类也会继承父类的元类行为。**（  ）

**2. `__new__` 在元类中用于控制类的实例化，`__init__` 用于控制类的创建。**（  ）

#### 代码填空题

**1. 补全代码，使用元类实现单例模式：**

```python
class SingletonMeta(____):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(____, ____)
        return cls._instances[cls]
```

**2. 补全代码，动态创建一个继承自 `dict` 的类：**

```python
MyDict = type('MyDict', (____,), {})
d = MyDict()
d['key'] = 'value'
```

**3. 补全代码，在元类中强制所有方法名必须小写：**

```python
class LowerCaseMeta(type):
    def __new__(mcs, name, bases, namespace):
        for attr_name in namespace:
            if callable(namespace[attr_name]) and not attr_name.startswith('__'):
                if not attr_name.islower():
                    raise ValueError(f"方法 {attr_name} 必须小写")
        return super().__new__(____, ____, ____, ____)
```

### 16.4 答案与讲解

#### 选择题答案

1. **B** - `type` 是所有类的默认元类，`isinstance(MyClass, type)` 为 `True`。
2. **B** - 当使用 `MyClass()` 创建实例时，调用的是元类的 `__call__`，它再调用类的 `__new__` 和 `__init__`。
3. **B** - `type(name, bases, dict)` 的第二个参数是基类元组，即使只有一个基类也要用逗号（如 `(Base,)`）。
4. **B** - 元类适合需要统一控制类创建行为的场景，如 Django ORM 的模型元类自动注册字段、管理数据库表名等。

#### 判断题答案

1. **v** - 元类可以被继承，除非子类显式指定其他元类，否则会继承父类的元类。
2. **x** - `__new__` 控制类的**创建**（分配内存），`__call__` 控制类的**实例化**（`Class()` 时调用）。

#### 代码填空题答案

1. `type`, `*args`, `**kwargs` - 元类继承 `type`；`super().__call__(*args, **kwargs)` 调用父类的实例化逻辑。
2. `dict` - `type` 的第二个参数是基类元组，`dict` 作为基类使 `MyDict` 继承字典行为。
3. `mcs`, `name`, `bases`, `namespace` - `super().__new__(mcs, name, bases, namespace)` 调用父类 `type.__new__` 完成类创建。

---

## 第17章 描述符

### 17.1 知识讲解

#### 什么是描述符
- 实现了 `__get__`、`__set__` 或 `__delete__` 方法的对象
- 描述符是 Python 属性访问机制的核心（`property`、`classmethod`、`staticmethod` 都是描述符）
- 数据描述符：实现 `__set__`（优先级高于实例字典）
- 非数据描述符：只实现 `__get__`（优先级低于实例字典）

#### 描述符协议方法
- `__get__(self, instance, owner)`：获取属性值
- `__set__(self, instance, value)`：设置属性值
- `__delete__(self, instance)`：删除属性
- `instance` 为 `None` 时通过类访问（如 `MyClass.attr`）

### 17.2 代码示例

```python
# ========== 自定义描述符：类型检查 ==========
class Typed:
    """强制属性类型"""
    def __init__(self, name, expected_type):
        self.name = name
        self.expected_type = expected_type

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return instance.__dict__[self.name]

    def __set__(self, instance, value):
        if not isinstance(value, self.expected_type):
            raise TypeError(f"{self.name} 必须是 {self.expected_type}")
        instance.__dict__[self.name] = value

    def __delete__(self, instance):
        del instance.__dict__[self.name]

class Person:
    name = Typed('name', str)
    age = Typed('age', int)

p = Person()
p.name = "Alice"
p.age = 25
# p.age = "25"  # 报错：TypeError

# ========== 使用描述符实现属性缓存 ==========
class LazyProperty:
    """延迟计算属性，只计算一次"""
    def __init__(self, func):
        self.func = func
        self.name = func.__name__

    def __get__(self, instance, owner):
        if instance is None:
            return self
        value = self.func(instance)
        instance.__dict__[self.name] = value
        return value

class Circle:
    def __init__(self, radius):
        self.radius = radius

    @LazyProperty
    def area(self):
        print("计算面积...")
        return 3.14159 * self.radius ** 2

c = Circle(5)
print(c.area)  # 计算并缓存
print(c.area)  # 直接使用缓存

# ========== 非数据描述符示例 ==========
class MethodDescriptor:
    """模拟方法绑定"""
    def __init__(self, func):
        self.func = func

    def __get__(self, instance, owner):
        if instance is None:
            return self
        from functools import partial
        return partial(self.func, instance)

class MyClass:
    @MethodDescriptor
    def show(self):
        print("show method")
```

### 17.3 练习题

#### 选择题

**1. 以下哪个不是描述符必须实现的方法？**

A. `__get__`  
B. `__set__`  
C. `__call__`  
D. `__delete__`  

**2. 数据描述符和非数据描述符的主要区别是？**

A. 数据描述符更快  
B. 数据描述符实现了 `__set__`，优先级高于实例字典  
C. 非数据描述符可以删除属性  
D. 没有区别  

**3. `property` 装饰器本质上是什么？**

A. 元类  
B. 描述符  
C. 装饰器函数  
D. 生成器  

**4. 当通过类访问描述符属性（如 `MyClass.attr`）时，`__get__` 的 `instance` 参数值是？**

A. 类的实例  
B. `None`  
C. 类本身  
D. 描述符对象  

#### 判断题

**1. 描述符必须作为类的属性定义才能生效，作为实例属性定义时不会触发描述符协议。**（  ）

**2. 数据描述符的优先级高于实例的 `__dict__`，而非数据描述符的优先级低于实例的 `__dict__`。**（  ）

#### 代码填空题

**1. 补全代码，实现一个只读描述符（只能设置一次）：**

```python
class ReadOnly:
    def __init__(self, name):
        self.name = name

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return instance.__dict__.get(self.name)

    def __set__(self, instance, value):
        if self.name in instance.__dict__:
            raise AttributeError("只读属性")
        instance.____[self.name] = ____
```

**2. 补全代码，使用描述符实现属性访问计数：**

```python
class AccessCounter:
    def __init__(self, initval=None):
        self.val = initval
        self.count = 0

    def __get__(self, instance, owner):
        self.count += 1
        return self.____
```

**3. 补全代码，实现一个范围限制描述符：**

```python
class Range:
    def __init__(self, min_val, max_val):
        self.min_val = min_val
        self.max_val = max_val

    def __set__(self, instance, value):
        if not (self.min_val <= value <= self.max_val):
            raise ValueError(f"值必须在 {self.min_val} 到 {self.max_val} 之间")
        instance.__dict__[self.name] = ____
```

### 17.4 答案与讲解

#### 选择题答案

1. **C** - 描述符只需实现 `__get__`、`__set__`、`__delete__` 中的至少一个，`__call__` 不是描述符协议方法。
2. **B** - 数据描述符（有 `__set__`）优先级高于实例 `__dict__`；非数据描述符（只有 `__get__`）优先级低于实例 `__dict__`。
3. **B** - `property` 是内置的数据描述符，实现了 `__get__`、`__set__`、`__delete__`。
4. **B** - 类访问时 `instance` 为 `None`，`owner` 为类本身；实例访问时 `instance` 为实例对象。

#### 判断题答案

1. **v** - 描述符协议只在描述符作为**类属性**时触发，作为实例属性时 Python 不会调用描述符方法。
2. **v** - 属性查找顺序：数据描述符 > 实例字典 > 非数据描述符 > 类字典。

#### 代码填空题答案

1. `__dict__`, `value` - 将值存入实例字典中；首次设置后再次设置会触发 `AttributeError`。
2. `val` - `self.val` 存储实际值，每次访问时计数器加一。
3. `value` - 将通过验证的值存入实例字典，`self.name` 需要在 `__init__` 或 `__set_name__`（Python 3.6+）中设置。

---

## 第18章 内存管理与垃圾回收

### 18.1 知识讲解

#### Python 内存管理机制
- **引用计数**：每个对象维护引用计数器，计数为 0 时立即回收
- **垃圾回收器（GC）**：处理循环引用，基于分代回收策略
- **内存池（pymalloc）**：管理小块内存分配，减少系统调用开销
- **对象复用**：小整数（-5~256）、短字符串等会被缓存复用

#### 垃圾回收器详解
- 分三代：0 代（新对象）、1 代、2 代（老对象）
- 对象存活过一定次数 GC 后晋升到下一代
- 可通过 `gc` 模块手动控制：
  - `gc.collect()`：手动触发垃圾回收
  - `gc.disable()`/`gc.enable()`：控制自动 GC
  - `gc.get_objects()`：获取所有被跟踪的对象

#### 循环引用问题
- 容器对象（列表、字典、实例等）可能形成循环引用
- 循环引用导致引用计数永不为 0，需 GC 介入
- 使用 `weakref` 模块创建弱引用，不增加引用计数

### 18.2 代码示例

```python
import sys
import gc
import weakref

# ========== 引用计数 ==========
a = [1, 2, 3]
print(sys.getrefcount(a))  # 至少为 2（a + getrefcount 参数）

b = a
print(sys.getrefcount(a))  # 增加 1

del b
print(sys.getrefcount(a))  # 恢复

# ========== 循环引用 ==========
class Node:
    def __init__(self, name):
        self.name = name
        self.next = None
    def __del__(self):
        print(f"{self.name} 被销毁")

node1 = Node("A")
node2 = Node("B")
node1.next = node2
node2.next = node1  # 循环引用

# 删除引用后，由于循环引用，__del__ 不会立即执行
del node1
del node2
gc.collect()  # 手动触发 GC，回收循环引用

# ========== 弱引用 ==========
class Data:
    pass

data = Data()
weak = weakref.ref(data)
print(weak())  # 返回原始对象

del data
gc.collect()
print(weak())  # None，对象已被回收

# ========== 弱引用字典 ==========
cache = weakref.WeakValueDictionary()
key = "item1"
cache[key] = Data()
print(key in cache)  # True
# 当没有其他强引用时，WeakValueDictionary 中的条目自动消失

# ========== GC 调试 ==========
gc.set_debug(gc.DEBUG_STATS)
gc.collect()  # 输出 GC 统计信息
```

### 18.3 练习题

#### 选择题

**1. Python 中对象被销毁的主要依据是什么？**

A. 对象的大小  
B. 对象的引用计数为 0  
C. 对象的创建时间  
D. 对象的类型  

**2. 以下哪种情况会导致循环引用？**

A. 两个整数相互引用  
B. 两个列表互相包含对方  
C. 两个字符串拼接  
D. 两个元组相加  

**3. `weakref.ref(obj)` 创建的引用有什么特点？**

A. 会增加 obj 的引用计数  
B. 不会阻止 obj 被垃圾回收  
C. 只能用于函数  
D. 比强引用更安全  

**4. `gc.collect()` 的作用是？**

A. 删除所有对象  
B. 手动触发垃圾回收  
C. 增加引用计数  
D. 释放系统内存  

#### 判断题

**1. Python 的小整数（-5 到 256）会被缓存复用，因此 `a = 5; b = 5` 时 `a is b` 为 True。**（  ）

**2. 循环引用只能通过 `gc.collect()` 手动回收，自动 GC 无法处理。**（  ）

#### 代码填空题

**1. 补全代码，查看对象的引用计数：**

```python
import sys

a = [1, 2, 3]
print(sys.____(a))  # 查看引用计数
```

**2. 补全代码，使用弱引用创建不阻止垃圾回收的引用：**

```python
import weakref

class MyClass:
    pass

obj = MyClass()
ref = weakref.____(obj)
print(ref())  # 访问被引用对象
```

**3. 补全代码，禁用自动垃圾回收后手动触发：**

```python
import gc

gc.____()  # 禁用自动 GC
# ... 执行代码 ...
gc.____()  # 手动触发 GC
gc.____()  # 恢复自动 GC
```

### 18.4 答案与讲解

#### 选择题答案

1. **B** - Python 主要使用引用计数管理内存，当引用计数降为 0 时对象立即被回收。
2. **B** - 两个列表互相包含对方形成循环引用，导致引用计数永不为 0，需 GC 介入。
3. **B** - 弱引用不增加引用计数，不会阻止垃圾回收器回收对象，常用于缓存和观察者模式。
4. **B** - `gc.collect()` 手动触发垃圾回收，返回被回收的不可达对象数量。

#### 判断题答案

1. **v** - CPython 会缓存小整数对象，因此相同小整数的 `is` 判断为 True（但不应依赖此行为）。
2. **x** - Python 的 GC 会自动检测和回收循环引用，`gc.collect()` 只是手动触发，非唯一方式。

#### 代码填空题答案

1. `getrefcount` - `sys.getrefcount(obj)` 返回对象的引用计数（结果会比预期多 1，因为参数传递增加了临时引用）。
2. `ref` - `weakref.ref(obj)` 创建弱引用对象，通过 `ref()` 调用获取原始对象（可能已变为 None）。
3. `disable`, `collect`, `enable` - 先禁用自动 GC，执行代码后手动触发，最后恢复自动 GC。

---

## 第18章 内存管理与垃圾回收

### 18.1 知识讲解

#### Python 内存模型
- 所有对象都在堆上分配，由 Python 内存管理器管理
- 小整数缓存：`-5` 到 `256` 的整数被预先创建并缓存
- 字符串驻留（interning）：部分短字符串被缓存复用
- `id()` 返回对象的内存地址
- `sys.getsizeof()` 获取对象的内存占用

#### 垃圾回收机制
1. **引用计数**：每个对象维护引用计数器，为 0 时立即回收
2. **循环引用检测**：引用计数无法处理循环引用，由 `gc` 模块处理
3. **分代回收**：对象分为 0/1/2 三代，存活越久检查频率越低
- `gc.collect()`：手动触发垃圾回收
- `gc.disable()` / `gc.enable()`：控制自动回收

#### 内存优化技巧
- 使用 `__slots__` 限制实例属性，减少内存占用
- 使用生成器替代列表，惰性求值
- 及时删除大对象：`del` + `gc.collect()`
- 使用 `weakref` 避免循环引用

### 18.2 代码示例

```python
import sys
import gc

# ========== 引用计数 ==========
a = [1, 2, 3]
print(sys.getrefcount(a))  # 至少为 2（a + getrefcount 参数）
b = a
print(sys.getrefcount(a))  # 增加 1
del b
print(sys.getrefcount(a))  # 恢复

# ========== 循环引用 ==========
class Node:
    def __init__(self, name):
        self.name = name
        self.next = None

n1 = Node("A")
n2 = Node("B")
n1.next = n2
n2.next = n1  # 循环引用！

# 手动解除引用
n1.next = None
n2.next = None

# ========== __slots__ 优化内存 ==========
class Person:
    __slots__ = ['name', 'age']  # 禁止动态添加属性
    def __init__(self, name, age):
        self.name = name
        self.age = age

p = Person("Alice", 25)
# p.gender = 'F'  # 报错！AttributeError

# ========== weakref 弱引用 ==========
import weakref

class Data:
    pass

d = Data()
ref = weakref.ref(d)  # 弱引用，不增加引用计数
print(ref())  # 访问对象
del d
print(ref())  # None，对象已被回收

# ========== 手动垃圾回收 ==========
gc.collect()  # 手动触发
print(gc.get_count())  # 查看各代对象数量
print(gc.get_threshold())  # 查看回收阈值
```

### 18.3 练习题

#### 选择题

**1. Python 中对象被回收的主要机制是？**

A. 标记-清除  
B. 引用计数  
C. 分代回收  
D. 复制算法  

**2. `sys.getrefcount(a)` 返回的引用计数通常比实际多几？**

A. 0  
B. 1  
C. 2  
D. 不确定  

**3. `__slots__` 的主要作用是？**

A. 加速属性访问  
B. 限制实例可拥有的属性，减少内存占用  
C. 实现私有属性  
D. 自动垃圾回收  

**4. `weakref.ref(obj)` 创建的引用有什么特点？**

A. 可以阻止对象被垃圾回收  
B. 不增加引用计数，对象可被正常回收  
C. 只能用于整数  
D. 会自动复制对象  

#### 判断题

**1. Python 中所有整数对象都会被缓存复用。**（  ）

**2. 循环引用一定会导致内存泄漏。**（  ）

#### 代码填空题

**1. 补全代码，查看对象的内存占用大小：**

```python
import sys
data = [1, 2, 3, 4, 5]
print(sys.____(data))  # 返回对象占用的字节数
```

**2. 补全代码，使用 `__slots__` 定义一个只能有 x、y 属性的 Point 类：**

```python
class Point:
    ____ = ['x', 'y']
    def __init__(self, x, y):
        self.x = x
        self.y = y
```

**3. 补全代码，手动触发垃圾回收并打印不可达对象数量：**

```python
import gc
count = gc.____()  # 返回被回收的对象数量
print(f"回收了 {count} 个对象")
```

### 18.4 答案与讲解

#### 选择题答案

1. **B** - 引用计数是 Python 的主要回收机制，对象引用计数为 0 时立即回收；循环引用由 `gc` 模块补充处理。
2. **B** - `getrefcount()` 会将传入的参数临时增加一次引用，因此返回值通常比实际多 1。
3. **B** - `__slots__` 用固定数组替代动态字典存储属性，显著减少内存占用，同时禁止动态添加新属性。
4. **B** - 弱引用不增加引用计数，不会阻止垃圾回收，适合缓存和观察者模式。

#### 判断题答案

1. **x** - 只有小整数（-5 到 256）被缓存，大整数每次创建新对象。
2. **x** - Python 的 `gc` 模块会检测并回收循环引用，不会导致内存泄漏（除非对象定义了 `__del__` 且形成循环引用）。

#### 代码填空题答案

1. `getsizeof` - `sys.getsizeof(obj)` 返回对象占用的内存字节数（不包括引用对象的内存）。
2. `__slots__` - `__slots__ = ['x', 'y']` 限制实例只能有 x 和 y 两个属性。
3. `collect` - `gc.collect()` 强制运行垃圾回收器，返回被回收的不可达对象数量。

---

## 第19章 设计模式

### 19.1 知识讲解

#### 设计模式分类
| 类型 | 模式 |
|------|------|
| 创建型 | 单例、工厂、建造者、原型 |
| 结构型 | 装饰器、适配器、代理、组合 |
| 行为型 | 观察者、策略、迭代器、命令 |

#### Python 中的设计模式特点
- 一等函数和鸭子类型简化了许多模式的实现
- 装饰器模式可用 Python 装饰器语法直接实现
- 迭代器模式已内置于语言（`for` 循环、`yield`）
- 单例可用模块全局变量或元类实现

### 19.2 代码示例

```python
# ========== 单例模式（模块方式，推荐）==========
# singleton.py
class _Database:
    def __init__(self):
        self.connection = "connected"
Database = _Database()  # 模块导入时只创建一次

# ========== 工厂模式 ==========
class Dog:
    def speak(self):
        return "Woof!"

class Cat:
    def speak(self):
        return "Meow!"

def animal_factory(animal_type):
    animals = {'dog': Dog, 'cat': Cat}
    return animals.get(animal_type, Dog)()

# ========== 策略模式（使用一等函数）==========
def bubble_sort(data):
    return sorted(data)  # 简化示意

def quick_sort(data):
    return sorted(data)  # 简化示意

class Sorter:
    def __init__(self, strategy):
        self.strategy = strategy
    def sort(self, data):
        return self.strategy(data)

sorter = Sorter(quick_sort)
result = sorter.sort([3, 1, 4, 1, 5])

# ========== 观察者模式 ==========
class Subject:
    def __init__(self):
        self._observers = []
    def attach(self, observer):
        self._observers.append(observer)
    def detach(self, observer):
        self._observers.remove(observer)
    def notify(self, data):
        for observer in self._observers:
            observer.update(data)

class EmailNotifier:
    def update(self, data):
        print(f"发送邮件: {data}")

class SMSNotifier:
    def update(self, data):
        print(f"发送短信: {data}")

subject = Subject()
subject.attach(EmailNotifier())
subject.attach(SMSNotifier())
subject.notify("订单已发货")

# ========== 适配器模式 ==========
class EuropeanSocket:
    def voltage(self):
        return 230
    def live(self):
        return 1
    def neutral(self):
        return -1

class USASocket:
    def voltage(self):
        return 110

class Adapter:
    def __init__(self, socket):
        self._socket = socket
    def voltage(self):
        return 110  # 转换电压
```

### 19.3 练习题

#### 选择题

**1. 在 Python 中，以下哪种方式实现单例最简单且符合 Python 风格？**

A. 元类  
B. 模块级全局变量  
C. 双重检查锁  
D. 装饰器  

**2. 策略模式在 Python 中通常如何简化实现？**

A. 使用继承  
B. 使用一等函数作为策略  
C. 使用全局变量  
D. 使用异常处理  

**3. 观察者模式中，Subject 的主要职责是？**

A. 执行业务逻辑  
B. 维护观察者列表并通知它们  
C. 修改观察者状态  
D. 创建观察者  

**4. 适配器模式的主要目的是？**

A. 提高性能  
B. 将不兼容的接口转换为兼容的接口  
C. 创建对象  
D. 管理对象生命周期  

#### 判断题

**1. Python 的迭代器模式需要手动实现 `__iter__` 和 `__next__`，因为语言本身不提供迭代支持。**（  ）

**2. 工厂模式将对象的创建逻辑集中管理，便于后续扩展和维护。**（  ）

#### 代码填空题

**1. 补全代码，实现一个简单的工厂函数：**

```python
def shape_factory(shape_type):
    shapes = {
        'circle': Circle,
        'square': Square
    }
    return ____.get(shape_type, Circle)()
```

**2. 补全代码，实现观察者模式中的通知方法：**

```python
class Subject:
    def __init__(self):
        self._observers = []

    def notify(self, data):
        for observer in self._observers:
            observer.____(data)
```

**3. 补全代码，使用函数实现策略模式：**

```python
def execute_strategy(data, strategy):
    return ____(data)
```

### 19.4 答案与讲解

#### 选择题答案

1. **B** - Python 模块天然是单例（模块只导入一次），将单例对象放在模块级别是最 Pythonic 的方式。
2. **B** - Python 的函数是一等公民，可直接传入作为策略，无需定义策略接口和多个策略类。
3. **B** - Subject（主题）维护观察者列表，状态变化时调用各观察者的 `update()` 方法通知它们。
4. **B** - 适配器模式包装一个类，将其接口转换为客户期望的另一个接口，解决接口不兼容问题。

#### 判断题答案

1. **x** - Python 原生支持迭代器协议，`for` 循环、`yield`、生成器表达式都是内置的迭代器支持。
2. **v** - 工厂模式将对象创建集中到一个地方，新增产品只需修改工厂，无需改动使用方代码。

#### 代码填空题答案

1. `shapes` - 从字典中获取对应的类，找不到默认返回 `Circle`，然后实例化。
2. `update` - 观察者模式约定观察者实现 `update(data)` 方法接收通知。
3. `strategy` - 直接调用传入的策略函数，利用 Python 函数是一等对象的特性。

---

## 第20章 性能优化

### 20.1 知识讲解

#### 性能分析工具
- `timeit`：精确测量小段代码执行时间
- `cProfile`：标准库性能分析器，统计函数调用次数和时间
- `line_profiler`：逐行分析（第三方）
- `memory_profiler`：内存分析（第三方）

#### 常见优化策略
1. **算法优化**：选择合适的数据结构和算法（O(n) vs O(n^2)）
2. **避免重复计算**：使用缓存（`functools.lru_cache`）
3. **列表推导式 vs for 循环**：推导式通常更快
4. **局部变量优先**：局部变量访问比全局变量快
5. **使用内置函数**：`map`、`filter`、`sum` 等用 C 实现
6. **字符串拼接**：用 `join()` 替代 `+` 拼接
7. **生成器替代列表**：大数据集用惰性求值
8. **C 扩展**：NumPy、Cython 等处理数值计算

### 20.2 代码示例

```python
import timeit
import cProfile
from functools import lru_cache

# ========== timeit 精确计时 ==========
# 测量列表推导式 vs for 循环
list_comp_time = timeit.timeit(
    '[x**2 for x in range(1000)]',
    number=1000
)
for_loop_time = timeit.timeit(
    '''result = []\nfor x in range(1000):\n    result.append(x**2)''',
    number=1000
)
print(f"列表推导式: {list_comp_time:.4f}s")
print(f"for 循环: {for_loop_time:.4f}s")

# ========== cProfile 性能分析 ==========
def slow_function():
    total = 0
    for i in range(10000):
        total += i ** 2
    return total

cProfile.run('slow_function()')

# ========== lru_cache 缓存 ==========
@lru_cache(maxsize=None)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(100))  # 瞬间完成

# ========== 局部变量优化 ==========
# 慢：每次循环查找全局函数
def slow_append():
    result = []
    for i in range(10000):
        result.append(i)
    return result

# 快：将方法绑定到局部变量
def fast_append():
    result = []
    append = result.append  # 局部变量绑定
    for i in range(10000):
        append(i)
    return result

# ========== 字符串拼接优化 ==========
# 慢：每次 + 都创建新字符串
def slow_join(words):
    result = ""
    for word in words:
        result += word
    return result

# 快：使用 join()
def fast_join(words):
    return "".join(words)
```

### 20.3 练习题

#### 选择题

**1. 以下哪种方式测量小段代码性能最精确？**

A. `time.time()`  
B. `timeit.timeit()`  
C. `datetime.now()`  
D. `os.times()`  

**2. `functools.lru_cache` 的 `maxsize=None` 表示？**

A. 缓存大小为 0  
B. 缓存无限制  
C. 缓存大小为 1  
D. 禁用缓存  

**3. 为什么 `result.append` 绑定到局部变量后循环更快？**

A. 局部变量访问比属性查找快  
B. append 方法被加速了  
C. 列表变小了  
D. 没有区别  

**4. 大量字符串拼接时，推荐的方式是？**

A. 使用 `+` 循环拼接  
B. 使用 `join()` 方法  
C. 使用 `f-string` 循环拼接  
D. 使用 `%` 格式化  

#### 判断题

**1. `cProfile` 会显著增加程序运行时间，因此不适合在生产环境使用。**（  ）

**2. 列表推导式通常比等价的 for 循环更快，因为推导式在 C 层面执行。**（  ）

#### 代码填空题

**1. 补全代码，使用 `timeit` 测量函数执行时间：**

```python
import timeit
elapsed = timeit.____('sum(range(100))', number=____)
print(f"执行时间: {elapsed:.6f} 秒")
```

**2. 补全代码，使用 `lru_cache` 缓存递归函数：**

```python
from functools import lru_cache

@lru_cache(maxsize=____)
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
```

**3. 补全代码，使用 `cProfile` 分析函数性能：**

```python
import cProfile

def compute():
    return sum(x**2 for x in range(10000))

cProfile.____('compute()')
```

### 20.4 答案与讲解

#### 选择题答案

1. **B** - `timeit` 自动禁用垃圾回收、重复执行取平均，消除系统噪声，适合测量小段代码。
2. **B** - `maxsize=None` 表示缓存无大小限制，所有调用结果都会被缓存。
3. **A** - 局部变量访问是数组索引（FAST），属性查找需要字典查找（LOAD_ATTR），局部变量绑定避免了每次循环的属性查找开销。
4. **B** - `join()` 预先分配足够内存，只创建一次新字符串；`+` 拼接会创建大量中间字符串对象。

#### 判断题答案

1. **v** - `cProfile` 是纯 Python 分析器，开销较大，通常在开发和测试环境使用；生产环境可用 `yappi` 等低开销工具。
2. **v** - 列表推导式在字节码层面优化更好，且 CPython 对其有专门优化，通常比手动 for 循环快 10-30%。

#### 代码填空题答案

1. `timeit`, `10000`（或任意数字） - `timeit.timeit(stmt, number)` 执行语句指定次数并返回总耗时。
2. `128`（或任意数字/None） - `maxsize` 设置缓存上限，`None` 表示无限制。
3. `run` - `cProfile.run('compute()')` 执行字符串形式的代码并打印性能统计报告。

---

## 第21章 异步编程

### 21.1 知识讲解

#### 异步编程核心概念
- **协程（Coroutine）**：使用 `async def` 定义的函数，调用时返回协程对象而非直接执行
- **事件循环（Event Loop）**：调度执行协程的核心机制
- **`await`**：挂起当前协程，等待异步操作完成，期间不阻塞事件循环
- **`asyncio`**：Python 标准库中的异步 I/O 框架

#### 关键组件
| 组件 | 说明 |
|------|------|
| `async def` | 定义协程函数 |
| `await` | 等待可等待对象完成 |
| `asyncio.run()` | 运行最高层级的入口点协程 |
| `asyncio.create_task()` | 将协程包装为 Task 并调度执行 |
| `asyncio.gather()` | 并发运行多个可等待对象 |
| `asyncio.sleep()` | 非阻塞延迟 |
| `async for` | 异步迭代 |
| `async with` | 异步上下文管理器 |

#### 异步 vs 多线程
- 异步：单线程 + 事件循环，适合大量 I/O 操作
- 多线程：多线程 + GIL，适合 I/O 操作但切换开销大
- 异步避免了线程切换开销和锁竞争问题

### 21.2 代码示例

```python
import asyncio

# ========== 基础协程 ==========
async def say_hello():
    print("Hello...")
    await asyncio.sleep(1)  # 非阻塞等待 1 秒
    print("World!")

# 运行协程
asyncio.run(say_hello())

# ========== 并发执行 ==========
async def fetch_data(url, delay):
    print(f"开始获取 {url}")
    await asyncio.sleep(delay)
    print(f"完成获取 {url}")
    return f"数据: {url}"

async def main():
    # 方式1：create_task 创建任务
    task1 = asyncio.create_task(fetch_data("A", 2))
    task2 = asyncio.create_task(fetch_data("B", 1))
    result1 = await task1
    result2 = await task2
    print(result1, result2)

    # 方式2：gather 并发等待
    results = await asyncio.gather(
        fetch_data("C", 2),
        fetch_data("D", 1),
        fetch_data("E", 3)
    )
    print(results)

asyncio.run(main())

# ========== 异步上下文管理器 ==========
class AsyncDatabase:
    async def __aenter__(self):
        print("连接数据库...")
        await asyncio.sleep(0.5)
        return self

    async def __aexit__(self, exc_type, exc, tb):
        print("关闭数据库...")
        await asyncio.sleep(0.5)

    async def query(self, sql):
        await asyncio.sleep(0.1)
        return f"结果: {sql}"

async def use_db():
    async with AsyncDatabase() as db:
        result = await db.query("SELECT * FROM users")
        print(result)

# ========== 异步迭代器 ==========
class AsyncCounter:
    def __init__(self, limit):
        self.limit = limit
        self.current = 0

    def __aiter__(self):
        return self

    async def __anext__(self):
        if self.current >= self.limit:
            raise StopAsyncIteration
        await asyncio.sleep(0.1)
        self.current += 1
        return self.current

async def iterate():
    async for num in AsyncCounter(5):
        print(num)
```

### 21.3 练习题

#### 选择题

**1. `async def` 定义的函数被调用时返回什么？**

A. 立即执行函数体  
B. 一个协程对象  
C. None  
D. 一个线程  

**2. `await` 关键字的作用是什么？**

A. 阻塞当前线程直到操作完成  
B. 挂起当前协程，让出控制权给其他协程  
C. 创建新线程  
D. 终止程序  

**3. `asyncio.gather()` 的作用是？**

A. 顺序执行多个协程  
B. 并发运行多个可等待对象并收集结果  
C. 取消所有任务  
D. 创建线程池  

**4. 以下哪个不能在协程外部直接使用？**

A. `asyncio.run()`  
B. `await`  
C. `asyncio.sleep()`  
D. `asyncio.create_task()`  

#### 判断题

**1. `asyncio` 使用多线程实现并发，因此可以绕过 GIL 限制。**（  ）

**2. `await asyncio.sleep(1)` 会阻塞整个程序 1 秒钟。**（  ）

#### 代码填空题

**1. 补全代码，并发执行两个异步任务：**

```python
import asyncio

async def task(name, delay):
    await asyncio.sleep(delay)
    return f"{name} 完成"

async def main():
    t1 = asyncio.____(task("A", 1))
    t2 = asyncio.____(task("B", 2))
    result1 = ____ t1
    result2 = ____ t2
    print(result1, result2)

asyncio.run(main())
```

**2. 补全代码，使用 `gather` 并发获取多个结果：**

```python
async def main():
    results = await asyncio.____(
        task("A", 1),
        task("B", 2),
        task("C", 3)
    )
    print(results)
```

**3. 补全代码，定义异步上下文管理器：**

```python
class AsyncFile:
    async def __aenter__(self):
        print("打开文件")
        return self

    async def ____aexit____(self, exc_type, exc, tb):
        print("关闭文件")
```

### 21.4 答案与讲解

#### 选择题答案

1. **B** - `async def` 函数调用时返回协程对象（coroutine object），不会立即执行，需要通过 `await` 或 `asyncio.run()` 驱动。
2. **B** - `await` 挂起当前协程，将控制权交还事件循环，让其他协程有机会执行，不会阻塞线程。
3. **B** - `asyncio.gather(*aws)` 并发运行所有传入的可等待对象，等待全部完成后返回结果列表。
4. **B** - `await` 只能在 `async def` 函数内部使用，在普通函数或全局作用域使用会报 `SyntaxError`。

#### 判断题答案

1. **x** - `asyncio` 是单线程事件循环，利用协程切换实现并发，不涉及多线程，因此 GIL 不是限制因素（但也没有绕过 GIL）。
2. **x** - `await asyncio.sleep(1)` 是非阻塞的，协程挂起 1 秒期间事件循环可以调度其他协程执行。

#### 代码填空题答案

1. `create_task`, `create_task`, `await`, `await` - `create_task()` 将协程包装为 Task 并加入事件循环；`await` 等待任务完成获取结果。
2. `gather` - `asyncio.gather()` 并发运行多个可等待对象，返回按传入顺序排列的结果列表。
3. `__aexit__` - 异步上下文管理器协议要求实现 `__aenter__` 和 `__aexit__`，对应同步版本的 `__enter__` 和 `__exit__`。

---

## 第22章 类型提示与静态检查

### 22.1 知识讲解

#### 类型提示（Type Hints）
- Python 3.5+ 引入 `typing` 模块，PEP 484 规范
- 类型提示是**静态检查**工具使用的，Python 运行时**不强制执行**
- 主要工具：`mypy`、`pyright`、`pytype`
- 优点：提高代码可读性、IDE 智能提示、提前发现类型错误

#### 常用类型注解
| 语法 | 含义 |
|------|------|
| `int`, `str`, `float`, `bool` | 基本类型 |
| `List[int]` | 整数列表 |
| `Dict[str, int]` | 字符串键、整数值的字典 |
| `Optional[str]` | `str` 或 `None` |
| `Union[int, str]` | `int` 或 `str` |
| `Callable[[int], str]` | 接收 int 返回 str 的函数 |
| `Any` | 任意类型 |
| `Tuple[int, str]` | 固定长度元组 |
| `Protocol` | 结构子类型（鸭子类型）|

#### Python 3.9+ 新语法
- 内置泛型：`list[int]`、`dict[str, int]`（无需从 typing 导入）
- `X | Y` 替代 `Union[X, Y]`
- `X | None` 替代 `Optional[X]`

### 22.2 代码示例

```python
from typing import List, Dict, Optional, Union, Callable, Tuple, Any
from typing import Protocol  # Python 3.8+

# ========== 基础类型注解 ==========
def greet(name: str) -> str:
    return f"Hello, {name}"

def add(x: int, y: int) -> int:
    return x + y

# ========== 容器类型 ==========
def process_items(items: List[int]) -> Dict[str, int]:
    result: Dict[str, int] = {}
    for i, item in enumerate(items):
        result[str(i)] = item
    return result

# ========== Optional 和 Union ==========
def find_user(user_id: int) -> Optional[str]:
    """可能返回 None"""
    if user_id > 0:
        return f"User{user_id}"
    return None

# Python 3.10+ 语法
def parse_value(value: str) -> int | None:  # 替代 Optional[int]
    try:
        return int(value)
    except ValueError:
        return None

# ========== Callable ==========
def apply_operation(
    data: List[int],
    operation: Callable[[int], int]
) -> List[int]:
    return [operation(x) for x in data]

# ========== Protocol（结构子类型）==========
class Drawable(Protocol):
    def draw(self) -> None:
        ...

def render(item: Drawable) -> None:
    item.draw()

class Circle:
    def draw(self) -> None:
        print("Drawing circle")

render(Circle())  # 通过！Circle 有 draw 方法

# ========== 泛型函数 ==========
from typing import TypeVar

T = TypeVar('T')

def first(items: List[T]) -> T:
    return items[0]

# ========== 类型别名 ==========
Vector = List[float]
Matrix = List[Vector]

def dot_product(v1: Vector, v2: Vector) -> float:
    return sum(x * y for x, y in zip(v1, v2))
```

### 22.3 练习题

#### 选择题

**1. Python 的类型提示在运行时有什么作用？**

A. 强制类型检查，类型不匹配会报错  
B. 没有任何运行时作用，仅用于静态检查  
C. 自动转换类型  
D. 提高运行速度  

**2. `Optional[str]` 等价于以下哪种写法？**

A. `str | None`（Python 3.10+）  
B. `Union[str]`  
C. `str or None`  
D. `Any`  

**3. `Protocol` 的主要用途是？**

A. 定义抽象基类  
B. 实现结构子类型（鸭子类型）检查  
C. 网络通信协议  
D. 替代继承  

**4. `Callable[[int, str], bool]` 表示？**

A. 返回 bool 的列表  
B. 接收 int 和 str 两个参数、返回 bool 的函数  
C. 一个布尔值  
D. 一个类  

#### 判断题

**1. Python 3.9 起可以直接使用 `list[int]` 而无需从 `typing` 导入 `List`。**（  ）

**2. `mypy` 是 Python 官方运行时类型检查器，会在程序运行时检查类型。**（  ）

#### 代码填空题

**1. 补全代码，为函数添加类型提示：**

```python
from typing import List, Dict

def count_words(words: List[str]) -> Dict[str, int]:
    result: Dict[str, int] = {}
    for word in words:
        result[word] = result.get(word, 0) + 1
    return result
```

**2. 补全代码，使用 `Protocol` 定义可比较接口：**

```python
from typing import Protocol

class Comparable(____):
    def compare(self, other) -> int:
        ...

def sort_items(items: List[____]) -> List[____]:
    return sorted(items, key=lambda x: x.compare(0))
```

**3. 补全代码，使用 TypeVar 定义泛型函数：**

```python
from typing import TypeVar, List

T = TypeVar('T')

def get_last(items: List[T]) -> ____:
    return items[-1]
```

### 22.4 答案与讲解

#### 选择题答案

1. **B** - Python 的类型提示是可选的、运行时被忽略的注释信息，仅用于静态类型检查工具（如 mypy）和 IDE 提示。
2. **A** - Python 3.10 引入 `X | Y` 语法，`str | None` 等价于 `Optional[str]` 和 `Union[str, None]`。
3. **B** - `Protocol` 定义接口规范，只要类实现了协议中的方法（无论是否显式继承），静态检查就认为是该协议的子类型。
4. **B** - `Callable[[参数类型列表], 返回类型]`，`[int, str]` 表示接收 int 和 str 两个参数。

#### 判断题答案

1. **v** - Python 3.9 起内置容器类型支持泛型语法（`list[int]`、`dict[str, int]`），不再需要 `typing.List`、`typing.Dict`。
2. **x** - `mypy` 是静态类型检查器，在代码运行前分析类型，不会在运行时介入。

#### 代码填空题答案

1. 已完整 - 示例展示了 `List[str]` 和 `Dict[str, int]` 的完整用法。
2. `Protocol`, `Comparable`, `Comparable` - `Protocol` 作为基类；`sort_items` 接收和返回 `Comparable` 类型的列表。
3. `T` - `TypeVar` 定义的泛型类型变量，函数返回类型与列表元素类型一致。

---

## 第23章 C 扩展开发

### 23.1 知识讲解

#### 为什么需要 C 扩展
- Python 是解释型语言，纯 Python 代码执行速度有限
- CPU 密集型任务（数值计算、图像处理等）用 C/C++ 实现可提升 10-100 倍性能
- 复用现有的 C/C++ 库
- 绕过 GIL 实现真正的并行计算

#### 主要方式
| 方式 | 说明 | 难度 |
|------|------|------|
| Python C API | 直接使用 C 编写扩展模块 | 高 |
| ctypes | 调用动态链接库（.so/.dll）无需编译 | 低 |
| Cython | Python 超集，编译为 C | 中 |
| pybind11 | C++ 库，简化 C++ 扩展编写 | 中 |
| cffi | 类似 ctypes，更现代 | 低 |
| SWIG | 自动生成多种语言绑定 | 中 |

#### ctypes 基础
- `ctypes.CDLL()`：加载动态链接库
- `ctypes.c_int`、`c_double` 等：C 类型映射
- `argtypes` / `restype`：指定参数和返回类型

### 23.2 代码示例

```python
# ========== ctypes 调用 C 标准库 ==========
from ctypes import CDLL, c_int, c_double, byref

# 加载 C 标准库
libc = CDLL("libc.so.6")  # Linux
# libc = CDLL("msvcrt.dll")  # Windows

# 调用 C 函数
libc.printf(b"Hello from C!\n")

# ========== ctypes 调用自定义动态库 ==========
# 假设有 C 代码编译为 libmath.so：
# int add(int a, int b) { return a + b; }
# double sum_array(double* arr, int n) { ... }

from ctypes import CDLL, c_int, c_double, POINTER

libmath = CDLL("./libmath.so")

# 指定函数签名
libmath.add.argtypes = [c_int, c_int]
libmath.add.restype = c_int

result = libmath.add(3, 5)
print(result)  # 8

# 传递数组
libmath.sum_array.argtypes = [POINTER(c_double), c_int]
libmath.sum_array.restype = c_double

import array
arr = array.array('d', [1.0, 2.0, 3.0, 4.0, 5.0])
total = libmath.sum_array(arr, len(arr))

# ========== Cython 示例（.pyx 文件）==========
# cyfib.pyx
# def fib(int n):
#     cdef int a = 0, b = 1, i
#     for i in range(n):
#         a, b = b, a + b
#     return a

# setup.py
# from setuptools import setup
# from Cython.Build import cythonize
# setup(ext_modules=cythonize("cyfib.pyx"))

# 编译后使用
# from cyfib import fib
# print(fib(100))

# ========== pybind11 示例（C++）==========
# // example.cpp
# #include <pybind11/pybind11.h>
# int add(int a, int b) { return a + b; }
# PYBIND11_MODULE(example, m) {
#     m.def("add", &add, "A function that adds two numbers");
# }

# 编译后 import example; example.add(1, 2)
```

### 23.3 练习题

#### 选择题

**1. `ctypes` 的主要用途是？**

A. 编写 C 代码  
B. 在 Python 中调用动态链接库（.so/.dll）  
C. 替代 Python 解释器  
D. 调试 C 程序  

**2. Cython 文件的后缀名是什么？**

A. `.c`  
B. `.cpp`  
C. `.pyx`  
D. `.pyd`  

**3. 使用 `ctypes` 调用 C 函数前，为什么要设置 `argtypes` 和 `restype`？**

A. 提高运行速度  
B. 让 Python 正确转换参数和返回值类型  
C. 检查 C 代码语法  
D. 没有特别作用  

**4. 以下哪种方式不需要编写 C/C++ 代码就能调用 C 库？**

A. Python C API  
B. ctypes  
C. Cython  
D. pybind11  

#### 判断题

**1. C 扩展可以绕过 Python 的 GIL，实现真正的多线程并行。**（  ）

**2. `ctypes` 只能调用 C 标准库，不能调用自定义编译的动态库。**（  ）

#### 代码填空题

**1. 补全代码，使用 `ctypes` 加载动态库并调用函数：**

```python
from ctypes import CDLL, c_int

lib = CDLL("./libcalc.so")
lib.multiply.argtypes = [c_int, c_int]
lib.multiply.restype = ____
result = lib.multiply(6, 7)
print(result)  # 42
```

**2. 补全代码，使用 `ctypes` 将 Python 列表转为 C 数组传入：**

```python
from ctypes import CDLL, c_int, POINTER

lib = CDLL("./libarray.so")
lib.sum_array.argtypes = [POINTER(c_int), c_int]
lib.sum_array.restype = c_int

arr = [1, 2, 3, 4, 5]
c_arr = (c_int * len(arr))(*arr)
result = lib.sum_array(c_arr, ____
print(result)  # 15
```

**3. 补全 Cython 代码，声明 C 类型变量加速循环：**

```python
# cyloop.pyx
def sum_n(int n):
    cdef int total = 0
    cdef int i
    for i in range(n):
        total += i
    return ____
```

### 23.4 答案与讲解

#### 选择题答案

1. **B** - `ctypes` 是 Python 标准库，用于加载 C 动态链接库并调用其中的函数，无需编写 C 扩展代码。
2. **C** - Cython 源文件后缀为 `.pyx`，编译后生成 C 代码再编译为 `.so`（Linux）或 `.pyd`（Windows）。
3. **B** - `argtypes` 和 `restype` 告诉 `ctypes` 如何正确转换 Python 类型到 C 类型，以及返回值如何转回 Python 类型。
4. **B** - `ctypes` 直接调用已编译好的动态库，无需编写 C/C++ 代码；其他方式都需要编写 C/C++ 扩展代码。

#### 判断题答案

1. **v** - C 扩展在执行 C 代码时可以释放 GIL（`Py_BEGIN_ALLOW_THREADS` / `Py_END_ALLOW_THREADS`），实现真正的并行计算。
2. **x** - `ctypes` 可以加载任何动态链接库（包括自定义编译的 `.so`、`.dll`、`.dylib`），不限于 C 标准库。

#### 代码填空题答案

1. `c_int` - 设置返回类型为 C 整数，确保 `ctypes` 正确转换返回值。
2. `len(arr)` - 传入数组长度作为第二个参数，C 函数需要知道数组有多少个元素。
3. `total` - Cython 中 `cdef` 声明的 C 类型变量在编译为 C 后直接使用 C 运算，大幅提升循环性能。

---

# 附录：学习路线建议

## 入门阶段（1-2 周）
1. 完成第 1-4 章：环境搭建、基础语法、流程控制、数据结构
2. 每天编写 50+ 行代码，熟悉 Python 语法风格
3. 完成所有配套练习题

## 进阶阶段（2-3 周）
1. 完成第 5-8 章：函数、文件、异常、模块
2. 完成第 9-12 章：面向对象、迭代器、装饰器、上下文管理器
3. 开始阅读优秀开源项目源码（如 requests、flask）
4. 尝试编写 500 行以上的完整项目

## 精通阶段（持续学习）
1. 完成第 13-15 章：正则、并发、网络
2. 完成第 16-23 章：元类、描述符、内存管理、设计模式、性能优化、异步、类型提示、C 扩展
3. 阅读 CPython 源码，理解解释器实现
4. 参与开源项目贡献
5. 学习一个主流 Web 框架（Django/Flask/FastAPI）和一个数据处理库（Pandas/NumPy）

---

> **提示**：本知识库练习题答案中，**v** 表示正确（对），**x** 表示错误（错）。

> 所有代码示例均可在 Python 3.8+ 环境中运行，部分特性需要 Python 3.10+。

> 建议配合实际编码练习，理论结合实践才能真正掌握。

