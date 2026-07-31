# 📚 SQL 从入门到精通知识库

> **说明**：本知识库涵盖SQL完整学习路径，每个知识点包含代码讲解、详细注释及配套练习题（选择题、判断题、代码填空题），适合零基础到进阶开发者系统学习。

---

# 第一部分：SQL基础入门

## 1.1 数据库与SQL简介

### 知识点讲解
SQL（Structured Query Language，结构化查询语言）是用于管理关系型数据库的标准语言。主流的关系型数据库包括 MySQL、PostgreSQL、SQL Server、Oracle、SQLite 等。

### 基础概念
- **数据库（Database）**：有组织的数据集合
- **表（Table）**：由行（记录）和列（字段）组成的二维结构
- **主键（Primary Key）**：唯一标识每条记录的字段
- **SQL语句分类**：
  - DDL（数据定义语言）：CREATE、DROP、ALTER
  - DML（数据操作语言）：SELECT、INSERT、UPDATE、DELETE
  - DCL（数据控制语言）：GRANT、REVOKE

---

## 1.2 创建数据库和表（DDL）

### 代码讲解

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS school_db 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE school_db;

-- 创建学生表
CREATE TABLE IF NOT EXISTS students (
    student_id      INT PRIMARY KEY AUTO_INCREMENT COMMENT '学生ID，主键自增',
    name            VARCHAR(50) NOT NULL COMMENT '学生姓名，不允许为空',
    gender          CHAR(1) COMMENT '性别：M男/F女',
    age             INT CHECK (age >= 0 AND age <= 150) COMMENT '年龄，约束在0-150之间',
    enrollment_date DATE DEFAULT (CURDATE()) COMMENT '入学日期，默认为当天',
    gpa             DECIMAL(3,2) COMMENT '绩点，例如3.85',
    email           VARCHAR(100) UNIQUE COMMENT '邮箱，唯一约束'
) COMMENT='学生信息表';
```

**关键注释说明：**
- `PRIMARY KEY`：主键约束，唯一且非空，AUTO_INCREMENT 自动递增
- `NOT NULL`：非空约束，插入数据时该字段必须有值
- `DEFAULT`：默认值，未提供值时自动填充
- `UNIQUE`：唯一约束，表中该字段值不能重复
- `CHECK`：检查约束，确保数据满足指定条件
- `COMMENT`：注释，描述字段或表的用途

---

## 1.3 基础查询语句（SELECT）

### 代码讲解

```sql
-- 查询所有列（* 表示所有字段，生产环境不建议使用）
SELECT * FROM students;

-- 查询指定列，提高可读性和性能
SELECT name, age, gpa FROM students;

-- 使用别名（AS 可省略），让结果更易读
SELECT 
    name AS 姓名,           -- AS 关键字可省略
    age 年龄,               -- 省略 AS 的写法
    gpa AS '平均绩点'       -- 别名含空格需用引号
FROM students;

-- 去重查询：DISTINCT 去除重复值
SELECT DISTINCT gender FROM students;

-- 常量列和表达式
SELECT 
    name,
    age,
    age + 1 AS next_year_age,      -- 计算表达式
    '2024级' AS grade_level        -- 添加常量列
FROM students;
```

---

## 1.4 条件查询（WHERE）

### 代码讲解

```sql
-- 比较运算符：=, <>, !=, >, <, >=, <=
SELECT * FROM students WHERE age >= 18;
SELECT * FROM students WHERE gender = 'F';

-- 逻辑运算符：AND, OR, NOT
SELECT * FROM students 
WHERE age >= 18 AND gender = 'M';   -- 且：两个条件同时满足

SELECT * FROM students 
WHERE age < 18 OR gpa > 3.5;        -- 或：满足任一条件

SELECT * FROM students 
WHERE NOT gender = 'F';             -- 非：取反

-- 范围查询：BETWEEN（包含边界值）
SELECT * FROM students 
WHERE age BETWEEN 18 AND 22;        -- 等价于 age >= 18 AND age <= 22

-- 集合查询：IN（匹配列表中的任意值）
SELECT * FROM students 
WHERE name IN ('张三', '李四', '王五');

-- 模糊查询：LIKE
-- % 匹配任意数量字符（包括0个）
-- _ 匹配单个字符
SELECT * FROM students WHERE name LIKE '张%';    -- 姓张的学生
SELECT * FROM students WHERE name LIKE '_三';    -- 名字为"某三"的学生
SELECT * FROM students WHERE email LIKE '%@gmail.com';

-- 空值判断：IS NULL / IS NOT NULL
SELECT * FROM students WHERE email IS NULL;      -- 查询邮箱为空的学生
SELECT * FROM students WHERE email IS NOT NULL;  -- 查询邮箱不为空的学生
```

---

## 1.5 排序与限制结果（ORDER BY / LIMIT）

### 代码讲解

```sql
-- 单列升序排序（ASC 可省略，默认升序）
SELECT * FROM students ORDER BY age ASC;

-- 单列降序排序
SELECT * FROM students ORDER BY gpa DESC;

-- 多列排序：先按年龄升序，年龄相同再按绩点降序
SELECT * FROM students 
ORDER BY age ASC, gpa DESC;

-- LIMIT 限制返回行数（MySQL/SQLite语法）
SELECT * FROM students LIMIT 10;              -- 前10条
SELECT * FROM students LIMIT 5 OFFSET 10;     -- 跳过10条，取5条（第11-15条）
SELECT * FROM students LIMIT 10, 5;           -- 同上，另一种写法（MySQL）

-- 分页查询公式：LIMIT pageSize OFFSET (pageNum - 1) * pageSize
-- 第3页，每页10条
SELECT * FROM students ORDER BY student_id LIMIT 10 OFFSET 20;

-- SQL Server 使用 TOP
-- SELECT TOP 10 * FROM students;

-- PostgreSQL/Oracle 使用 FETCH FIRST
-- SELECT * FROM students FETCH FIRST 10 ROWS ONLY;
```

---

## 1.6 基础查询练习题

### 一、选择题

**题目1**：以下哪个SQL语句用于查询表中所有数据？
- A. `GET * FROM table_name;`
- B. `SELECT ALL FROM table_name;`
- C. `SELECT * FROM table_name;`
- D. `FETCH * FROM table_name;`

<details>
<summary>✅ 答案与解析</summary>

**答案：C**

**解析**：`SELECT * FROM table_name;` 是标准SQL语法，用于查询表中所有列的所有数据。`*` 是通配符，表示所有列。A选项的GET不是SQL关键字；B选项的ALL虽然可用但不标准；D选项的FETCH在部分数据库中用于分页，不是查询全部数据的标准写法。
</details>

---

**题目2**：在WHERE子句中，以下哪个运算符用于模糊匹配？
- A. `=`
- B. `LIKE`
- C. `MATCH`
- D. `SIMILAR`

<details>
<summary>✅ 答案与解析</summary>

**答案：B**

**解析**：`LIKE` 是SQL中用于模糊匹配的关键字，配合 `%`（匹配任意数量字符）和 `_`（匹配单个字符）使用。`=` 是精确匹配；`MATCH` 和 `SIMILAR` 不是标准模糊匹配运算符（部分数据库支持SIMILAR TO，但不是最常用）。
</details>

---

**题目3**：以下关于 `LIMIT 10 OFFSET 20` 的描述，正确的是？
- A. 返回第10到第20条记录
- B. 跳过前10条，返回20条
- C. 跳过前20条，返回10条
- D. 返回前30条记录中的后10条

<details>
<summary>✅ 答案与解析</summary>

**答案：C**

**解析**：`LIMIT 10 OFFSET 20` 的含义是：先跳过（OFFSET）前20条记录，然后返回（LIMIT）接下来的10条记录。即返回第21到第30条记录。
</details>

---

### 二、判断题

**题目1**：`SELECT DISTINCT age FROM students;` 会返回所有学生的年龄，包括重复值。

<details>
<summary>✅ 答案与解析</summary>

**答案：❌ 错误**

**解析**：`DISTINCT` 关键字用于去除查询结果中的重复行。该语句只会返回不同的年龄值，重复的年龄只会出现一次。
</details>

---

**题目2**：`WHERE age BETWEEN 18 AND 22` 等价于 `WHERE age >= 18 AND age <= 22`。

<details>
<summary>✅ 答案与解析</summary>

**答案：✅ 正确**

**解析**：`BETWEEN ... AND ...` 是包含边界值的范围查询，完全等价于使用 `>=` 和 `<=` 的组合。注意与 `age > 18 AND age < 22`（不包含边界）的区别。
</details>

---

**题目3**：`WHERE name = NULL` 可以正确查询出 name 字段为空的记录。

<details>
<summary>✅ 答案与解析</summary>

**答案：❌ 错误**

**解析**：在SQL中，NULL 表示"未知"或"不存在"，不能使用 `=` 进行比较。判断空值必须使用 `IS NULL`（`WHERE name IS NULL`）。使用 `= NULL` 不会报错，但永远返回空结果集。
</details>

---

### 三、代码填空题

**题目1**：请补全SQL语句，查询年龄大于20岁且性别为女（'F'）的学生姓名和年龄。

```sql
SELECT name, age 
FROM students 
WHERE age ___ 20 ___ gender ___ 'F';
```

<details>
<summary>✅ 答案与解析</summary>

**答案**：
```sql
SELECT name, age 
FROM students 
WHERE age > 20 AND gender = 'F';
```

**解析**：
- 第一个空填 `>`，表示"大于"
- 第二个空填 `AND`，连接两个条件，要求同时满足
- 第三个空填 `=`，进行字符串精确匹配
</details>

---

**题目2**：请补全SQL语句，查询姓"李"的学生信息，并按年龄从大到小排序，只返回前5条。

```sql
SELECT * FROM students 
WHERE name ___ '李%' 
ORDER BY age ___ 
___ 5;
```

<details>
<summary>✅ 答案与解析</summary>

**答案**：
```sql
SELECT * FROM students 
WHERE name LIKE '李%' 
ORDER BY age DESC 
LIMIT 5;
```

**解析**：
- 第一个空填 `LIKE`，模糊匹配以"李"开头的姓名
- 第二个空填 `DESC`，表示降序排列（从大到小）
- 第三个空填 `LIMIT`，限制返回结果为前5条
</details>

---

**题目3**：请补全SQL语句，创建一个课程表 `courses`，包含课程ID（自增主键）、课程名称（非空）、学分（默认为3）。

```sql
CREATE TABLE courses (
    course_id   INT PRIMARY KEY ___,
    course_name VARCHAR(100) ___,
    credits     INT ___ 3
);
```

<details>
<summary>✅ 答案与解析</summary>

**答案**：
```sql
CREATE TABLE courses (
    course_id   INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL,
    credits     INT DEFAULT 3
);
```

**解析**：
- 第一个空填 `AUTO_INCREMENT`，使课程ID自动递增（MySQL语法）
- 第二个空填 `NOT NULL`，确保课程名称不能为空
- 第三个空填 `DEFAULT`，设置默认值为3

**注意**：不同数据库自增语法不同：
- MySQL：`AUTO_INCREMENT`
- PostgreSQL：`SERIAL` 或 `GENERATED ALWAYS AS IDENTITY`
- SQL Server：`IDENTITY(1,1)`
- SQLite：`AUTOINCREMENT`
</details>

---

---

# 第二部分：数据操作与基础函数

## 2.1 插入数据（INSERT）

### 代码讲解

```sql
-- 插入完整记录（需按表定义的顺序提供所有字段值）
INSERT INTO students 
VALUES (NULL, '张三', 'M', 20, '2024-09-01', 3.85, 'zhangsan@example.com');

