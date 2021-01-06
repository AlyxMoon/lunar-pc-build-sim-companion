# Lunar's PC Building Simulator Companion

This is a web-hosted companion app for PC Building Simulator. Intended to help look up parts, keep track of client projects, and plan out builds. It's a hobby project right now so I'm not spending too much time on documentation. If you have any questions or want to help you are welcome to reach out.


### Notes on validation rules
One goal I have is to check all possible errors that might happen when picking out parts for a build. These rules can be found in `src/lib/buildValidationRules`. The general naming convention I'm going with is to have it rule start with the part type and then state the rule. In the case of part compatibility, the part that holds the other part goes first (i.e. a CPU goes on a motherboard, so that check would be motherboardFitsCpu).
