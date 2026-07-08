import os

def main():
    directory = r"c:\Users\Admin\Desktop\divy-crm"
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            filepath = os.path.join(directory, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Cache bust supabase-config.js
            if "auth.js" in content:
                import re
                new_content = re.sub(r'auth\.js(\?v=\d+)?', 'auth.js?v=4', content)
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Updated auth.js in {filename}")

if __name__ == "__main__":
    main()