-- 插入指定字段（推荐，更安全且可读性强）
INSERT INTO students (name, gender, age, gpa, email) 
VALUES ('李四', 'F', 19, 3.92, 'lisi@example.com');

-- 批量插入（一条语句插入多条记录，性能更优）
INSERT INTO students (name, gender, age, gpa) 
VALUES 
    ('王五', 'M', 21, 3.50),
    ('赵六', 'F', 20, 3.78),
    ('孙七', 'M', 22, 3.65);

-- 插入查询结果（将查询结果插入到另一张表）
INSERT INTO students_backup (name, gender, age, gpa)
SELECT name, gender, age, gpa 
FROM students 
WHERE gpa > 3.8;

-- 插入时处理冲突（MySQL：ON DUPLICATE KEY UPDATE）
INSERT INTO students (student_id, name, age) 
VALUES (1, '张三', 21)
ON DUPLICATE KEY UPDATE age = VALUES(age);  -- 主键冲突时更新年龄

-- PostgreSQL：ON CONFLICT
-- INSERT INTO students (student_id, name) VALUES (1, '张三')
-- ON CONFLICT (student_id) DO UPDATE SET name = EXCLUDED.name;
```

---

## 2.2 更新数据（UPDATE）

### 代码讲解

```sql
-- 更新单条记录（必须加WHERE条件，否则更新全表！）
UPDATE students 
SET gpa = 3.90 
WHERE student_id = 1;

-- 更新多个字段
UPDATE students 
SET 
    age = age + 1,              -- 年龄加1
    gpa = 3.95,
    email = 'new_email@example.com'
WHERE student_id = 2;

-- 使用子查询更新
UPDATE students 
SET gpa = gpa + 0.1 
WHERE student_id IN (
    SELECT student_id 
    FROM honor_students        -- 从另一张表查询
);

-- 关联更新（多表关联更新）
-- MySQL语法
UPDATE students s
JOIN classes c ON s.class_id = c.class_id
SET s.gpa = s.gpa + 0.05
WHERE c.grade = '2024';
```

> ⚠️ **重要警告**：UPDATE 语句忘记写 WHERE 条件会导致全表数据被更新！执行前务必确认条件正确。

---

## 2.3 删除数据（DELETE / TRUNCATE）

### 代码讲解

```sql
-- 删除指定条件的记录
DELETE FROM students WHERE student_id = 5;

-- 删除多条记录
DELETE FROM students WHERE age < 18;

-- 删除所有记录（保留表结构，可回滚）
DELETE FROM students;

-- 清空表（更快，不可回滚，重置自增计数器）
TRUNCATE TABLE students;

-- 删除表（连同结构一起删除）
DROP TABLE students;

-- 删除数据库
DROP DATABASE IF EXISTS school_db;
```

**DELETE vs TRUNCATE vs DROP 对比：**

| 特性 | DELETE | TRUNCATE | DROP |
|------|--------|----------|------|
| 删除内容 | 数据（可带条件） | 全部数据 | 数据和结构 |
| 执行速度 | 慢（逐行删除，记日志） | 快（删除数据页） | 最快 |
| 可回滚 | ✅ 可以 | ❌ 不可以 | ❌ 不可以 |
| 重置自增 | ❌ 不重置 | ✅ 重置 | - |
| WHERE条件 | ✅ 支持 | ❌ 不支持 | ❌ 不支持 |

---

## 2.4 字符串函数

### 代码讲解

```sql
-- 字符串拼接
SELECT CONCAT('Hello', ' ', 'World');        -- 结果: Hello World
SELECT CONCAT(name, ' - ', email) FROM students;

-- 字符串长度
SELECT LENGTH('Hello');                      -- 结果: 5（字节数）
SELECT CHAR_LENGTH('你好');                   -- 结果: 2（字符数）

-- 大小写转换
SELECT UPPER('hello');                       -- 结果: HELLO
SELECT LOWER('WORLD');                       -- 结果: world

-- 截取字符串
SELECT SUBSTRING('Hello World', 1, 5);       -- 结果: Hello（从第1位开始，取5个字符）
SELECT LEFT('Hello World', 5);               -- 结果: Hello（取左边5个字符）
SELECT RIGHT('Hello World', 5);              -- 结果: World（取右边5个字符）

-- 替换字符串
SELECT REPLACE('Hello World', 'World', 'SQL');  -- 结果: Hello SQL

-- 去除空格
SELECT TRIM('  hello  ');                    -- 结果: hello（去除两端空格）
SELECT LTRIM('  hello');                     -- 结果: hello（去除左边空格）
SELECT RTRIM('hello  ');                     -- 结果: hello（去除右边空格）

-- 查找位置
SELECT INSTR('Hello World', 'World');        -- 结果: 7（World在字符串中的起始位置）
```

---

## 2.5 数值函数与日期函数

### 代码讲解

```sql
-- ========== 数值函数 ==========
SELECT ABS(-10);              -- 绝对值: 10
SELECT ROUND(3.14159, 2);     -- 四舍五入: 3.14（保留2位小数）
SELECT CEIL(3.2);             -- 向上取整: 4
SELECT FLOOR(3.8);            -- 向下取整: 3
SELECT MOD(10, 3);            -- 取模: 1（10除以3的余数）
SELECT POWER(2, 3);           -- 幂运算: 8（2的3次方）
SELECT SQRT(16);              -- 平方根: 4
SELECT RAND();                -- 随机数: 0到1之间的随机小数

-- ========== 日期函数 ==========
SELECT CURDATE();             -- 当前日期: 2024-07-25
SELECT CURTIME();             -- 当前时间: 14:30:00
SELECT NOW();                 -- 当前日期时间: 2024-07-25 14:30:00
SELECT DATE(NOW());           -- 提取日期部分
SELECT TIME(NOW());           -- 提取时间部分

-- 日期计算
SELECT DATE_ADD('2024-01-01', INTERVAL 30 DAY);   -- 加30天: 2024-01-31
SELECT DATE_SUB('2024-01-01', INTERVAL 1 MONTH);  -- 减1个月: 2023-12-01
SELECT DATEDIFF('2024-07-25', '2024-01-01');      -- 日期差: 205天

-- 提取日期组成部分
SELECT YEAR('2024-07-25');    -- 年: 2024
SELECT MONTH('2024-07-25');   -- 月: 7
SELECT DAY('2024-07-25');     -- 日: 25
SELECT WEEKDAY('2024-07-25'); -- 星期几: 0=周一, 6=周日

-- 格式化日期
SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s');   -- 2024-07-25 14:30:00
SELECT DATE_FORMAT(NOW(), '%Y年%m月%d日');          -- 2024年07月25日
```

---

## 2.6 数据操作练习题

### 一、选择题

**题目1**：以下哪条语句可以正确删除表中所有数据，并且执行速度最快？
- A. `DELETE FROM table_name WHERE 1=1;`
- B. `DELETE * FROM table_name;`
- C. `TRUNCATE TABLE table_name;`
- D. `DROP TABLE table_name;`

<details>
<summary>✅ 答案与解析</summary>

**答案：C**

**解析**：
- A选项虽然能删除所有数据，但逐行删除且记录日志，速度慢
- B选项语法错误，DELETE不需要`*`
- C选项 `TRUNCATE` 直接删除数据页，不记录单行日志，速度最快，且保留表结构
- D选项 `DROP` 会删除整个表（包括结构），不符合"删除数据"的要求
</details>

---

**题目2**：执行 `UPDATE students SET age = age + 1;` 没有加 WHERE 子句，结果是？
- A. 只更新第一条记录
- B. 更新所有记录的 age 字段
- C. 语句执行失败
- D. 没有任何变化

<details>
<summary>✅ 答案与解析</summary>

**答案：B**

**解析**：UPDATE 语句没有 WHERE 条件时，会更新表中**所有记录**的指定字段。这是一个常见的SQL陷阱，生产环境中执行UPDATE前务必确认WHERE条件正确，建议先执行SELECT验证条件。
</details>

---

**题目3**：`DATE_ADD('2024-01-31', INTERVAL 1 MONTH)` 的结果是什么？
- A. `2024-02-31`
- B. `2024-02-29`
- C. `2024-03-02`
- D. `2024-02-28`

<details>
<summary>✅ 答案与解析</summary>

**答案：B**

**解析**：2024年是闰年，2月有29天。`DATE_ADD` 在日期运算时会自动处理月份天数和闰年，1月31日加1个月会调整到2月的最后一天，即2024-02-29。如果是非闰年（如2023年），结果将是2023-02-28。
</details>

---

### 二、判断题

**题目1**：`INSERT INTO table_name VALUES (1, 'A', 20);` 这种写法要求值的数量和顺序必须与表定义完全一致。

<details>
<summary>✅ 答案与解析</summary>

**答案：✅ 正确**

**解析**：省略列名列表的INSERT语句，必须按表中列的定义顺序提供所有字段的值，包括自增主键（通常填NULL让数据库自动生成）。这种写法风险较高，如果表结构变更（如增加字段），语句会出错。推荐使用指定列名的写法。
</details>

---

**题目2**：`TRUNCATE TABLE` 和 `DELETE FROM TABLE` 都可以回滚。

<details>
<summary>✅ 答案与解析</summary>

**答案：❌ 错误**

**解析**：`DELETE` 是DML语句，会记录每行删除的日志，在事务中可以回滚。`TRUNCATE` 是DDL语句，操作不记录单行日志，通常不能回滚（具体取决于数据库实现，但大多数数据库中TRUNCATE不可回滚）。
</details>

---

**题目3**：`SELECT CONCAT('2024', '-', '07')` 的结果类型是数值型。

<details>
<summary>✅ 答案与解析</summary>

**答案：❌ 错误**

**解析**：`CONCAT` 函数用于字符串拼接，所有参数都会被转换为字符串后连接，结果始终是字符串类型。该语句的结果是 `'2024-07'`，是一个字符串，不是数值。
</details>

---

### 三、代码填空题

**题目1**：请补全SQL语句，将所有年龄小于18岁的学生年龄增加1岁。

```sql
___ students 
___ age = age + 1 
___ age < 18;
```

<details>
<summary>✅ 答案与解析</summary>

**答案**：
```sql
UPDATE students 
SET age = age + 1 
WHERE age < 18;
```

**解析**：
- 第一个空填 `UPDATE`，表示更新操作
- 第二个空填 `SET`，指定要更新的字段和新值
- 第三个空填 `WHERE`，限定更新条件，避免全表更新
</details>

---

**题目2**：请补全SQL语句，向 `courses` 表同时插入三条记录。

```sql
___ INTO courses (course_name, credits) 
___ 
    ('高等数学', 4),
    ('大学英语', 3),
    ('计算机基础', ___);
