import os

base_path = r"c:\Users\Digitalisasi\.gemini\antigravity\scratch\sdn-tegalsari\frontend"
files = ['index.html', 'admin.html', 'pendaftaran.html']

for filename in files:
    filepath = os.path.join(base_path, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace dark blue with a brighter royal blue (blue-700)
        content = content.replace("blue-900", "blue-700")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Done replacing blue-900 with blue-700")
