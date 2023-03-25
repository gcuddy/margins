// import { parse, stringify } from "css";

export function scopeCss(css?: string) {
    if (!css) return;
    console.time("scopeCss");
    const ast = parse(css);
    if (!ast.stylesheet) return;
    ast.stylesheet.rules = ast.stylesheet.rules.map((rule) => {
        if (rule.type === "rule" && "selectors" in rule) {
            rule.selectors = rule.selectors?.map((selector) => {
                return `#entry-container ${selector}`;
            });
        }
        return rule;
    });

    const str = stringify(ast);
    console.timeEnd("scopeCss");
    return str;
}
export function unscopeCss(css?: string) {
    if (!css) return;
    console.time("unscopeCss");
    const ast = parse(css);
    if (!ast.stylesheet) return;
    ast.stylesheet.rules = ast.stylesheet.rules.map((rule) => {
        if (rule.type === "rule" && "selectors" in rule) {
            rule.selectors = rule.selectors?.map((selector) => {
                return selector.replace("#entry-container ", "");
            });
        }
        return rule;
    });

    const str = stringify(ast);
    console.timeEnd("unscopeCss");
    return str;
}
