# Java 从入门到精通知识库

> 本知识库涵盖 Java 从基础到进阶的核心知识点，每个模块均包含：**概念讲解**、**精讲代码（含详细注释）**、**配套习题（选择/判断/代码填空）**及**答案解析**。

---

## 目录

- [第一章 Java 基础语法](#第一章-java-基础语法)
- [第二章 面向对象编程](#第二章-面向对象编程)
- [第三章 常用类与异常处理](#第三章-常用类与异常处理)
- [第四章 集合框架](#第四章-集合框架)
- [第五章 IO 流与 NIO](#第五章-io-流与-nio)
- [第六章 多线程与并发](#第六章-多线程与并发)
- [第七章 反射、注解与泛型](#第七章-反射注解与泛型)
- [第八章 Java 8+ 新特性](#第八章-java-8-新特性)
- [第九章 JVM 基础与调优入门](#第九章-jvm-基础与调优入门)

---

## 第一章 Java 基础语法

### 1.1 Java 程序结构与 main 方法

#### 知识点讲解

Java 是纯粹的面向对象语言，**所有代码必须写在类中**。`main` 方法是 JVM 约定的程序入口，签名必须严格为：
```java
public static void main(String[] args)
```

- `public`：访问权限，JVM 需要从外部调用
- `static`：无需创建对象即可调用
- `void`：不返回任何值给 JVM
- `String[] args`：接收命令行参数

#### 精讲代码

```java
/**
 * 文件名必须与 public 类名完全一致（包括大小写）
 * 一个 .java 文件只能有一个 public 类
 */
public class HelloWorld {

    // 类变量（静态变量）：属于类，所有实例共享
    static String version = "1.0";

    // 实例变量：属于对象，每个实例独立一份
    String message = "Hello";

    /**
     * 程序入口方法
     * JVM 启动时，先加载类，然后直接调用此方法，不经过构造器
     */
    public static void main(String[] args) {
        // 局部变量：只在 main 方法内有效
        String name = "Java";

        // 访问静态变量：直接通过类名（推荐）或实例
        System.out.println("Version: " + HelloWorld.version);

        // 访问实例变量：必须先创建对象
        HelloWorld hw = new HelloWorld();
        System.out.println(hw.message + " " + name);

        // 遍历命令行参数
        for (int i = 0; i < args.length; i++) {
            System.out.println("参数 " + i + ": " + args[i]);
        }
    }
}
```

#### 习题

**一、选择题**

1. 以下哪个是 Java 程序的正确入口方法？
   - A. `public void main(String[] args)`
   - B. `public static void main(String args)`
   - C. `public static void main(String[] args)`
   - D. `static public void main(String[] args)`

2. 关于 `main` 方法的 `static` 修饰符，下列说法正确的是？
   - A. 只是为了规范，可以去掉
   - B. JVM 调用时还未创建对象，必须通过类名直接调用
   - C. 表示该方法不能被重写
   - D. 表示该方法线程安全

3. 一个 `.java` 源文件中，最多可以有几个 `public` 类？
   - A. 0 个
   - B. 1 个
   - C. 不限数量
   - D. 与文件名有关，文件名中有几个 public 就几个

**二、判断题**

1. `main` 方法中的 `args` 数组如果未传参数，其值为 `null`。（ ）
2. 类中的实例变量在对象创建时会有默认值（如 int 默认为 0），而局部变量没有默认值。（ ）
3. `static` 方法中可以直接访问非 `static` 的实例变量。（ ）

**三、代码填空题**

1. 补全代码，使其能正确输出实例变量 `count` 的值：
```java
public class Counter {
    int count = 10;
    public static void main(String[] args) {
        // 请补全此行
        System.out.println(__________.count);
    }
}
```

#### 答案与解析

**选择题**
1. **C**。`public static void main(String[] args)` 是标准签名。D 虽然语法允许（修饰符顺序无关），但不是规范写法。
2. **B**。JVM 加载类后直接调用，此时堆中还没有该类的实例对象。
3. **B**。一个 `.java` 文件只能有一个 `public` 类，且文件名必须与该类名一致。

**判断题**
1. **×**。未传参数时 `args` 是长度为 0 的数组，不是 `null`。
2. **√**。实例变量有默认值，局部变量必须显式初始化才能使用。
3. **×**。`static` 方法属于类，没有隐式的 `this` 引用，无法直接访问实例变量。

**代码填空题**
1. `new Counter()`。必须通过 `new` 关键字创建实例，才能访问实例变量。

---

### 1.2 数据类型与变量

#### 知识点讲解

Java 数据类型分为两大类：
- **基本类型**（8 种）：`byte`(1), `short`(2), `int`(4), `long`(8), `float`(4), `double`(8), `char`(2), `boolean`(1 bit/1 byte，视 JVM 实现)
- **引用类型**：类、接口、数组、枚举、注解

**类型转换规则**：
- 自动转换（隐式）：小范围 → 大范围，如 `int` → `long`
- 强制转换（显式）：大范围 → 小范围，可能丢失精度
- `byte/short/char` 参与运算时自动提升为 `int`

#### 精讲代码

```java
public class DataTypeDemo {
    public static void main(String[] args) {
        // 整数字面量默认为 int，赋值给 long 需加 L/l（推荐大写 L）
        long bigNum = 10000000000L;

        // 浮点数字面量默认为 double，赋值给 float 需加 F/f
        float pi = 3.14F;

        // 自动类型转换：int → long → float → double
        int i = 100;
        long l = i;      // 自动转换，安全
        double d = l;    // 自动转换，安全

        // 强制类型转换：double → int，小数部分直接截断（非四舍五入）
        double price = 19.99;
        int intPrice = (int) price;  // 结果为 19

        // byte/short/char 运算时自动提升为 int
        byte b1 = 10;
        byte b2 = 20;
        // byte b3 = b1 + b2;  // 编译错误！b1+b2 结果是 int
        byte b3 = (byte) (b1 + b2);  // 必须强转

        // char 本质是无符号 16 位整数，可与 int 运算
        char c = 'A';  // ASCII 65
        int charVal = c + 1;  // 66，对应字符 'B'

        // 字符串连接：+ 遇到 String 后变为连接符
        System.out.println(1 + 2 + "3");  // "33"
        System.out.println("1" + 2 + 3);  // "123"

        // 进制表示
        int binary = 0b1010;   // 二进制，Java 7+
        int octal = 017;       // 八进制，以 0 开头
        int hex = 0x1A;        // 十六进制，以 0x 开头
    }
}
```

#### 习题

**一、选择题**

1. 以下代码编译结果是什么？
   ```java
   byte b = 127;
   b = b + 1;
   ```
   - A. 编译通过，b 值为 128
   - B. 编译通过，b 值为 -128
   - C. 编译错误
   - D. 运行时报溢出异常

2. 表达式 `'A' + 1` 的结果类型是？
   - A. `char`
   - B. `String`
   - C. `int`
   - D. `long`

3. 以下哪个赋值语句是正确的？
   - A. `float f = 3.14;`
   - B. `long l = 10000000000;`
   - C. `char c = 65;`
   - D. `byte b = 128;`

**二、判断题**

1. `boolean` 类型在内存中固定占用 1 个字节。（ ）
2. 强制类型转换 `(int) 3.9` 的结果是 `4`。（ ）
3. `String` 是 Java 的基本数据类型。（ ）

**三、代码填空题**

1. 补全代码，实现将 `double` 类型的 `avg` 四舍五入转为 `int`：
```java
double avg = 85.6;
int score = (int)__________;  // 结果应为 86
```

#### 答案与解析

**选择题**
1. **C**。`b + 1` 中 `b` 自动提升为 `int`，结果是 `int` 类型，不能赋值给 `byte`。
2. **C**。`char` 参与算术运算时自动提升为 `int`，结果是 `int`。
3. **C**。`char` 可以接收 0~65535 的整数。A 缺少 `F`，B 超出 `int` 范围需加 `L`，D 超出 `byte` 范围。

**判断题**
1. **×**。JVM 规范未规定 `boolean` 的具体大小，由具体实现决定。
2. **×**。强制转换直接截断小数部分，结果是 `3`。四舍五入需用 `Math.round()`。
3. **×**。`String` 是引用类型，属于类。

**代码填空题**
1. `Math.round(avg)`。`Math.round()` 返回 `long`，再强转为 `int`。

---

### 1.3 运算符与表达式

#### 知识点讲解

重点掌握：
- **短路逻辑运算符**：`&&`（短路与）、`||`（短路或）—— 左侧能确定结果时右侧不执行
- **位运算符**：`&`、`|`、`^`、`~`、`<<`、`>>`、`>>>`
- **三元运算符**：`条件 ? 值1 : 值2`
- **自增/自减**：前缀（先变后用） vs 后缀（先用后变）

#### 精讲代码

```java
public class OperatorDemo {
    public static void main(String[] args) {
        // 短路逻辑运算
        int a = 5, b = 0;
        // 左侧为 false，右侧不会执行，避免除零异常
        if (a < 0 && (b = 10 / a) > 0) {
            System.out.println("不会执行到这里");
        }
        System.out.println("b = " + b);  // b 仍为 0

        // 非短路逻辑 &：两侧都会执行
        if (a > 0 & (b = 100 / a) > 0) {
            System.out.println("b = " + b);  // b = 20
        }

        // 自增/自减
        int x = 5;
        int y = x++;  // y = 5, x = 6（先用后加）
        int z = ++x;  // z = 7, x = 7（先加后用）

        // 位运算：交换两个数（不借助临时变量）
        int m = 10, n = 20;
        m = m ^ n;
        n = m ^ n;  // n = (m^n)^n = m
        m = m ^ n;  // m = (m^n)^m = n
        System.out.println("m=" + m + ", n=" + n);  // m=20, n=10

        // 移位运算
        int num = 8;     // 二进制 1000
        System.out.println(num << 2);   // 32，左移 n 位等于乘以 2^n
        System.out.println(num >> 2);   // 2，右移 n 位等于除以 2^n

        // 无符号右移：负数高位补 0
        int neg = -8;
        System.out.println(neg >>> 2);  // 很大的正数

        // 三元运算符嵌套（不推荐过多嵌套，可读性差）
        int score = 85;
        String grade = score >= 90 ? "A" : (score >= 80 ? "B" : "C");
    }
}
```

#### 习题

**一、选择题**

1. 执行以下代码后，`a` 和 `b` 的值分别是？
   ```java
   int a = 5;
   int b = a++ + ++a;
   ```
   - A. a=6, b=11
   - B. a=7, b=12
   - C. a=7, b=11
   - D. a=6, b=12

2. 以下哪个运算符不能用于 `boolean` 类型？
   - A. `&`
   - B. `|`
   - C. `^`
   - D. `~`

3. `10 >> 1` 的结果是？
   - A. 5
   - B. 20
   - C. 2
   - D. 1

**二、判断题**

1. `&&` 和 `&` 在逻辑运算中效果完全相同，只是 `&&` 效率更高。（ ）
2. `>>>` 和 `>>` 对于正数效果相同。（ ）
3. 三元运算符可以替代所有简单的 if-else 语句。（ ）

**三、代码填空题**

1. 使用位运算判断一个数 `n` 是否为偶数：
```java
public boolean isEven(int n) {
    return (n ________ 1) == 0;
}
```

#### 答案与解析

**选择题**
1. **B**。`a++` 先返回 5，然后 `a` 变为 6；`++a` 先让 `a` 变为 7，再返回 7。所以 `b = 5 + 7 = 12`，`a = 7`。
2. **D**。`~` 是按位取反，只能用于整数类型。
3. **A**。右移 1 位相当于除以 2。

**判断题**
1. **×**。`&` 可以用于位运算（整数按位与），而 `&&` 只能用于布尔逻辑。
2. **√**。正数高位为 0，`>>>` 和 `>>` 都是补 0。
3. **×**。三元运算符要求必须有返回值，且不能替代有复杂逻辑或没有返回值的 if-else。

**代码填空题**
1. `&`。偶数二进制最低位为 0，与 1 按位与结果为 0。`n & 1`。

---

### 1.4 流程控制

#### 知识点讲解

- `if-else if-else`：条件分支
- `switch`：JDK 12+ 支持箭头语法和 `yield` 返回值；表达式类型可为 `String`（JDK 7+）、枚举、`int/short/byte/char` 及其包装类
- 循环：`for`、`while`、`do-while`、`增强 for`（for-each）
- 跳转：`break`（跳出循环）、`continue`（跳过本次）、`return`（结束方法）
- **标签**：`break label` 可跳出指定外层循环（不推荐使用，破坏结构）

#### 精讲代码

```java
public class FlowControlDemo {
    public static void main(String[] args) {
        // switch 表达式（Java 14+）
        String day = "MONDAY";
        int numLetters = switch (day) {
            case "MONDAY", "FRIDAY", "SUNDAY" -> 6;  // 箭头语法，无需 break
            case "TUESDAY" -> 7;
            case "THURSDAY", "SATURDAY" -> 8;
            case "WEDNESDAY" -> 9;
            default -> {
                System.out.println("未知");
                yield 0;  // 代码块中用 yield 返回值
            }
        };

        // 增强 for 循环（for-each）：只能遍历，不能修改集合结构
        int[] arr = {1, 2, 3, 4, 5};
        for (int num : arr) {
            System.out.println(num);
        }

        // 标签示例：跳出外层循环
        outer: for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (i == 1 && j == 1) {
                    break outer;  // 跳出外层循环
                }
                System.out.println(i + "," + j);
            }
        }

        // 打印九九乘法表
        for (int i = 1; i <= 9; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.printf("%d*%d=%-2d ", j, i, i * j);
            }
            System.out.println();
        }
    }
}
```

#### 习题

**一、选择题**

1. 以下关于 `switch` 语句，说法错误的是？
   - A. JDK 7 开始支持 `String`
   - B. `case` 后可以是变量
   - C. `case` 后的值必须唯一
   - D. 没有 `break` 会发生穿透

2. 以下代码输出什么？
   ```java
   int sum = 0;
   for (int i = 0; i < 5; i++) {
       if (i == 2) continue;
       if (i == 4) break;
       sum += i;
   }
   System.out.println(sum);
   ```
   - A. 10
   - B. 7
   - C. 6
   - D. 4

3. `do-while` 和 `while` 的主要区别是？
   - A. `do-while` 效率更高
   - B. `do-while` 至少执行一次
   - C. `while` 可以嵌套，`do-while` 不能
   - D. 没有区别

**二、判断题**

1. `for-each` 循环中不能修改数组元素的值（对于基本类型）。（ ）
2. `switch` 表达式中，`default` 必须放在最后。（ ）
3. `break` 只能用于循环和 `switch` 中。（ ）

**三、代码填空题**

1. 补全代码，打印 1~100 中所有能被 3 整除但不能被 5 整除的数：
```java
for (int i = 1; i <= 100; i++) {
    if (i % 3 != 0) ________;
    if (i % 5 == 0) ________;
    System.out.println(i);
}
```

#### 答案与解析

**选择题**
1. **B**。`case` 后必须是常量表达式，不能是变量。
2. **D**。i=0 sum=0, i=1 sum=1, i=2 continue, i=3 sum=4, i=4 break。sum = 4。
3. **B**。`do-while` 先执行后判断，至少执行一次。

**判断题**
1. **√**。`for-each` 中的变量是副本，修改不影响原数组（基本类型）。
2. **×**。`default` 可以放在任何位置，但通常放在最后。
3. **×**。`break` 还可以用于带标签的代码块，但一般不这么用。

**代码填空题**
1. `continue`，`continue`。第一个条件不满足 3 的倍数则跳过；第二个条件满足 5 的倍数也跳过。

---

### 1.5 数组

#### 知识点讲解

- 数组是**引用类型**，存储在堆中，变量保存的是引用地址
- 声明方式：`int[] arr`（推荐）或 `int arr[]`
- 创建方式：`new int[5]`（动态初始化）或 `{1,2,3}`（静态初始化）
- 多维数组：Java 实际上是"数组的数组"，`int[][]` 每行长度可以不同
- 常用工具类：`Arrays.sort()`、`Arrays.binarySearch()`、`Arrays.copyOf()`、`Arrays.toString()`

#### 精讲代码

```java
import java.util.Arrays;

public class ArrayDemo {
    public static void main(String[] args) {
        // 声明与初始化
        int[] arr1 = new int[5];           // 默认值 [0,0,0,0,0]
        int[] arr2 = {1, 2, 3, 4, 5};      // 静态初始化，不能先声明后赋值
        int[] arr3 = new int[]{1, 2, 3};   // 匿名数组，可以拆分为声明+赋值

        // 数组拷贝：System.arraycopy（native 方法，效率高）
        int[] src = {1, 2, 3, 4, 5};
        int[] dest = new int[5];
        System.arraycopy(src, 0, dest, 0, 5);

        // Arrays.copyOf：内部调用 System.arraycopy
        int[] copy = Arrays.copyOf(src, 10);  // 长度 10，多出的补默认值

        // 二维数组：每行长度可以不同（锯齿数组）
        int[][] matrix = new int[3][];
        matrix[0] = new int[]{1, 2};
        matrix[1] = new int[]{3, 4, 5};
        matrix[2] = new int[]{6};

        // 遍历二维数组
        for (int i = 0; i < matrix.length; i++) {
            for (int j = 0; j < matrix[i].length; j++) {
                System.out.print(matrix[i][j] + " ");
            }
            System.out.println();
        }

        // 数组排序与查找
        int[] nums = {5, 2, 8, 1, 9};
        Arrays.sort(nums);  // 双轴快速排序，O(n log n)
        int index = Arrays.binarySearch(nums, 8);  // 必须是有序数组
        System.out.println("8 的索引: " + index);

        // 数组作为方法参数：传的是引用，方法内修改会影响原数组
        modifyArray(nums);
        System.out.println(Arrays.toString(nums));  // 第一个元素被修改
    }

    static void modifyArray(int[] arr) {
        if (arr != null && arr.length > 0) {
            arr[0] = 999;  // 修改原数组内容
            // arr = new int[]{1,2,3};  // 这行只改变局部引用，不影响实参
        }
    }
}
```

#### 习题

**一、选择题**

1. 以下代码执行后 `arr` 的值是？
   ```java
   int[] arr = {1, 2, 3};
   int[] arr2 = arr;
   arr2[0] = 100;
   ```
   - A. `{1, 2, 3}`
   - B. `{100, 2, 3}`
   - C. 编译错误
   - D. 运行时异常

2. `Arrays.binarySearch()` 在查找失败时返回？
   - A. `-1`
   - B. `0`
   - C. `-(插入点) - 1`
   - D. 抛出异常

3. 以下哪种声明方式是推荐的 Java 风格？
   - A. `int arr[]`
   - B. `int[] arr`
   - C. `Integer[] arr`
   - D. B 和 C 都是

**二、判断题**

1. 数组的长度可以通过 `length()` 方法获取。（ ）
2. `int[][] arr = new int[3][4];` 创建了一个 3 行 4 列的二维数组，共 12 个元素。（ ）
3. `Arrays.copyOf()` 是深拷贝。（ ）

**三、代码填空题**

1. 补全代码，实现数组反转：
```java
public static void reverse(int[] arr) {
    for (int i = 0; i < ________; i++) {
        int temp = arr[i];
        arr[i] = arr[arr.length - 1 - i];
        arr[arr.length - 1 - i] = temp;
    }
}
```

#### 答案与解析

**选择题**
1. **B**。`arr2` 和 `arr` 指向同一数组对象，修改 `arr2` 就是修改 `arr`。
2. **C**。返回负值表示未找到，具体值为 `-(插入点) - 1`。
3. **B**。`int[] arr` 是 Java 推荐的声明方式。

**判断题**
1. **×**。数组通过 `length` 属性获取长度，不是方法。`String` 才是 `length()`。
2. **√**。这是标准的矩形二维数组。
3. **×**。对于基本类型是深拷贝，对于引用类型是浅拷贝。

**代码填空题**
1. `arr.length / 2`。只需要遍历到中间位置。

---

## 第二章 面向对象编程

### 2.1 类与对象、构造器

#### 知识点讲解

- **类**是对象的模板，**对象**是类的实例
- **构造器**：方法名与类名相同，无返回值（连 `void` 都不能写），可重载
- `this` 关键字：指向当前对象，用于区分同名变量、调用其他构造器
- **构造器调用链**：`this()` 必须放在构造器第一行

#### 精讲代码

```java
public class Student {
    // 私有属性：封装，外部不可直接访问
    private String name;
    private int age;
    private String id;

    // 无参构造器：显式写出后，系统不再提供默认构造器
    public Student() {
        // this() 调用其他构造器，必须是第一句
        this("未知", 0, "0000");
    }

    // 有参构造器
    public Student(String name, int age, String id) {
        // this.name 指属性，name 指参数
        this.name = name;
        this.age = age;
        this.id = id;
    }

    // 构造器重载：部分参数
    public Student(String name) {
        this(name, 0, "0000");  // 复用全参构造器
    }

    // Getter / Setter：访问私有属性的标准方式
    public String getName() {
        return name;
    }

    public void setName(String name) {
        // 可在 setter 中加入校验逻辑
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("姓名不能为空");
        }
        this.name = name;
    }

    // 业务方法
    public void study() {
        System.out.println(name + " 正在学习");
    }

    // toString：方便打印对象信息
    @Override
    public String toString() {
        return "Student{name='" + name + "', age=" + age + ", id='" + id + "'}";
    }

    public static void main(String[] args) {
        Student s1 = new Student();           // 调用无参构造
        Student s2 = new Student("张三", 20, "1001");  // 调用全参构造
        Student s3 = new Student("李四");     // 调用单参构造

        System.out.println(s2);  // 自动调用 toString()
        s2.study();
    }
}
```

#### 习题

**一、选择题**

1. 以下关于构造器的说法，正确的是？
   - A. 构造器可以有返回值
   - B. 构造器可以被 `static` 修饰
   - C. 一个类可以有多个构造器
   - D. 构造器不能被重载

2. 如果类中显式定义了有参构造器，但没有定义无参构造器，那么？
   - A. 系统仍会提供默认无参构造器
   - B. 系统不再提供默认无参构造器
   - C. 编译报错
   - D. 运行时报错

3. `this()` 在构造器中的作用是？
   - A. 调用父类构造器
   - B. 调用本类其他构造器
   - C. 返回当前对象
   - D. 创建新对象

**二、判断题**

1. 构造器可以被 `private` 修饰，用于实现单例模式。（ ）
2. `this` 在静态方法中也可以使用。（ ）
3. 类的属性如果没有显式初始化，引用类型默认值为 `null`，基本类型有默认值。（ ）

**三、代码填空题**

1. 补全单例模式的构造器：
```java
public class Singleton {
    private static Singleton instance = new Singleton();
    ________ Singleton() {}  // 阻止外部 new
    public static Singleton getInstance() {
        return instance;
    }
}
```

#### 答案与解析

**选择题**
1. **C**。构造器不能有任何返回值类型（包括 void），不能被 static 修饰，可以重载。
2. **B**。显式定义构造器后，默认构造器不再自动提供。
3. **B**。`this()` 调用本类其他构造器；`super()` 调用父类构造器。

**判断题**
1. **√**。`private` 构造器阻止外部实例化，是单例模式的核心。
2. **×**。`static` 方法属于类，没有 `this` 引用。
3. **√**。实例变量有默认值，局部变量没有。

**代码填空题**
1. `private`。将构造器设为私有，外部无法通过 `new` 创建实例。

---

### 2.2 封装、继承、多态

#### 知识点讲解

- **封装**：隐藏内部实现，暴露公共接口。通过访问修饰符控制可见性
- **继承**：`extends` 关键字，子类继承父类非私有成员。Java 只支持单继承
- **多态**：父类引用指向子类对象。三个必要条件：继承、重写、向上转型
- **方法重写（Override）**：子类重新实现父类方法，返回值类型兼容、访问权限不能更严格
- `@Override` 注解：编译器检查是否真正重写了父类方法

#### 精讲代码

```java
// 父类
public class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    // 父类方法，子类可重写
    public void speak() {
        System.out.println(name + " 发出声音");
    }

    // final 方法不能被重写
    public final void breathe() {
        System.out.println(name + " 在呼吸");
    }
}

// 子类
public class Dog extends Animal {
    private String breed;  // 品种

    public Dog(String name, String breed) {
        super(name);  // 调用父类构造器，必须是子类构造器第一行
        this.breed = breed;
    }

    @Override
    public void speak() {
        System.out.println(name + " 汪汪叫");
    }

    // 子类特有方法
    public void wagTail() {
        System.out.println(name + " 摇尾巴");
    }
}

// 多态演示
public class PolymorphismDemo {
    public static void main(String[] args) {
        // 向上转型：父类引用指向子类对象
        Animal animal = new Dog("旺财", "金毛");
        animal.speak();  // 调用 Dog 的 speak()，输出"旺财 汪汪叫"
        // animal.wagTail();  // 编译错误！父类引用无法访问子类特有方法

        // 向下转型：需要显式强转，且必须先用 instanceof 检查
        if (animal instanceof Dog) {
            Dog dog = (Dog) animal;
            dog.wagTail();  // 现在可以调用子类方法了
        }

        // 多态数组
        Animal[] animals = {
            new Animal("动物"),
            new Dog("小白", "泰迪"),
            new Cat("咪咪")  // 假设有 Cat 类也继承 Animal
        };

        for (Animal a : animals) {
            a.speak();  // 根据实际对象类型调用不同方法（动态绑定）
        }
    }
}
```

#### 习题

**一、选择题**

1. 以下关于方法重写的说法，错误的是？
   - A. 方法名和参数列表必须相同
   - B. 返回值类型必须完全相同
   - C. 访问权限不能比父类更严格
   - D. 不能重写 `final` 方法

2. 以下代码输出什么？
   ```java
   Animal a = new Dog("旺财", "金毛");
   a.speak();
   ```
   - A. "旺财 发出声音"
   - B. "旺财 汪汪叫"
   - C. 编译错误
   - D. 运行异常

3. `instanceof` 运算符的作用是？
   - A. 判断两个对象是否相等
   - B. 判断引用指向的对象是否是某类或其子类的实例
   - C. 创建对象实例
   - D. 比较两个类是否相同

**二、判断题**

1. Java 支持多重继承（一个类继承多个父类）。（ ）
2. 子类构造器默认第一行会隐式调用 `super()`（父类无参构造器）。（ ）
3. 向上转型是自动的，向下转型需要显式强转。（ ）

**三、代码填空题**

1. 补全代码，实现子类构造器正确调用父类构造器：
```java
class Person {
    String name;
    Person(String name) { this.name = name; }
}

class Employee extends Person {
    double salary;
    Employee(String name, double salary) {
        ________;  // 调用父类构造器
        this.salary = salary;
    }
}
```

#### 答案与解析

**选择题**
1. **B**。JDK 5+ 支持协变返回类型，返回值可以是父类返回值的子类型。
2. **B**。运行时根据实际对象类型（Dog）调用方法，这是多态的体现。
3. **B**。`instanceof` 用于类型检查，避免 `ClassCastException`。

**判断题**
1. **×**。Java 只支持单继承，但可以通过接口实现多继承的效果。
2. **√**。如果父类没有无参构造器，子类必须显式调用父类有参构造器。
3. **√**。向上转型（子→父）自动，向下转型（父→子）需显式强转且需类型检查。

**代码填空题**
1. `super(name)`。子类构造器必须通过 `super()` 调用父类构造器，且必须是第一句。

---

### 2.3 抽象类与接口

#### 知识点讲解

| 特性 | 抽象类 (abstract class) | 接口 (interface) |
|------|------------------------|-----------------|
| 构造器 | 有 | 无 |
| 多继承 | 不支持 | 支持（多实现） |
| 方法实现 | 可以有具体方法 | JDK 8+ 可有 default/static 方法 |
| 属性 | 可以有各种类型 | 默认 `public static final` |
| 设计目的 | "is-a"，代码复用 | "has-a"，定义规范 |

- **抽象类**：不能被实例化，可有抽象方法和具体方法，用于模板设计
- **接口**：JDK 8 引入 `default` 和 `static` 方法；JDK 9 引入 `private` 方法
- **函数式接口**：只有一个抽象方法的接口，可用 Lambda 表达式实现（`@FunctionalInterface`）

#### 精讲代码

```java
// 接口：定义飞行能力
public interface Flyable {
    // 接口中的属性默认是 public static final
    int MAX_HEIGHT = 10000;

    // 抽象方法（默认 public abstract）
    void fly();

    // JDK 8: default 方法，实现类可不重写
    default void land() {
        System.out.println("安全着陆");
    }

    // JDK 8: static 方法，通过接口名调用
    static void checkEngine() {
        System.out.println("检查引擎状态");
    }

    // JDK 9: private 方法，供接口内部 default 方法复用
    private void log(String msg) {
        System.out.println("[LOG] " + msg);
    }
}

// 抽象类：提供部分实现
public abstract class Vehicle {
    protected String brand;

    public Vehicle(String brand) {
        this.brand = brand;
    }

    // 抽象方法：子类必须实现
    public abstract void move();

    // 具体方法
    public void horn() {
        System.out.println(brand + " 鸣笛");
    }
}

// 具体类：继承抽象类 + 实现接口
public class Airplane extends Vehicle implements Flyable {
    public Airplane(String brand) {
        super(brand);
    }

    @Override
    public void move() {
        System.out.println(brand + " 在跑道上滑行");
    }

    @Override
    public void fly() {
        System.out.println(brand + " 飞行在 " + MAX_HEIGHT + " 米高空");
    }
}

// 函数式接口
@FunctionalInterface
public interface Calculator {
    int calculate(int a, int b);

    // 可以有 default/static 方法，不影响函数式接口定义
    default void printResult(int result) {
        System.out.println("结果: " + result);
    }
}
```

#### 习题

**一、选择题**

1. 以下关于接口的说法，正确的是？
   - A. 接口中的方法默认是 `protected`
   - B. 一个类可以实现多个接口
   - C. 接口可以包含实例变量
   - D. 接口不能被继承

2. JDK 8 引入的 `default` 方法的主要目的是？
   - A. 让接口可以实例化
   - B. 在不破坏现有实现类的情况下扩展接口
   - C. 替代抽象类
   - D. 提高接口方法执行效率

3. 以下哪个是函数式接口？
   - A. 有 2 个抽象方法的接口
   - B. 有 1 个抽象方法和 2 个 default 方法的接口
   - C. 没有方法的接口
   - D. 有 3 个 static 方法的接口

**二、判断题**

1. 抽象类中必须有抽象方法。（ ）
2. 接口可以继承多个接口。（ ）
3. `default` 方法可以被实现类重写。（ ）

**三、代码填空题**

1. 补全代码，实现接口中的抽象方法：
```java
interface Runnable {
    void run();
}

class Car implements Runnable {
    ________
    public void run() {
        System.out.println("汽车在行驶");
    }
}
```

#### 答案与解析

**选择题**
1. **B**。接口方法默认 `public abstract`；接口只有常量；接口可以继承接口（多继承）。
2. **B**。`default` 方法让接口可以扩展而不强制所有实现类修改。
3. **B**。函数式接口只要求**只有一个抽象方法**，default/static 方法不影响。

**判断题**
1. **×**。抽象类可以没有抽象方法，只是不能实例化。
2. **√**。接口支持多继承，如 `interface C extends A, B {}`。
3. **√**。`default` 方法提供默认实现，实现类可以选择重写。

**代码填空题**
1. `@Override`（可选但推荐）。标记该方法为重写接口方法。

---

## 第三章 常用类与异常处理

### 3.1 String、StringBuilder、StringBuffer

#### 知识点讲解

| 类 | 可变性 | 线程安全 | 适用场景 |
|----|--------|----------|----------|
| `String` | 不可变 | 安全（只读） | 字符串常量、少量操作 |
| `StringBuilder` | 可变 | 不安全 | 单线程大量拼接 |
| `StringBuffer` | 可变 | 安全（synchronized） | 多线程大量拼接 |

- `String` 不可变：每次修改都创建新对象，原对象被 GC
- `StringBuilder/StringBuffer` 内部是 `char[]` 数组，扩容时容量翻倍+2
- 字符串常量池：字面量创建的字符串放入常量池，`intern()` 方法可将堆中字符串放入常量池

#### 精讲代码

```java
public class StringDemo {
    public static void main(String[] args) {
        // String 的创建方式
        String s1 = "hello";              // 常量池
        String s2 = "hello";              // 常量池，与 s1 同一对象
        String s3 = new String("hello");  // 堆中新建对象

        System.out.println(s1 == s2);     // true，同一常量池对象
        System.out.println(s1 == s3);     // false，堆 vs 常量池
        System.out.println(s1.equals(s3)); // true，内容相同

        // intern()：将堆中字符串放入常量池（或返回已有引用）
        String s4 = s3.intern();
        System.out.println(s1 == s4);     // true

        // StringBuilder：单线程字符串拼接
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            sb.append(i);
        }
        System.out.println(sb.toString());  // "01234"

        // 链式调用
        String result = new StringBuilder()
            .append("姓名:")
            .append("张三")
            .append(",年龄:")
            .append(20)
            .toString();

        // String 常用方法
        String str = "  Hello World  ";
        System.out.println(str.trim());           // "Hello World"
        System.out.println(str.substring(2, 7)); // "Hello"
        System.out.println(str.replace("World", "Java"));
        System.out.println("abc,def,ghi".split(","));  // ["abc", "def", "ghi"]

        // StringBuffer：线程安全版本（方法加了 synchronized）
        StringBuffer sbf = new StringBuffer("start");
        sbf.append("-end");
    }
}
```

#### 习题

**一、选择题**

1. 以下代码创建了几个 String 对象？
   ```java
   String s = new String("abc");
   ```
   - A. 1 个
   - B. 2 个
   - C. 3 个
   - D. 0 个

2. 以下哪个操作效率最高（大量循环拼接字符串）？
   - A. `String +=`
   - B. `StringBuilder.append()`
   - C. `StringBuffer.append()`
   - D. `String.concat()`

3. `StringBuilder` 和 `StringBuffer` 的区别是？
   - A. `StringBuilder` 是可变的，`StringBuffer` 不可变
   - B. `StringBuffer` 线程安全，`StringBuilder` 不安全
   - C. `StringBuilder` 在 JDK 1.0 就有了
   - D. 没有区别

**二、判断题**

1. `String` 的 `substring()` 方法会修改原字符串。（ ）
2. `==` 比较字符串时比较的是内容。（ ）
3. `StringBuilder` 的默认初始容量是 16 个字符。（ ）

**三、代码填空题**

1. 补全代码，将字符串 `"Java is great"` 中的空格替换为下划线：
```java
String str = "Java is great";
String result = str.________(" ", "_");
```

#### 答案与解析

**选择题**
1. **B**。常量池一个 `"abc"`，堆中一个 `new String` 对象。
2. **B**。单线程下 `StringBuilder` 效率最高（无同步开销）。
3. **B**。两者都可变；`StringBuffer` 线程安全（synchronized）；`StringBuilder` JDK 5 引入。

**判断题**
1. **×**。`String` 不可变，所有修改方法都返回新字符串。
2. **×**。`==` 比较引用地址；比较内容用 `equals()`。
3. **√**。默认容量 16，扩容时 `(value.length << 1) + 2`。

**代码填空题**
1. `replace`。`replace(CharSequence target, CharSequence replacement)` 替换所有匹配。

---

### 3.2 异常处理

#### 知识点讲解

- **异常体系**：`Throwable` → `Error`（不可恢复）/ `Exception`（可处理）
- `Exception` → `RuntimeException`（非受检/运行时异常）/ 其他（受检异常）
- **受检异常**：编译器强制要求处理（`try-catch` 或 `throws`）
- **非受检异常**：`RuntimeException` 及其子类，不强制处理
- **try-catch-finally**：`finally` 无论是否异常都会执行（除非 `System.exit()`）
- **try-with-resources**：JDK 7+，自动关闭实现了 `AutoCloseable` 的资源
- **异常链**：保留原始异常信息，用构造器或 `initCause()`

#### 精讲代码

```java
public class ExceptionDemo {

    // 抛出受检异常，调用者必须处理
    public void readFile(String path) throws FileNotFoundException {
        FileReader reader = new FileReader(path);  // 可能抛出受检异常
    }

    // 自定义异常
    static class BusinessException extends RuntimeException {
        private int code;

        public BusinessException(int code, String message) {
            super(message);
            this.code = code;
        }

        public int getCode() { return code; }
    }

    public static void main(String[] args) {
        // 基本 try-catch-finally
        try {
            int result = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("除零错误: " + e.getMessage());
        } finally {
            System.out.println("finally 总会执行");
        }

        // 多个 catch：子类异常在前，父类在后
        try {
            String s = null;
            s.length();
        } catch (NullPointerException e) {
            System.out.println("空指针");
        } catch (Exception e) {
            System.out.println("其他异常");
        }

        // try-with-resources：自动关闭资源
        // 资源必须实现 AutoCloseable 接口
        try (BufferedReader br = new BufferedReader(new FileReader("test.txt"))) {
            String line = br.readLine();
        } catch (IOException e) {
            e.printStackTrace();
        }  // br 会自动关闭，无需 finally

        // 异常链：包装异常，保留原始信息
        try {
            riskyOperation();
        } catch (SQLException e) {
            // 将受检异常转为非受检异常抛出，保留原始异常
            throw new BusinessException(500, "数据库操作失败");
        }
    }

    static void riskyOperation() throws SQLException {
        throw new SQLException("连接超时");
    }
}
```

#### 习题

**一、选择题**

1. 以下哪个是**受检异常**？
   - A. `NullPointerException`
   - B. `ArrayIndexOutOfBoundsException`
   - C. `IOException`
   - D. `ClassCastException`

2. `finally` 块中的代码在什么情况下**不会**执行？
   - A. 发生异常且被 catch
   - B. try 中执行了 `return`
   - C. try 中执行了 `System.exit(0)`
   - D. 发生异常且未被 catch

3. `try-with-resources` 要求资源必须实现哪个接口？
   - A. `Closeable`
   - B. `AutoCloseable`
   - C. `Serializable`
   - D. `Cloneable`

**二、判断题**

1. `catch` 块中如果不抛出异常，程序会继续正常执行。（ ）
2. `RuntimeException` 及其子类不需要显式处理。（ ）
3. 一个 `try` 块后面可以只有 `finally` 而没有 `catch`。（ ）

**三、代码填空题**

1. 补全代码，正确捕获数组越界异常：
```java
int[] arr = {1, 2, 3};
try {
    System.out.println(arr[5]);
} ________ (ArrayIndexOutOfBoundsException e) {
    System.out.println("索引越界");
}
```

#### 答案与解析

**选择题**
1. **C**。`IOException` 是受检异常，其他都是 `RuntimeException` 子类。
2. **C**。`System.exit(0)` 直接终止 JVM，`finally` 不会执行。
3. **B**。`AutoCloseable` 是 `try-with-resources` 的要求。

**判断题**
1. **√**。`catch` 处理完异常后，程序继续执行后续代码。
2. **√**。非受检异常不强制 try-catch 或 throws。
3. **√**。`try-finally` 是合法结构，用于确保资源释放。

**代码填空题**
1. `catch`。异常捕获用 `catch` 关键字。

---

## 第四章 集合框架

### 4.1 Collection 体系与 List

#### 知识点讲解

**集合框架体系**：
- `Collection`（单列）→ `List`（有序可重复）/ `Set`（无序不重复）/ `Queue`
- `Map`（双列，键值对）

**List 实现类对比**：

| 特性 | `ArrayList` | `LinkedList` | `Vector` |
|------|------------|-------------|---------|
| 底层结构 | 动态数组 | 双向链表 | 动态数组 |
| 随机访问 | O(1) | O(n) | O(1) |
| 插入删除 | O(n) | O(1) | O(n) |
| 线程安全 | 否 | 否 | 是（已过时） |
| 扩容机制 | 1.5 倍 | 无需扩容 | 2 倍 |

#### 精讲代码

```java
import java.util.*;

public class ListDemo {
    public static void main(String[] args) {
        // ArrayList：默认初始容量 10，扩容为原来的 1.5 倍
        List<String> arrayList = new ArrayList<>();
        arrayList.add("A");
        arrayList.add(0, "B");  // 指定位置插入，后续元素后移

        // LinkedList：适合频繁插入删除，实现了 Deque 接口
        LinkedList<String> linkedList = new LinkedList<>();
        linkedList.addFirst("Head");
        linkedList.addLast("Tail");
        String first = linkedList.pollFirst();  // 取出并移除首元素

        // 遍历方式对比
        List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5);

        // 1. for 循环（索引遍历，适合 ArrayList）
        for (int i = 0; i < nums.size(); i++) {
            System.out.println(nums.get(i));
        }

        // 2. 增强 for（适合所有 List，遍历时不能修改结构）
        for (Integer num : nums) {
            System.out.println(num);
        }

        // 3. 迭代器（遍历时可安全删除）
        Iterator<Integer> it = nums.iterator();
        while (it.hasNext()) {
            Integer num = it.next();
            if (num == 3) {
                it.remove();  // 安全删除，不会触发 ConcurrentModificationException
            }
        }

        // 4. ListIterator：支持双向遍历和修改
        ListIterator<Integer> lit = nums.listIterator();
        while (lit.hasNext()) {
            int idx = lit.nextIndex();
            Integer val = lit.next();
            lit.set(val * 2);  // 修改当前元素
        }

        // 5. forEach + Lambda（Java 8+）
        nums.forEach(n -> System.out.println(n));

        // 排序
        List<String> fruits = new ArrayList<>(Arrays.asList("Banana", "Apple", "Cherry"));
        Collections.sort(fruits);  // 自然排序（Comparable）

        // 自定义排序（Comparator）
        fruits.sort((a, b) -> b.length() - a.length());  // 按长度降序

        // 线程安全转换
        List<String> syncList = Collections.synchronizedList(new ArrayList<>());
    }
}
```

#### 习题

**一、选择题**

1. `ArrayList` 扩容时，新容量是原来的多少倍？
   - A. 1 倍
   - B. 1.5 倍
   - C. 2 倍
   - D. 0.5 倍

2. 以下哪种遍历方式在遍历过程中**安全删除**元素？
   - A. 增强 for 循环
   - B. 普通 for 循环配合 `list.remove(i)`
   - C. 迭代器的 `remove()`
   - D. `forEach` + Lambda

3. `LinkedList` 相比 `ArrayList` 的优势是？
   - A. 随机访问更快
   - B. 内存占用更小
   - C. 插入删除更快
   - D. 线程安全

**二、判断题**

1. `Arrays.asList()` 返回的 List 支持增删操作。（ ）
2. `Vector` 是线程安全的，但性能较差，现代开发中推荐使用 `CopyOnWriteArrayList` 或 `Collections.synchronizedList()`。（ ）
3. `List` 接口继承自 `Collection` 接口。（ ）

**三、代码填空题**

1. 补全代码，使用 `Collections` 对 List 进行二分查找（List 必须先排序）：
```java
List<Integer> list = Arrays.asList(3, 1, 4, 1, 5);
Collections.________(list);
int index = Collections.________(list, 4);
```

#### 答案与解析

**选择题**
1. **B**。`ArrayList` 扩容为 `oldCapacity + (oldCapacity >> 1)`，即 1.5 倍。
2. **C**。迭代器的 `remove()` 会同步修改 expectedModCount，不会触发异常。
3. **C**。`LinkedList` 插入删除只需修改指针，O(1)；`ArrayList` 需要移动元素，O(n)。

**判断题**
1. **×**。`Arrays.asList()` 返回固定大小的 List，不支持 add/remove，但支持 set。
2. **√**。`Vector` 所有方法加 `synchronized`，效率低。`CopyOnWriteArrayList` 读多写少场景更优。
3. **√**。`List extends Collection`。

**代码填空题**
1. `sort`，`binarySearch`。二分查找要求列表已按自然顺序或指定比较器排序。

2. **A**。先自底向上委托给父加载器，父加载器无法加载时再自顶向下尝试自己加载。
3. **B**。JDBC 的 `ServiceLoader` 使用线程上下文类加载器（TCCL）打破双亲委派。

**判断题**
1. **√**。自定义类加载器通常继承 `ClassLoader`，重写 `findClass()`。
2. **√**。核心类由引导类加载器加载，用户自定义的同名类不会被加载。
3. **√**。初始化阶段执行 `<clinit>()` 方法，包含静态变量赋值和静态代码块。

**代码填空题**
1. `getClassLoader()`。通过 `Class` 对象的 `getClassLoader()` 获取加载它的类加载器。

---

## 附录：学习路线图

```
第一阶段：基础语法（2-3 周）
├── Java 环境搭建与 IDE 使用
├── 变量、数据类型、运算符
├── 流程控制、数组、方法
└── 面向对象：封装、继承、多态

第二阶段：核心 API（2 周）
├── String/StringBuilder/StringBuffer
├── 异常处理机制
├── 集合框架（List/Set/Map）
└── IO 流与文件操作

第三阶段：进阶特性（2-3 周）
├── 多线程与并发编程
├── 反射机制
├── 注解与泛型
└── Java 8+ 新特性（Lambda、Stream、Optional）

第四阶段：JVM 与调优（1-2 周）
├── JVM 内存模型
├── 垃圾回收机制
├── 类加载机制
└── 常用 JVM 参数与调优工具
```

---

> **使用建议**：建议按章节顺序学习，每学完一个知识点先独立完成习题，再对照答案检查。代码示例建议全部手敲运行，加深理解。