```

<details>
<summary>✅ 答案与解析</summary>

**答案**：
```sql
INSERT INTO courses (course_name, credits) 
VALUES 
    ('高等数学', 4),
    ('大学英语', 3),
    ('计算机基础', 3);
```

**解析**：
- 第一个空填 `INSERT`，插入数据的标准关键字
- 第二个空填 `VALUES`，提供要插入的值列表
- 第三个空填 `3`（或你认为合适的学分值），作为第三条记录的学分
</details>

---

**题目3**：请补全SQL语句，查询所有学生，显示姓名、入学年份（从enrollment_date中提取）和格式化后的当前日期。

```sql
SELECT 
    name,
    ___ (enrollment_date) AS enrollment_year,
    DATE_FORMAT(___, '___') AS today
FROM students;
```

<details>
<summary>✅ 答案与解析</summary>

**答案**：
```sql
SELECT 
    name,
    YEAR(enrollment_date) AS enrollment_year,
    DATE_FORMAT(NOW(), '%Y-%m-%d') AS today
FROM students;
```

**解析**：
- 第一个空填 `YEAR`，从日期中提取年份部分
- 第二个空填 `NOW()`，获取当前日期时间
- 第三个空填 `'%Y-%m-%d'`，日期格式化模板，表示"年-月-日"

**格式化符号说明**：
- `%Y`：四位年份（2024）
- `%m`：两位月份（07）
- `%d`：两位日期（25）
- `%H`：24小时制小时
- `%i`：分钟
- `%s`：秒
</details>

---

---

# 第三部分：高级查询

## 3.1 聚合函数

### 代码讲解

```sql
-- COUNT：计数（统计行数）
SELECT COUNT(*) FROM students;                    -- 统计所有学生人数（包含NULL）
SELECT COUNT(email) FROM students;                -- 统计有邮箱的学生人数（忽略NULL）
SELECT COUNT(DISTINCT gender) FROM students;      -- 统计不同的性别数量

-- SUM：求和
SELECT SUM(credits) FROM courses;                 -- 所有课程的总学分

-- AVG：平均值
SELECT AVG(age) FROM students;                    -- 学生的平均年龄
SELECT AVG(gpa) FROM students WHERE gender = 'F'; -- 女学生的平均绩点

-- MAX / MIN：最大/最小值
SELECT MAX(gpa) FROM students;                    -- 最高绩点
SELECT MIN(enrollment_date) FROM students;        -- 最早的入学日期

-- 组合使用
SELECT 
    COUNT(*) AS total_students,       -- 总人数
    AVG(age) AS avg_age,              -- 平均年龄
    MAX(gpa) AS highest_gpa,          -- 最高绩点
    MIN(gpa) AS lowest_gpa,           -- 最低绩点
    SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS female_count  -- 女生人数
FROM students;
```

---

## 3.2 分组查询（GROUP BY）

### 代码讲解

```sql
-- 按性别分组统计人数
SELECT 
    gender,
    COUNT(*) AS student_count,
    AVG(age) AS avg_age,
    AVG(gpa) AS avg_gpa
FROM students
GROUP BY gender;

-- 按多字段分组（先按性别，再按入学年份）
SELECT 
    gender,
    YEAR(enrollment_date) AS enrollment_year,
    COUNT(*) AS student_count
FROM students
GROUP BY gender, YEAR(enrollment_date)
ORDER BY enrollment_year DESC, gender;

-- 常见错误：SELECT 中的非聚合字段必须出现在 GROUP BY 中
-- 错误示例：
-- SELECT name, gender, COUNT(*) FROM students GROUP BY gender;
-- name 不在 GROUP BY 中，且不是聚合函数，会导致错误（MySQL宽松模式下可能不报错但结果不确定）

-- 正确写法：
SELECT gender, COUNT(*) FROM students GROUP BY gender;
```

---

## 3.3 分组过滤（HAVING）

### 代码讲解

```sql
-- HAVING 用于对分组后的结果进行过滤（WHERE 不能用于过滤聚合结果）

-- 查询平均绩点大于3.5的性别分组
SELECT 
    gender,
    COUNT(*) AS student_count,
    AVG(gpa) AS avg_gpa
FROM students
GROUP BY gender
HAVING AVG(gpa) > 3.5;           -- 过滤平均绩点大于3.5的组

-- WHERE 和 HAVING 同时使用
SELECT 
    gender,
    AVG(gpa) AS avg_gpa
FROM students
WHERE age >= 18                    -- 先过滤：只统计18岁以上的学生
GROUP BY gender
HAVING COUNT(*) > 5;              -- 再过滤：只保留人数超过5人的组

-- 执行顺序：WHERE → GROUP BY → HAVING → ORDER BY
SELECT 
    gender,
    COUNT(*) AS cnt,
    AVG(gpa) AS avg_gpa
FROM students
WHERE enrollment_date >= '2024-01-01'
GROUP BY gender
HAVING cnt > 3
ORDER BY avg_gpa DESC;
```

> 💡 **WHERE vs HAVING 对比**：
> - `WHERE`：过滤原始行，在分组前执行，不能使用聚合函数
> - `HAVING`：过滤分组结果，在分组后执行，可以使用聚合函数

---

## 3.4 表连接（JOIN）

### 代码讲解

```sql
-- ========== 准备数据表 ==========
-- 学生表 students (student_id, name, class_id)
-- 班级表 classes (class_id, class_name, teacher_name)
-- 成绩表 scores (score_id, student_id, course_id, score)
-- 课程表 courses (course_id, course_name, credits)

-- ========== INNER JOIN（内连接）==========
-- 只返回两个表中匹配的记录
SELECT 
    s.name AS 学生姓名,
    c.class_name AS 班级名称,
    c.teacher_name AS 班主任
FROM students s                    -- 主表，s 是别名
INNER JOIN classes c               -- 连接表，c 是别名
    ON s.class_id = c.class_id;    -- 连接条件

-- 多表连接
SELECT 
    s.name AS 学生,
    c.class_name AS 班级,
    co.course_name AS 课程,
    sc.score AS 成绩
FROM students s
INNER JOIN classes c ON s.class_id = c.class_id
INNER JOIN scores sc ON s.student_id = sc.student_id
INNER JOIN courses co ON sc.course_id = co.course_id;

-- ========== LEFT JOIN（左连接）==========
-- 返回左表所有记录，右表不匹配的记录用NULL填充
SELECT 
    s.name AS 学生姓名,
    c.class_name AS 班级名称
FROM students s
LEFT JOIN classes c ON s.class_id = c.class_id;
-- 结果包含：有班级的学生 + 没有班级的学生（班级名称为NULL）

-- ========== RIGHT JOIN（右连接）==========
-- 返回右表所有记录，左表不匹配的记录用NULL填充
SELECT 
    s.name AS 学生姓名,
    c.class_name AS 班级名称
FROM students s
RIGHT JOIN classes c ON s.class_id = c.class_id;
-- 结果包含：有学生的班级 + 没有学生的班级（学生姓名为NULL）

-- ========== FULL OUTER JOIN（全外连接）==========
-- 返回两个表的所有记录，不匹配的部分用NULL填充
-- MySQL不支持FULL JOIN，可用 UNION 模拟
SELECT s.name, c.class_name FROM students s LEFT JOIN classes c ON s.class_id = c.class_id
UNION
SELECT s.name, c.class_name FROM students s RIGHT JOIN classes c ON s.class_id = c.class_id;

-- ========== CROSS JOIN（交叉连接）==========
-- 笛卡尔积：左表每条记录与右表每条记录组合
-- 3个学生 × 4个班级 = 12条结果
SELECT s.name, c.class_name 
FROM students s
CROSS JOIN classes c;

-- ========== 自连接（SELF JOIN）==========
-- 表与自身连接，常用于层级结构（如员工与上级）
-- 查询每个学生的同班同学
SELECT 
    a.name AS 学生A,
    b.name AS 学生B,
    a.class_id
FROM students a
JOIN students b ON a.class_id = b.class_id AND a.student_id <> b.student_id;
```

**JOIN 类型对比图：**

| JOIN 类型 | 结果说明 | 使用场景 |
|-----------|----------|----------|
| INNER JOIN | 只返回匹配的记录 | 查询有关联的数据 |
| LEFT JOIN | 返回左表所有记录 | 查询所有学生及其班级（包括未分班的） |
| RIGHT JOIN | 返回右表所有记录 | 查询所有班级及其学生（包括空班） |
| FULL JOIN | 返回两边所有记录 | 查询所有学生和所有班级 |
| CROSS JOIN | 返回笛卡尔积 | 生成组合数据 |

---

## 3.5 子查询（Subquery）

### 代码讲解

```sql
-- ========== 标量子查询（返回单个值）==========
-- 查询高于平均绩点的学生
SELECT * FROM students 
WHERE gpa > (SELECT AVG(gpa) FROM students);

-- ========== 行子查询（返回一行）==========
-- 查询与学号为1的学生同班的所有学生
SELECT * FROM students 
WHERE class_id = (SELECT class_id FROM students WHERE student_id = 1);

-- ========== 表子查询（返回多行多列）==========
-- 查询每个班级的最高绩点学生
SELECT s.name, s.class_id, s.gpa
FROM students s
INNER JOIN (
    SELECT class_id, MAX(gpa) AS max_gpa
    FROM students
    GROUP BY class_id
) AS max_gpa_table
ON s.class_id = max_gpa_table.class_id 
   AND s.gpa = max_gpa_table.max_gpa;

-- ========== 相关子查询（Correlated Subquery）==========
-- 子查询依赖外层查询的值，每行执行一次
-- 查询每个班级中年龄大于本班平均年龄的学生
SELECT s1.name, s1.age, s1.class_id
FROM students s1
WHERE s1.age > (
    SELECT AVG(s2.age) 
    FROM students s2 
    WHERE s2.class_id = s1.class_id  -- 关联条件
);

-- ========== EXISTS（存在性查询）==========
-- 查询至少有一门课程成绩超过90分的学生
SELECT name FROM students s
WHERE EXISTS (
    SELECT 1 FROM scores sc 
    WHERE sc.student_id = s.student_id AND sc.score > 90
);

-- NOT EXISTS：查询没有任何成绩记录的学生
SELECT name FROM students s
WHERE NOT EXISTS (
    SELECT 1 FROM scores sc WHERE sc.student_id = s.student_id
);

-- ========== IN / NOT IN（集合判断）==========
-- 查询参加了"高等数学"课程的学生
SELECT name FROM students 
WHERE student_id IN (
    SELECT student_id FROM scores sc
    JOIN courses c ON sc.course_id = c.course_id
    WHERE c.course_name = '高等数学'
);

