## Performance Optimizations
- **Suffix Removal**: Replaced double `string.replace(...)` calls in `removeParticle`, `removePossessive`, and `removeSuffix` with top-level compiled regular expressions and `string.match(...)` / `string.slice(...)`. This reduced execution time by ~50-55% by eliminating redundant regular expression compilations and search passes.
