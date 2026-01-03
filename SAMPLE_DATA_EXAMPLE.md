# Dashboard Example with 5 Tests

## Sample Test Data

Here's what your dashboard will look like with 5 test entries:

### Test 1 - January 5, 2024
- **Total Questions**: 200
- **Correct**: 120
- **Incorrect**: 50
- **Skipped**: 30
- **Score**: 430/800 (53.75%)

**Subjects:**
- Physics: 40 questions (25 correct, 10 incorrect, 5 skipped) = 90 marks
- Chemistry: 40 questions (30 correct, 5 incorrect, 5 skipped) = 115 marks
- Biology: 40 questions (25 correct, 10 incorrect, 5 skipped) = 90 marks
- Mathematics: 40 questions (20 correct, 15 incorrect, 5 skipped) = 65 marks
- English: 40 questions (20 correct, 10 incorrect, 10 skipped) = 70 marks

### Test 2 - January 12, 2024
- **Total Questions**: 200
- **Correct**: 135
- **Incorrect**: 45
- **Skipped**: 20
- **Score**: 495/800 (61.88%)

**Subjects:**
- Physics: 40 questions (30 correct, 8 incorrect, 2 skipped) = 112 marks
- Chemistry: 40 questions (32 correct, 5 incorrect, 3 skipped) = 123 marks
- Biology: 40 questions (28 correct, 8 incorrect, 4 skipped) = 104 marks
- Mathematics: 40 questions (25 correct, 12 incorrect, 3 skipped) = 88 marks
- English: 40 questions (20 correct, 12 incorrect, 8 skipped) = 68 marks

### Test 3 - January 19, 2024
- **Total Questions**: 200
- **Correct**: 150
- **Incorrect**: 35
- **Skipped**: 15
- **Score**: 565/800 (70.63%)

**Subjects:**
- Physics: 40 questions (35 correct, 4 incorrect, 1 skipped) = 136 marks
- Chemistry: 40 questions (38 correct, 2 incorrect, 0 skipped) = 150 marks
- Biology: 40 questions (32 correct, 6 incorrect, 2 skipped) = 122 marks
- Mathematics: 40 questions (28 correct, 10 incorrect, 2 skipped) = 102 marks
- English: 40 questions (17 correct, 13 incorrect, 10 skipped) = 55 marks

### Test 4 - January 26, 2024
- **Total Questions**: 200
- **Correct**: 145
- **Incorrect**: 40
- **Skipped**: 15
- **Score**: 540/800 (67.50%)

**Subjects:**
- Physics: 40 questions (33 correct, 5 incorrect, 2 skipped) = 127 marks
- Chemistry: 40 questions (36 correct, 3 incorrect, 1 skipped) = 141 marks
- Biology: 40 questions (30 correct, 7 incorrect, 3 skipped) = 113 marks
- Mathematics: 40 questions (26 correct, 12 incorrect, 2 skipped) = 92 marks
- English: 40 questions (20 correct, 13 incorrect, 7 skipped) = 67 marks

### Test 5 - February 2, 2024
- **Total Questions**: 200
- **Correct**: 160
- **Incorrect**: 30
- **Skipped**: 10
- **Score**: 610/800 (76.25%)

**Subjects:**
- Physics: 40 questions (38 correct, 2 incorrect, 0 skipped) = 150 marks
- Chemistry: 40 questions (40 correct, 0 incorrect, 0 skipped) = 160 marks
- Biology: 40 questions (35 correct, 4 incorrect, 1 skipped) = 136 marks
- Mathematics: 40 questions (30 correct, 8 incorrect, 2 skipped) = 112 marks
- English: 40 questions (17 correct, 16 incorrect, 7 skipped) = 52 marks

---

## Dashboard Display

### 📊 Overall Performance Stats (Top Section)

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total Tests │ Avg Score   │ Best Score  │ Worst Score │
│     5       │   528/800   │   610/800   │   430/800   │
└─────────────┴─────────────┴─────────────┴─────────────┘

┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Avg %       │ Latest Score│ Variance    │ Improvement │
│  66.00%     │   610/800   │   62.45     │  +41.86% ⬆  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### 📈 Score Trend Chart (Line Graph)

Shows a line going upward:
- Test 1: 430 (53.75%)
- Test 2: 495 (61.88%)
- Test 3: 565 (70.63%)
- Test 4: 540 (67.50%)
- Test 5: 610 (76.25%)

**Visual**: Upward trending line showing consistent improvement!

### 📊 Subject-wise Score Comparison (Bar Chart)

Shows bars for each subject:
- **Chemistry**: Highest (average ~138 marks) - Green bars
- **Physics**: Second (average ~123 marks) - Blue bars
- **Biology**: Third (average ~113 marks) - Orange bars
- **Mathematics**: Fourth (average ~92 marks) - Yellow bars
- **English**: Lowest (average ~62 marks) - Red bars

### 🥧 Subject Contribution (Pie Chart)

Shows pie slices:
- Chemistry: ~26% (largest slice)
- Physics: ~23%
- Biology: ~21%
- Mathematics: ~17%
- English: ~12% (smallest slice)

### 🎯 Radar Chart (Performance Spider)

Shows a pentagon shape with:
- Chemistry: Highest point (near 100%)
- Physics: High point
- Biology: Medium-high point
- Mathematics: Medium point
- English: Lowest point (needs attention)

### 💡 Performance Insights Cards

**Top Performing Subject:**
- Chemistry (Average: 137.8 marks, 86.13%)

**Needs Attention:**
- English (Average: 62.4 marks, 39.00%)

**Improving Subjects:**
- Chemistry, Physics, Biology, Mathematics (all showing positive trend)

**Declining Subjects:**
- English (showing decline)

### 📋 Subject-wise Analysis Table

| Subject    | Avg Score | Avg %  | Best | Latest | Improvement | Weightage |
|------------|-----------|--------|------|--------|-------------|-----------|
| Chemistry  | 137.8     | 86.13% | 160  | 160    | +39.13% ⬆   | 20.00%    |
| Physics    | 123.0     | 76.88% | 150  | 150    | +66.67% ⬆   | 20.00%    |
| Biology    | 113.0     | 70.63% | 136  | 136    | +51.11% ⬆   | 20.00%    |
| Mathematics| 92.0      | 57.50% | 112  | 112    | +72.31% ⬆   | 20.00%    |
| English    | 62.4      | 39.00% | 70   | 52     | -25.71% ⬇   | 20.00%    |

---

## Key Observations from This Example:

1. **Overall Improvement**: Score increased from 430 to 610 (+180 points, +41.86%)

2. **Strong Subjects**: Chemistry and Physics are performing excellently

3. **Weak Subject**: English needs significant improvement

4. **Consistent Growth**: Most subjects showing upward trend

5. **Best Performance**: Test 5 with 610/800 (76.25%)

6. **Focus Area**: English subject requires attention

---

## How to Test This:

1. Add these 5 tests manually through the "Add Test" page
2. Or I can create a JSON file you can import via Settings → Import Data

Would you like me to create an importable JSON file with this sample data?