-- NOT IN 注意NULL值问题！
-- 如果子查询返回NULL，NOT IN 永远返回空结果
```

---

## 3.6 高级查询练习题

### 一、选择题

**题目1**：以下关于 `WHERE` 和 `HAVING` 的说法，正确的是？
- A. WHERE 和 HAVING 都可以在分组后过滤聚合结果
- B. HAVING 可以在分组前过滤原始数据行
- C. WHERE 在分组前执行，不能使用聚合函数；HAVING 在分组后执行，可以使用聚合函数
- D. WHERE 和 HAVING 功能完全相同，可以互换使用

<details>
<summary>✅ 答案与解析</summary>

**答案：C**

**解析**：
- WHERE 在 GROUP BY 之前执行，过滤原始数据行，不能使用聚合函数（如 COUNT、AVG）
- HAVING 在 GROUP BY 之后执行，过滤分组后的结果，可以使用聚合函数
- 两者执行时机和功能不同，不能互换
</details>

---

**题目2**：执行 `LEFT JOIN` 时，结果集中会包含？
- A. 仅两个表都匹配的记录
- B. 左表所有记录，右表不匹配的记录被丢弃
- C. 左表所有记录，右表不匹配的记录用 NULL 填充
- D. 两个表的所有记录，不匹配的记录用 NULL 填充

<details>
<summary>✅ 答案与解析</summary>

**答案：C**

**解析**：LEFT JOIN（左连接）以左表为基准，返回左表的所有记录。对于右表中不匹配的记录，对应的右表字段会用 NULL 填充。D选项描述的是 FULL OUTER JOIN。
</details>

---

**题目3**：以下哪个子查询会返回多行多列结果？
- A. `SELECT MAX(score) FROM scores`
- B. `SELECT student_id, score FROM scores WHERE score > 90`
- C. `SELECT AVG(score) FROM scores WHERE student_id = 1`
- D. `SELECT COUNT(*) FROM scores`

<details>
<summary>✅ 答案与解析</summary>

**答案：B**

**解析**：
- A、C、D 都是聚合函数查询，返回单个值（标量）
- B 查询分数大于90的学生ID和分数，可能返回多条记录，每条记录包含两列（student_id 和 score），属于表子查询
</details>

---

### 二、判断题

**题目1**：`SELECT class_id, name, COUNT(*) FROM students GROUP BY class_id;` 在标准SQL中是合法的。

<details>
<summary>✅ 答案与解析</summary>

**答案：❌ 错误**

**解析**：在标准SQL中，SELECT 子句中的非聚合字段必须出现在 GROUP BY 子句中。`name` 既不是聚合函数，也不在 GROUP BY 中，因此该语句在标准SQL中不合法（MySQL的宽松模式下可能执行，但结果不确定）。
</details>

---

**题目2**：`SELECT * FROM A CROSS JOIN B` 的结果行数等于 A 表行数乘以 B 表行数。

<details>
<summary>✅ 答案与解析</summary>

**答案：✅ 正确**

**解析**：CROSS JOIN 产生笛卡尔积，结果集中的每一行都是左表一行与右表一行的组合。如果A表有m行，B表有n行，结果集就有 m × n 行。
</details>

---

**题目3**：相关子查询（Correlated Subquery）只执行一次。

<details>
<summary>✅ 答案与解析</summary>

**答案：❌ 错误**

**解析**：相关子查询依赖外层查询的当前行值，因此外层查询每处理一行，子查询就要执行一次。而非相关子查询（独立子查询）只执行一次，结果缓存后供外层使用。相关子查询性能通常较差，大数据量时应考虑改用 JOIN。
</details>

---

### 三、代码填空题

**题目1**：请补全SQL语句，查询每个班级的学生人数，并只显示人数超过10人的班级。

```sql
SELECT class_id, ___(*) AS student_count
FROM students
___ BY class_id
___ student_count > 10;
```

<details>
<summary>✅ 答案与解析</summary>

**答案**：
```sql
SELECT class_id, COUNT(*) AS student_count
FROM students
GROUP BY class_id
HAVING student_count > 10;
```

**解析**：
- 第一个空填 `COUNT`，聚合函数统计人数
- 第二个空填 `GROUP`，按班级分组
- 第三个空填 `HAVING`，对分组结果进行过滤（不能用WHERE过滤聚合结果）
</details>

---

**题目2**：请补全SQL语句，查询所有学生及其班级信息，包括没有班级的学生。

```sql
SELECT s.name, c.class_name
FROM students s
___ JOIN classes c 
___ s.class_id = c.class_id;
```

<details>
<summary>✅ 答案与解析</summary>

**答案**：
```sql
SELECT s.name, c.class_name
FROM students s
LEFT JOIN classes c 
ON s.class_id = c.class_id;
```

**解析**：
- 第一个空填 `LEFT`，左连接保留左表（students）的所有记录
- 第二个空填 `ON`，指定连接条件
- 使用LEFT JOIN可以确保没有班级的学生也出现在结果中（class_name为NULL）
</details>

---

**题目3**：请补全SQL语句，查询绩点高于全校平均绩点的学生姓名和绩点。

```sql
SELECT name, gpa 
FROM students 
WHERE gpa ___ (___ AVG(gpa) ___ students);
```

<details>
<summary>✅ 答案与解析</summary>

**答案**：
```sql
SELECT name, gpa 
FROM students 
WHERE gpa > (SELECT AVG(gpa) FROM students);
```

**解析**：
- 第一个空填 `>`，表示"大于"
- 第二个空填 `SELECT`，子查询开始
- 第三个空填 `FROM`，指定子查询的数据源

这是一个标量子查询，返回全校平均绩点这一个值，外层查询用它作为比较条件。
</details>

---

---

# 第四部分：数据库设计与约束

## 4.1 数据完整性约束

### 代码讲解

```sql
-- ========== 创建带完整约束的订单表 ==========
CREATE TABLE orders (
    order_id        INT PRIMARY KEY AUTO_INCREMENT COMMENT '订单ID',
    customer_id     INT NOT NULL COMMENT '客户ID',
    order_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
    total_amount    DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
    status          VARCHAR(20) DEFAULT 'pending' COMMENT '订单状态',

    -- CHECK约束：确保金额为正数
    CONSTRAINT chk_amount CHECK (total_amount > 0),

    -- CHECK约束：限制状态值
    CONSTRAINT chk_status CHECK (status IN ('pending', 'paid', 'shipped', 'completed', 'cancelled'))
) COMMENT='订单表';

-- ========== 外键约束 ==========
CREATE TABLE order_items (
    item_id         INT PRIMARY KEY AUTO_INCREMENT,
    order_id        INT NOT NULL COMMENT '所属订单',
    product_id      INT NOT NULL COMMENT '商品ID',
    quantity        INT NOT NULL COMMENT '数量',
    unit_price      DECIMAL(10,2) NOT NULL COMMENT '单价',

    -- 外键约束：关联orders表
    CONSTRAINT fk_order_items_order 
        FOREIGN KEY (order_id) 
        REFERENCES orders(order_id)
        ON DELETE CASCADE          -- 删除订单时，自动删除关联的订单项
        ON UPDATE CASCADE,         -- 订单ID更新时，级联更新

    -- 外键约束：关联products表
    CONSTRAINT fk_order_items_product 
        FOREIGN KEY (product_id) 
        REFERENCES products(product_id)
        ON DELETE RESTRICT         -- 禁止删除有关联订单的商品
        ON UPDATE CASCADE,

    -- 检查约束：数量必须大于0
    CONSTRAINT chk_quantity CHECK (quantity > 0)
) COMMENT='订单明细表';
```

**外键的级联操作：**

| 操作 | 说明 |
|------|------|
| `CASCADE` | 级联操作，主表变更时从表同步变更 |
| `RESTRICT` | 拒绝操作，如果从表有关联数据则禁止主表操作 |
| `SET NULL` | 主表删除/更新时，从表外键设为NULL（要求字段可为NULL） |
| `NO ACTION` | 同RESTRICT，但检查时机略有不同 |
| `SET DEFAULT` | 设为默认值（部分数据库支持） |

---

## 4.2 索引（Index）

### 代码讲解

```sql
-- ========== 创建索引 ==========
-- 单列索引：加速WHERE条件查询
CREATE INDEX idx_students_name ON students(name);

-- 唯一索引：确保字段值唯一，同时加速查询
CREATE UNIQUE INDEX idx_students_email ON students(email);

-- 组合索引：多列联合索引，注意最左前缀原则
CREATE INDEX idx_students_class_gpa ON students(class_id, gpa);
-- 查询条件为 class_id 或 class_id + gpa 时会使用该索引
-- 单独查询 gpa 不会使用该索引

-- 全文索引：用于文本搜索（MySQL）
CREATE FULLTEXT INDEX idx_articles_content ON articles(content);

-- 前缀索引：对大字段使用前缀，节省空间
CREATE INDEX idx_students_email_prefix ON students(email(10));

-- ========== 查看索引 ==========
SHOW INDEX FROM students;

-- ========== 删除索引 ==========
DROP INDEX idx_students_name ON students;
ALTER TABLE students DROP INDEX idx_students_name;

-- ========== 创建表时定义索引 ==========
CREATE TABLE products (
    product_id      INT PRIMARY KEY AUTO_INCREMENT,
    product_name    VARCHAR(200) NOT NULL,
    category_id     INT NOT NULL,
    price           DECIMAL(10,2) NOT NULL,
    description     TEXT,

    INDEX idx_category (category_id),           -- 普通索引
    INDEX idx_name_price (product_name, price), -- 组合索引
    FULLTEXT INDEX idx_description (description) -- 全文索引
);
```

**索引使用原则：**
- ✅ 频繁作为查询条件的字段
- ✅ 经常用于 JOIN 的字段
- ✅ 经常用于 ORDER BY / GROUP BY 的字段
- ❌ 数据量很小的表（索引维护成本大于收益）
- ❌ 频繁更新的字段（索引需要同步维护）
- ❌ 重复度很高的字段（如性别，区分度低）

---

## 4.3 数据库范式（Normal Forms）

### 知识点讲解

**第一范式（1NF）：原子性**
- 每个字段值都是不可再分的原子值
- 不允许有多值属性或重复组

```sql
-- ❌ 不符合1NF：hobbies字段包含多个值
CREATE TABLE bad_students (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    hobbies VARCHAR(200)  -- '篮球,足球,游泳' 多个值用逗号分隔
);

-- ✅ 符合1NF：拆分为独立表
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE student_hobbies (
    student_id INT,
    hobby VARCHAR(50),
    PRIMARY KEY (student_id, hobby),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);
```

**第二范式（2NF）：消除部分函数依赖**
- 满足1NF
- 非主键字段必须完全依赖于整个主键（针对复合主键）

```sql
-- ❌ 不符合2NF：teacher_name 只依赖于 course_id，不依赖于 student_id
-- 联合主键 (student_id, course_id)
CREATE TABLE bad_scores (
    student_id INT,
    course_id INT,
    score DECIMAL(4,2),
    teacher_name VARCHAR(50),  -- 只依赖course_id
    PRIMARY KEY (student_id, course_id)
);

-- ✅ 符合2NF：拆分为两个表
CREATE TABLE scores (
    student_id INT,
    course_id INT,
    score DECIMAL(4,2),
    PRIMARY KEY (student_id, course_id)
);

CREATE TABLE courses (
    course_id INT PRIMARY KEY,
    course_name VARCHAR(100),
    teacher_name VARCHAR(50)
);
```

**第三范式（3NF）：消除传递函数依赖**
- 满足2NF
- 非主键字段必须直接依赖于主键，不能传递依赖

```sql
-- ❌ 不符合3NF：class_teacher 依赖于 class_id，class_id 依赖于 student_id（传递依赖）
CREATE TABLE bad_students (
    student_id INT PRIMARY KEY,
    name VARCHAR(50),
    class_id INT,
    class_name VARCHAR(50),
    class_teacher VARCHAR(50)  -- 应该属于class表
);

