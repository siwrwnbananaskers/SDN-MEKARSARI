import os

def replace_theme(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Specific replacements for admin.html sidebar header
    if 'admin.html' in filepath:
        # Replace the sidebar header wrapper
        content = content.replace(
            'class="py-10 px-6 flex flex-col items-center justify-center gap-1 bg-blue-900 text-center"',
            'class="py-10 px-6 flex flex-col items-center justify-center gap-1 bg-white border-b border-gray-200 text-center"'
        )
        # Replace the school name text inside the header
        content = content.replace(
            'class="text-xl font-black text-white leading-none mb-1 shadow-sm uppercase"',
            'class="text-xl font-black text-blue-900 leading-none mb-1 shadow-sm uppercase"'
        )
        # Replace the subtitle text inside the header
        content = content.replace(
            'class="text-[10px] text-blue-300 uppercase tracking-[0.2em] font-medium leading-none mt-1"',
            'class="text-[10px] text-orange-500 uppercase tracking-[0.2em] font-bold leading-none mt-1"'
        )

    # General replacements (Tailwind classes)
    replacements = {
        'bg-blue-50': 'bg-orange-50',
        'bg-blue-100': 'bg-orange-100',
        'bg-blue-200': 'bg-orange-200',
        'bg-blue-300': 'bg-orange-300',
        'bg-blue-400': 'bg-orange-400',
        'bg-blue-500': 'bg-orange-500',
        'bg-blue-600': 'bg-orange-500',
        'bg-blue-700': 'bg-orange-600',
        'bg-blue-800': 'bg-orange-700',
        
        'text-blue-50': 'text-orange-50',
        'text-blue-100': 'text-orange-100',
        'text-blue-200': 'text-orange-200',
        'text-blue-300': 'text-orange-300',
        'text-blue-400': 'text-orange-400',
        'text-blue-500': 'text-orange-500',
        'text-blue-600': 'text-orange-500',
        'text-blue-700': 'text-orange-600',
        'text-blue-800': 'text-orange-700',
        
        'border-blue-50': 'border-orange-50',
        'border-blue-100': 'border-orange-100',
        'border-blue-200': 'border-orange-200',
        'border-blue-300': 'border-orange-300',
        'border-blue-400': 'border-orange-400',
        'border-blue-500': 'border-orange-500',
        'border-blue-600': 'border-orange-500',
        'border-blue-700': 'border-orange-600',
        'border-blue-800': 'border-orange-700',

        'ring-blue-500': 'ring-orange-500',
        'ring-blue-600': 'ring-orange-500',
        'ring-blue-700': 'ring-orange-600',
        
        # Note: We do NOT replace blue-900. It stays as the dark secondary color!
    }

    # Iterate over replacements, replacing longest strings first if necessary, 
    # but since these are exact tailwind classes, normal replace is fine.
    # However, to avoid overlapping replaces (like bg-blue-500 inside bg-blue-5000 which doesn't exist),
    # we just do it sequentially.
    for old, new in replacements.items():
        content = content.replace(old, new)

    # Some specific fixes for gradients or mix-blend in index.html
    if 'index.html' in filepath:
        # Change hero background from blue to orange/blue mix
        content = content.replace('bg-blue-900/60', 'bg-slate-900/70')
        # Ensure footer is dark blue
        content = content.replace('bg-blue-900', 'bg-slate-900')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Processed {filepath}")

base_path = r"c:\Users\Digitalisasi\.gemini\antigravity\scratch\sdn-tegalsari\frontend"
files = ['index.html', 'admin.html', 'pendaftaran.html']

for file in files:
    filepath = os.path.join(base_path, file)
    if os.path.exists(filepath):
        replace_theme(filepath)
    else:
        print(f"File not found: {filepath}")
