import os
import glob

# The replacement block
supabase_scripts = """  <!-- Supabase JS SDK -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
  <script src="supabase-config.js"></script>"""

# The strings to look for (we'll replace the block that starts with firebase-app-compat)
html_files = glob.glob("*.html")

for f in html_files:
    if f in ["index.html", "login.html", "register.html", "dashboard.html"]:
        continue
    
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
        
    if "firebase-app-compat.js" in content:
        # We need to replace the 3 lines
        # Let's do a simple string replace
        
        # Find the start index of the firebase-app-compat script tag
        start_idx = content.find('<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>')
        # Find the end index of the firebase-config.js script tag
        end_str = '<script src="firebase-config.js"></script>'
        end_idx = content.find(end_str) + len(end_str)
        
        if start_idx != -1 and end_idx != -1:
            new_content = content[:start_idx] + supabase_scripts + content[end_idx:]
            with open(f, "w", encoding="utf-8") as file:
                file.write(new_content)
            print(f"Updated {f}")
        else:
            print(f"Could not find exact block in {f}")