-- ✅ 符合3NF
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    name VARCHAR(50),
    class_id INT,
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
);

CREATE TABLE classes (
    class_id INT PRIMARY KEY,
    class_name VARCHAR(50),
    teacher_name VARCHAR(50)
);
```

**范式对比总结：**

| 范式 | 要求 | 解决的问题 |
|------|------|------------|
| 1NF | 字段原子性 | 重复组、多值属性 |
| 2NF | 消除部分依赖 | 复合主键的部分依赖 |
| 3NF | 消除传递依赖 | 非主键字段的传递依赖 |
| BCNF | 消除主属性依赖 | 更严格的3NF |

---

## 4.4 数据库设计练习题

### 一、选择题

**题目1**：以下关于索引的说法，错误的是？
- A. 索引可以加速数据查询
- B. 索引会降低数据插入、更新、删除的速度
- C. 索引越多越好，应该为每个字段都创建索引
- D. 唯一索引可以确保字段值的唯一性

<details>
<summary>✅ 答案与解析</summary>

**答案：C**

**解析**：
- A正确：索引的主要作用是加速查询
- B正确：索引需要维护，DML操作时需要同步更新索引，因此会降低写入性能
- C错误：索引不是越多越好。过多索引会占用存储空间，增加维护开销，降低写入性能。应该只为频繁查询的字段创建索引
- D正确：唯一索引同时具有索引加速和唯一约束的功能
</details>

---

**题目2**：外键约束中的 `ON DELETE CASCADE` 表示？
- A. 删除从表数据时，级联删除主表数据
- B. 删除主表数据时，自动删除从表中关联的数据
- C. 删除主表数据时，拒绝删除
- D. 删除主表数据时，将从表外键设为NULL

<details>
<summary>✅ 答案与解析</summary>

**答案：B**

**解析**：`ON DELETE CASCADE` 定义在主表数据被删除时的行为：自动级联删除从表中与之关联的所有记录。例如删除订单时，自动删除该订单的所有订单项。
</details>

---

**题目3**：一个学生表包含 `student_id`（主键）、`name`、`class_id`、`class_name`、`class_teacher`，该表最高满足第几范式？
- A. 1NF
- B. 2NF
- C. 3NF
- D. BCNF

<details>
<summary>✅ 答案与解析</summary>

**答案：B**

**解析**：
- 满足1NF：字段都是原子值
- 满足2NF：主键是单字段（student_id），不存在部分依赖
- 不满足3NF：`class_name` 和 `class_teacher` 依赖于 `class_id`，而 `class_id` 依赖于主键 `student_id`，存在传递依赖。应该拆分为 students 表和 classes 表
</details>

---

### 二、判断题

**题目1**：主键约束和唯一约束都允许字段值为 NULL。

<details>
<summary>✅ 答案与解析</summary>

**答案：❌ 错误**

**解析**：
- 主键约束：不允许NULL值，且每张表只能有一个主键
- 唯一约束：允许NULL值（通常只允许一个NULL，因为NULL之间被认为不相等），一张表可以有多个唯一约束
</details>

---

**题目2**：组合索引 `(a, b, c)` 可以支持查询条件 `WHERE b = 1 AND c = 2` 使用索引。

<details>
<summary>✅ 答案与解析</summary>

**答案：❌ 错误**

**解析**：组合索引遵循"最左前缀原则"。索引 `(a, b, c)` 可以支持：
- `WHERE a = ?`
- `WHERE a = ? AND b = ?`
- `WHERE a = ? AND b = ? AND c = ?`
- `WHERE a = ? AND c = ?`（部分使用）

但 `WHERE b = ? AND c = ?` 跳过了最左列 `a`，无法使用该组合索引。
</details>

---

**题目3**：`TRUNCATE TABLE` 操作会触发触发器（Trigger）。

<details>
<summary>✅ 答案与解析</summary>

**答案：❌ 错误**

**解析**：`TRUNCATE` 是DDL（数据定义语言）操作，不是DML操作。在大多数数据库中，TRUNCATE 不会触发 DELETE 触发器，因为它不逐行删除数据，而是直接释放数据页。
</details>

---

### 三、代码填空题

**题目1**：请补全SQL语句，创建一个用户表，要求用户名唯一且不能为空，邮箱唯一，创建时间默认为当前时间。

```sql
CREATE TABLE users (
    user_id     INT PRIMARY KEY ___,
    username    VARCHAR(50) ___ ___ COMMENT '用户名',
    email       VARCHAR(100) ___ COMMENT '邮箱',
    created_at  TIMESTAMP ___ ___ ___ COMMENT '创建时间'
);
```

<details>
<summary>✅ 答案与解析</summary>

**答案**：
```sql
CREATE TABLE users (
    user_id     INT PRIMARY KEY AUTO_INCREMENT,
    username    VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    email       VARCHAR(100) UNIQUE COMMENT '邮箱',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
);
```

**解析**：
- 第一个空填 `AUTO_INCREMENT`，用户ID自增
- 第二个空填 `NOT NULL`，用户名不能为空
- 第三个空填 `UNIQUE`，用户名唯一
- 第四个空填 `UNIQUE`，邮箱唯一
- 第五个空填 `DEFAULT`
- 第六个空填 `CURRENT_TIMESTAMP`，默认当前时间

**注意**：不同数据库默认值语法不同：
- MySQL：`DEFAULT CURRENT_TIMESTAMP`
- PostgreSQL：`DEFAULT NOW()`
- SQL Server：`DEFAULT GETDATE()`
</details>

---

**题目2**：请补全SQL语句，为订单表创建外键，关联客户表，并设置删除客户时拒绝删除（如果有未完成的订单）。

```sql
ALTER TABLE orders
ADD CONSTRAINT fk_orders_customer
    ___ KEY (customer_id)
    ___ customers(customer_id)
    ON DELETE ___
    ON UPDATE CASCADE;
```

<details>
<summary>✅ 答案与解析</summary>

**答案**：
```sql
ALTER TABLE orders
ADD CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id)
    REFERENCES customers(customer_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;
```

**解析**：
- 第一个空填 `FOREIGN`，定义外键约束
- 第二个空填 `REFERENCES`，指定引用的表和字段
- 第三个空填 `RESTRICT`，当客户有关联订单时拒绝删除客户

**RESTRICT vs CASCADE**：
- RESTRICT：保护数据完整性，有依赖时禁止删除
- CASCADE：级联操作，删除客户时自动删除其所有订单
- 实际业务中，通常使用 RESTRICT 或 SET NULL 来保护数据
</details>

---

**题目3**：请补全SQL语句，查询没有创建任何订单的客户（使用 NOT EXISTS）。

```sql
SELECT c.customer_id, c.customer_name
FROM customers c
WHERE ___ ___ (
    SELECT 1 
    FROM orders o 
    ___ o.customer_id = c.customer_id
);
```

<details>
<summary>✅ 答案与解析</summary>

**答案**：
```sql
SELECT c.customer_id, c.customer_name
FROM customers c
WHERE NOT EXISTS (
    SELECT 1 
    FROM orders o 
    WHERE o.customer_id = c.customer_id
);
```

**解析**：
- 第一个空填 `NOT`
- 第二个空填 `EXISTS`
- 第三个空填 `WHERE`

`NOT EXISTS` 是判断子查询是否返回空结果的高效方式。对于 customers 表中的每一行，检查 orders 表中是否存在 customer_id 匹配的记录。如果不存在（即该客户没有订单），则返回该客户信息。相比 `NOT IN`，`NOT EXISTS` 能正确处理 NULL 值。
</details>

---

---

# 第五部分：高级主题

## 5.1 视图（View）

### 代码讲解

```sql
-- ========== 创建视图 ==========
-- 创建学生成绩汇总视图（简化复杂查询）
CREATE VIEW v_student_scores AS
SELECT 
    s.student_id,
    s.name AS student_name,
    c.class_name,
    COUNT(sc.score_id) AS course_count,           -- 选修课程数
    AVG(sc.score) AS avg_score,                   -- 平均分
    MAX(sc.score) AS highest_score,               -- 最高分
    MIN(sc.score) AS lowest_score                 -- 最低分
FROM students s
LEFT JOIN classes c ON s.class_id = c.class_id
LEFT JOIN scores sc ON s.student_id = sc.student_id
GROUP BY s.student_id, s.name, c.class_name;

-- 使用视图（像查询表一样简单）
SELECT * FROM v_student_scores WHERE avg_score > 85;

-- ========== 创建带条件的视图 ==========
-- 只显示优秀学生（平均分≥90）
CREATE VIEW v_excellent_students AS
SELECT * FROM v_student_scores WHERE avg_score >= 90;

-- ========== 可更新视图 ==========
-- 简单视图（单表，无聚合）可以直接更新
CREATE VIEW v_students_basic AS
SELECT student_id, name, gender, age FROM students;

-- 通过视图更新数据（实际更新的是基础表）
UPDATE v_students_basic SET age = 21 WHERE student_id = 1;

-- ========== 修改和删除视图 ==========
-- 修改视图（或先删除再创建）
CREATE OR REPLACE VIEW v_student_scores AS
SELECT 
    s.student_id,
    s.name AS student_name,
    c.class_name,
    AVG(sc.score) AS avg_score
FROM students s
LEFT JOIN classes c ON s.class_id = c.class_id
LEFT JOIN scores sc ON s.student_id = sc.student_id
GROUP BY s.student_id, s.name, c.class_name;

-- 删除视图
DROP VIEW IF EXISTS v_student_scores;
```

**视图的优点：**
- 简化复杂查询，提供清晰的数据接口
- 增强安全性（隐藏敏感字段，只暴露必要数据）
- 逻辑数据独立性（底层表结构变更不影响应用）

**视图的限制：**
- 涉及多表、聚合、DISTINCT 的视图通常不可更新
- 性能可能略低于直接查询（视图的查询会展开执行）

---

## 5.2 存储过程与函数（Stored Procedure / Function）

### 代码讲解

```sql
-- ========== 存储过程（MySQL语法）==========
DELIMITER //  -- 修改分隔符，避免与过程中的分号冲突

CREATE PROCEDURE sp_get_student_by_id(IN p_student_id INT)
BEGIN
    -- 根据学生ID查询学生详情
    SELECT 
        s.*, 
        c.class_name 
    FROM students s
    LEFT JOIN classes c ON s.class_id = c.class_id
    WHERE s.student_id = p_student_id;
END //

DELIMITER ;  -- 恢复默认分隔符

-- 调用存储过程
CALL sp_get_student_by_id(1);

-- ========== 带输出参数的存储过程 ==========
DELIMITER //

CREATE PROCEDURE sp_get_class_stats(
    IN p_class_id INT,           -- 输入参数
    OUT p_student_count INT,     -- 输出参数：学生人数
    OUT p_avg_gpa DECIMAL(3,2)  -- 输出参数：平均绩点
)
BEGIN
    -- 统计班级学生人数
    SELECT COUNT(*) INTO p_student_count
    FROM students 
    WHERE class_id = p_class_id;

    -- 统计班级平均绩点
    SELECT AVG(gpa) INTO p_avg_gpa
    FROM students 
    WHERE class_id = p_class_id;
END //

DELIMITER ;

-- 调用带输出参数的存储过程
CALL sp_get_class_stats(1, @student_count, @avg_gpa);
SELECT @student_count AS 学生人数, @avg_gpa AS 平均绩点;

-- ========== 带流程控制的存储过程 ==========
DELIMITER //

CREATE PROCEDURE sp_update_student_grade(IN p_student_id INT)
BEGIN
    DECLARE v_gpa DECIMAL(3,2);    -- 声明变量
    DECLARE v_grade VARCHAR(10);   -- 等级

    -- 查询学生绩点
    SELECT gpa INTO v_gpa 
    FROM students 
    WHERE student_id = p_student_id;

    -- 根据绩点判断等级
    IF v_gpa >= 3.7 THEN
        SET v_grade = '优秀';
    ELSEIF v_gpa >= 3.0 THEN
        SET v_grade = '良好';
    ELSEIF v_gpa >= 2.0 THEN
        SET v_grade = '及格';
    ELSE
        SET v_grade = '不及格';
    END IF;

    -- 返回结果
    SELECT p_student_id AS 学生ID, v_gpa AS 绩点, v_grade AS 等级;
END //

DELIMITER ;

-- ========== 自定义函数 ==========
DELIMITER //

CREATE FUNCTION fn_calculate_grade(p_score DECIMAL(5,2))
RETURNS VARCHAR(10)               -- 返回类型
DETERMINISTIC                     -- 确定性函数（相同输入总是相同输出）
BEGIN
    DECLARE v_grade VARCHAR(10);

    CASE 
        WHEN p_score >= 90 THEN SET v_grade = 'A';
        WHEN p_score >= 80 THEN SET v_grade = 'B';
        WHEN p_score >= 70 THEN SET v_grade = 'C';
        WHEN p_score >= 60 THEN SET v_grade = 'D';
        ELSE SET v_grade = 'F';
    END CASE;

    RETURN v_grade;
END //

DELIMITER ;

-- 使用自定义函数
SELECT 
    student_id,
    score,
    fn_calculate_grade(score) AS grade
FROM scores;

-- ========== 删除存储过程和函数 ==========
DROP PROCEDURE IF EXISTS sp_get_student_by_id;
DROP FUNCTION IF EXISTS fn_calculate_grade;
```

---

## 5.3 触发器（Trigger）

### 代码讲解

```sql
-- ========== 创建触发器：自动更新更新时间 ==========
-- BEFORE UPDATE 触发器：在更新前自动设置更新时间
DELIMITER //

CREATE TRIGGER trg_students_before_update
BEFORE UPDATE ON students           -- 触发时机和事件
FOR EACH ROW                        -- 对每一行触发
BEGIN
    SET NEW.updated_at = NOW();     -- NEW 表示更新后的新记录
END //

DELIMITER ;

-- ========== 创建触发器：记录操作日志 ==========
-- AFTER INSERT 触发器：插入后记录日志
DELIMITER //

CREATE TRIGGER trg_students_after_insert
AFTER INSERT ON students
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, operation, record_id, operation_time, details)
    VALUES ('students', 'INSERT', NEW.student_id, NOW(), CONCAT('Inserted: ', NEW.name));
