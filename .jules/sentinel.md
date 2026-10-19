# Sentinel Security Log

## ReDoS Prevention in String Affix Checks
- Greedy regular expressions like `/^(be.+lah|be.+an|me.+i|di.+i|pe.+i|ter.+i)$/` present catastrophic backtracking risks (ReDoS) when evaluated against long crafted strings.
- Replacing regex evaluations with non-backtracking string functions (`startsWith`, `endsWith`, `length`) eliminates ReDoS vulnerability while maintaining exact match functionality.
