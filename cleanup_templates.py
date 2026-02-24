import re

templates_to_remove = [
    'allele_v1',
    'trisomy_v1',
    'mitosis_v1',
    'dna_replication_okazaki_v1',
    'transcription_v1',
    'translation_v1',
    'gene_structure_v1'
]

file_path = r'c:\trae_coding\AhaTutor\src\backend\src\modules\agents\data\a2ui-templates.data.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

for template_id in templates_to_remove:
    pattern = rf",\s*\n\s*// .*?\n\s*{{\s*templateId: '{template_id}'.*?^  }}\n"
    content = re.sub(pattern, '', content, flags=re.MULTILINE | re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Removed templates: {', '.join(templates_to_remove)}")