END //

DELIMITER ;

-- ========== 创建触发器：防止非法删除 ==========
-- BEFORE DELETE 触发器：删除前检查条件
DELIMITER //

CREATE TRIGGER trg_students_before_delete
BEFORE DELETE ON students
FOR EACH ROW
BEGIN
    -- 如果学生还有未完成的订单，禁止删除
    IF EXISTS (SELECT 1 FROM orders WHERE customer_id = OLD.student_id AND status != 'completed') THEN
        SIGNAL SQLSTATE '45000'                     -- 触发错误
        SET MESSAGE_TEXT = 'Cannot delete student with active orders';
    END IF;
END //

DELIMITER ;

-- ========== 查看和删除触发器 ==========
SHOW TRIGGERS;                                    -- 查看所有触发器
SHOW CREATE TRIGGER trg_students_before_update;     -- 查看触发器定义
DROP TRIGGER IF EXISTS trg_students_before_update;  -- 删除触发器
```

**触发器类型：**

| 触发时机 | 触发事件 | 说明 |
|----------|----------|------|
| BEFORE | INSERT | 插入前验证或修改数据 |
| AFTER | INSERT | 插入后执行关联操作（如记录日志） |
| BEFORE | UPDATE | 更新前验证或自动填充字段 |
| AFTER | UPDATE | 更新后同步其他表 |
| BEFORE | DELETE | 删除前检查约束条件 |
| AFTER | DELETE | 删除后清理关联数据 |

---

## 5.4 事务（Transaction）

### 代码讲解

```sql
-- ========== 基本事务控制 ==========
-- 转账操作：需要保证原子性
START TRANSACTION;                  -- 开始事务（或 BEGIN）

-- 从账户A扣款
UPDATE accounts 
SET balance = balance - 1000 
WHERE account_id = 'A';

-- 向账户B加款
UPDATE accounts 
SET balance = balance + 1000 
WHERE account_id = 'B';

-- 检查是否有异常（余额不足等）
-- 如果没有问题，提交事务
COMMIT;                             -- 提交：所有更改永久生效

-- 如果有问题，回滚事务
-- ROLLBACK;                        -- 回滚：撤销所有更改

-- ========== 事务的ACID特性 ==========
-- A - Atomicity（原子性）：事务中的所有操作要么全部完成，要么全部不完成
-- C - Consistency（一致性）：事务执行前后，数据库从一个一致状态变为另一个一致状态
-- I - Isolation（隔离性）：并发事务之间相互隔离，互不干扰
-- D - Durability（持久性）：事务提交后，更改永久保存

-- ========== 事务隔离级别 ==========
-- 查看当前隔离级别
SELECT @@transaction_isolation;     -- MySQL 8.0+

-- 设置隔离级别
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;

/*
隔离级别（从低到高）：
1. READ UNCOMMITTED（读未提交）：可能读取到其他事务未提交的数据（脏读）
2. READ COMMITTED（读已提交）：只能读取已提交的数据（Oracle默认）
3. REPEATABLE READ（可重复读）：同一事务内多次读取结果一致（MySQL默认）
4. SERIALIZABLE（串行化）：完全串行执行，性能最低但最安全
*/

-- ========== 保存点（Savepoint）==========
START TRANSACTION;

INSERT INTO orders (customer_id, total_amount) VALUES (1, 500);
SAVEPOINT sp_after_order;           -- 设置保存点

INSERT INTO order_items (order_id, product_id, quantity) VALUES (LAST_INSERT_ID(), 101, 2);

-- 如果订单项有问题，只回滚到保存点
ROLLBACK TO SAVEPOINT sp_after_order;

-- 继续其他操作...
COMMIT;

-- ========== 事务中的锁 ==========
-- 显式加锁（悲观锁）
START TRANSACTION;
SELECT * FROM accounts WHERE account_id = 'A' FOR UPDATE;  -- 排他锁
-- 其他事务无法修改该行，直到当前事务提交或回滚
UPDATE accounts SET balance = balance - 100 WHERE account_id = 'A';
COMMIT;

-- 乐观锁（通过版本号实现）
UPDATE accounts 
SET balance = balance - 100, version = version + 1 
WHERE account_id = 'A' AND version = 1;  -- 只有版本号匹配才更新
```

**并发问题：**

| 问题 | 说明 | 解决隔离级别 |
|------|------|-------------|
| 脏读（Dirty Read） | 读取到其他事务未提交的数据 | READ COMMITTED |
| 不可重复读（Non-repeatable Read） | 同一事务内两次读取结果不同 | REPEATABLE READ |
| 幻读（Phantom Read） | 同一事务内两次查询，结果集行数不同 | SERIALIZABLE |

---

## 5.5 SQL优化基础

### 代码讲解

```sql
-- ========== 使用 EXPLAIN 分析查询 ==========
EXPLAIN SELECT * FROM students WHERE name = '张三';

-- 分析结果关键字段：
-- type: 访问类型（system > const > eq_ref > ref > range > index > ALL）
-- key: 实际使用的索引
-- rows: 估计需要扫描的行数
-- Extra: 额外信息（Using index 表示覆盖索引，Using filesort 需要优化）

-- ========== 避免 SELECT * ==========
-- ❌ 低效：返回所有列，增加网络传输和内存消耗
SELECT * FROM students WHERE class_id = 1;

-- ✅ 高效：只查询需要的列
SELECT student_id, name, gpa FROM students WHERE class_id = 1;

-- ========== 索引优化 ==========
-- ✅ 索引字段作为查询条件
SELECT * FROM students WHERE name = '张三';  -- name有索引

-- ❌ 避免对索引字段进行函数操作（会导致索引失效）
SELECT * FROM students WHERE YEAR(enrollment_date) = 2024;  -- 索引失效
-- ✅ 改为范围查询
SELECT * FROM students 
WHERE enrollment_date >= '2024-01-01' AND enrollment_date < '2025-01-01';

-- ❌ 避免前导模糊查询（索引失效）
SELECT * FROM students WHERE name LIKE '%张%';
-- ✅ 使用后缀模糊查询（可以使用索引）
SELECT * FROM students WHERE name LIKE '张%';

-- ========== JOIN 优化 ==========
-- ✅ 小表驱动大表（MySQL中JOIN的顺序优化）
-- 确保关联字段有索引
SELECT * FROM small_table s
JOIN large_table l ON s.id = l.small_id;  -- l.small_id 需要有索引

-- ========== 分页优化 ==========
-- ❌ 深度分页性能差（需要扫描大量数据）
SELECT * FROM students ORDER BY student_id LIMIT 1000000, 10;

-- ✅ 使用覆盖索引 + 子查询优化
SELECT * FROM students
WHERE student_id >= (SELECT student_id FROM students ORDER BY student_id LIMIT 1000000, 1)
ORDER BY student_id LIMIT 10;

-- ========== 批量操作优化 ==========
-- ❌ 逐条插入（N次网络往返）
-- INSERT INTO students (name) VALUES ('A');
-- INSERT INTO students (name) VALUES ('B');
-- ...

-- ✅ 批量插入（1次网络往返）
INSERT INTO students (name) VALUES ('A'), ('B'), ('C'), ('D');

-- ========== 使用 UNION ALL 代替 UNION ==========
-- ❌ UNION 会去重，消耗性能
SELECT name FROM students WHERE class_id = 1
UNION
SELECT name FROM students WHERE class_id = 2;

