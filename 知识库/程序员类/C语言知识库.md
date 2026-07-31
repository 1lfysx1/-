# C语言知识库 — 从入门到精通

> 本文档涵盖C语言全部核心知识点，每个知识点配有代码示例、详细注释及配套练习题（选择题、判断题、代码填空题），适合系统学习与复习。

---

## 目录

1. [C语言概述与开发环境](#1-c语言概述与开发环境)
2. [基本数据类型与变量](#2-基本数据类型与变量)
3. [运算符与表达式](#3-运算符与表达式)
4. [输入与输出](#4-输入与输出)
5. [选择结构](#5-选择结构)
6. [循环结构](#6-循环结构)
7. [数组](#7-数组)
8. [字符串](#8-字符串)
9. [函数](#9-函数)
10. [指针基础](#10-指针基础)
11. [指针与数组、字符串](#11-指针与数组字符串)
12. [结构体与联合体](#12-结构体与联合体)
13. [动态内存管理](#13-动态内存管理)
14. [文件操作](#14-文件操作)
15. [预处理与宏](#15-预处理与宏)
16. [高级指针与复杂声明](#16-高级指针与复杂声明)
17. [位运算](#17-位运算)
18. [常见算法与数据结构](#18-常见算法与数据结构)

---

## 1. C语言概述与开发环境

### 1.1 知识点讲解

C语言由丹尼斯·里奇于1972年在贝尔实验室开发，是一种通用的、过程式的编程语言。C语言具有以下特点：
- **高效性**：接近底层硬件，执行效率高
- **可移植性**：标准C代码可在多种平台上编译运行
- **灵活性**：提供丰富的底层操作能力
- **广泛应用**：操作系统、嵌入式系统、驱动程序等

一个C程序的基本结构：

```c
// 预处理指令：包含标准输入输出头文件
#include <stdio.h>

// main函数是程序的入口点，每个C程序必须有且仅有一个main函数
// int 表示函数返回整数类型
int main(void) {
    // printf是标准库函数，用于向控制台输出字符串
    // \n 是转义字符，表示换行
    printf("Hello, World!\n");

    // return 0 表示程序正常结束
    // 返回值会被操作系统接收，0通常表示成功
    return 0;
}
```

### 1.2 练习题

#### 选择题

**1. C语言属于以下哪种类型的编程语言？**

A. 面向对象语言  
B. 过程式语言  
C. 函数式语言  
D. 脚本语言

**答案：B**

> **解析**：C语言是过程式（结构化）编程语言，不支持类和对象等面向对象特性（C++才支持）。它通过函数和过程来组织代码。

---

**2. C程序的入口函数是？**

A. start()  
B. begin()  
C. main()  
D. entry()

**答案：C**

> **解析**：C程序总是从 `main()` 函数开始执行，这是C语言标准规定的唯一程序入口。

---

**3. 以下关于 `#include <stdio.h>` 的说法正确的是？**

A. 定义了main函数  
B. 包含标准输入输出库的声明  
C. 是C语言的注释  
D. 用于连接数据库

**答案：B**

> **解析**：`#include` 是预处理指令，用于在编译前将指定头文件的内容插入到当前位置。`stdio.h` 包含了 `printf`、`scanf` 等函数的声明。

---

#### 判断题

**1. C语言程序中可以有多个main函数。**

**答案：错误**

> **解析**：一个C程序只能有且仅有一个 `main` 函数，否则编译器无法确定程序入口。

---

**2. `return 0;` 在main函数中表示程序正常结束。**

**答案：正确**

> **解析**：`return 0` 是向操作系统报告程序成功执行完毕的惯例。非零值通常表示发生了错误。

---

#### 代码填空题

**1. 补全以下程序，使其输出 "C Language"：**

```c
#include <_____>

int main(void) {
    printf("C Language\n");
    return _____;
}
```

**答案：**
- 第一空：`stdio.h`
- 第二空：`0`

> **解析**：使用 `printf` 需要包含 `stdio.h` 头文件；`main` 函数返回 `0` 表示正常结束。

---

## 2. 基本数据类型与变量

### 2.1 知识点讲解

C语言的基本数据类型包括：

| 类型 | 说明 | 典型大小 | 格式符 |
|------|------|----------|--------|
| `char` | 字符型 | 1字节 | `%c` |
| `short` | 短整型 | 2字节 | `%hd` |
| `int` | 整型 | 4字节 | `%d` |
| `long` | 长整型 | 4/8字节 | `%ld` |
| `long long` | 长长整型 | 8字节 | `%lld` |
| `float` | 单精度浮点 | 4字节 | `%f` |
| `double` | 双精度浮点 | 8字节 | `%lf` |

变量声明与初始化：

```c
#include <stdio.h>

int main(void) {
    // 变量声明：类型 + 变量名
    int age;           // 声明一个整型变量
    float price;       // 声明一个浮点型变量
    char grade;        // 声明一个字符型变量

    // 变量初始化：声明时赋值
    int count = 10;    // 初始化为10
    double pi = 3.14159;

    // 同时声明多个变量
    int a = 1, b = 2, c = 3;

    // 常量：值不可修改
    const int MAX = 100;  // const修饰的变量是只读的

    // 字面常量
    age = 25;         // 整数常量
    price = 19.99;    // 浮点常量
    grade = 'A';      // 字符常量（单引号）

    printf("age = %d, price = %.2f, grade = %c\n", age, price, grade);

    return 0;
}
```

**有符号与无符号：**

```c
unsigned int a = 4294967295;  // 无符号整型，只能表示非负数，范围更大
signed int b = -100;          // 有符号整型（默认），可正可负
```

**类型转换：**

```c
#include <stdio.h>

int main(void) {
    int a = 5, b = 2;

    // 隐式转换：整数相除，结果仍为整数
    float result1 = a / b;       // result1 = 2.0（先整数除法，再转换）

    // 显式转换（强制类型转换）
    float result2 = (float)a / b;  // result2 = 2.5（先转换a为float）

    printf("result1 = %f, result2 = %f\n", result1, result2);

    return 0;
}
```

### 2.2 练习题

#### 选择题

**1. 在32位系统中，`int` 类型通常占用多少字节？**

A. 1  
B. 2  
C. 4  
D. 8

**答案：C**

> **解析**：在大多数现代32位和64位系统中，`int` 类型占用4字节（32位），可表示范围约为 -21亿 到 +21亿。

---

**2. 以下哪个是合法的变量名？**

A. `2num`  
B. `_value`  
C. `float`  
D. `my-var`

**答案：B**

> **解析**：C语言变量名规则：必须以字母或下划线开头；不能是关键字（如float）；只能包含字母、数字和下划线。`_value` 符合所有规则。

---

**3. 执行 `int a = 5 / 2;` 后，`a` 的值是？**

A. 2.5  
B. 2  
C. 3  
D. 编译错误

**答案：B**

> **解析**：两个整数相除，C语言执行整数除法，小数部分直接截断（不是四舍五入）。所以 `5 / 2 = 2`。

---

**4. `const int MAX = 100;` 中，MAX的值？**

A. 可以在运行时修改  
B. 是编译时常量，不可修改  
C. 默认值为0  
D. 占用8字节

**答案：B**

> **解析**：`const` 修饰的变量是只读的，任何试图修改它的操作都会导致编译错误。它告诉编译器该变量的值不应被改变。

---

#### 判断题

**1. `char` 类型在C语言中占用1字节，可以存储一个ASCII字符。**

**答案：正确**

> **解析**：`char` 类型固定占用1字节（8位），足以存储标准ASCII字符集（0-127）。

---

**2. 变量声明时如果不初始化，它的默认值是0。**

**答案：错误**

> **解析**：局部变量如果不初始化，其值是未定义的（垃圾值）。全局变量和静态变量不初始化时默认值为0。

---

#### 代码填空题

**1. 补全代码，正确计算并输出圆的面积（半径为5）：**

```c
#include <stdio.h>

int main(void) {
    const double PI = 3.14159;
    int r = 5;
    double area = _____ * r * r;
    printf("面积 = %.2f\n", area);
    return 0;
}
```

**答案：** `PI`

> **解析**：圆面积公式为 pi*r^2，这里使用已定义的常量 `PI` 来计算。注意变量 `r` 是 `int` 类型，与 `double` 运算时会自动提升为 `double`。

---

**2. 补全代码，实现两个整数除法得到浮点结果：**

```c
#include <stdio.h>

int main(void) {
    int a = 7, b = 2;
    double result = (_____)a / b;
    printf("result = %f\n", result);
    return 0;
}
```

**答案：** `double`

> **解析**：需要将 `a` 强制转换为 `double` 类型，这样除法运算会按浮点数进行，结果为 `3.5`。如果直接 `a / b`，结果是整数 `3`。

---

## 3. 运算符与表达式

### 3.1 知识点讲解

C语言提供丰富的运算符：

```c
#include <stdio.h>

int main(void) {
    int a = 10, b = 3;

    // 算术运算符
    printf("a + b = %d\n", a + b);   // 13
    printf("a - b = %d\n", a - b);   // 7
    printf("a * b = %d\n", a * b);   // 30
    printf("a / b = %d\n", a / b);   // 3（整数除法）
    printf("a %% b = %d\n", a % b);  // 1（取模/求余）

    // 关系运算符：结果为 0（假）或 1（真）
    printf("a > b = %d\n", a > b);   // 1
    printf("a == b = %d\n", a == b); // 0

    // 逻辑运算符
    printf("a > 5 && b < 5 = %d\n", a > 5 && b < 5);  // 1（与）
    printf("a > 15 || b < 5 = %d\n", a > 15 || b < 5); // 1（或）
    printf("!a = %d\n", !a);  // 0（非，a非0即为真，取反为假）

    // 赋值运算符
    int c = 5;
    c += 3;  // 等价于 c = c + 3，c 变为 8
    c -= 2;  // 等价于 c = c - 2，c 变为 6
    c *= 4;  // 等价于 c = c * 4，c 变为 24
    c /= 3;  // 等价于 c = c / 3，c 变为 8
    c %= 5;  // 等价于 c = c % 5，c 变为 3

    // 自增自减运算符（重点！）
    int x = 5;
    printf("x++ = %d\n", x++);  // 先使用值，再自增：输出5，x变为6
    printf("++x = %d\n", ++x);  // 先自增，再使用值：x变为7，输出7

    // 三元运算符
    int max = (a > b) ? a : b;  // 如果a>b为真，max=a，否则max=b
    printf("max = %d\n", max);  // 10

    // sizeof 运算符：获取类型或变量占用的字节数
    printf("sizeof(int) = %zu\n", sizeof(int));
    printf("sizeof(double) = %zu\n", sizeof(double));

    return 0;
}
```

**运算符优先级（从高到低）：**
1. `()` 括号
2. `++` `--` `sizeof` 单目运算符
3. `*` `/` `%` 算术（乘除）
4. `+` `-` 算术（加减）
5. `<` `<=` `>` `>=` 关系
6. `==` `!=` 相等
7. `&&` 逻辑与
8. `||` 逻辑或
9. `?:` 三元
10. `=` `+=` 等赋值

### 3.2 练习题

#### 选择题

**1. 已知 `int a = 5;`，执行 `printf("%d", ++a + a++);` 的输出是？**

A. 11  
B. 12  
C. 13  
D. 未定义行为

**答案：D**

> **解析**：在同一个表达式中多次修改同一个变量（`++a` 和 `a++` 都修改 `a`），这是C语言中的**未定义行为(Undefined Behavior)**。不同编译器可能产生不同结果，切勿这样写代码。

---

**2. `10 % 3` 的结果是？**

A. 3  
B. 3.33  
C. 1  
D. 0

**答案：C**

> **解析**：`%` 是取模（求余）运算符。`10 / 3 = 3` 余 `1`，所以结果是 `1`。取模运算要求两边都是整数。

---

**3. 表达式 `5 > 3 > 1` 的值是？**

A. 1（真）  
B. 0（假）  
C. 编译错误  
D. 5

**答案：B**

> **解析**：关系运算符是左结合的。先计算 `5 > 3` 得 `1`（真），再计算 `1 > 1` 得 `0`（假）。要判断 `x` 是否在范围内应写 `5 > 3 && 3 > 1`。

---

**4. `sizeof(char)` 的值是？**

A. 1  
B. 2  
C. 4  
D. 取决于编译器

**答案：A**

> **解析**：C语言标准规定 `sizeof(char)` 恒等于1。其他类型的大小可能因平台而异，但 `char` 始终是1字节。

---

#### 判断题

**1. 在C语言中，非零值在逻辑判断中都被视为真。**

**答案：正确**

> **解析**：C语言没有布尔类型（C99之前有），逻辑判断中 `0` 表示假，任何非零值（包括负数）都表示真。

---

**2. `a = b = c = 5;` 是合法的赋值语句。**

**答案：正确**

> **解析**：赋值运算符是右结合的。先执行 `c = 5`，然后 `b = c`（即5），最后 `a = b`（即5）。三个变量最终都等于5。

---

#### 代码填空题

**1. 补全代码，使用三元运算符找出两个数中的较大值：**

```c
#include <stdio.h>

int main(void) {
    int a = 10, b = 20;
    int max = (a > b) ? _____ : _____;
    printf("max = %d\n", max);
    return 0;
}
```

**答案：** 第一空：`a`，第二空：`b`

> **解析**：三元运算符 `?:` 的语法是 `条件 ? 表达式1 : 表达式2`。条件为真时取表达式1的值，否则取表达式2的值。

---

**2. 补全代码，实现交换两个变量的值（不使用临时变量）：**

```c
#include <stdio.h>

int main(void) {
    int a = 5, b = 3;
    a = a + b;
    b = a - b;
    a = _____;
    printf("a = %d, b = %d\n", a, b);
    return 0;
}
```

**答案：** `a - b`

> **解析**：这是经典的加减法交换。第一步后 `a = 8`；第二步 `b = 8 - 3 = 5`（原a的值）；第三步 `a = 8 - 5 = 3`（原b的值）。注意：如果数值过大可能溢出，实际工程中更推荐使用临时变量或异或运算。

---

## 4. 输入与输出

### 4.1 知识点讲解

C语言标准I/O函数在 `stdio.h` 中声明：

```c
#include <stdio.h>

int main(void) {
    int age;
    float height;
    char name[50];

    // printf - 格式化输出
    printf("Hello\n");              // 输出字符串并换行
    printf("Value: %d\n", 100);     // %d 输出整数
    printf("Pi: %.2f\n", 3.14159); // %.2f 保留2位小数
    printf("Char: %c\n", 'A');      // %c 输出字符
    printf("Str: %s\n", "Hello");   // %s 输出字符串

    // scanf - 格式化输入
    printf("请输入年龄: ");
    scanf("%d", &age);      // & 是取地址运算符，scanf需要变量的地址

    printf("请输入身高: ");
    scanf("%f", &height);   // float用%f，注意要有&

    printf("请输入姓名: ");
    scanf("%s", name);      // 数组名本身就是地址，不需要&

    printf("%s 的年龄是 %d，身高是 %.2f\n", name, age, height);

    // getchar / putchar - 字符I/O
    printf("输入一个字符: ");
    char ch = getchar();    // 从标准输入读取一个字符
    putchar(ch);            // 输出一个字符
    putchar('\n');

    return 0;
}
```

**scanf 使用注意事项：**

```c
#include <stdio.h>

int main(void) {
    int a, b;
    char c;

    // 问题：输入数字后按回车，回车符会留在缓冲区
    printf("输入两个整数: ");
    scanf("%d %d", &a, &b);

    // 需要吸收缓冲区中的换行符
    while (getchar() != '\n');  // 清空缓冲区

    printf("输入一个字符: ");
    scanf("%c", &c);  // 如果不清理缓冲区，这里会读到换行符

    printf("a=%d, b=%d, c='%c'\n", a, b, c);

    return 0;
}
```

**常用格式说明符：**

| 格式符 | 说明 | 示例 |
|--------|------|------|
| `%d` | 有符号十进制整数 | `printf("%d", 100);` |
| `%u` | 无符号十进制整数 | `printf("%u", 100);` |
| `%f` | 浮点数 | `printf("%f", 3.14);` |
| `%e` | 科学计数法 | `printf("%e", 3.14);` |
| `%c` | 单个字符 | `printf("%c", 'A');` |
| `%s` | 字符串 | `printf("%s", "hello");` |
| `%p` | 指针地址 | `printf("%p", &a);` |
| `%x` | 十六进制 | `printf("%x", 255);` // ff |
| `%o` | 八进制 | `printf("%o", 8);` // 10 |
| `%ld` | long类型 | `printf("%ld", 100L);` |
| `%lld` | long long类型 | `printf("%lld", 100LL);` |
| `%%` | 输出%号 | `printf("%%");` |

### 4.2 练习题

#### 选择题

**1. `scanf("%d", &a);` 中 `&a` 的作用是？**

A. 对a取反  
B. 获取a的地址  
C. 对a求逻辑与  
D. 按位与运算

**答案：B**

> **解析**：`&` 在这里是取地址运算符。`scanf` 需要知道变量在内存中的位置才能将输入的数据存入该变量，因此必须传递地址。

---

**2. 以下代码的输出是？**
```c
printf("%5d\n", 42);
```

A. `42`  
B. `42   `  
C. `   42`  
D. 编译错误

**答案：C**

> **解析**：`%5d` 表示输出宽度为5的整数，默认右对齐，不足宽度用空格填充。所以 `42` 前面有3个空格。

---

**3. 使用 `scanf` 读取字符串时，以下说法正确的是？**

A. 必须写成 `scanf("%s", &str);`  
B. 数组名作为参数时不需要 `&`  
C. `scanf` 可以读取包含空格的字符串  
D. 字符串需要用双引号括起来输入

**答案：B**

> **解析**：数组名在表达式中会自动退化为指向首元素的指针，即数组名本身就代表地址，因此不需要再加 `&`。`scanf("%s")` 遇到空格会停止读取，不能读含空格的字符串；读取含空格的字符串应使用 `fgets`。

---

#### 判断题

**1. `printf("%f", 3);` 可以正确输出整数3。**

**答案：错误**

> **解析**：格式说明符与参数类型不匹配会导致未定义行为。`%f` 期望 `double` 类型参数，但传入 `int` 会导致输出错误的结果（可能是一个很小的数或垃圾值）。应使用 `%d` 输出整数。

---

**2. `scanf("%d,%d", &a, &b);` 要求输入时两个数字之间必须有逗号。**

**答案：正确**

> **解析**：`scanf` 的格式字符串中除了格式说明符以外的字符都需要在输入中精确匹配。这里格式中有逗号，所以输入必须是如 `3,5` 的形式，输入 `3 5` 会导致匹配失败。

---

#### 代码填空题

**1. 补全代码，实现输入一个浮点数并保留3位小数输出：**

```c
#include <stdio.h>

int main(void) {
    double x;
    printf("请输入一个数: ");
    scanf("%_____", &x);
    printf("结果为: %._____f\n", x);
    return 0;
}
```

**答案：** 第一空：`lf`，第二空：`3`

> **解析**：`double` 类型输入用 `%lf`（long float），输出用 `%f` 或 `%lf` 都可以。`%.3f` 表示保留3位小数输出。

---

**2. 补全代码，正确读取一行包含空格的字符串：**

```c
#include <stdio.h>

int main(void) {
    char str[100];
    printf("输入一句话: ");
    fgets(str, _____, _____);
    printf("你输入的是: %s", str);
    return 0;
}
```

**答案：** 第一空：`100`（或 `sizeof(str)`），第二空：`stdin`

> **解析**：`fgets(str, n, stream)` 从指定流读取最多 `n-1` 个字符到 `str` 中。`sizeof(str)` 获取数组大小，`stdin` 表示标准输入。`fgets` 会保留换行符，可以读取包含空格的字符串。

---

## 5. 选择结构

### 5.1 知识点讲解

C语言提供 `if` 和 `switch` 两种选择结构：

```c
#include <stdio.h>

int main(void) {
    int score = 85;

    // if-else 结构
    if (score >= 90) {
        printf("优秀\n");
    } else if (score >= 80) {
        printf("良好\n");
    } else if (score >= 60) {
        printf("及格\n");
    } else {
        printf("不及格\n");
    }

    // 嵌套if
    int age = 20;
    if (age >= 18) {
        if (age >= 60) {
            printf("老年人\n");
        } else {
            printf("成年人\n");
        }
    } else {
        printf("未成年人\n");
    }

    // switch 结构：适用于多分支等值判断
    int day = 3;
    switch (day) {
        case 1:
            printf("星期一\n");
            break;  // 必须有break，否则会继续执行下一个case（穿透）
        case 2:
            printf("星期二\n");
            break;
        case 3:
            printf("星期三\n");
            break;
        case 4:
            printf("星期四\n");
            break;
        case 5:
            printf("星期五\n");
            break;
        default:  // 默认分支，当没有case匹配时执行
            printf("周末\n");
            break;
    }

    // switch 穿透的巧用：多个case共享代码
    char grade = 'B';
    switch (grade) {
        case 'A':
        case 'B':
        case 'C':
            printf("通过\n");
            break;
        case 'D':
        case 'F':
            printf("未通过\n");
            break;
        default:
            printf("无效等级\n");
    }

    return 0;
}
```

### 5.2 练习题

#### 选择题

**1. 以下关于 `switch` 语句的说法，错误的是？**

A. `case` 后面必须是常量表达式  
B. `default` 分支可以省略  
C. `switch` 后面的表达式可以是浮点数  
D. 缺少 `break` 会导致case穿透

**答案：C**

> **解析**：`switch` 后面的表达式必须是整数类型（包括 `char`、`int`、`enum` 等），不能是 `float` 或 `double`。因为 `case` 标签需要在编译时确定，浮点数无法精确比较。

---

**2. 以下代码的输出是？**
```c
int a = 5, b = 3;
if (a > b)
    if (b > 4)
        printf("A");
    else
        printf("B");
```

A. A  
B. B  
C. 无输出  
D. 编译错误

**答案：B**

> **解析**：`else` 总是与最近的未匹配的 `if` 配对。这里 `else` 属于内层的 `if (b > 4)`。`a > b` 为真进入内层，但 `b > 4` 为假，执行 `else` 输出 "B"。

---

**3. 以下代码中 `x` 的最终值是？**
```c
int x = 5;
if (x = 0)  // 注意这里是赋值不是比较
    x = 10;
else
    x = 20;
```

A. 5  
B. 10  
C. 20  
D. 0

**答案：C**

> **解析**：`if (x = 0)` 是赋值而非比较！将0赋给x，表达式值为0（假），所以执行else分支，`x = 20`。这是一个常见bug，应将 `=` 改为 `==`。好的编译器会对此发出警告。

---

#### 判断题

**1. `if` 语句后面的条件表达式必须用括号括起来。**

**答案：正确**

> **解析**：C语言语法规定 `if` 后面必须紧跟括号包围的条件表达式，如 `if (a > b)`。括号不可省略。

---

**2. `switch` 语句中，`default` 分支必须放在最后。**

**答案：错误**

> **解析**：`default` 分支可以放在 `switch` 的任何位置（开头、中间或末尾）。但为了代码可读性，通常放在最后。

---

#### 代码填空题

**1. 补全代码，判断一个年份是否为闰年（闰年条件：能被4整除但不能被100整除，或者能被400整除）：**

```c
#include <stdio.h>

int main(void) {
    int year;
    printf("输入年份: ");
    scanf("%d", &year);

    if ((year % 4 == 0 && year % 100 != 0) || (_____)) {
        printf("%d是闰年\n", year);
    } else {
        printf("%d不是闰年\n", year);
    }
    return 0;
}
```

**答案：** `year % 400 == 0`

> **解析**：闰年的完整判断条件是：能被4整除且不能被100整除，**或者**能被400整除。两个条件满足其一即可。注意运算符优先级，`&&` 优先级高于 `||`，但这里用括号明确分组更清晰。

---

**2. 补全 `switch` 代码，实现简单的计算器：**

```c
#include <stdio.h>

int main(void) {
    char op;
    int a = 10, b = 3;
    printf("输入运算符(+,-,*,/): ");
    scanf("%c", &op);

    switch (op) {
        case '+':
            printf("%d + %d = %d\n", a, b, a + b);
            _____;
        case '-':
            printf("%d - %d = %d\n", a, b, a - b);
            break;
        case '*':
            printf("%d * %d = %d\n", a, b, a * b);
            break;
        case '/':
            printf("%d / %d = %d\n", a, b, a / b);
            break;
        _____:
            printf("无效运算符\n");
    }
    return 0;
}
```

**答案：** 第一空：`break`，第二空：`default`

> **解析**：每个 `case` 分支末尾通常需要 `break` 来防止穿透到下一个case。`default` 是当没有任何 `case` 匹配时执行的分支。注意第一个空缺少 `break` 会导致 `+` 分支执行后继续执行 `-` 分支。

---

## 6. 循环结构

### 6.1 知识点讲解

C语言提供三种循环结构：`for`、`while`、`do-while`。

```c
#include <stdio.h>

int main(void) {
    int i;

    // for循环：适用于已知循环次数的场景
    // 语法：for(初始化; 条件; 迭代)
    printf("for循环: ");
    for (i = 0; i < 5; i++) {
        printf("%d ", i);  // 输出 0 1 2 3 4
    }
    printf("\n");

    // while循环：适用于条件控制循环
    printf("while循环: ");
    i = 0;
    while (i < 5) {
        printf("%d ", i);
        i++;
    }
    printf("\n");

    // do-while循环：至少执行一次
    printf("do-while循环: ");
    i = 0;
    do {
        printf("%d ", i);
        i++;
    } while (i < 5);
    printf("\n");

    // 嵌套循环：打印乘法表
    printf("\n乘法表:\n");
    for (int row = 1; row <= 9; row++) {
        for (int col = 1; col <= row; col++) {
            printf("%d*%d=%-2d ", col, row, col * row);
        }
        printf("\n");
    }

    // break：立即跳出当前循环
    printf("\nbreak示例:\n");
    for (i = 0; i < 10; i++) {
        if (i == 5) {
            break;  // i等于5时跳出循环
        }
        printf("%d ", i);  // 输出 0 1 2 3 4
    }
    printf("\n");

    // continue：跳过当前迭代，继续下一次循环
    printf("continue示例:\n");
    for (i = 0; i < 10; i++) {
        if (i % 2 == 0) {
            continue;  // 跳过偶数
        }
        printf("%d ", i);  // 输出 1 3 5 7 9
    }
    printf("\n");

    return 0;
}
```

### 6.2 练习题

#### 选择题

**1. 以下哪种循环至少会执行一次循环体？**

A. `for`  
B. `while`  
C. `do-while`  
D. 以上都是

**答案：C**

> **解析**：`do-while` 是先执行循环体，再判断条件。即使条件一开始就不满足，循环体也已经执行了一次。而 `for` 和 `while` 都是先判断条件，条件不满足时一次都不执行。

---

**2. 以下代码的输出是？**
```c
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 1) break;
        printf("%d%d ", i, j);
    }
}
```

A. `00 01 02 10 11 12 20 21 22`  
B. `00 10 20`  
C. `00 01 10 11 20 21`  
D. `00 02 10 12 20 22`

**答案：B**

> **解析**：`break` 只跳出**当前所在**的循环（内层 `j` 循环）。当 `j == 1` 时，内层循环 `break`，所以每层外层循环只输出 `j=0` 的情况：`00`、`10`、`20`。

---

**3. 以下代码的输出是？**
```c
int i;
for (i = 0; i < 5; i++);
    printf("%d", i);
```

A. `01234`  
B. `5`  
C. `4`  
D. 编译错误

**答案：B**

> **解析**：`for` 循环后面有一个分号 `;`，表示循环体是**空语句**。循环执行完毕后 `i` 的值为5（因为 `i=4` 时条件为真执行循环体，然后 `i++` 变为5，条件为假退出）。然后执行 `printf` 输出5。这是一个常见的因多余分号导致的bug。

---

#### 判断题

**1. `continue` 语句会终止整个循环。**

**答案：错误**

> **解析**：`continue` 只跳过当前迭代的剩余部分，直接进入下一次循环判断。终止整个循环应该使用 `break` 或 `return`。

---

**2. `for(;;)` 是一个合法的C语句，表示无限循环。**

**答案：正确**

> **解析**：`for` 循环的三个表达式都是可选的。省略初始化、条件和迭代后，`for(;;)` 等价于 `while(1)`，构成无限循环。需要通过 `break`、`return` 或 `goto` 来退出。

---

#### 代码填空题

**1. 补全代码，计算1到100所有奇数的和：**

```c
#include <stdio.h>

int main(void) {
    int sum = 0;
    for (int i = 1; i <= 100; i++) {
        if (i % 2 == _____)
            continue;
        sum += i;
    }
    printf("奇数和 = %d\n", sum);
    return 0;
}
```

**答案：** `0`

> **解析**：`i % 2 == 0` 判断是否为偶数。如果是偶数就 `continue` 跳过，不加入总和。最终只累加奇数。1到100的奇数和为2500。

---

**2. 补全代码，实现判断一个正整数是否为素数：**

```c
#include <stdio.h>
#include <math.h>

int main(void) {
    int n, i;
    printf("输入一个正整数: ");
    scanf("%d", &n);

    int isPrime = 1;  // 假设是素数
    if (n <= 1) isPrime = 0;

    for (i = 2; i <= _____; i++) {
        if (n % i == 0) {
            isPrime = 0;
            _____;
        }
    }

    if (isPrime)
        printf("%d是素数\n", n);
    else
        printf("%d不是素数\n", n);
    return 0;
}
```

**答案：** 第一空：`sqrt(n)`（或 `n / 2` 或 `n - 1`），第二空：`break`

> **解析**：判断素数只需检查从2到 `sqrt(n)` 的整数。因为如果 `n` 有大于 `sqrt(n)` 的因子，那它必然也有对应的小于 `sqrt(n)` 的因子。找到因子后立即 `break` 提高效率。注意使用 `sqrt` 需要包含 `<math.h>`。

---

## 7. 数组

### 7.1 知识点讲解

数组是相同类型数据的连续存储集合：

```c
#include <stdio.h>

int main(void) {
    // 一维数组声明与初始化
    int arr1[5];              // 声明5个元素的整型数组，值未初始化
    int arr2[5] = {1, 2, 3, 4, 5};  // 完全初始化
    int arr3[] = {1, 2, 3};  // 省略大小，编译器自动计算为3
    int arr4[5] = {1, 2};     // 部分初始化，其余元素自动为0
    int arr5[5] = {0};        // 所有元素初始化为0的简便方法

    // 访问数组元素：下标从0开始
    printf("arr2[0] = %d\n", arr2[0]);  // 1
    printf("arr2[4] = %d\n", arr2[4]);  // 5

    // 遍历数组
    printf("arr2: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", arr2[i]);
    }
    printf("\n");

    // 数组越界（危险！C语言不检查越界）
    // printf("%d", arr2[10]);  // 越界访问！可能崩溃或读取垃圾值

    // 二维数组
    int matrix[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };

    // 遍历二维数组
    printf("矩阵:\n");
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            printf("%2d ", matrix[i][j]);
        }
        printf("\n");
    }

    // 数组大小计算
    int nums[] = {10, 20, 30, 40, 50};
    int n = sizeof(nums) / sizeof(nums[0]);  // 总字节数 / 单个元素字节数 = 元素个数
    printf("数组元素个数: %d\n", n);  // 5

    return 0;
}
```

**数组作为函数参数：**

```c
#include <stdio.h>

// 数组作为参数时，会退化为指针
// 因此必须同时传递数组大小
void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

// 或者这样声明（等价）
void printArray2(int *arr, int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);  // 指针也可以用下标访问
    }
    printf("\n");
}

int main(void) {
    int a[] = {1, 2, 3, 4, 5};
    printArray(a, 5);
    return 0;
}
```

### 7.2 练习题

#### 选择题

**1. 声明 `int a[10];`，以下哪个表达式可以正确访问最后一个元素？**

A. `a[10]`  
B. `a[9]`  
C. `a[0]`  
D. `a`

**答案：B**

> **解析**：C语言数组下标从0开始。10个元素的数组下标范围是0到9，最后一个元素是 `a[9]`。`a[10]` 是越界访问。

---

**2. 以下代码的输出是？**
```c
int a[5] = {1, 2};
printf("%d", a[3]);
```

A. 随机值  
B. 0  
C. 2  
D. 编译错误

**答案：B**

> **解析**：部分初始化数组时，未显式初始化的元素自动设为0。所以 `a[2]`、`a[3]`、`a[4]` 都是0。

---

**3. 数组名作为函数参数时，以下说法正确的是？**

A. 数组会完整复制到函数中  
B. 数组名退化为指向首元素的指针  
C. 可以在函数内用 `sizeof` 计算数组元素个数  
D. 函数内修改数组元素不会影响原数组

**答案：B**

> **解析**：数组作为参数传递时，实际上传递的是指向首元素的指针（地址），不是整个数组的副本。因此函数内修改会影响原数组，且 `sizeof(arr)` 得到的是指针大小而非数组大小。

---

#### 判断题

**1. C语言编译器会自动检查数组越界访问。**

**答案：错误**

> **解析**：C语言不进行数组越界检查，越界访问是未定义行为，可能导致程序崩溃、数据损坏或安全漏洞。程序员必须自行确保索引在有效范围内。

---

**2. `int arr[3][3] = {{1,2},{3,4}};` 是合法的初始化方式。**

**答案：正确**

> **解析**：二维数组可以部分初始化。未初始化的元素自动为0。这里 `arr[0][2]`、`arr[1][2]`、`arr[2][0~2]` 都为0。

---

#### 代码填空题

**1. 补全代码，实现数组逆序：**

```c
#include <stdio.h>

int main(void) {
    int arr[] = {1, 2, 3, 4, 5};
    int n = sizeof(arr) / sizeof(_____);

    for (int i = 0; i < n / 2; i++) {
        int temp = arr[i];
        arr[i] = arr[_____];
        arr[_____] = temp;
    }

    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    return 0;
}
```

**答案：** 第一空：`arr[0]`（或 `int`），第二空：`n - 1 - i`，第三空：`n - 1 - i`

> **解析**：`sizeof(arr) / sizeof(arr[0])` 是计算数组长度的惯用写法。逆序的核心是对称交换：`arr[i]` 和 `arr[n-1-i]` 交换。循环只需执行到中间位置 `n/2`。

---

**2. 补全代码，找出数组中的最大值：**

```c
#include <stdio.h>

int main(void) {
    int arr[] = {34, 12, 89, 5, 67, 23};
    int n = sizeof(arr) / sizeof(arr[0]);
    int max = _____;  // 初始化为第一个元素

    for (int i = 1; i < n; i++) {
        if (arr[i] _____ max) {
            max = arr[i];
        }
    }
    printf("最大值 = %d\n", max);
    return 0;
}
```

**答案：** 第一空：`arr[0]`，第二空：`>`

> **解析**：找最大值的标准算法：先假设第一个元素最大，然后遍历数组，遇到更大的就更新最大值。初始化为 `arr[0]` 确保即使数组全为负数也能正确工作。

---

## 8. 字符串

### 8.1 知识点讲解

C语言中字符串是以空字符 `\0` 结尾的字符数组：

```c
#include <stdio.h>
#include <string.h>  // 字符串处理函数头文件

int main(void) {
    // 字符串声明方式
    char str1[] = "Hello";       // 自动分配6字节（含'\0'）
    char str2[20] = "Hello";     // 分配20字节，前6个有效
    char str3[] = {'H', 'e', 'l', 'l', 'o', '\0'};  // 等价于上面

    // 字符串长度 vs 数组大小
    printf("str1内容: %s\n", str1);
    printf("字符串长度: %zu\n", strlen(str1));   // 5，不计'\0'
    printf("数组大小: %zu\n", sizeof(str1));    // 6，包含'\0'

    // 字符串复制
    char dest[20];
    strcpy(dest, str1);  // 将str1复制到dest（包括'\0'）
    printf("复制后: %s\n", dest);

    // 安全的复制（防止溢出）
    strncpy(dest, str1, sizeof(dest) - 1);
    dest[sizeof(dest) - 1] = '\0';  // 确保以'\0'结尾

    // 字符串连接
    char s1[50] = "Hello, ";
    char s2[] = "World!";
    strcat(s1, s2);  // 将s2连接到s1末尾
    printf("连接后: %s\n", s1);

    // 字符串比较
    printf("比较结果: %d\n", strcmp("abc", "def"));  // 负数（a < d）
    printf("比较结果: %d\n", strcmp("abc", "abc"));  // 0（相等）
    printf("比较结果: %d\n", strcmp("def", "abc"));  // 正数

    // 查找字符和子串
    char text[] = "Hello, World!";
    char *p = strchr(text, 'W');  // 查找字符'W'
    if (p != NULL) {
        printf("找到: %s\n", p);  // "World!"
    }

    char *sub = strstr(text, "World");  // 查找子串
    if (sub != NULL) {
        printf("找到子串: %s\n", sub);
    }

    // 字符串遍历
    printf("逐个字符: ");
    for (int i = 0; str1[i] != '\0'; i++) {
        printf("%c ", str1[i]);
    }
    printf("\n");

    return 0;
}
```

### 8.2 练习题

#### 选择题

**1. 声明 `char s[] = "abc";`，数组 `s` 占用的字节数是？**

A. 3  
B. 4  
C. 5  
D. 不确定

**答案：B**

> **解析**：字符串 `"abc"` 包含3个可见字符加上结尾的空字符 `\0`，共4个字节。`strlen(s)` 返回3，但 `sizeof(s)` 返回4。

---

**2. 以下哪个函数用于计算字符串长度（不包括 `\0`）？**

A. `sizeof()`  
B. `strlen()`  
C. `strcpy()`  
D. `strcmp()`

**答案：B**

> **解析**：`strlen()` 计算字符串长度，遇到 `\0` 停止，不计入 `\0`。`sizeof` 是运算符不是函数，它返回变量/类型占用的总字节数。`strcpy` 用于复制，`strcmp` 用于比较。

---

**3. 以下代码的输出是？**
```c
char s1[] = "abc";
char s2[] = "abc";
if (s1 == s2)
    printf("Equal");
else
    printf("Not Equal");
```

A. Equal  
B. Not Equal  
C. 编译错误  
D. 运行时错误

**答案：B**

> **解析**：`s1 == s2` 比较的是两个数组的**地址**，而不是字符串内容。两个数组在不同内存位置，地址必然不同。要比较字符串内容应使用 `strcmp(s1, s2) == 0`。

---

#### 判断题

**1. `strcpy(dest, src)` 会自动检查 `dest` 是否有足够的空间。**

**答案：错误**

> **解析**：`strcpy` 不会进行边界检查，如果 `src` 长度超过 `dest` 容量，会导致缓冲区溢出，这是严重的安全漏洞。应使用 `strncpy` 或确保目标缓冲区足够大。

---

**2. 空字符串 `""` 占用1字节内存。**

**答案：正确**

> **解析**：空字符串只包含结尾的 `\0`，所以占用1字节。`strlen("")` 返回0，但 `sizeof("")` 返回1。

---

#### 代码填空题

**1. 补全代码，不使用库函数计算字符串长度：**

```c
#include <stdio.h>

int main(void) {
    char str[] = "Hello, C!";
    int len = 0;

    while (str[_____] != '\0') {
        _____;
    }

    printf("长度 = %d\n", len);
    return 0;
}
```

**答案：** 第一空：`len`，第二空：`len++`

> **解析**：从索引0开始遍历字符串，遇到 `\0` 停止。每遍历一个有效字符，`len` 加1。循环结束时 `len` 就是字符串长度。

---

**2. 补全代码，实现字符串反转（不使用额外数组）：**

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char str[] = "abcdef";
    int len = strlen(str);

    for (int i = 0; i < len / 2; i++) {
        char temp = str[i];
        str[i] = str[_____];
        str[_____] = temp;
    }

    printf("反转后: %s\n", str);
    return 0;
}
```

**答案：** 第一空：`len - 1 - i`，第二空：`len - 1 - i`

> **解析**：与数组逆序原理相同。注意字符串反转必须确保字符数组可修改（不能用 `char *str = "abc"` 这样的字符串常量），所以这里用数组形式 `char str[] = "abcdef"`。

---

## 9. 函数

### 9.1 知识点讲解

函数是C程序的基本模块：

```c
#include <stdio.h>

// 函数声明（原型）：告诉编译器函数签名
int add(int a, int b);
void greet(void);

// 函数定义
int add(int a, int b) {
    // a和b是形参（形式参数），只在函数内部有效
    return a + b;  // return 返回结果并结束函数
}

void greet(void) {
    printf("Hello!\n");
    // void函数不需要return，也可以写 return;
}

// 值传递 vs 地址传递
void swap_wrong(int a, int b) {
    // 值传递：修改的是副本，不影响原变量
    int temp = a;
    a = b;
    b = temp;
}

void swap_correct(int *a, int *b) {
    // 地址传递：通过指针修改原变量
    int temp = *a;
    *a = *b;
    *b = temp;
}

// 递归函数：函数调用自身
int factorial(int n) {
    if (n <= 1) {
        return 1;  // 递归终止条件
    }
    return n * factorial(n - 1);  // 递归调用
}

// 静态局部变量
void counter(void) {
    static int count = 0;  // 只初始化一次，生命周期贯穿程序
    count++;
    printf("调用次数: %d\n", count);
}

int main(void) {
    int result = add(3, 5);  // 3和5是实参（实际参数）
    printf("3 + 5 = %d\n", result);

    greet();

    // 值传递示例
    int x = 3, y = 5;
    swap_wrong(x, y);
    printf("swap_wrong后: x=%d, y=%d\n", x, y);  // 未交换！

    // 地址传递示例
    swap_correct(&x, &y);
    printf("swap_correct后: x=%d, y=%d\n", x, y);  // 已交换！

    // 递归示例
    printf("5! = %d\n", factorial(5));  // 120

    // 静态变量示例
    counter();  // 1
    counter();  // 2
    counter();  // 3

    return 0;
}
```

**作用域与存储类型：**

```c
#include <stdio.h>

int global = 10;  // 全局变量：所有函数可访问，生命周期为整个程序

static int file_scope = 20;  // 静态全局变量：只在当前文件可见

void demo(void) {
    auto int local = 30;       // 自动变量（默认），函数结束时销毁
    static int static_local = 0;  // 静态局部变量，只初始化一次
    register int reg = 40;     // 建议存储在寄存器中（现代编译器优化自动处理）

    extern int global;  // 声明使用外部全局变量
}
```

### 9.2 练习题

#### 选择题

**1. 以下关于C语言函数的说法，正确的是？**

A. 函数必须先定义后使用  
B. 函数可以嵌套定义  
C. 函数可以没有返回值  
D. 函数必须至少有一个参数

**答案：C**

> **解析**：A错误，可以先声明后定义；B错误，C语言不支持函数嵌套定义（但支持嵌套调用）；C正确，`void` 函数没有返回值；D错误，函数可以没有参数（用 `void` 或空参数列表）。

---

**2. 以下代码的输出是？**
```c
void fun(int x) {
    x = 100;
}
int main(void) {
    int a = 10;
    fun(a);
    printf("%d", a);
}
```

A. 100  
B. 10  
C. 0  
D. 不确定

**答案：B**

> **解析**：C语言函数参数默认是**值传递**。`fun` 中修改的是 `x` 的副本，不影响 `main` 中的 `a`。`a` 仍然是10。

---

**3. `static` 修饰局部变量时，它的特性是？**

A. 作用域扩大到整个文件  
B. 只初始化一次，生命周期延长到程序结束  
C. 存储在栈上  
D. 可以被其他文件访问

**答案：B**

> **解析**：`static` 局部变量只在第一次进入函数时初始化，之后保持其值。它存储在数据段而非栈上，生命周期与程序相同，但作用域仍限于该函数内部。

---

#### 判断题

**1. 递归函数必须有终止条件，否则会导致栈溢出。**

**答案：正确**

> **解析**：递归函数如果没有终止条件或条件永远达不到，会无限递归调用，每次调用都会占用栈空间，最终导致栈溢出（Stack Overflow）程序崩溃。

---

**2. `return` 语句在一个函数中只能出现一次。**

**答案：错误**

> **解析**：一个函数中可以有多个 `return` 语句，通常用于不同分支提前返回。例如 `if (error) return -1;` 后函数末尾还有 `return 0;`。

---

#### 代码填空题

**1. 补全代码，实现求最大公约数（GCD）的函数：**

```c
#include <stdio.h>

int gcd(int a, int b) {
    while (b != _____) {
        int temp = b;
        b = a % b;
        a = _____;
    }
    return a;
}

int main(void) {
    printf("gcd(48, 18) = %d\n", gcd(48, 18));
    return 0;
}
```

**答案：** 第一空：`0`，第二空：`temp`

> **解析**：这是欧几里得算法（辗转相除法）。当 `b` 不为0时，用 `a % b` 的余数替换 `b`，原 `b` 替换 `a`。循环直到 `b` 为0，此时 `a` 就是最大公约数。`gcd(48, 18) = 6`。

---

**2. 补全代码，实现通过指针交换两个整数的函数：**

```c
#include <stdio.h>

void swap(int *a, int *b) {
    int temp = _____;
    _____ = *b;
    *b = temp;
}

int main(void) {
    int x = 5, y = 3;
    swap(_____, &y);
    printf("x=%d, y=%d\n", x, y);
    return 0;
}
```

**答案：** 第一空：`*a`，第二空：`*a`，第三空：`&x`

> **解析**：通过指针交换需要解引用操作。`temp = *a` 保存原值，`*a = *b` 将b的值赋给a指向的位置，`*b = temp` 完成交换。调用时传递地址 `&x` 和 `&y`。

---

## 10. 指针基础

### 10.1 知识点讲解

指针是C语言的灵魂，存储内存地址：

```c
#include <stdio.h>

int main(void) {
    int num = 100;

    // & 取地址运算符：获取变量的内存地址
    int *p = &num;  // p是指向int的指针，存储num的地址

    printf("num的值: %d\n", num);
    printf("num的地址: %p\n", (void*)&num);
    printf("p的值(即num的地址): %p\n", (void*)p);
    printf("p的地址: %p\n", (void*)&p);

    // * 解引用运算符：通过地址访问或修改值
    printf("*p = %d\n", *p);  // 100，通过指针访问num的值

    *p = 200;  // 通过指针修改num的值
    printf("修改后num = %d\n", num);  // 200

    // 指针的大小
    printf("指针大小: %zu字节\n", sizeof(p));  // 32位系统4字节，64位系统8字节

    // 空指针
    int *null_ptr = NULL;  // NULL是空指针常量，表示指针不指向任何有效地址
    if (null_ptr == NULL) {
        printf("这是空指针\n");
    }

    // 野指针（危险！）
    int *wild;  // 未初始化的指针，指向不确定的地址
    // *wild = 10;  // 绝对不要这样做！可能导致程序崩溃

    // 指针的指针
    int x = 10;
    int *px = &x;
    int **ppx = &px;  // ppx是指向指针的指针

    printf("x = %d\n", x);
    printf("*px = %d\n", *px);
    printf("**ppx = %d\n", **ppx);  // 两次解引用

    return 0;
}
```

### 10.2 练习题

#### 选择题

**1. 声明 `int *p;`，以下说法正确的是？**

A. `*p` 表示p的地址  
B. `p` 存储的是一个整数  
C. `&p` 获取指针变量p自身的地址  
D. `p` 可以直接存储整数10

**答案：C**

> **解析**：`p` 是指针变量，存储的是地址而非整数；`*p` 是解引用，访问p指向的地址中的值；`&p` 是取p变量本身的地址。要给p赋值应该 `p = &某个变量` 或动态分配内存。

---

**2. 以下代码的输出是？**
```c
int a = 5;
int *p = &a;
printf("%d", *p + 1);
```

A. 5  
B. 6  
C. a的地址加1  
D. 编译错误

**答案：B**

> **解析**：`*p` 解引用得到 `a` 的值5，然后 `5 + 1 = 6`。注意 `*p + 1` 和 `*(p + 1)` 完全不同：前者是值加1，后者是访问p后面一个int位置的值。

---

**3. `int **pp;` 声明的是什么？**

A. 一个二维数组  
B. 一个指向指针的指针  
C. 一个二级整数  
D. 语法错误

**答案：B**

> **解析**：`int **pp` 是指向指针的指针。`pp` 存储的是一个 `int*` 类型指针的地址，`*pp` 得到那个 `int*` 指针，`**pp` 才能最终访问到 `int` 值。

---

#### 判断题

**1. `NULL` 指针可以安全地解引用。**

**答案：错误**

> **解析**：对 `NULL` 指针解引用是未定义行为，会导致程序崩溃（段错误/Segmentation Fault）。使用指针前应该检查它是否为 `NULL`。

---

**2. 指针变量的大小与它所指向的数据类型无关。**

**答案：正确**

> **解析**：在同一平台上，所有指针变量的大小都相同（32位系统4字节，64位系统8字节），无论它指向 `char`、`int` 还是 `double`。指针存储的是地址，地址大小由系统决定。

---

#### 代码填空题

**1. 补全代码，通过指针修改变量的值：**

```c
#include <stdio.h>

int main(void) {
    int num = 10;
    int *p = _____;
    _____ = 20;
    printf("num = %d\n", num);
    return 0;
}
```

**答案：** 第一空：`&num`，第二空：`*p`

> **解析**：`p = &num` 让p指向num；`*p = 20` 通过解引用修改p指向位置的值，即修改num的值。最终num变为20。

---

**2. 补全代码，实现指针的指针访问：**

```c
#include <stdio.h>

int main(void) {
    int x = 100;
    int *p = &x;
    int **pp = _____;
    printf("x = %d\n", _____);  // 通过pp访问x的值
    return 0;
}
```

**答案：** 第一空：`&p`，第二空：`**pp`

> **解析**：`pp = &p` 让pp指向指针p；`**pp` 两次解引用：第一次得到p的值（即x的地址），第二次得到x的值100。

---

## 11. 指针与数组、字符串

### 11.1 知识点讲解

数组名本质上是指向首元素的常量指针：

```c
#include <stdio.h>

int main(void) {
    int arr[5] = {10, 20, 30, 40, 50};

    // 数组名与指针的关系
    printf("arr = %p\n", (void*)arr);       // 数组名即首元素地址
    printf("&arr[0] = %p\n", (void*)&arr[0]);  // 等价
    printf("*arr = %d\n", *arr);          // 10，解引用首元素

    // 指针算术：指针 +/- 整数
    int *p = arr;
    printf("p = %p, *p = %d\n", (void*)p, *p);     // 10
    printf("p+1 = %p, *(p+1) = %d\n", (void*)(p+1), *(p+1)); // 20
    printf("p+2 = %p, *(p+2) = %d\n", (void*)(p+2), *(p+2)); // 30

    // 指针算术按数据类型大小偏移
    // p+1 不是地址加1字节，而是加 sizeof(int) 字节

    // 用指针遍历数组
    printf("用指针遍历: ");
    for (int *q = arr; q < arr + 5; q++) {
        printf("%d ", *q);
    }
    printf("\n");

    // 下标与指针的等价关系
    printf("arr[2] = %d\n", arr[2]);      // 30
    printf("*(arr+2) = %d\n", *(arr+2));   // 30，等价
    printf("2[arr] = %d\n", 2[arr]);       // 30！也合法（不推荐）

    // 指针与字符串
    char *str = "Hello";  // str指向字符串常量（只读！）
    printf("%s\n", str);
    printf("str[0] = %c\n", str[0]);  // H
    printf("*(str+1) = %c\n", *(str+1));  // e

    // 指针数组
    char *names[] = {"Alice", "Bob", "Charlie"};
    printf("names[1] = %s\n", names[1]);  // Bob

    // 数组指针 vs 指针数组
    int (*pa)[5];   // pa是指向包含5个int的数组的指针（数组指针）
    int *ap[5];     // ap是包含5个int指针的数组（指针数组）

    return 0;
}
```

### 11.2 练习题

#### 选择题

**1. 已知 `int arr[5] = {1,2,3,4,5}; int *p = arr;`，`*(p+2)` 的值是？**

A. 1  
B. 2  
C. 3  
D. 编译错误

**答案：C**

> **解析**：`p` 指向 `arr[0]`，`p+2` 指向 `arr[2]`（偏移2个int大小），解引用得到 `arr[2]` 的值3。指针算术自动按元素大小偏移。

---

**2. `char *s = "hello"; s[0] = 'H';` 的执行结果是？**

A. 字符串变为 "Hello"  
B. 编译错误  
C. 运行时错误（段错误）  
D. 无变化

**答案：C**

> **解析**：`"hello"` 是字符串常量，存储在只读数据段。`s` 指向这个常量，试图修改它会导致段错误（Segmentation Fault）。要修改字符串应使用字符数组 `char s[] = "hello";`。

---

**3. 以下声明中，`int *ap[10];` 的含义是？**

A. 指向包含10个int的数组的指针  
B. 包含10个int指针的数组  
C. 指向int的指针  
D. 包含10个int的数组

**答案：B**

> **解析**：根据运算符优先级，`[]` 优先级高于 `*`，所以先与 `[10]` 结合，表示这是一个数组；然后 `int *` 表示数组元素的类型是指向int的指针。`int (*ap)[10]` 才是指向包含10个int的数组的指针（数组指针）。

---

#### 判断题

**1. 数组名是一个变量，可以被赋值。**

**答案：错误**

> **解析**：数组名是一个**常量指针**（地址常量），不能被赋值。例如 `arr = arr2` 是非法的。但数组元素可以被赋值，如 `arr[0] = 10`。

---

**2. `arr[i]` 和 `*(arr + i)` 完全等价。**

**答案：正确**

> **解析**：C语言标准规定 `arr[i]` 等价于 `*(arr + i)`。甚至 `i[arr]` 也合法（因为加法交换律），但后者可读性差，不推荐。

---

#### 代码填空题

**1. 补全代码，用指针遍历并输出数组：**

```c
#include <stdio.h>

int main(void) {
    int arr[] = {10, 20, 30, 40, 50};
    int n = sizeof(arr) / sizeof(arr[0]);
    int *p = _____;

    for (int i = 0; i < n; i++) {
        printf("%d ", _____);
        p++;
    }
    return 0;
}
```

**答案：** 第一空：`arr`，第二空：`*p`

> **解析**：`p = arr` 让p指向数组首元素。循环中 `*p` 访问当前指向的值，然后 `p++` 移动到下一个元素。也可以用 `*(arr + i)` 或 `arr[i]`。

---

**2. 补全代码，实现指针数组存储多个字符串并输出：**

```c
#include <stdio.h>

int main(void) {
    char *fruits[] = {"Apple", "Banana", "Cherry"};
    int n = sizeof(fruits) / sizeof(_____);

    for (int i = 0; i < n; i++) {
        printf("%s\n", _____);
    }
    return 0;
}
```

**答案：** 第一空：`fruits[0]`（或 `char*`），第二空：`fruits[i]`

> **解析**：`fruits` 是指针数组，每个元素是 `char*` 类型。`sizeof(fruits[0])` 得到指针大小。`fruits[i]` 得到第i个字符串的地址，用 `%s` 输出。

---

## 12. 结构体与联合体

### 12.1 知识点讲解

结构体用于组合不同类型的数据：

```c
#include <stdio.h>
#include <string.h>

// 定义结构体
struct Student {
    char name[50];
    int age;
    float score;
};

// typedef 简化类型名
typedef struct {
    int x;
    int y;
} Point;

// 嵌套结构体
struct Rectangle {
    Point topLeft;
    Point bottomRight;
};

int main(void) {
    // 声明结构体变量
    struct Student stu1;

    // 初始化
    struct Student stu2 = {"张三", 20, 89.5};

    // 访问成员：使用点运算符
    strcpy(stu1.name, "李四");
    stu1.age = 22;
    stu1.score = 92.0;

    printf("姓名: %s, 年龄: %d, 成绩: %.1f\n", 
           stu1.name, stu1.age, stu1.score);

    // 结构体指针：使用箭头运算符
    struct Student *p = &stu2;
    printf("通过指针: %s\n", p->name);  // 等价于 (*p).name

    // 结构体数组
    struct Student class[3] = {
        {"王五", 19, 85.0},
        {"赵六", 20, 90.5},
        {"孙七", 21, 88.0}
    };

    // 结构体大小（注意内存对齐）
    printf("sizeof(struct Student) = %zu\n", sizeof(struct Student));

    // 联合体：所有成员共享同一块内存
    union Data {
        int i;
        float f;
        char str[20];
    };

    union Data data;
    data.i = 10;
    printf("data.i = %d\n", data.i);
    data.f = 3.14;
    printf("data.f = %f\n", data.f);  // 此时data.i的值已被覆盖
    printf("联合体大小: %zu\n", sizeof(union Data));  // 取最大成员大小

    return 0;
}
```

### 12.2 练习题

#### 选择题

**1. 以下关于结构体的说法，正确的是？**

A. 结构体成员必须是相同类型  
B. 结构体大小等于各成员大小之和  
C. 结构体可以嵌套定义  
D. 结构体不能作为函数参数

**答案：C**

> **解析**：A错误，结构体成员可以是不同类型；B错误，由于内存对齐，结构体大小通常大于等于各成员大小之和；C正确，结构体可以嵌套；D错误，结构体可以作为函数参数（值传递会复制整个结构体）。

---

**2. 已知 `struct Student *p = &stu;`，访问成员name的正确方式是？**

A. `p.name`  
B. `p->name`  
C. `*p.name`  
D. `p[0].name`

**答案：B**

> **解析**：通过结构体指针访问成员应使用箭头运算符 `->`，即 `p->name`。`p.name` 用于结构体变量而非指针；`*p.name` 等价于 `*(p.name)` 是错误的；`p[0].name` 虽然等价但不够直观。

---

**3. 联合体（union）的特点是？**

A. 所有成员同时有效  
B. 所有成员共享同一块内存  
C. 联合体大小等于各成员大小之和  
D. 联合体不能包含数组

**答案：B**

> **解析**：联合体的所有成员共享同一块内存空间，同一时间只有一个成员有效。联合体的大小等于最大成员的大小（考虑对齐）。联合体可以包含数组。

---

#### 判断题

**1. `typedef` 用于创建新的数据类型。**

**答案：错误**

> **解析**：`typedef` 不是创建新类型，而是为**已有类型**创建别名。例如 `typedef int Integer;` 后，`Integer` 和 `int` 是完全相同的类型。

---

**2. 结构体变量之间可以直接赋值。**

**答案：正确**

> **解析**：C语言允许相同类型的结构体变量直接赋值，如 `stu2 = stu1`，这会复制结构体的所有成员。但结构体不能直接用 `==` 比较。

---

#### 代码填空题

**1. 补全代码，定义一个表示日期的结构体并初始化：**

```c
#include <stdio.h>

struct Date {
    int year;
    int month;
    int day;
};

int main(void) {
    struct Date today = {_____, _____, _____};
    printf("%d-%d-%d\n", today.year, today.month, today.day);
    return 0;
}
```

**答案：** 例如 `2026, 7, 25`（任意合法日期）

> **解析**：结构体初始化使用大括号按成员顺序赋值。也可以指定初始化如 `{.year=2026, .month=7, .day=25}`（C99标准）。

---

**2. 补全代码，通过结构体指针修改成员值：**

```c
#include <stdio.h>
#include <string.h>

struct Person {
    char name[50];
    int age;
};

int main(void) {
    struct Person p = {"Alice", 25};
    struct Person *ptr = _____;

    strcpy(ptr->_____, "Bob");
    ptr->_____ = 30;

    printf("%s, %d\n", p.name, p.age);
    return 0;
}
```

**答案：** 第一空：`&p`，第二空：`name`，第三空：`age`

> **解析**：`ptr = &p` 让ptr指向结构体p。通过 `ptr->name` 和 `ptr->age` 访问和修改成员。注意修改字符串需要用 `strcpy`，不能直接赋值。

---

## 13. 动态内存管理

### 13.1 知识点讲解

动态内存分配在运行时申请内存：

```c
#include <stdio.h>
#include <stdlib.h>  // malloc/free/calloc/realloc 的头文件

int main(void) {
    // malloc：分配指定字节数的内存，返回void*指针
    // 内存内容未初始化（垃圾值）
    int *arr = (int*)malloc(5 * sizeof(int));
    if (arr == NULL) {
        printf("内存分配失败！\n");
        return 1;
    }

    // 使用分配的内存
    for (int i = 0; i < 5; i++) {
        arr[i] = i * 10;  // 初始化
    }

    printf("malloc分配的数组: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");

    // calloc：分配内存并初始化为0
    int *arr2 = (int*)calloc(5, sizeof(int));  // 5个元素，每个sizeof(int)字节
    printf("calloc分配的数组（已清零）: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", arr2[i]);  // 全是0
    }
    printf("\n");

    // realloc：重新调整已分配内存的大小
    // 扩大内存
    arr = (int*)realloc(arr, 10 * sizeof(int));  // 扩大到10个元素
    if (arr != NULL) {
        printf("realloc后，新增元素: ");
        for (int i = 5; i < 10; i++) {
            arr[i] = i * 10;
        }
        for (int i = 0; i < 10; i++) {
            printf("%d ", arr[i]);
        }
        printf("\n");
    }

    // free：释放动态分配的内存
    free(arr);   // 释放arr指向的内存
    arr = NULL;  // 好习惯：释放后置空指针，防止野指针

    free(arr2);
    arr2 = NULL;

    // 常见错误：内存泄漏
    int *p = (int*)malloc(sizeof(int));
    p = (int*)malloc(sizeof(int));  // 错误！第一块内存丢失，无法释放
    free(p);

    // 常见错误：使用已释放的内存（悬垂指针）
    int *q = (int*)malloc(sizeof(int));
    *q = 100;
    free(q);
    // printf("%d", *q);  // 错误！q现在是悬垂指针

    // 常见错误：重复释放
    // free(p); free(p);  // 错误！double free

    return 0;
}
```

### 13.2 练习题

#### 选择题

**1. `malloc` 分配的内存位于哪个区域？**

A. 栈区  
B. 堆区  
C. 代码区  
D. 静态区

**答案：B**

> **解析**：`malloc`/`calloc`/`realloc` 从**堆区（Heap）**分配内存。局部变量在栈区，全局变量和静态变量在静态区，程序代码在代码区。

---

**2. `calloc(5, sizeof(int))` 与 `malloc(5 * sizeof(int))` 的区别是？**

A. calloc分配在栈上  
B. calloc会将内存初始化为0  
C. calloc不需要free  
D. calloc返回的指针类型不同

**答案：B**

> **解析**：`calloc` 和 `malloc` 都从堆分配内存，都需要 `free`。主要区别是 `calloc` 会将分配的内存全部初始化为0，而 `malloc` 不初始化（内容为垃圾值）。

---

**3. 以下代码的问题是？**
```c
int *p = (int*)malloc(sizeof(int));
free(p);
*p = 10;
```

A. 内存泄漏  
B. 使用已释放的内存（悬垂指针）  
C. 重复释放  
D. 没有错误

**答案：B**

> **解析**：`free(p)` 后，`p` 成为**悬垂指针（Dangling Pointer）**，指向的内存已归还系统。此时访问 `*p` 是未定义行为，可能导致程序崩溃或数据损坏。

---

#### 判断题

**1. `free(NULL)` 是安全的，不会导致错误。**

**答案：正确**

> **解析**：C标准规定 `free(NULL)` 是无操作（no-op），不会报错。这是一个安全特性，允许在不确定指针是否为空时安全调用 `free`。

---

**2. `realloc(NULL, size)` 等价于 `malloc(size)`。**

**答案：正确**

> **解析**：当 `realloc` 的第一个参数为 `NULL` 时，它的行为等同于 `malloc(size)`，分配一块新的内存。

---

#### 代码填空题

**1. 补全代码，动态分配数组并求和：**

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    printf("输入元素个数: ");
    scanf("%d", &n);

    int *arr = (int*)_____(n * sizeof(int));
    if (arr == _____) {
        printf("内存分配失败\n");
        return 1;
    }

    int sum = 0;
    for (int i = 0; i < n; i++) {
        arr[i] = i + 1;
        sum += arr[i];
    }
    printf("和 = %d\n", sum);

    _____(arr);
    return 0;
}
```

**答案：** 第一空：`malloc`，第二空：`NULL`，第三空：`free`

> **解析**：动态分配使用 `malloc`，分配失败返回 `NULL` 需要检查。使用完毕后必须用 `free` 释放内存，防止内存泄漏。

---

**2. 补全代码，使用realloc扩展动态数组：**

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *arr = (int*)malloc(3 * sizeof(int));
    arr[0] = 1; arr[1] = 2; arr[2] = 3;

    // 扩展到5个元素
    int *new_arr = (int*)realloc(arr, _____ * sizeof(int));
    if (new_arr != NULL) {
        arr = new_arr;
        arr[3] = 4;
        arr[4] = 5;
    }

    for (int i = 0; i < 5; i++)
        printf("%d ", arr[i]);

    _____(arr);
    return 0;
}
```

**答案：** 第一空：`5`，第二空：`free`

> **解析**：`realloc` 的第二个参数是新总大小（字节数），所以是 `5 * sizeof(int)`。扩展后原有数据保留。最后用 `free` 释放。注意：如果 `realloc` 失败，原指针仍然有效，所以用新指针接收返回值是安全的做法。

---

## 14. 文件操作

### 14.1 知识点讲解

C语言通过文件指针进行文件操作：

```c
#include <stdio.h>

int main(void) {
    // 打开文件
    // fopen(文件名, 模式)
    // 模式: "r"读 "w"写(覆盖) "a"追加 "r+"读写 "w+"读写(覆盖) "a+"读写(追加)
    // "rb" "wb" 等表示二进制模式
    FILE *fp = fopen("test.txt", "w");
    if (fp == NULL) {
        printf("打开文件失败！\n");
        return 1;
    }

    // 写入文件
    fprintf(fp, "Hello, File!\n");  // 格式化写入，类似printf
    fprintf(fp, "Number: %d\n", 42);

    fputs("This is a line\n", fp);  // 写入字符串

    fputc('A', fp);  // 写入单个字符
    fputc('\n', fp);

    fclose(fp);  // 关闭文件，刷新缓冲区

    // 读取文件
    fp = fopen("test.txt", "r");
    if (fp == NULL) {
        printf("打开文件失败！\n");
        return 1;
    }

    // 按行读取
    char buffer[100];
    printf("文件内容:\n");
    while (fgets(buffer, sizeof(buffer), fp) != NULL) {
        printf("%s", buffer);  // fgets会保留换行符
    }

    fclose(fp);

    // 二进制文件操作
    int data[5] = {10, 20, 30, 40, 50};
    fp = fopen("data.bin", "wb");
    fwrite(data, sizeof(int), 5, fp);  // 写入5个int
    fclose(fp);

    int readData[5];
    fp = fopen("data.bin", "rb");
    fread(readData, sizeof(int), 5, fp);  // 读取5个int
    fclose(fp);

    printf("读取的二进制数据: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", readData[i]);
    }
    printf("\n");

    // 文件定位
    fp = fopen("test.txt", "r");
    fseek(fp, 0, SEEK_END);  // 移动到文件末尾
    long size = ftell(fp);   // 获取当前位置（即文件大小）
    printf("文件大小: %ld字节\n", size);
    rewind(fp);  // 回到文件开头
    fclose(fp);

    return 0;
}
```

### 14.2 练习题

#### 选择题

**1. `fopen("data.txt", "a")` 中模式 `"a"` 的含义是？**

A. 只读  
B. 写入（覆盖）  
C. 追加写入  
D. 读写

**答案：C**

> **解析**：`"a"` 是 append（追加）模式。如果文件存在，新内容会追加到文件末尾；如果文件不存在则创建新文件。`"r"` 是只读，`"w"` 是写入（会清空原内容），`"r+"` 是读写。

---

**2. 以下哪个函数用于按行读取文件？**

A. `fscanf`  
B. `fgets`  
C. `fread`  
D. `fgetc`

**答案：B**

> **解析**：`fgets(buffer, size, fp)` 从文件中读取一行（最多 `size-1` 个字符），遇到换行符或文件结束停止。`fscanf` 格式化读取，`fread` 二进制读取，`fgetc` 读取单个字符。

---

**3. 以下代码的问题是？**
```c
FILE *fp = fopen("test.txt", "r");
fprintf(fp, "Hello");
```

A. 没有关闭文件  
B. 以只读模式打开却尝试写入  
C. 文件不存在  
D. 没有错误

**答案：B**

> **解析**：文件以 `"r"`（只读）模式打开，却使用 `fprintf` 尝试写入，这是非法操作，可能导致运行时错误或写入失败。要以写入模式打开应使用 `"w"`、`"a"` 或 `"r+"` 等。

---

#### 判断题

**1. `fclose` 关闭文件后会自动释放文件指针占用的内存。**

**答案：错误**

> **解析**：`fclose` 会关闭文件流、刷新缓冲区，但**不会**释放 `FILE*` 指针本身（指针是局部变量，函数结束时自动释放；如果是动态分配的则需要手动释放）。不过通常不需要关心 `FILE*` 指针的内存，因为它通常是在栈上声明的。

---

**2. 二进制模式下，`fread` 和 `fwrite` 可以读写结构体。**

**答案：正确**

> **解析**：`fread`/`fwrite` 按字节读写，适合处理二进制数据，包括结构体、数组等。但要注意结构体中的指针成员和不同平台的字节序/对齐差异。

---

#### 代码填空题

**1. 补全代码，将学生信息写入文件：**

```c
#include <stdio.h>

int main(void) {
    FILE *fp = fopen("students.txt", _____);
    if (fp == NULL) {
        printf("打开失败\n");
        return 1;
    }

    fprintf(fp, "%s %d %.1f\n", "张三", 20, 89.5);
    fprintf(fp, "%s %d %.1f\n", "李四", 21, 92.0);

    _____(fp);
    printf("写入完成\n");
    return 0;
}
```

**答案：** 第一空：`"w"`（或 `"a"`），第二空：`fclose`

> **解析**：写入文件用 `"w"` 模式（覆盖）或 `"a"` 模式（追加）。操作完成后必须用 `fclose` 关闭文件，确保数据写入磁盘。

---

**2. 补全代码，统计文件中的字符数：**

```c
#include <stdio.h>

int main(void) {
    FILE *fp = fopen("text.txt", "r");
    if (fp == NULL) return 1;

    int count = 0;
    int ch;
    while ((ch = _____) != _____) {
        count++;
    }

    printf("字符数: %d\n", count);
    fclose(fp);
    return 0;
}
```

**答案：** 第一空：`fgetc(fp)`，第二空：`EOF`

> **解析**：`fgetc(fp)` 逐个读取字符，`EOF`（通常为-1）表示文件结束。循环统计所有字符数。注意 `ch` 应声明为 `int` 而非 `char`，因为 `EOF` 可能超出 `char` 范围。

---

## 15. 预处理与宏

### 15.1 知识点讲解

预处理器在编译前处理源代码：

```c
#include <stdio.h>

// #define 定义宏
#define PI 3.14159              // 常量宏
#define MAX(a, b) ((a) > (b) ? (a) : (b))  // 带参数的宏（注意括号！）
#define SQUARE(x) ((x) * (x))   // 宏参数必须用括号包裹

// 多行宏（使用反斜杠续行）
#define PRINT_DEBUG(msg) do {     printf("[DEBUG] %s\n", msg); } while(0)

// 条件编译
#define DEBUG 1

#ifdef DEBUG
    #define LOG(x) printf("Log: %s\n", x)
#else
    #define LOG(x)
#endif

// #ifndef 防止头文件重复包含
#ifndef MY_HEADER_H
#define MY_HEADER_H
// 头文件内容...
#endif

// 预定义宏
void showMacros(void) {
    printf("当前文件: %s\n", __FILE__);      // 当前源文件名
    printf("当前行号: %d\n", __LINE__);      // 当前行号
    printf("编译日期: %s\n", __DATE__);      // 编译日期
    printf("编译时间: %s\n", __TIME__);      // 编译时间
    printf("C标准版本: %ld\n", __STDC_VERSION__);
}

// #pragma 指令
#pragma pack(push, 1)  // 设置1字节对齐
struct Packed {
    char c;
    int i;
};
#pragma pack(pop)  // 恢复默认对齐

int main(void) {
    printf("PI = %f\n", PI);
    printf("MAX(3, 5) = %d\n", MAX(3, 5));
    printf("SQUARE(5) = %d\n", SQUARE(5));
    printf("SQUARE(2+3) = %d\n", SQUARE(2+3));  // 如果宏没加括号，这里会出错

    LOG("程序启动");
    showMacros();

    return 0;
}
```

### 15.2 练习题

#### 选择题

**1. 以下宏定义中，哪个是正确的最大值宏？**

A. `#define MAX(a,b) a>b?a:b`  
B. `#define MAX(a,b) (a>b?a:b)`  
C. `#define MAX(a,b) ((a)>(b)?(a):(b))`  
D. `#define MAX(a,b) {a>b?a:b}`

**答案：C**

> **解析**：宏参数必须用括号包裹，防止运算符优先级问题。例如 `MAX(1+2, 3+4)` 如果没有括号会变成 `1+2>3+4?1+2:3+4`，由于 `>` 优先级高于 `+`，结果错误。整个表达式也要用括号包裹。

---

**2. `#ifdef` 和 `#ifndef` 的作用是？**

A. 定义变量  
B. 条件编译  
C. 定义函数  
D. 循环控制

**答案：B**

> **解析**：`#ifdef`（如果已定义）和 `#ifndef`（如果未定义）是条件编译指令，根据宏是否定义来决定是否编译某段代码。常用于调试代码开关和防止头文件重复包含。

---

**3. `__FILE__` 是？**

A. 用户定义的变量  
B. 预定义宏，表示当前文件名  
C. 标准库函数  
D. 编译器选项

**答案：B**

> **解析**：`__FILE__`、`__LINE__`、`__DATE__`、`__TIME__` 等是C语言预定义的宏，在预处理阶段被替换为相应的信息，用于调试和日志记录。

---

#### 判断题

**1. 宏在编译阶段进行替换。**

**答案：错误**

> **解析**：宏在**预处理阶段**进行文本替换，而不是编译阶段。预处理完成后，编译器看到的是已经替换后的代码。

---

**2. `const int MAX = 100;` 和 `#define MAX 100` 完全等价。**

**答案：错误**

> **解析**：两者有重要区别：`#define` 是文本替换，没有类型检查，不占用内存；`const` 定义的是有类型的只读变量，有作用域，占用内存，编译器可以进行类型检查。推荐优先使用 `const` 和 `enum`。

---

#### 代码填空题

**1. 补全代码，定义一个交换两个变量的宏：**

```c
#include <stdio.h>

#define SWAP(a, b) do {     typeof(a) _____ = a;     a = b;     b = _____; } while(0)

int main(void) {
    int x = 5, y = 3;
    SWAP(x, y);
    printf("x=%d, y=%d\n", x, y);
    return 0;
}
```

**答案：** 第一空：`temp`，第二空：`temp`

> **解析**：交换宏需要一个临时变量。`typeof(a)` 是GCC扩展，获取a的类型。`do { } while(0)` 是宏多语句的标准写法，确保宏在任何上下文中都能正确工作（如 `if` 后单条语句位置）。

---

**2. 补全代码，使用条件编译控制调试输出：**

```c
#include <stdio.h>

#define DEBUG

int main(void) {
    int x = 10;

    _____ DEBUG
        printf("Debug: x = %d\n", x);
    _____

    printf("x = %d\n", x);
    return 0;
}
```

**答案：** 第一空：`#ifdef`，第二空：`#endif`

> **解析**：`#ifdef DEBUG` 检查是否定义了 `DEBUG` 宏，如果定义了就编译中间的调试输出代码。`#endif` 结束条件编译块。取消 `#define DEBUG` 后调试代码就不会被编译。

---

## 16. 高级指针与复杂声明

### 16.1 知识点讲解

复杂声明的解析方法（从变量名开始，顺时针/螺旋法则）：

```c
#include <stdio.h>

int main(void) {
    // 函数指针：指向函数的指针
    int (*fp)(int, int);  // fp是指向函数的指针，函数接收两个int，返回int

    // 函数指针赋值与调用
    fp = &add;   // 或 fp = add;（函数名自动退化为指针）
    int result = fp(3, 5);  // 或 (*fp)(3, 5)
    printf("3+5=%d\n", result);

    // 函数指针数组
    int (*ops[])(int, int) = {add, subtract, multiply};
    printf("ops[0](3,5)=%d\n", ops[0](3, 5));  // 8
    printf("ops[1](3,5)=%d\n", ops[1](3, 5));  // -2

    // 回调函数
    void execute(int a, int b, int (*operation)(int, int)) {
        printf("结果: %d\n", operation(a, b));
    }
    execute(10, 5, add);

    // 复杂声明解析
    int *a[10];       // a是包含10个int指针的数组（指针数组）
    int (*b)[10];     // b是指向包含10个int的数组的指针（数组指针）
    int *(*c[10])(int);  // c是包含10个元素的数组，每个元素是
                          // 指向函数的指针，函数接收int返回int*

    // 函数返回指针
    char *strdup(const char *s);  // 返回char指针的函数

    // 指向指针的指针（常用于修改指针本身）
    void allocate(int **pp) {
        *pp = (int*)malloc(sizeof(int));
        **pp = 100;
    }

    int *p = NULL;
    allocate(&p);
    printf("*p = %d\n", *p);
    free(p);

    return 0;
}

int add(int a, int b) { return a + b; }
int subtract(int a, int b) { return a - b; }
int multiply(int a, int b) { return a * b; }
```

### 16.2 练习题

#### 选择题

**1. `int (*fp)(int, int);` 声明的是什么？**

A. 一个返回int指针的函数  
B. 一个指向函数的指针  
C. 一个包含int的数组  
D. 一个函数，参数是两个int指针

**答案：B**

> **解析**：括号改变了优先级。`(*fp)` 表示fp是一个指针，`(int, int)` 表示指向一个函数，最前面的 `int` 表示函数返回int。如果没有括号写成 `int *fp(int, int)`，那fp就是一个返回 `int*` 的函数。

---

**2. 以下哪个是函数指针数组的正确声明？**

A. `int *fp[3]();`  
B. `int (*fp[3])();`  
C. `int (*fp)[3]();`  
D. `int *fp()[3];`

**答案：B**

> **解析**：`fp[3]` 表示fp是包含3个元素的数组；`(*fp[3])` 表示数组元素是指针；`(*fp[3])()` 表示指针指向函数；最前面的 `int` 表示函数返回int。所以 `int (*fp[3])()` 是包含3个函数指针的数组。

---

**3. 以下代码中 `callback` 参数的类型是？**
```c
void process(int x, void (*callback)(int));
```

A. int  
B. 指向void的指针  
C. 指向函数的指针  
D. void

**答案：C**

> **解析**：`void (*callback)(int)` 表示 `callback` 是一个指向函数的指针，该函数接收一个 `int` 参数，返回 `void`。这是典型的回调函数声明方式。

---

#### 判断题

**1. 函数名在表达式中会退化为指向该函数的指针。**

**答案：正确**

> **解析**：与数组名类似，函数名在大多数表达式中会退化为指向该函数的指针。因此 `fp = add` 和 `fp = &add` 等价，`fp(3,5)` 和 `(*fp)(3,5)` 也等价。

---

**2. `int *a[10]` 和 `int (*a)[10]` 是相同的类型。**

**答案：错误**

> **解析**：两者完全不同。`int *a[10]` 是指针数组（10个int指针）；`int (*a)[10]` 是数组指针（指向包含10个int的数组）。优先级不同导致含义截然不同。

---

#### 代码填空题

**1. 补全代码，使用函数指针实现简单的计算器：**

```c
#include <stdio.h>

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

int main(void) {
    int (*op)(int, int);  // 声明函数指针

    op = _____;  // 指向add函数
    printf("3+5=%d\n", op(3, 5));

    op = _____;  // 指向sub函数
    printf("5-3=%d\n", op(5, 3));
    return 0;
}
```

**答案：** 第一空：`add`（或 `&add`），第二空：`sub`（或 `&sub`）

> **解析**：函数名自动退化为函数指针，所以可以直接赋值。调用时 `op(3,5)` 等价于 `(*op)(3,5)`。函数指针允许在运行时动态选择要执行的函数。

---

**2. 补全代码，实现通过二级指针分配内存：**

```c
#include <stdio.h>
#include <stdlib.h>

void createArray(int **arr, int n) {
    *arr = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        (*arr)[i] = i + 1;
    }
}

int main(void) {
    int *nums = NULL;
    createArray(_____, 5);

    for (int i = 0; i < 5; i++)
        printf("%d ", nums[i]);

    free(nums);
    return 0;
}
```

**答案：** `&nums`

> **解析**：`createArray` 需要修改 `nums` 指针本身的值（让它指向新分配的内存），所以必须传递 `nums` 的地址 `&nums`。在函数内部 `*arr` 就是 `nums`，通过解引用修改它。

---

## 17. 位运算

### 17.1 知识点讲解

位运算直接操作二进制位：

```c
#include <stdio.h>

int main(void) {
    unsigned int a = 0b1010;  // 10（二进制表示，C23标准）
    unsigned int b = 0b1100;  // 12

    // 按位与 &：两位都为1时结果为1
    printf("a & b = %u\n", a & b);  // 0b1000 = 8

    // 按位或 |：有一位为1时结果为1
    printf("a | b = %u\n", a | b);  // 0b1110 = 14

    // 按位异或 ^：两位不同时结果为1
    printf("a ^ b = %u\n", a ^ b);  // 0b0110 = 6

    // 按位取反 ~：0变1，1变0
    printf("~a = %u\n", (unsigned)~a);  // 所有位取反

    // 左移 <<：所有位向左移动，右侧补0
    printf("a << 1 = %u\n", a << 1);  // 0b10100 = 20
    printf("a << 2 = %u\n", a << 2);  // 0b101000 = 40

    // 右移 >>：所有位向右移动
    printf("a >> 1 = %u\n", a >> 1);  // 0b0101 = 5
    printf("a >> 2 = %u\n", a >> 2);  // 0b0010 = 2

    // 实际应用：设置某一位
    unsigned int flags = 0;
    flags |= (1 << 3);  // 设置第3位为1
    printf("设置第3位: %u\n", flags);  // 8

    // 清除某一位
    flags &= ~(1 << 3);  // 清除第3位
    printf("清除第3位: %u\n", flags);  // 0

    // 切换某一位
    flags ^= (1 << 2);  // 切换第2位
    printf("切换第2位: %u\n", flags);  // 4

    // 检查某一位
    if (flags & (1 << 2)) {
        printf("第2位是1\n");
    }

    // 不借助临时变量交换两个数
    int x = 5, y = 3;
    x = x ^ y;
    y = x ^ y;  // y = (x^y)^y = x
    x = x ^ y;  // x = (x^y)^x = y
    printf("交换后: x=%d, y=%d\n", x, y);

    // 判断奇偶
    int num = 7;
    if (num & 1) {
        printf("%d是奇数\n", num);
    } else {
        printf("%d是偶数\n", num);
    }

    // 获取最低位的1
    int lowbit = num & (-num);
    printf("最低位的1: %d\n", lowbit);  // 1

    return 0;
}
```

### 17.2 练习题

#### 选择题

**1. `5 & 3` 的结果是？**

A. 8  
B. 7  
C. 1  
D. 2

**答案：C**

> **解析**：`5 = 0b101`，`3 = 0b011`。按位与：`101 & 011 = 001 = 1`。

---

**2. `8 >> 2` 的结果是？**

A. 32  
B. 4  
C. 2  
D. 16

**答案：C**

> **解析**：`8 = 0b1000`，右移2位：`0b0010 = 2`。右移n位等价于除以2^n（对于无符号数）。

---

**3. 以下哪个表达式可以判断整数n的第k位是否为1？**

A. `n & k`  
B. `n & (1 << k)`  
C. `n | (1 << k)`  
D. `n ^ (1 << k)`

**答案：B**

> **解析**：`1 << k` 生成只有第k位为1的掩码。`n & (1 << k)` 如果结果非0，说明n的第k位是1。注意位编号通常从0开始。

---

#### 判断题

**1. 左移运算 `a << n` 总是等价于 `a * 2^n`。**

**答案：错误**

> **解析**：对于无溢出情况且为正数时成立。但如果左移导致溢出（超出类型范围），结果是未定义的（有符号数）或被截断的（无符号数）。此外，有符号负数的左移行为是未定义的。

---

**2. `a ^ a` 的结果总是0。**

**答案：正确**

> **解析**：相同位异或结果为0，所以任何数与自身异或结果都是0。这是异或运算的基本性质之一，也是用异或交换两个数算法的理论基础。

---

#### 代码填空题

**1. 补全代码，使用位运算判断一个数是否是2的幂：**

```c
#include <stdio.h>

int isPowerOfTwo(int n) {
    return n > 0 && (_____) == 0;
}

int main(void) {
    printf("8是2的幂: %d\n", isPowerOfTwo(8));   // 1
    printf("6是2的幂: %d\n", isPowerOfTwo(6));   // 0
    return 0;
}
```

**答案：** `n & (n - 1)`

> **解析**：2的幂的二进制只有一位是1（如 `8 = 0b1000`）。`n - 1` 会将最低位的1变为0，其后的0全变为1（如 `7 = 0b0111`）。所以 `n & (n-1)` 对于2的幂结果为0。同时要 `n > 0` 排除0和负数。

---

**2. 补全代码，使用位运算统计一个整数中1的个数：**

```c
#include <stdio.h>

int countBits(int n) {
    int count = 0;
    while (n) {
        count++;
        n = n & (_____);
    }
    return count;
}

int main(void) {
    printf("0b1011中1的个数: %d\n", countBits(0b1011));  // 3
    return 0;
}
```

**答案：** `n - 1`

> **解析**：`n & (n - 1)` 的效果是清除最低位的1。每次循环清除一个1，计数器加1，直到n变为0。这是统计1个数的高效算法（Brian Kernighan算法），时间复杂度为O(k)，k为1的个数。

---

## 18. 常见算法与数据结构

### 18.1 知识点讲解

#### 冒泡排序

```c
#include <stdio.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                // 交换
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}
```

#### 快速排序

```c
#include <stdio.h>

void quickSort(int arr[], int low, int high) {
    if (low >= high) return;

    int pivot = arr[low];  // 选择第一个元素为基准
    int i = low, j = high;

    while (i < j) {
        while (i < j && arr[j] >= pivot) j--;
        while (i < j && arr[i] <= pivot) i++;
        if (i < j) {
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    arr[low] = arr[i];
    arr[i] = pivot;

    quickSort(arr, low, i - 1);
    quickSort(arr, i + 1, high);
}
```

#### 二分查找

```c
#include <stdio.h>

int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;  // 防止溢出

        if (arr[mid] == target) {
            return mid;  // 找到
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;  // 未找到
}
```

#### 链表（单向链表）

```c
#include <stdio.h>
#include <stdlib.h>

// 链表节点定义
typedef struct Node {
    int data;
    struct Node *next;
} Node;

// 创建新节点
Node* createNode(int data) {
    Node *newNode = (Node*)malloc(sizeof(Node));
    if (newNode == NULL) return NULL;
    newNode->data = data;
    newNode->next = NULL;
    return newNode;
}

// 头插法
void insertHead(Node **head, int data) {
    Node *newNode = createNode(data);
    newNode->next = *head;
    *head = newNode;
}

// 尾插法
void insertTail(Node **head, int data) {
    Node *newNode = createNode(data);
    if (*head == NULL) {
        *head = newNode;
        return;
    }
    Node *p = *head;
    while (p->next != NULL) {
        p = p->next;
    }
    p->next = newNode;
}

// 删除节点
void deleteNode(Node **head, int data) {
    if (*head == NULL) return;

    Node *temp = *head;
    if (temp->data == data) {
        *head = temp->next;
        free(temp);
        return;
    }

    while (temp->next != NULL && temp->next->data != data) {
        temp = temp->next;
    }

    if (temp->next != NULL) {
        Node *toDelete = temp->next;
        temp->next = toDelete->next;
        free(toDelete);
    }
}

// 打印链表
void printList(Node *head) {
    while (head != NULL) {
        printf("%d -> ", head->data);
        head = head->next;
    }
    printf("NULL\n");
}

// 释放链表
void freeList(Node *head) {
    while (head != NULL) {
        Node *temp = head;
        head = head->next;
        free(temp);
    }
}
```

#### 栈（数组实现）

```c
#include <stdio.h>
#include <stdbool.h>

#define MAX_SIZE 100

typedef struct {
    int data[MAX_SIZE];
    int top;
} Stack;

void initStack(Stack *s) {
    s->top = -1;
}

bool isEmpty(Stack *s) {
    return s->top == -1;
}

bool isFull(Stack *s) {
    return s->top == MAX_SIZE - 1;
}

bool push(Stack *s, int val) {
    if (isFull(s)) return false;
    s->data[++s->top] = val;
    return true;
}

bool pop(Stack *s, int *val) {
    if (isEmpty(s)) return false;
    *val = s->data[s->top--];
    return true;
}

int peek(Stack *s) {
    if (isEmpty(s)) return -1;
    return s->data[s->top];
}
```

### 18.2 练习题

#### 选择题

**1. 冒泡排序的时间复杂度是？**

A. O(n)  
B. O(n log n)  
C. O(n^2)  
D. O(2^n)

**答案：C**

> **解析**：冒泡排序有两层嵌套循环，最坏和平均情况都需要约 n*(n-1)/2 次比较，时间复杂度为 O(n^2)。空间复杂度为 O(1)。

---

**2. 二分查找的前提条件是？**

A. 数组元素个数必须为偶数  
B. 数组必须是有序的  
C. 数组中不能有重复元素  
D. 数组必须是动态分配的

**答案：B**

> **解析**：二分查找要求数组**有序**（升序或降序）。每次比较中间元素，排除一半元素，时间复杂度为 O(log n)。数组长度、重复元素和分配方式都不影响。

---

**3. 链表中插入节点（头插法）的时间复杂度是？**

A. O(n)  
B. O(log n)  
C. O(1)  
D. O(n^2)

**答案：C**

> **解析**：头插法只需要修改头指针和新节点的next指针，不需要遍历链表，时间复杂度为 O(1)。尾插法需要遍历到末尾，时间复杂度为 O(n)。

---

#### 判断题

**1. 快速排序的平均时间复杂度是 O(n log n)。**

**答案：正确**

> **解析**：快速排序在平均情况下时间复杂度为 O(n log n)，是效率最高的通用排序算法之一。但最坏情况（数组已有序且总是选第一个为基准）时间复杂度退化为 O(n^2)。

---

**2. 栈的特点是先进先出（FIFO）。**

**答案：错误**

> **解析**：栈的特点是**后进先出（LIFO, Last In First Out）**。先进先出（FIFO）是队列（Queue）的特点。栈只能在一端（栈顶）进行插入和删除操作。

---

#### 代码填空题

**1. 补全代码，实现选择排序：**

```c
#include <stdio.h>

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] _____ arr[minIdx]) {
                minIdx = j;
            }
        }
        // 交换arr[i]和arr[minIdx]
        int temp = arr[i];
        arr[i] = arr[_____];
        arr[_____] = temp;
    }
}

int main(void) {
    int arr[] = {64, 25, 12, 22, 11};
    int n = sizeof(arr) / sizeof(arr[0]);
    selectionSort(arr, n);
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    return 0;
}
```

**答案：** 第一空：`<`，第二空：`minIdx`，第三空：`minIdx`

> **解析**：选择排序每轮找到未排序部分的最小值。`arr[j] < arr[minIdx]` 更新最小值索引。找到后交换 `arr[i]` 和 `arr[minIdx]`，将最小值放到已排序部分的末尾。

---

**2. 补全代码，实现链表的反转：**

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node* reverseList(Node *head) {
    Node *prev = NULL;
    Node *curr = head;
    Node *next = NULL;

    while (curr != NULL) {
        next = curr->next;  // 保存下一个节点
        curr->next = _____;  // 反转指向
        prev = curr;         // prev前移
        curr = _____;        // curr前移
    }
    return prev;  // 新的头节点
}
```

**答案：** 第一空：`prev`，第二空：`next`

> **解析**：链表反转使用三个指针。`curr->next = prev` 将当前节点指向前一个节点；`curr = next` 将curr移动到下一个待处理节点。最终 `prev` 指向原链表的最后一个节点，成为新头节点。

---

## 附录：学习路线图

| 阶段 | 知识点 | 建议时间 |
|------|--------|----------|
| 入门 | 数据类型、变量、运算符、输入输出 | 1-2周 |
| 基础 | 选择结构、循环结构、数组、字符串 | 2-3周 |
| 进阶 | 函数、指针基础 | 2-3周 |
| 提高 | 指针与数组、结构体、动态内存 | 2-3周 |
| 深入 | 文件操作、预处理、高级指针 | 2周 |
| 精通 | 位运算、算法与数据结构、项目实战 | 持续 |

---

> **提示**：本文档共18个章节，涵盖C语言从入门到精通的完整知识体系。建议按顺序学习，每个知识点配合练习题巩固理解。编程能力的提升关键在于多写代码、多调试、多思考。

---

*本文档由 AI 辅助生成，内容经专业审核，适合作为C语言系统学习的参考资料。*
