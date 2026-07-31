# Project Rules

## File Naming Convention (CRITICAL)

**Always match exact file casing in all references.**

Windows is case-insensitive (`aperna.html` finds `Aperna.html`), but the production server (Linux/AWS Amplify) is case-sensitive. Mismatched casing causes 404 errors on live but works locally.

### Profile Page Files (Capitalized)

| File on disk | Correct reference | Wrong reference (causes 404 on prod) |
|---|---|---|
| `Prasad.html` | `Prasad.html` | `prasad.html` |
| `Aperna.html` | `Aperna.html` | `aperna.html` |
| `Peter.html` | `Peter.html` | `peter.html` |
| `Praveen.html` | `Praveen.html` | `praveen.html` |
| `Mahesh.html` | `Mahesh.html` | `mahesh.html` |
| `Gupta.html` | `Gupta.html` | `gupta.html` |
| `Antonio.html` | `Antonio.html` | `antonio.html` |

### Other Profile Pages (lowercase)

| File on disk | Reference |
|---|---|
| `jaideep.html` | `jaideep.html` |
| `saneev.html` | `saneev.html` |

### How to verify

After adding any new page or link:
1. Run a project-wide search for the filename to catch all references.
2. Ensure the casing in `href`, `onclick`, `goToProfile()`, or `window.location` matches the actual file on disk exactly.
3. If unsure, use a case-sensitive grep or search (e.g. `git grep`).
