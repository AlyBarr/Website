# How to Update NDA / Confidential Project Content

## The NDA content is encrypted. You cannot edit it by opening index.html and changing text directly.
## To update what appears when the vault is unlocked, follow these steps:

---

## Step 1 — Edit this list (your plain-text NDA projects)

Paste this into a local Python script (`nda_encrypt.py`) and edit the NDA_PROJECTS list:

```python
import hashlib, json, base64

# ── EDIT THIS SECTION ─────────────────────────────────────────────────
NDA_PROJECTS = [
    {
        "category": "Feature Film · VFX Studio",        # ← studio type
        "title": "Asset Pipeline Overhaul",              # ← project name
        "role": "Pipeline TD Intern · 2024",             # ← your role + year
        "desc": "Redesigned USD-based asset delivery...", # ← 1-2 sentence description
        "tools": ["USD", "Python", "Houdini", "ShotGrid"]  # ← tools used
    },
    # Add more entries following the same pattern
    # {
    #     "category": "...",
    #     "title": "...",
    #     "role": "...",
    #     "desc": "...",
    #     "tools": [...]
    # },
]

PASSWORD = "Vault#9Rx"   # ← your current password (change if needed)
# ── END EDIT SECTION ──────────────────────────────────────────────────

key_bytes = hashlib.sha256(PASSWORD.encode()).digest()
data_bytes = json.dumps(NDA_PROJECTS).encode('utf-8')

encrypted = bytearray()
for i, b in enumerate(data_bytes):
    encrypted.append(b ^ key_bytes[i % len(key_bytes)])

payload = base64.b64encode(bytes(encrypted)).decode()
new_hash = hashlib.sha256(PASSWORD.encode()).hexdigest()

print("NDA_HASH =", new_hash)
print("NDA_PAYLOAD length:", len(payload))
print()
print("Copy this payload into index.html and recruiter.html:")
print()
print(payload)
```

---

## Step 2 — Run the script

```bash
python3 nda_encrypt.py
```

It will print:
- A SHA-256 hash (starts with `f7a899...`)
- A long base64 payload string

---

## Step 3 — Update index.html

Find these two lines in index.html and replace:

```
var NDA_HASH    = 'OLD_HASH_HERE';
var NDA_PAYLOAD = 'OLD_PAYLOAD_HERE';
```

Replace with the values from the script output.

**Do the same in recruiter.html** — search for `NDA_HASH` and `NDA_PAYLOAD` and replace both.

---

## To change the password

1. Pick a new password (must have: upper + lower + number or symbol, 8+ chars, no name/email)
2. Change `PASSWORD = "..."` in the script above
3. Run the script — it generates a new hash and re-encrypted payload
4. Replace both `NDA_HASH` and `NDA_PAYLOAD` in index.html AND recruiter.html

**Current password: `Vault#9Rx`** — store this somewhere safe, not in any repo.

---

## What the teaser chips show (before unlock)

These are always visible and don't need decrypting — edit them directly in index.html:

```html
<span class="nda-teaser-chip">Feature Film Pipeline</span>
<span class="nda-teaser-chip">AAA Environment Tools</span>
<span class="nda-teaser-chip">VFX R&D</span>
<span class="nda-teaser-chip">+2 more</span>
```

And in recruiter.html:
```html
<span class="nda-tc">Feature Film Pipeline · VFX Studio</span>
```

---

## Security reminder

The NDA content is XOR-encrypted with a SHA-256 key and NOT in plaintext in the source.
It cannot be read by opening the page source. However, a determined developer who copies
the decrypt function and brute-forces it locally could theoretically access it.

For absolute security, use server-side authentication (Netlify Functions, Cloudflare Workers,
or a password-protected hosting plan). The current approach is the maximum protection
available on static GitHub Pages hosting.