-- ✅ UNION ALL 不去重，性能更好（如果确定没有重复数据）
SELECT name FROM students WHERE class_id = 1
UNION ALL
SELECT name FROM students WHERE class_id = 2;
```

---

## 5.6 高级主题练习题

### 一、选择题

**题目1**：以下关于事务的说法，错误的是？
- A. 事务具有原子性，要么全部成功，要么全部失败
- B. COMMIT 用于提交事务，使更改永久生效
- C. ROLLBACK 只能回滚整个事务，不能回滚到指定保存点
- D. 事务的隔离性可以防止并发事务之间的干扰

<details>
<summary>✅ 答案与解析</summary>

**答案：C**

**解析**：
- A正确：原子性是事务的基本特性
- B正确：COMMIT 提交事务
- C错误：ROLLBACK 可以回滚整个事务，也可以通过 `ROLLBACK TO SAVEPOINT savepoint_name` 回滚到指定的保存点
- D正确：隔离性确保并发事务互不干扰
</details>

---

**题目2**：在MySQL默认隔离级别（REPEATABLE READ）下，以下哪种并发问题可能发生？
- A. 脏读
- B. 不可重复读
- C. 幻读
- D. 以上都不会发生

<details>
<summary>✅ 答案与解析</summary>

**答案：C**

**解析**：
- MySQL默认隔离级别 REPEATABLE READ 可以防止脏读和不可重复读
- 但在该级别下，幻读仍可能发生（InnoDB通过MVCC和间隙锁在一定程度上解决了幻读，但严格意义上仍属于可能的问题）
- 只有 SERIALIZABLE 级别可以完全防止幻读
</details>

---

**题目3**：以下哪个操作会导致索引失效？
- A. `WHERE name = '张三'`
- B. `WHERE name LIKE '张%'`
- C. `WHERE YEAR(enrollment_date) = 2024`
- D. `WHERE student_id = 1`

<details>
<summary>✅ 答案与解析</summary>

**答案：C**

**解析**：
- A：等值查询，索引有效
- B：前缀模糊查询，可以使用索引
- C：对索引字段使用函数 `YEAR()`，会导致索引失效。因为数据库无法直接使用索引中的原始值与函数计算结果比较。应改为范围查询 `WHERE enrollment_date >= '2024-01-01' AND enrollment_date < '2025-01-01'`
- D：主键等值查询，索引有效
</details>

---

### 二、判断题

**题目1**：视图可以像表一样进行所有的增删改查操作。

<details>
<summary>✅ 答案与解析</summary>

**答案：❌ 错误**

**解析**：
- 简单视图（单表、无聚合、无DISTINCT）可以执行INSERT、UPDATE、DELETE
- 复杂视图（多表JOIN、包含聚合函数、GROUP BY、UNION等）通常只能查询，不能更新
- 即使可以更新，也可能有限制（如不能更新由表达式计算的字段）
</details>

---

**题目2**：触发器中的 `NEW` 关键字在 BEFORE DELETE 触发器中也可以使用。

<details>
<summary>✅ 答案与解析</summary>

**答案：❌ 错误**

**解析**：
- `NEW` 代表新记录值，用于 INSERT 和 UPDATE 操作
- `OLD` 代表旧记录值，用于 UPDATE 和 DELETE 操作
- BEFORE DELETE 触发器中只能使用 `OLD`，因为删除操作没有新值。使用 `NEW` 会导致错误
</details>

---

**题目3**：存储过程和自定义函数的主要区别是：存储过程可以返回多个值，而函数只能返回一个值。

<details>
<summary>✅ 答案与解析</summary>

**答案：✅ 正确**

**解析**：
- 存储过程：通过 OUT 参数可以返回多个值，也可以不返回值，主要用于执行一系列操作
- 自定义函数：必须有且只有一个返回值（通过 RETURN 语句），可以在SQL语句中直接调用
- 另一个区别：函数通常要求确定性（DETERMINISTIC），而存储过程不要求
</details>

---

### 三、代码填空题

**题目1**：请补全SQL语句，创建一个存储过程，根据班级ID查询该班级所有学生的平均绩点。

```sql
DELIMITER //
CREATE ___ sp_class_avg_gpa(IN p_class_id INT)
___
    SELECT AVG(gpa) AS avg_gpa
    FROM students
    ___ class_id = p_class_id;
END //
DELIMITER ;
```

<details>
<summary>✅ 答案与解析</summary>

**答案**：
```sql
DELIMITER //
CREATE PROCEDURE sp_class_avg_gpa(IN p_class_id INT)
BEGIN
    SELECT AVG(gpa) AS avg_gpa
    FROM students
    WHERE class_id = p_class_id;
END //
DELIMITER ;
```

**解析**：
- 第一个空填 `PROCEDURE`，创建存储过程（函数用 `FUNCTION`）
- 第二个空填 `BEGIN`，开始过程体
- 第三个空填 `WHERE`，指定查询条件

调用方式：`CALL sp_class_avg_gpa(1);`
</details>

---

**题目2**：请补全SQL语句，创建一个触发器，在更新学生表时自动记录更新时间和操作人。

```sql
DELIMITER //
CREATE TRIGGER trg_students_update
___ UPDATE ON students
FOR EACH ___
BEGIN
    SET NEW.updated_at = ___;
    SET NEW.updated_by = ___();
END //
DELIMITER ;
```

<details>
<summary>✅ 答案与解析</summary>

**答案**：
```sql
DELIMITER //
CREATE TRIGGER trg_students_update
BEFORE UPDATE ON students
FOR EACH ROW
BEGIN
    SET NEW.updated_at = NOW();
    SET NEW.updated_by = USER();
END //
DELIMITER ;
```

**解析**：
- 第一个空填 `BEFORE`，在更新前执行（确保新值被修改）
- 第二个空填 `ROW`，表示行级触发器（每行触发一次）
- 第三个空填 `NOW()`，获取当前日期时间
- 第四个空填 `USER()`，获取当前数据库用户名

**注意**：`NEW` 表示更新后的新记录，`OLD` 表示更新前的旧记录。
</details>

---

**题目3**：请补全SQL语句，实现银行转账的事务控制（从账户A转1000到账户B）。

```sql
___ TRANSACTION;

UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A';
UPDATE accounts SET balance = balance + 1000 WHERE account_id = 'B';

-- 假设检查通过
___;
```

<details>
<summary>✅ 答案与解析</summary>

**答案**：
```sql
START TRANSACTION;

UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A';
UPDATE accounts SET balance = balance + 1000 WHERE account_id = 'B';

-- 假设检查通过
COMMIT;
```

**解析**：
- 第一个空填 `START`（或 `BEGIN`），开启事务
- 第二个空填 `COMMIT`，提交事务使更改永久生效

**完整的事务处理逻辑**：
```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A';
UPDATE accounts SET balance = balance + 1000 WHERE account_id = 'B';
-- 检查是否有异常（如余额不足）
IF 无异常 THEN
    COMMIT;     -- 提交
ELSE
    ROLLBACK;   -- 回滚
END IF;
```
</details>

---

---

# 第六部分：综合实战与附录

## 6.1 综合实战案例：学生成绩管理系统

### 场景描述
设计一个学生成绩管理系统，包含学生、班级、课程、成绩等表，完成以下需求。

### 表结构设计

```sql
-- 班级表
CREATE TABLE classes (
    class_id    INT PRIMARY KEY AUTO_INCREMENT COMMENT '班级ID',
    class_name  VARCHAR(50) NOT NULL COMMENT '班级名称',
    grade       INT NOT NULL COMMENT '年级',
    teacher_name VARCHAR(50) COMMENT '班主任',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) COMMENT='班级表';

-- 学生表
CREATE TABLE students (
    student_id      INT PRIMARY KEY AUTO_INCREMENT COMMENT '学生ID',
    name            VARCHAR(50) NOT NULL COMMENT '姓名',
    gender          CHAR(1) COMMENT '性别 M/F',
    age             INT CHECK (age BETWEEN 0 AND 100),
    class_id        INT COMMENT '所属班级',
    enrollment_date DATE DEFAULT (CURDATE()),
    gpa             DECIMAL(3,2) COMMENT '总绩点',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
) COMMENT='学生表';

-- 课程表
CREATE TABLE courses (
    course_id   INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL,
    credits     INT NOT NULL DEFAULT 3 CHECK (credits > 0),
    teacher_name VARCHAR(50)
) COMMENT='课程表';

-- 成绩表
CREATE TABLE scores (
    score_id    INT PRIMARY KEY AUTO_INCREMENT,
    student_id  INT NOT NULL,
    course_id   INT NOT NULL,
    score       DECIMAL(5,2) NOT NULL CHECK (score BETWEEN 0 AND 100),
    exam_date   DATE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE (student_id, course_id)  -- 一个学生一门课程只有一个成绩
) COMMENT='成绩表';
```

### 实战查询案例

```sql
-- 案例1：查询每个班级的学生人数、平均绩点、最高最低绩点
SELECT 
    c.class_name,
    COUNT(s.student_id) AS student_count,
    ROUND(AVG(s.gpa), 2) AS avg_gpa,
    MAX(s.gpa) AS max_gpa,
    MIN(s.gpa) AS min_gpa
FROM classes c
LEFT JOIN students s ON c.class_id = s.class_id
GROUP BY c.class_id, c.class_name;

