import os, re
pattern = re.compile(r"'([\d.]+)rem'rem'")
matches_count = 0
for root, dirs, files in os.walk('l:/AlzheimerApp/src'):
    for f in files:
        if f.endswith('.jsx') or f.endswith('.js') or f.endswith('.css'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                content = file.read()
            new_content, count = pattern.subn(r"'\1rem'", content)
            if count > 0:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                matches_count += count
print(f'Fixed {matches_count} rem syntax errors')