-- 案例2：查询每门课程的成绩统计（平均分、及格率、优秀率）
SELECT 
    c.course_name,
    COUNT(sc.score_id) AS total_students,
    ROUND(AVG(sc.score), 2) AS avg_score,
    ROUND(SUM(CASE WHEN sc.score >= 60 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS pass_rate,
    ROUND(SUM(CASE WHEN sc.score >= 90 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS excellent_rate
FROM courses c
LEFT JOIN scores sc ON c.course_id = sc.course_id
GROUP BY c.course_id, c.course_name;

-- 案例3：查询每个学生的总成绩、平均成绩、排名
SELECT 
    s.student_id,
    s.name,
    SUM(sc.score * co.credits) / SUM(co.credits) AS weighted_avg,  -- 加权平均分
    RANK() OVER (ORDER BY SUM(sc.score * co.credits) / SUM(co.credits) DESC) AS rank_num
FROM students s
LEFT JOIN scores sc ON s.student_id = sc.student_id
LEFT JOIN courses co ON sc.course_id = co.course_id
GROUP BY s.student_id, s.name;

-- 案例4：查询没有参加任何考试的学生（即没有成绩记录）
SELECT s.student_id, s.name
FROM students s
LEFT JOIN scores sc ON s.student_id = sc.student_id
WHERE sc.score_id IS NULL;

-- 或使用 NOT EXISTS
SELECT s.student_id, s.name
FROM students s
WHERE NOT EXISTS (
    SELECT 1 FROM scores sc WHERE sc.student_id = s.student_id
);

-- 案例5：查询各科目前三名的学生
SELECT course_name, student_name, score, rank_num
FROM (
    SELECT 
        c.course_name,
        s.name AS student_name,
        sc.score,
        DENSE_RANK() OVER (PARTITION BY c.course_id ORDER BY sc.score DESC) AS rank_num
    FROM scores sc
    JOIN students s ON sc.student_id = s.student_id
    JOIN courses c ON sc.course_id = c.course_id
) ranked
WHERE rank_num <= 3;
```

---

## 6.2 窗口函数（Window Functions）

### 代码讲解

```sql
-- ========== 排名函数 ==========
SELECT 
    name,
    gpa,
    RANK() OVER (ORDER BY gpa DESC) AS rank_num,           -- 排名，相同值跳号
    DENSE_RANK() OVER (ORDER BY gpa DESC) AS dense_rank,   -- 密集排名，相同值不跳号
    ROW_NUMBER() OVER (ORDER BY gpa DESC) AS row_num       -- 行号，无重复
FROM students;

-- ========== 分区窗口函数 ==========
-- 每个班级内按绩点排名
SELECT 
    class_id,
    name,
    gpa,
    RANK() OVER (PARTITION BY class_id ORDER BY gpa DESC) AS class_rank
FROM students;

-- ========== 聚合窗口函数 ==========
-- 计算累计和、移动平均等
SELECT 
    student_id,
    name,
    gpa,
    AVG(gpa) OVER () AS overall_avg,                        -- 全局平均
    AVG(gpa) OVER (PARTITION BY class_id) AS class_avg,     -- 班级平均
    SUM(gpa) OVER (ORDER BY student_id) AS cumulative_sum,  -- 累计绩点和
    LAG(gpa, 1) OVER (ORDER BY gpa) AS prev_gpa,           -- 上一行的绩点
    LEAD(gpa, 1) OVER (ORDER BY gpa) AS next_gpa            -- 下一行的绩点
FROM students;

-- ========== 窗口范围控制 ==========
SELECT 
    student_id,
    score,
    AVG(score) OVER (
        ORDER BY exam_date 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW   -- 当前行及前2行的平均
    ) AS moving_avg
FROM scores
ORDER BY exam_date;
```

---

## 6.3 学习路线图

```
SQL学习路径
│
├── 第一阶段：基础入门（1-2周）
│   ├── 数据库概念与SQL分类
│   ├── CREATE TABLE / 数据类型 / 约束
│   ├── SELECT / WHERE / ORDER BY / LIMIT
│   └── INSERT / UPDATE / DELETE
│
├── 第二阶段：函数与操作（1周）
│   ├── 字符串函数（CONCAT, SUBSTRING, LENGTH）
│   ├── 数值函数（ROUND, ABS, MOD）
│   ├── 日期函数（NOW, DATE_ADD, DATEDIFF）
│   └── 数据导入导出
│
├── 第三阶段：高级查询（2周）
│   ├── 聚合函数（COUNT, SUM, AVG, MAX, MIN）
│   ├── GROUP BY / HAVING
│   ├── JOIN（INNER, LEFT, RIGHT, FULL, CROSS, SELF）
│   └── 子查询（标量、行、表、相关子查询）
│
├── 第四阶段：数据库设计（1-2周）
│   ├── 约束（主键、外键、唯一、检查、默认）
│   ├── 索引设计与优化
│   ├── 数据库范式（1NF, 2NF, 3NF, BCNF）
│   └── ER图设计与建模
│
├── 第五阶段：高级主题（2-3周）
│   ├── 视图（View）
│   ├── 存储过程与函数
│   ├── 触发器（Trigger）
│   ├── 事务与隔离级别
│   ├── 窗口函数
│   └── SQL优化与性能调优
│
└── 第六阶段：实战与进阶（持续）
    ├── 复杂业务查询实战
    ├── 慢查询分析与优化
    ├── 分库分表概念
    └── 特定数据库深入（MySQL/PostgreSQL/SQL Server）
```

---

## 6.4 附录：常用SQL速查表

### 数据类型速查

| 类型 | MySQL | 说明 |
|------|-------|------|
| 整数 | INT, BIGINT, SMALLINT, TINYINT | 存储整数 |
| 小数 | DECIMAL(M,D), FLOAT, DOUBLE | DECIMAL精确，FLOAT/DOUBLE近似 |
| 字符串 | VARCHAR(N), CHAR(N), TEXT | VARCHAR变长，CHAR定长 |
| 日期 | DATE, TIME, DATETIME, TIMESTAMP | TIMESTAMP自动更新 |
| 布尔 | BOOLEAN (TINYINT(1)) | 0或1 |
| 二进制 | BLOB, BINARY | 存储二进制数据 |

### 运算符速查

| 类型 | 运算符 | 示例 |
|------|--------|------|
| 算术 | +, -, *, /, % | `SELECT 10 / 3` |
| 比较 | =, <>, !=, >, <, >=, <= | `WHERE age > 18` |
| 逻辑 | AND, OR, NOT | `WHERE a > 1 AND b < 10` |
| 范围 | BETWEEN, IN | `WHERE age BETWEEN 18 AND 25` |
| 模糊 | LIKE | `WHERE name LIKE '张%'` |
| 空值 | IS NULL, IS NOT NULL | `WHERE email IS NOT NULL` |
| 存在 | EXISTS, NOT EXISTS | `WHERE EXISTS (...)` |

### 常用函数速查

| 类别 | 函数 | 说明 |
|------|------|------|
| 聚合 | COUNT, SUM, AVG, MAX, MIN | 统计计算 |
| 字符串 | CONCAT, LENGTH, SUBSTRING, REPLACE, UPPER | 字符串操作 |
| 数值 | ROUND, ABS, CEIL, FLOOR, MOD, RAND | 数值计算 |
| 日期 | NOW, CURDATE, DATE_ADD, DATEDIFF, YEAR, MONTH | 日期处理 |
| 条件 | IF, CASE WHEN, COALESCE, NULLIF | 条件判断 |
| 窗口 | RANK, DENSE_RANK, ROW_NUMBER, LAG, LEAD | 窗口分析 |

---

## 6.5 综合练习题

### 一、选择题

**题目1**：窗口函数 `DENSE_RANK()` 与 `RANK()` 的主要区别是？
- A. DENSE_RANK 不能处理NULL值
- B. RANK 遇到相同值会跳号，DENSE_RANK 不会跳号
- C. DENSE_RANK 只能用于数值类型
- D. 两者功能完全相同

<details>
<summary>✅ 答案与解析</summary>

**答案：B**

**解析**：
- `RANK()`：1, 2, 2, 4（相同值排名相同，下一个排名跳号）
- `DENSE_RANK()`：1, 2, 2, 3（相同值排名相同，下一个排名不跳号）
- `ROW_NUMBER()`：1, 2, 3, 4（每行唯一编号，不考虑相同值）
</details>

---

**题目2**：以下哪个SQL语句可以查询出每个班级绩点最高的学生？
- A. `SELECT class_id, name, MAX(gpa) FROM students GROUP BY class_id;`
- B. `SELECT class_id, name, gpa FROM students WHERE gpa = MAX(gpa);`
- C. `SELECT s.class_id, s.name, s.gpa FROM students s JOIN (SELECT class_id, MAX(gpa) AS max_gpa FROM students GROUP BY class_id) m ON s.class_id = m.class_id AND s.gpa = m.max_gpa;`
- D. `SELECT class_id, name, gpa FROM students ORDER BY gpa DESC LIMIT 1;`

<details>
<summary>✅ 答案与解析</summary>

**答案：C**

**解析**：
- A错误：`name` 不在GROUP BY中，且不是聚合函数，标准SQL不合法
- B错误：WHERE子句中不能直接使用聚合函数MAX
- C正确：使用子查询先找出每个班级的最高绩点，再通过JOIN关联获取对应的学生姓名
- D错误：只返回全局绩点最高的一个学生，不是每个班级
</details>

---

### 二、判断题

**题目1**：`COALESCE(NULL, 0, 10)` 的结果是 0。

<details>
<summary>✅ 答案与解析</summary>

**答案：✅ 正确**

**解析**：`COALESCE` 函数返回参数列表中第一个非NULL的值。`COALESCE(NULL, 0, 10)` 中第一个非NULL值是0，因此结果是0。常用于为NULL值提供默认值，如 `COALESCE(email, '未填写')`。
</details>

---

### 三、代码填空题

**题目1**：请补全SQL语句，使用窗口函数查询每个学生的绩点在班级内的排名。

```sql
SELECT 
    name,
    class_id,
    gpa,
    ___() OVER (___ BY class_id ___ BY gpa ___) AS class_rank
FROM students;
```

<details>
<summary>✅ 答案与解析</summary>

**答案**：
```sql
SELECT 
    name,
    class_id,
    gpa,
    RANK() OVER (PARTITION BY class_id ORDER BY gpa DESC) AS class_rank
FROM students;
```

**解析**：
- 第一个空填 `RANK`（或 `DENSE_RANK`、`ROW_NUMBER`）
- 第二个空填 `PARTITION`，按班级分区
- 第三个空填 `ORDER`，按绩点排序
- 第四个空填 `DESC`，绩点高的排名靠前

`PARTITION BY` 将数据按班级分组，在每个班级内部独立计算排名。
</details>

---

**题目2**：请补全SQL语句，查询选修了"高等数学"且成绩在班级前3名的学生。

```sql
SELECT course_name, student_name, score
FROM (
    SELECT 
        c.course_name,
        s.name AS student_name,
        sc.score,
        ___() OVER (
            ___ BY c.course_id 
            ___ BY sc.score ___
        ) AS rank_num
    FROM scores sc
    JOIN students s ON sc.student_id = s.student_id
    JOIN courses c ON sc.course_id = c.course_id
    WHERE c.course_name = '高等数学'
) ranked
WHERE rank_num ___ 3;
```

<details>
<summary>✅ 答案与解析</summary>

**答案**：
```sql
SELECT course_name, student_name, score
FROM (
    SELECT 
        c.course_name,
        s.name AS student_name,
        sc.score,
        DENSE_RANK() OVER (
            PARTITION BY c.course_id 
            ORDER BY sc.score DESC
        ) AS rank_num
    FROM scores sc
    JOIN students s ON sc.student_id = s.student_id
    JOIN courses c ON sc.course_id = c.course_id
    WHERE c.course_name = '高等数学'
) ranked
WHERE rank_num <= 3;
```

**解析**：
- 第一个空填 `DENSE_RANK`（或 `RANK`），窗口排名函数
- 第二个空填 `PARTITION`，按课程分区排名
- 第三个空填 `ORDER`，按分数排序
- 第四个空填 `DESC`，分数高的排名靠前
- 第五个空填 `<=`，取前3名

使用子查询先计算排名，外层查询过滤出前3名。
</details>

---

# 🎓 学习完成！

恭喜你完成了SQL从入门到精通的系统学习！

## 核心知识点回顾

| 阶段 | 核心技能 |
|------|----------|
| 基础 | SELECT, WHERE, ORDER BY, LIMIT, INSERT, UPDATE, DELETE |
| 进阶 | 聚合函数, GROUP BY, HAVING, JOIN, 子查询 |
| 设计 | 约束, 索引, 范式, ER建模 |
| 高级 | 视图, 存储过程, 触发器, 事务, 窗口函数 |
| 优化 | EXPLAIN分析, 索引优化, 查询重写, 批量操作 |

## 下一步建议

1. **动手实践**：在本地安装MySQL/PostgreSQL，创建数据库并完成所有练习题
2. **项目实战**：尝试为一个实际项目设计数据库（如博客系统、电商系统）
3. **性能调优**：学习使用 EXPLAIN 分析慢查询，理解执行计划
4. **深入特定数据库**：选择MySQL或PostgreSQL深入学习其特性和优化技巧
5. **学习ORM**：了解如何通过代码（如Python的SQLAlchemy、Java的MyBatis）操作数据库

> 📌 **记住**：SQL是一门实践性很强的语言，多写多练才能真正掌握！

---

*本知识库由AI辅助生成，内容涵盖SQL标准语法及MySQL常用特性。不同数据库（PostgreSQL、SQL Server、Oracle）在语法细节上可能存在差异，实际使用时请参考对应数据库的官方文档。*
